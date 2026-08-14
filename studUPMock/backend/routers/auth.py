from fastapi import APIRouter, Response, Request, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
import smtplib
from http import HTTPStatus
from dotenv import dotenv_values

from core.security import hash_password, verify_password, decode_token, create_access_token, create_refresh_token
from schemas.token import Token
from schemas.user import UserPublic, UserSchema, UserRegister
from models.user import User
from database import get_session

router = APIRouter(prefix="/auth", tags=["Authentication"])
env = dotenv_values("./.env")



@router.post("/register", status_code=HTTPStatus.CREATED, response_model=UserPublic)
def register_user(user: UserRegister, session: Session = Depends(get_session)):
    # Check if the user is already in the database or the email is already linked to an account
    dbuser = session.scalar(
        select(User).where(User.email == user.email)
    )

    print("arrived here")
    if dbuser is not None:
        if dbuser.email == user.email: 
            #The email already belongs to someone in the database.. 
            raise HTTPException(status_code=409, detail={
                "code": "EMAIL_ALREADY_IN_USE",
                "field": "email",
                "message": "Cette adresse email est déjà connectée a un compte. Si tu ne te souviens plus du mot de passe, tu peux en demaner un nouveau."
            })

    hashed_password = hash_password(user.password)

    #Otherwise we create it.
    dbuser = User(
        firstName=user.firstName,
        lastName=user.lastName,
        username=user.username,
        password=hashed_password,
        email=user.email,
        role=user.role,
        classroom=user.classroom,
        school=user.school,
        professor=user.professor
    )

    session.add(dbuser)
    session.commit()
    session.refresh(dbuser)

    message = f"""\
    Subject: New account request on studUP.

    A new user want to create an account on StudUP. Here's a recap:
    username = {user.username}
    email = {user.email},
    role = {user.role}.

    Check on your admin page to authorize it.
    """
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(env["EMAIL_SENDER"], env["EMAIL_KEY"])
        server.sendmail(env["EMAIL_SENDER"], env["EMAIL_RECEIVER"], message)

    return dbuser

@router.post("/login", status_code=HTTPStatus.OK, response_model=Token)
def return_user(user: UserSchema, response: Response, session: Session = Depends(get_session)):

    dbuser = session.scalar(
        select(User).where(User.username == user.username)
    )
    print("user found.")

    if not dbuser: 
        #Database don't have the user. 
        raise HTTPException(status_code=401, detail="It seems you don't have an account. Go to the Sign Up page.")

    if not verify_password(user.password, dbuser.password):
        raise HTTPException(status_code=401, detail="Wrong password")

    if not dbuser.authorized:
        raise HTTPException(status_code=403, detail="Your account is pending approval. Please wait for admin to authorize you.")

    access_token = create_access_token({
        "user_id": dbuser.id,
        "username": dbuser.username,
        "email": dbuser.email
    })

    refresh_token = create_refresh_token({
        "user_id": dbuser.id,
        "username": dbuser.username,
    })

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=7*24*60*60, #7 days
        path="/auth/refresh",
    )

    print(f"User {dbuser.username} logged in successfully.")
    return {"access_token": access_token, "refresh_token": refresh_token}


@router.post("/refresh", response_model=Token)
def refresh_access_token(request: Request, response: Response, session: Session = Depends(get_session)):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="No refresh token provided")

    payload = decode_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    # Verify user is still in DB or authorized

    dbuser = session.scalar(select(User).where(User.id == payload["user_id"]))
    if not dbuser:
        raise HTTPException(status_code=401, detail="User not found")

    if not dbuser.authorized:
        raise HTTPException(status_code=403, detail="Account not authorized")

    new_access = create_access_token({
        "user_id": dbuser.id,
        "username": dbuser.username,
        "email": dbuser.email
    })
    
    new_refresh = create_refresh_token({
        "user_id": dbuser.id,
        "username": dbuser.username,
    })

    response.set_cookie(
        key="refresh_token",
        value=new_refresh,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=7*24*60*60, #7 days
        path="/auth/refresh",
    )

    return {"access_token": new_access, "refresh_token": new_refresh}

@router.post("/logout")
def logout_user(response: Response):
    response.delete_cookie(
        key="refresh_token",
        httponly=True,
        secure=True,
        samesite="strict",
        path="/auth/refresh",
    )
    return {"message": "Logged out successfully!"}

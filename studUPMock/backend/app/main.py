from fastapi import FastAPI, Depends, HTTPException
from http import HTTPStatus
from sqlalchemy import select, or_
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
import smtplib
from dotenv import dotenv_values

from settings import Settings
from schemas import UserPublic, UserSchema, LogInResponse, UserRegister, AdminResponse
from models import User
from database import get_session

app = FastAPI()
env = dotenv_values("./.env")

allowed_origins = env.get("ALLOWED_ORIGINS", "").split(",")
print(allowed_origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


settings = Settings()
print("DATABASE_URL loaded:", bool(settings.DATABASE_URL))
print(settings.DATABASE_URL)

@app.post("/register", status_code=HTTPStatus.CREATED, response_model=UserPublic)
def register_user(user: UserRegister, session: Session = Depends(get_session)):
    # Check if the user is already in the database or the email is already linked to an account
    dbuser = session.scalar(
        select(User).where(
            or_(
                User.username == user.username,
                User.email == user.email,
            )
        )
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

        if dbuser.username == user.username: 
                #The username already belongs to someone in the database.. 
                raise HTTPException(status_code=409, detail={
                    "code": "USERNAME_ALREADY_IN_USE",
                    "field": "username",
                    "message": "Ce nom d'utilisateur est déjà utilisé, choisis-en un autre."
                })

    #Otherwise we create it.
    dbuser = User(
        username=user.username,
        password=user.password,
        email=user.email,
        role=user.role
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

@app.post("/login", status_code=HTTPStatus.OK, response_model=LogInResponse)
def return_user(user: UserSchema, session: Session = Depends(get_session)):

    dbuser = session.scalar(
        select(User).where(User.username == user.username).where(User.password == user.password)
    )
    print("user found and connected.")
    access_token = "nothingUsefull"

    if dbuser: 
        #Database have already the user. 
        return {
             "user": dbuser,
             "accessToken": access_token,
            }

    dbuser = session.scalar(
            select(User).where(User.username == user.username)
        )
    if dbuser:
        raise HTTPException(status_code=401, detail="Wrong password")

    else: 
        raise HTTPException(status_code=401, detail="It seems you don't have an account. Go to the Sign Up page.")

@app.get('/requested', status_code=HTTPStatus.OK, response_model=AdminResponse)
def return_unauth_users(session: Session = Depends(get_session)):

    unauth_users = session.scalars(
        select(User).where(User.authorized == False)
    ).all()
    print("Unauth users are here below:")
    print(unauth_users)

    return {"users": unauth_users}
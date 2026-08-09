from fastapi import FastAPI, Depends, HTTPException
from http import HTTPStatus
from sqlalchemy import select, or_
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
import logging

from schemas import UserPublic, UserSchema
from models import User
from database import get_session

app = FastAPI()
logger = logging.getLogger(__name__)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # ← dev
        "https://thibaultvanni.ovh/studUPMock",  # ← prod
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
)

@app.post("/register", status_code=HTTPStatus.CREATED, response_model=UserPublic)
def register_user(user: UserSchema, session: Session = Depends(get_session)):
    logger.info("Register Request")
    # Check if the user is already in the database or the email is already linked to an account
    dbuser = session.scalar(
        select(User).where(
            or_(
                User.username == user.username,
                User.email == user.email,
            )
        )
    )

    if dbuser.email == User.email: 
        #The email already belongs to someone in the database.. 
        raise HTTPException(status_code=409, detail={
            "code": "EMAIL_ALREADY_IN_USE",
            "field": "email",
            "message": "Cette adresse email est déjà connectée a un compte. Si tu ne te souviens plus du mot de passe, tu peux en demaner un nouveau."
        })

    if dbuser.username == User.username: 
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



    return dbuser

@app.post("/login", status_code=HTTPStatus.OK, response_model=UserPublic)
def return_user(user: UserSchema, session: Session = Depends(get_session)):

    dbuser = session.scalar(
        select(User).where(User.username == user.username).where(User.password == user.password)
    )

    if dbuser: 
        #Database have already the user. 
        return dbuser

    dbuser = session.scalar(
            select(User).where(User.username == user.username)
        )
    if dbuser:
        raise HTTPException(status_code=401, detail="Wrong password")

    else: 
        raise HTTPException(status_code=401, detail="It seems you don't have an account. Go to the Sign Up page.")

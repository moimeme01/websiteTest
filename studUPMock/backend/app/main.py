from fastapi import FastAPI, Depends, HTTPException
from http import HTTPStatus
from sqlalchemy import select
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from schemas import UserPublic, UserSchema
from models import User
from database import get_session

app = FastAPI()

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

    dbuser = session.scalar(
        select(User).where(
            User.username == user.username
        )
    )

    if dbuser: 
        #Database have already the user. 
        raise HTTPException(status_code=409, detail='User already exists')
        
    dbuser = User(
        username=user.username,
        password=user.password
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

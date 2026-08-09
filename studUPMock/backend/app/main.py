from fastapi import FastAPI, Depends, HTTPException
from http import HTTPStatus
from sqlalchemy import select
from sqlalchemy.orm import Session

from schemas import UserPublic, UserSchema
from models import User
from database import get_session

app = FastAPI()

@app.get("/users/")
def user():
    return {"status": "OK"}

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

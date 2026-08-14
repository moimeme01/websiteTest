from pydantic import BaseModel, EmailStr
from typing import List
from datetime import datetime

class UserSchema(BaseModel):
    username: str
    password: str

class UserPublic(BaseModel):
    id: int
    firstName: str
    lastName: str
    username: str
    email: EmailStr
    role: str
    classroom: str
    school: str
    professor: str
    authorized: bool
    

class LogInResponse(BaseModel):
    user: UserPublic
    accessToken: str

class UserRegister(BaseModel):
    firstName: str
    lastName: str
    username: str
    password: str
    email: EmailStr
    role: str
    classroom: str
    school: str
    professor: str


class AdminResponse(BaseModel):
    users: List[UserPublic]

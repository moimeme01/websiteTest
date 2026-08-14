from pydantic import BaseModel, EmailStr
from typing import List
from datetime import datetime

class UserSchema(BaseModel):
    username: str
    password: str

class UserPublic(BaseModel):
    id: int
    username: str
    created_at: datetime
    role: str
    authorized: bool

class LogInResponse(BaseModel):
    user: UserPublic
    accessToken: str

class UserRegister(BaseModel):
    username: str
    password: str
    email: EmailStr
    role: str

class AdminResponse(BaseModel):
    users: List[UserPublic]
from pydantic import BaseModel, EmailStr
from typing import List, Optional, TYPE_CHECKING
from datetime import datetime

if TYPE_CHECKING:
    from .groups import GroupBase

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
    classroom_id: int
    school: str
    professor_id: int
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
    classroom_id: int
    school: str
    professor_id: int

class UserRegisterByProf(BaseModel):
    firstName: str
    lastName: str
    username: str
    password: str

class CreatedResponse(BaseModel): 
    userData: List[UserRegisterByProf]
    
class AdminResponse(BaseModel):
    users: List[UserPublic]

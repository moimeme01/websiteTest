from pydantic import BaseModel
from datetime import datetime

class UserSchema(BaseModel):
    id: int
    username: str
    password: str
    created_at: datetime
    
class UserPublic(BaseModel):
    id: int
    username: str
    created_at: datetime
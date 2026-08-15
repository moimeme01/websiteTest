from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    role: str
    authorized: bool
    token_type: str = "bearer "

class TokenData(BaseModel):
    user_id: int
    email: str
    username: str
    type: str
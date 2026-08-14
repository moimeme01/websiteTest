from pydantic import BaseModel

class Token(BaseModel):
    access_toke: str
    refresh_token: str
    token_type: str = "bearer "

class TokenData(BaseModel):
    user_id: int
    email: str
    username: str
    type: str
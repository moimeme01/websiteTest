from pydantic import BaseModel

class GroupPublic(BaseModel): 
    id: int
    name: str
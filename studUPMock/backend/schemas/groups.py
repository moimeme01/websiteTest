from pydantic import BaseModel
from typing import List
from datetime import datetime

class GroupPublic(BaseModel): 
    id: int
    name: str

class GroupBase(BaseModel):
    professor_id: int
    name: str
    academic_year: int
    is_active: bool


class GroupRegister(BaseModel):
    professor_id: int
    name: str
    academic_year: int
    is_active: bool

class GroupAdmin(BaseModel):
    groups: List[GroupBase]
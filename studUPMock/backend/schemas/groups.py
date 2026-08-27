from pydantic import BaseModel, EmailStr
from typing import List, Optional, TYPE_CHECKING
from datetime import datetime

if TYPE_CHECKING:
    from .user import UserPublic


class GroupPublic(BaseModel): 
    id: int
    name: str

class GroupBase(BaseModel):
    group_id: int
    professor_id: int
    name: str
    academic_year: int
    created_at: datetime
    school: str
    is_active: bool
    student: List["UserPublic"] | None


class GroupRegister(BaseModel):
    professor_id: int
    name: str
    academic_year: int
    is_active: bool

class GroupAdmin(BaseModel):
    groups: List[GroupBase]
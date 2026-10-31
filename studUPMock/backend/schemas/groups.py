from pydantic import BaseModel, ConfigDict
from typing import List, Optional, TYPE_CHECKING
from datetime import datetime

if TYPE_CHECKING:
    from .user import UserPublic, UserBase



class GroupPublic(BaseModel): 

    model_config = ConfigDict(from_attributes=True)

    group_id: int
    name: str


class Affectations(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    exam_id: int
    group: int | None
    user: int | None
    student: "UserPublic | None" = None
    classroom: GroupPublic | None


class GroupBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    group_id: int
    professor_id: int
    name: str
    academic_year: int
    created_at: datetime
    school: str
    is_active: bool
    student: List["UserBase"] | None
    affectations: List[Affectations] | None


class GroupRegister(BaseModel):
    professor_id: int
    name: str
    academic_year: int
    is_active: bool

class GroupAdmin(BaseModel):
    groups: List[GroupBase]
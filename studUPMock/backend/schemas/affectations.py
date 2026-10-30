from pydantic import BaseModel, ConfigDict
from typing import List, TYPE_CHECKING

from .user import UserPublic
from .groups import GroupPublic


class AffectRegister(BaseModel):
    exam_id: int
    group: List[int] | None
    user: List[int] | None


class Affectations(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    exam_id: int
    group: int | None
    user: int | None
    student: UserPublic | None
    classroom: GroupPublic | None

class AffectationList(BaseModel): 
    affectations: List[Affectations]
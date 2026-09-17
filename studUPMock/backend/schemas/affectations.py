from pydantic import BaseModel
from typing import List, TYPE_CHECKING


from .user import UserPublic



class AffectRegister(BaseModel):
    exam_id: int
    group: List[int] | None
    user: List[int] | None

class Affectations(BaseModel):
    exam_id: int
    group: int | None
    user: int | None
    student: UserPublic | None

class AffectationList(BaseModel): 
    affectations: List[Affectations]
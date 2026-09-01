from pydantic import BaseModel
from typing import List, Optional, TYPE_CHECKING
from datetime import datetime, date, timedelta

if TYPE_CHECKING:
    from .user import UserPublic


class ExamBase(BaseModel):
    professor_id: int
    title: str
    description: str
    estimated_duration: int
    opening_date: date
    closing_date: date
    random_question_order: bool
    show_score: bool

    #default values columns
    chapter: str
    level: int


class ExamLine(BaseModel):
    exam_id:int
    professor_id: int
    title: str
    description: str
    estimated_duration: timedelta
    opening_date: date
    closing_date: date
    random_question_order: bool
    show_score: bool
    created_at: datetime
    chapter: str
    level: int

class ListExams(BaseModel):
    exams: List[ExamLine]
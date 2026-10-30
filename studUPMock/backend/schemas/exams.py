from pydantic import BaseModel
from typing import List, Optional, TYPE_CHECKING
from datetime import datetime, date, timedelta

from .questions import QuestionResponse

if TYPE_CHECKING:
    
    from .answers import AnswerListQuestion

class ExamBase(BaseModel):
    professor_id: int
    title: str
    description: str
    estimated_duration: int
    opening_date: datetime
    closing_date: datetime
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
    estimated_duration: int
    opening_date: datetime
    closing_date: datetime
    random_question_order: bool
    show_score: bool
    created_at: datetime
    chapter: str
    level: int
    questions: Optional[List[QuestionResponse]] = None
    is_open: bool


class ListExams(BaseModel):
    exams: List[ExamLine]
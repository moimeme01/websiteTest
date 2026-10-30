from pydantic import BaseModel
from typing import List, Optional

from .answers import AnswerListQuestion

class QuestionRegister(BaseModel):
    question_text: str
    exam_id: int
    answer: int | str
    difficulty: int | None

class QuestionResponse(BaseModel):
    question_id: int
    question_text: str
    exam_id: int
    notes: int | None
    difficulty: int | None
    answers : Optional[List[AnswerListQuestion]] = None


class QuestionsList(BaseModel):
    questions: List[QuestionResponse]
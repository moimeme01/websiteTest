from pydantic import BaseModel
from typing import List

class QuestionRegister(BaseModel):
    question_text: str
    exam_id: int
    difficulty: int | None

class QuestionResponse(BaseModel):
    question_id: int
    question_text: str
    exam_id: int
    notes: int | None
    difficulty: int | None


class QuestionsList(BaseModel):
    questions: List[QuestionResponse]
from pydantic import BaseModel, ConfigDict
from typing import List, Optional, TYPE_CHECKING
from datetime import datetime, date, timedelta

class AnswerRegister(BaseModel):
    question_id : int
    answer_type : str | None
    answer_text : int | str | None


class AnswerComplete(AnswerRegister):
    answer_id : int

class AnswerListQuestion(BaseModel):
    answer_id : int
    answer_type : str | None
    answer_text : int | str | None

class AnswerList(BaseModel):
    answer_list : List[AnswerRegister]

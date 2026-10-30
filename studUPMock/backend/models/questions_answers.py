from sqlalchemy.orm import mapped_column, mapped_as_dataclass, Mapped, relationship
from sqlalchemy import ForeignKey, func
from datetime import datetime, timedelta
from models import table_registry

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .exams import Exams
    from .exams_questions import ExamsQuestions

@mapped_as_dataclass(table_registry)
class QuestionAnswers():
    __tablename__ = "questionsanswers"
    answer_id : Mapped[int] = mapped_column(primary_key=True, autoincrement=True, init=False)
    question_id : Mapped[int] = mapped_column(ForeignKey("examsquestions.question_id"))
    answer_type : Mapped[str]
    answer_text : Mapped[str]

    question: Mapped["ExamsQuestions"] = relationship(foreign_keys=[question_id], back_populates="answers", init=False)

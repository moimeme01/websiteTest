from sqlalchemy.orm import mapped_column, mapped_as_dataclass, Mapped, relationship
from sqlalchemy import ForeignKey, func
from datetime import datetime, timedelta
from models import table_registry

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .exams import Exams
    from .questions_answers import QuestionAnswers

@mapped_as_dataclass(table_registry)
class ExamsQuestions():
    __tablename__ = "examsquestions"
    question_id : Mapped[int] = mapped_column(primary_key=True, autoincrement=True, init=False)
    question_text : Mapped[str] = mapped_column(nullable=True)
    exam_id: Mapped[int] = mapped_column(ForeignKey("exams.exam_id"))
    notes: Mapped[int] = mapped_column(nullable=True)
    difficulty: Mapped[int] = mapped_column(nullable=True)

    exams: Mapped["Exams"] = relationship(foreign_keys=[exam_id], back_populates="questions", init=False)
    answers: Mapped[list["QuestionAnswers"]] = relationship(foreign_keys="QuestionAnswers.question_id", back_populates="question", init=False, default_factory=list, cascade="all, delete-orphan")

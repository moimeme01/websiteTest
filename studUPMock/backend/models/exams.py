from sqlalchemy.orm import mapped_column, mapped_as_dataclass, Mapped, relationship
from sqlalchemy import ForeignKey, func
from datetime import datetime, timedelta
from models import table_registry

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .user import User

@mapped_as_dataclass(table_registry)
class Exams ():
    __tablename__ = "exams"
    exam_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, init=False)
    professor_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    title: Mapped[str] = mapped_column(nullable=False, unique=False)
    description: Mapped[str] = mapped_column(nullable=True)
    estimated_duration: Mapped[timedelta] = mapped_column(nullable=True)
    opening_date: Mapped[datetime] = mapped_column(nullable=True)
    closing_date: Mapped[datetime] = mapped_column(nullable=True)
    random_question_order: Mapped[bool] = mapped_column(nullable=True, default=False)
    show_score: Mapped[bool] = mapped_column(nullable=True, default=False)

    #default values columns
    chapter: Mapped[str] = mapped_column(nullable=False, default="")
    level: Mapped[int] = mapped_column(nullable=False, default=1)
    created_at: Mapped[datetime] = mapped_column(nullable=False, server_default=func.now(), init=False)


    # Relation externe:
    #student: Mapped[list["User"]] = relationship(foreign_keys="User.classroom_id", back_populates="classroom", init=False, default_factory=list)

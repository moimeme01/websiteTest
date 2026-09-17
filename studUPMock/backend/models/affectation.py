from sqlalchemy.orm import mapped_column, mapped_as_dataclass, Mapped, relationship
from sqlalchemy import ForeignKey
from models import table_registry
from models import Exams

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .exams import Exams
    from .groups import Groups
    from .user import User

@mapped_as_dataclass(table_registry)
class Affectation():
    __tablename__ = "affectation"
    affectation_id : Mapped[int] = mapped_column(primary_key=True, autoincrement=True, init=False, nullable=False)
    exam_id : Mapped[int] = mapped_column(ForeignKey("exams.exam_id"))
    group: Mapped[int] = mapped_column(ForeignKey("groups.group_id"), nullable=True)
    user: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=True)

    student: Mapped["User"] = relationship(foreign_keys=[user], back_populates="affectations", init=False)

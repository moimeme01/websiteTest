from sqlalchemy.orm import mapped_column, mapped_as_dataclass, Mapped, relationship
from sqlalchemy import ForeignKey, func
from datetime import datetime
from models import table_registry

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .user import User

@mapped_as_dataclass(table_registry)
class Groups ():
    __tablename__ = "groups"
    group_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    professor_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    name: Mapped[str] = mapped_column(nullable=False, unique=True)
    academic_year: Mapped[int] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(nullable=False, server_default=func.now())
    is_active: Mapped[bool] = mapped_column(nullable=False, default=True)

    student: Mapped[list["User"]] = relationship(foreign_keys="User.classroom_id", back_populates="classroom", init=False, default_factory=list)
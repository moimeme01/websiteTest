from sqlalchemy.orm import Mapped, mapped_as_dataclass, mapped_column, registry, relationship
from sqlalchemy import ForeignKey
from typing import TYPE_CHECKING

from .groups import Groups
from models import table_registry

@mapped_as_dataclass(table_registry)
class User: 
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(init=False, primary_key=True)
    authorized: Mapped[bool] = mapped_column(init=False, default=False, nullable=False)

    firstName: Mapped[str] = mapped_column(nullable=False)
    lastName: Mapped[str] = mapped_column(nullable=False)
    username: Mapped[str] = mapped_column(unique=True)

    password: Mapped[str]

    email: Mapped[str] = mapped_column(nullable=False, unique=True)

    role:Mapped[str]
    first_visit: Mapped[bool] = mapped_column(init=False, default=True)
    classroom_id: Mapped[int] = mapped_column(ForeignKey("groups.group_id"), nullable=False)
    school: Mapped[str] = mapped_column(nullable=False)
    professor: Mapped[str]

    classroom: Mapped["Groups"] = relationship(foreign_keys=[classroom_id], back_populates="student", init=False)

from sqlalchemy import func
from sqlalchemy.orm import Mapped, mapped_as_dataclass, mapped_column, registry 
from datetime import datetime

table_registry = registry()

@mapped_as_dataclass(table_registry)
class User: 
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(init=False, primary_key=True)
    authorized: Mapped[bool] = mapped_column(init=False, default=False, nullable=False)
    username: Mapped[str] = mapped_column(unique=True)
    password: Mapped[str]
    email: Mapped[str] = mapped_column(nullable=False, unique=True)
    created_at: Mapped[datetime] = mapped_column(init=False, server_default=func.now())
    role:Mapped[str]
    first_visit: Mapped[bool] = mapped_column(init=False, default=True)


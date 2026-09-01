# models/__init__.py
from sqlalchemy.orm import registry

table_registry = registry()

from .user import UserPublic
from .groups import GroupBase
from .exams import ExamBase
# Ajoute tous tes autres modèles ici

UserPublic.model_rebuild()
GroupBase.model_rebuild()
ExamBase.model_rebuild()

# Exporte-les
__all__ = [
    "table_registry",
    "User",
    "Groups",
    "Exams",
]
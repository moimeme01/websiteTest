# models/__init__.py
from sqlalchemy.orm import registry

table_registry = registry()

from .user import User
from .groups import Groups
# Ajoute tous tes autres modèles ici

# Exporte-les
__all__ = [
    "table_registry",
    "User",
    "Groups",
]
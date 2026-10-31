# models/__init__.py
from sqlalchemy.orm import registry

table_registry = registry()

from .user import UserPublic, UserBase
from .groups import GroupBase, GroupPublic
from .exams import ExamBase, ExamLine, ListExams
from .questions import QuestionResponse
from .answers import AnswerList, AnswerRegister
from .affectations import Affectations, AffectRegister
# Ajoute tous tes autres modèles ici

Affectations.model_rebuild()
UserPublic.model_rebuild()
UserBase.model_rebuild()
GroupBase.model_rebuild()
ExamBase.model_rebuild()
ExamLine.model_rebuild()
ListExams.model_rebuild()
QuestionResponse.model_rebuild()
AnswerList.model_rebuild()
AnswerRegister.model_rebuild()
AffectRegister.model_rebuild()
GroupPublic.model_rebuild()

# Exporte-les
__all__ = [
    "table_registry",
    "User",
    "UserBase",
    "Groups",
    "Exams",
    "ExamsQuestions",
    "ExamLine",
    "QuestionAnswers",
    "Affectations",
    "AffectRegister",
    "GroupPublic"
]
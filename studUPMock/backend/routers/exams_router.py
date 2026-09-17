from fastapi import APIRouter, Depends, Header
from sqlalchemy import select
from sqlalchemy.orm import Session
from http import HTTPStatus

from schemas.exams import ExamBase, ListExams, ExamLine
from models.exams import Exams
from database import get_session


router = APIRouter(prefix="/exams", tags=["Exams"])

@router.get("/getMyExams", status_code=HTTPStatus.OK, response_model=ListExams)
def get_my_exams(profID: int, session: Session = Depends(get_session)):
    print(f"Getting the exams for the professor with id {profID}")
    exams = session.scalars(select(Exams).where(Exams.professor_id == profID)).all()
    return {"exams": exams}

@router.get("/getExam", status_code=HTTPStatus.OK, response_model=ExamLine)
def get_my_exam(testID: int, session: Session = Depends(get_session)):
    print(f"Getting the exams for the professor with id {testID}")
    exam = session.scalar(select(Exams).where(Exams.exam_id == testID))
    return exam


@router.post("/newExam", status_code=HTTPStatus.CREATED)
def create_new_exam(exam: ExamBase, session: Session = Depends(get_session)):
    print("trying to put a new exam")
    newExam = Exams(
        professor_id=exam.professor_id,
        title=exam.title,
        description = exam.description,
        level = exam.level,
        chapter = exam.chapter,
        estimated_duration = int(exam.estimated_duration),
        opening_date = exam.opening_date,
        closing_date = exam.closing_date,
        random_question_order = exam.random_question_order,
        show_score = exam.show_score,
    )
    session.add(newExam)
    session.commit()
    session.refresh(newExam)
    print("Done")
    return {"message": "Test created successfully"}


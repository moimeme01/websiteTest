from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from http import HTTPStatus
from typing import Optional
from datetime import datetime, timedelta

from schemas.user import AdminResponse
from schemas.exams import ExamBase, ListExams
from models.exams import Exams
from database import get_session


router = APIRouter(prefix="/exams", tags=["Exams"])

@router.get("/getMyExams", status_code=HTTPStatus.OK, response_model=ListExams)
def get_my_exams(profID: int, session: Session = Depends(get_session)):
    print(f"Getting the exams for the professor with id {profID}")
    exams = session.scalars(select(Exams).where(Exams.professor_id == profID)).all()
    return {"exams": exams}

@router.post("/newExam", status_code=HTTPStatus.CREATED)
def create_new_exam(exam: ExamBase, session: Session = Depends(get_session)):
    print("trying to put a new exam")
    newExam = Exams(
        professor_id=exam.professor_id,
        title=exam.title,
        description = exam.description,
        level = exam.level,
        chapter = exam.chapter,
        estimated_duration = timedelta(exam.estimated_duration),
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
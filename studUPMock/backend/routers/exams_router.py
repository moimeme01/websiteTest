from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from http import HTTPStatus
from datetime import datetime, time

from schemas.exams import ExamBase, ListExams, ExamLine
from models.exams import Exams
from schemas.questions import QuestionResponse
from database import get_session


router = APIRouter(prefix="/exams", tags=["Exams"])

@router.get("/getMyExams", status_code=HTTPStatus.OK, response_model=ListExams)
def get_my_exams(profID: int, session: Session = Depends(get_session)):
    print(f"Getting the exams for the professor with id {profID}")
    exams = session.scalars(select(Exams).where(Exams.professor_id == profID)).all()
    for lines in exams: 
        if (lines.opening_date < datetime.now() and lines.closing_date > datetime.now()):
            lines.is_open = True
        else: 
            lines.is_open = False
    return {"exams": exams}

@router.get("/getExam", status_code=HTTPStatus.OK, response_model=ExamLine)
def get_my_exam(testID: int, session: Session = Depends(get_session)):
    print(f"Getting the exams for the professor with id {testID}")
    exam = session.scalar(select(Exams).where(Exams.exam_id == testID))
    if (exam.opening_date < datetime.now() and exam.closing_date > datetime.now()):
        exam.is_open = True
    else: 
        exam.is_open = False
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

@router.put("/update", status_code=HTTPStatus.OK)
def update_exams(data: dict, session : Session = Depends(get_session)):
    print("Data recieved: ", data)
    exam = session.scalar(select(Exams).where(Exams.exam_id == data["exam_id"]))

    for key, element in data["params"].items():
        if key in ["opening_date", "closing_date"]:
            element = datetime.strptime(element, "%Y-%m-%dT%H:%M")
        setattr(exam, key, element)

    if (exam.closing_date < exam.opening_date):
        print(f"Date de fermeture: {exam.closing_date}, date d'ouverture: {exam.opening_date}")
        print(f"Difference is {exam.closing_date < exam.opening_date}")
        raise HTTPException(
            status_code=HTTPStatus.NOT_ACCEPTABLE,
            detail="Closing date must be after the opening date."
        )
    session.commit()
    session.close()
    
    return {"message": "Exam updated successfully"}
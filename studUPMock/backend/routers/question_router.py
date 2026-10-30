from fastapi import APIRouter, Depends, Body
from sqlalchemy import select
from sqlalchemy.orm import Session
from http import HTTPStatus
from typing import Annotated

from schemas.answers import AnswerList, AnswerListQuestion, AnswerRegister
from schemas.questions import QuestionsList, QuestionRegister
from models.exams import Exams
from models.questions_answers import QuestionAnswers
from models.exams_questions import ExamsQuestions
from database import get_session


router = APIRouter(prefix="/questions", tags=["Questions"])


@router.post("/newquestion", status_code=HTTPStatus.OK)
def add_question(questions: Annotated[list[QuestionRegister], Body()], session: Session = Depends(get_session)):
    print("Adding questions ...")
    for question in questions: 
        print(question)
        add_question = ExamsQuestions(
            question_text=question.question_text,
            exam_id=question.exam_id,
            notes=0,
            difficulty=question.difficulty
        )
        session.add(add_question)
        session.flush()
        add_answer = QuestionAnswers(
            question_id=add_question.question_id,
            answer_type=type(question.answer).__name__,
            answer_text=question.answer
        )
        session.add(add_answer)
    session.commit()
    print("Done")
    return{"message": "Question added successfully"}

@router.get("/getQuestions", status_code=HTTPStatus.OK, response_model=QuestionsList)
def get_questions(examID: int, session: Session = Depends(get_session)):
    print("Getting the questions for the exam: ", examID)
    exam = session.scalar(select(Exams).where(Exams.exam_id == examID))
    return{"questions": exam.questions}

@router.delete("/delete", status_code=HTTPStatus.OK)
def remove_question(question_id: int, session : Session = Depends(get_session)):
    print("Deleting question with id: ", question_id)
    question = session.scalar(select(ExamsQuestions).where(ExamsQuestions.question_id == question_id))
    if not question:
        return {"message": "Question not found"}

    session.delete(question)
    
    session.commit()
    return{"message": "Question deleted successfully"}

@router.put("/edit", status_code=HTTPStatus.OK)
def edit_questions(question: dict[int, dict], session: Session = Depends(get_session)):
    print(f"question is : {question} and is type {type(question)}")
    for question_id, values in question.items(): 
        question_db = session.scalar(select(ExamsQuestions).where(ExamsQuestions.question_id ==int(question_id)))
        if not question_db:
            return {"message": f"Question with id {question_id} does not exists in database"}
        for key, element in question[question_id].items():
            if (key == "answers"):
                if (question_db.answers == []):
                    question_db.answers = [QuestionAnswers(
                        question_id=question_id, 
                        answer_type=type(element).__name__,
                        answer_text=element)]
                else: 
                    setattr(question_db.answers[0], "answer_text", element)
            else:
                setattr(question_db, key, element)
    session.commit()
    return {"message": "Question updated successfully"}


@router.post("/newAnswer", status_code=HTTPStatus.CREATED)
def new_answer(answers: AnswerList, session : Session = Depends(get_session)):
    for element in answers: 
        session.add(element)
    session.commit()
    return {"message": "answers added successfully"}


@router.post("/getAnswer", status_code=HTTPStatus.OK, response_model=AnswerListQuestion)
def get_answers(question_id: int, session: Session = Depends(get_session)):
    answers = session.scalars(select(QuestionAnswers).where(QuestionAnswers.question_id == int(question_id))).all()
    if not answers :
        return {"message": "No anwsers for this question"}
    return {answers}
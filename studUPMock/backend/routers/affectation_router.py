from fastapi import APIRouter, Depends
from http import HTTPStatus
from sqlalchemy import select
from sqlalchemy.orm import Session

from models.affectation import Affectation
from schemas.affectations import AffectRegister, AffectationList, Affectations
from database import get_session

router = APIRouter(prefix="/affectation", tags=["Affectation"])

@router.get("/getaffectations", response_model=AffectationList, status_code=HTTPStatus.OK)
def get_affectation(exam_id: int, session: Session = Depends(get_session)):
    print("getting affectations for: ", exam_id)
    affectation = session.scalars(select(Affectation).where(Affectation.exam_id == exam_id)).all()
    if not affectation:
        affectation = []
    return {"affectations": list(affectation)}

@router.post("/newaffectation", status_code=HTTPStatus.CREATED)
def new_affectation(affected: AffectRegister, session: Session=Depends(get_session)):
    print("Making new affectation...")
    if affected.group:
        for value in affected.group:
            affect = Affectation(
                exam_id=affected.exam_id,
                group=value,
                user=None
            )
            session.add(affect)
    if affected.user:
        for value in affected.user:
            affect = Affectation(
                exam_id=affected.exam_id,
                group=None,
                user=value
            )
            session.add(affect)
    session.commit()
    
    return {"message": "exam affected correctly"}
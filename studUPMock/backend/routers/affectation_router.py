from fastapi import APIRouter, Depends, HTTPException
from http import HTTPStatus
from sqlalchemy import select
from sqlalchemy.orm import Session

from models.affectation import Affectation
from models.exams import Exams
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
    print("Affecting these data: ", affected.exam_id)
    if affected.group:
        for value in affected.group:
            print("La valeur que je rajoute est: ", value, " et en int: ", type(int(value)))
            affect = Affectation(
                exam_id=int(affected.exam_id),
                group=int(value),
                user=0
            )
            session.add(affect)
    if affected.user:
        for value in affected.user:
            affect = Affectation(
                exam_id=affected.exam_id,
                group=0,
                user=int(value)
            )
            session.add(affect)
    session.commit()
    
    return {"message": "exam affected correctly"}


@router.put("/update", status_code=HTTPStatus.OK)
def update_affectations(data: dict, session : Session = Depends(get_session)):
    exam_id = data["exam_id"]
    for key, element in data["affectation"].items():
        print(f"La clé est {key} et l'élément est {element}")
        if key == "user":
            for value in element:
                print(f"looking for value: {value}")
                user = session.scalar(select(Affectation).where(Affectation.exam_id == exam_id).where(Affectation.user == int(value)))
                if not user:
                    raise HTTPException(
                        status_code=HTTPStatus.NOT_FOUND,
                        detail="User not found in affectations."
                    )  
                session.delete(user)
        if key == "group":
            for value in element:
                group = session.scalar(select(Affectation).where(Affectation.exam_id == exam_id).where(Affectation.group == int(value)))
                if not group:
                    raise HTTPException(
                        status_code=HTTPStatus.NOT_FOUND,
                        detail="Group not found in affectations."
                    )  
                session.delete(group)
    session.commit()
    session.close()
    return {"message": "Affectations updated correctly"}


    
@router.get("/by_class", response_model=AffectationList, status_code=HTTPStatus.OK)
def get_affectation(class_id: int, session: Session = Depends(get_session)):
    affectation = session.scalars(select(Affectation).where(Affectation.group == class_id)).all()
    if not affectation:
        affectation = []
    return {"affectations": list(affectation)}

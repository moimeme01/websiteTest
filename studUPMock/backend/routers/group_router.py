from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from http import HTTPStatus
from typing import Optional

from schemas.groups import GroupAdmin, GroupBase, GroupRegister
from models.groups import Groups
from database import get_session


router = APIRouter(prefix="/groups", tags=["Groups"])

@router.get("/list", status_code=HTTPStatus.OK, response_model=GroupAdmin)
def getGroupName(session: Session = Depends(get_session)):
    print("Searching for groups in the DB")
    groupList = session.scalars(select(Groups).where(Groups.group_id)).all()
    return {"groups": groupList}


@router.post("/newgroup", status_code=HTTPStatus.OK)
def addNewGroup(groupe: GroupRegister, session: Session = Depends(get_session)):
    print("Putting a new group to the group DB.")
    new_group = Groups(
        professor_id = groupe.professor_id,
        name = groupe.name,
        academic_year = groupe.academic_year,
        is_active = groupe.is_active
    )
    
    session.add(new_group)
    session.commit()
    session.refresh(new_group)
        

    return {"message": "Group correctly added"}
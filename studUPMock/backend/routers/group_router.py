from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from http import HTTPStatus
from typing import Optional

from schemas.user import AdminResponse
from schemas.groups import GroupAdmin, GroupRegister, GroupBase
from models.groups import Groups
from database import get_session


router = APIRouter(prefix="/groups", tags=["Groups"])

@router.get("/list", status_code=HTTPStatus.OK, response_model=GroupAdmin)
def getGroupName(session: Session = Depends(get_session)):
    print("Searching for groups in the DB")
    groupList = session.scalars(select(Groups).where(Groups.group_id)).all()
    if groupList:
        print("Groups found.")
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

@router.get("/myclasses", status_code=HTTPStatus.OK, response_model=GroupAdmin)
def getMyClasses(id: int, session: Session = Depends(get_session)):
    print(f"Getting the classes for the professor with id {id}")
    my_groups = session.scalars(select(Groups).where(Groups.professor_id == id)).all()
    return {"groups": my_groups}

@router.get("/classStudents", status_code=HTTPStatus.OK, response_model=AdminResponse)
def getClassStudents(groupID:int, session: Session = Depends(get_session)):
    print("getting the students for the classroom with id: ", groupID)
    classroom = session.scalar(select(Groups).where(Groups.group_id == groupID))
    return {"users": classroom.student}

@router.get("/classInfo", status_code=HTTPStatus.OK, response_model=GroupBase)
def getClassStudents(groupID:int, session: Session = Depends(get_session)):
    print("getting the informations for the classroom with id: ", groupID)
    group = session.scalar(select(Groups).where(Groups.group_id == groupID))
    return group


@router.put("/update", status_code=HTTPStatus.CREATED)
def update_group(group: dict, session: Session = Depends(get_session)):
    print("Updating group...")
    id = list(group.keys())[0]
    db_group = session.scalar(select(Groups).where(Groups.group_id == int(id)))
    for (key, value) in group[id].items():
        if (key == "is_active"):
            if value == "activate":
                setattr(db_group, key, True)
            else:
                setattr(db_group, key, False)
        else: 
            setattr(db_group, key, value)
    session.commit()
    return {"message": "Group updated"}

@router.delete("/delete", status_code=HTTPStatus.OK)
def delete_group(id: int, session: Session = Depends(get_session)):
    print("Deleting group ...")
    db_group = session.scalar(select(Groups).where(Groups.group_id == id))
    if not db_group:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail="Group not found"
        )

    session.delete(db_group)
    session.commit()
    return {"message": "Group deleted successfully."}
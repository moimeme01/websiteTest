from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy import select
from sqlalchemy.orm import Session
from http import HTTPStatus
from typing import Optional

from schemas.groups import GroupPublic
from models.groups import Groups
from database import get_session


router = APIRouter(prefix="/groups", tags=["Groups"])

@router.get("/list", status_code=HTTPStatus.OK, response_model=GroupPublic)
def getGroupName(groupName: str, session: Session = Depends(get_session)):
    groupList = session.scalars(select(Groups).where(Groups.is_active)).all()
    return groupList
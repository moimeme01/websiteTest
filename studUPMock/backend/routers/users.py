from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy import select
from sqlalchemy.orm import Session
from http import HTTPStatus
from dotenv import dotenv_values
from typing import Optional

from core.security import hash_password, verify_password, decode_token, create_access_token, create_refresh_token
from schemas.user import AdminResponse, UserPublic
from models.user import User
from database import get_session


router = APIRouter(prefix="/users", tags=["Users"])

def get_current_user_from_token(authorization: Optional[str] = Header(None)) -> dict:
    if not authorization or authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header.")

    token = authorization.split(" ")[1]
    payload = decode_token(token)

    if not payload or payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid or expired access token")

    return payload

@router.get('/requested', status_code=HTTPStatus.OK, response_model=AdminResponse)
def return_unauth_users(session: Session = Depends(get_session)):

    unauth_users = session.scalars(
        select(User).where(User.authorized == False)
    ).all()
    print("Unauth users are here below:")
    print(unauth_users)

    return {"users": unauth_users}

@router.get('/me', response_model=UserPublic)
def get_current_user_profile(   session: Session = Depends(get_session), current_user: dict = Depends(get_current_user_from_token)):
    """Renvoie le profil de l'utilisateur connecté."""
    dbuser = session.scalar(select(User).where(User.id == current_user["user_id"]))
    if not dbuser:
        raise HTTPException(status_code=404, detail="User not found")
    
    return dbuser
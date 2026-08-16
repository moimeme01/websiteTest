from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy import select
from sqlalchemy.orm import Session
from http import HTTPStatus
from typing import Optional
from jose import JWTError

from core.security import decode_token
from schemas.user import AdminResponse, UserPublic
from models.user import User
from database import get_session


router = APIRouter(prefix="/users", tags=["Users"])

def get_current_user_from_token(
    authorization: Optional[str] = Header(default=None)
) -> dict:

    if not authorization:
        print("Authorization header missing")
        raise HTTPException(
            status_code=401,
            detail="Missing Authorization header",
            headers={"WWW-Authenticate": "Bearer"}
        )

    if not authorization.startswith("Bearer "):
        print("Invalid Authorization format")
        raise HTTPException(
            status_code=401,
            detail="Invalid Authorization header",
            headers={"WWW-Authenticate": "Bearer"}
        )

    token = authorization.removeprefix("Bearer ").strip()
    if not token:
        raise HTTPException(
            status_code=401,
            detail="Missing Bearer token",
            headers={"WWW-Authenticate": "Bearer"}
        )


    try:
        payload = decode_token(token)
    except JWTError:
        print("Token could not be decoded.")
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired access token",
            headers={"WWW-Authenticate": "Bearer"}
        )

    if not payload:
        print("Token could not be decoded")
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired access token",
            headers={"WWW-Authenticate": "Bearer"}
        )

    if payload.get("type") != "access":
        raise HTTPException(
            status_code=401,
            detail="Invalid token type",
            headers={"WWW-Authenticate": "Bearer"}
        )

    return payload

@router.get('/requested', status_code=HTTPStatus.OK, response_model=AdminResponse)
def return_unauth_users(session: Session = Depends(get_session)):
    print("Searchign for unauth users")
    unauth_users = session.scalars(
        select(User).where(User.authorized == False)
    ).all()
    print("Unauth users are here below:")
    return {"users": unauth_users}

@router.get("/authorized", status_code=HTTPStatus.OK, response_model=AdminResponse)
def return_auth_users(session: Session = Depends(get_session)):
    print("Searching for authorized users")
    auth_users = session.scalars(
        select(User).where(User.authorized == True)
    ).all()
    print("founded users!")
    return {"users": auth_users}

@router.put("/authorizing", status_code=HTTPStatus.OK)
def authorizing_users(list_of_users: list[int], session: Session = Depends(get_session)):
    print("Authorization of users: ", list_of_users)
    for element in list_of_users:
        print("Authorizing user with id: ", element)
        dbuser = session.scalar(select(User).where(User.id == int(element)))
        print("Founded user: ", dbuser)
        dbuser.authorized = True
    session.commit()
    return "Done"


@router.get('/me', response_model=UserPublic)
def get_current_user_profile(session: Session = Depends(get_session), current_user: dict = Depends(get_current_user_from_token)):
    """Renvoie le profil de l'utilisateur connecté."""
    dbuser = session.scalar(select(User).where(User.id == current_user["user_id"]))
    if not dbuser:
        raise HTTPException(status_code=404, detail="User not found")
    
    return dbuser
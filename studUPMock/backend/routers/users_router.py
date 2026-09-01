import os, io, secrets, string, smtplib
from fastapi import APIRouter, Depends, HTTPException, Header, Body
from sqlalchemy import select
from sqlalchemy.orm import Session
from http import HTTPStatus
from typing import Optional, Annotated
from jose import JWTError
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from reportlab.lib.units import cm
from dotenv import dotenv_values

from core.security import decode_token, hash_password
from schemas.user import AdminResponse, UserPublic, UserRegister, UserRegisterByProf, CreatedResponse
from models.user import User
from database import get_session


env = dotenv_values("./.env")

def generate_password(length):
    alphabet = string.ascii_letters + string.digits
    password = "".join(secrets.choice(alphabet) for _ in range(length))
    return password

def createAndSendPDF(liste, email):
    buffer = io.BytesIO()
    document = SimpleDocTemplate(buffer, pagesize=A4)
    elements = []

    table = Table(liste)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 12),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
        ("BACKGROUND", (0, 1), (-1, -1), colors.white),
        ("GRID", (0, 0), (-1, -1), 1, colors.black),
    ]))

    elements.append(table)
    document.build(elements)

    message = MIMEMultipart()
    message["Subject"] = "New students to your classrooms."
    message["From"] = env["EMAIL_SENDER"]
    message["To"] = env["EMAIL_RECEIVER"]
    body = f"""\
        You successfully added new students to your classroom. 

        Here is the PDF document with their username and password.

        """
    message.attach(MIMEText(body, "plain"))

    part = MIMEApplication(buffer.getvalue(), _subtype="pdf")
    part.add_header("Content-Disposition",
        'attachment; filename="newstudents.pdf"',
    )
    message.attach(part)
    
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(env["EMAIL_SENDER"], env["EMAIL_KEY"])
        server.sendmail(env["EMAIL_SENDER"], env["EMAIL_RECEIVER"], message.as_string())

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

@router.put("/authorizing", status_code=HTTPStatus.CREATED)
def authorizing_users(list_of_users: list[int], session: Session = Depends(get_session)):
    print("Authorization of users: ", list_of_users)
    for element in list_of_users:
        print("Authorizing user with id: ", element)
        dbuser = session.scalar(select(User).where(User.id == int(element)))
        print("Founded user: ", dbuser)
        dbuser.authorized = True
    session.commit()
    return "Done"

@router.put("/update", status_code=HTTPStatus.CREATED)
def update_user(user: dict, session: Session = Depends(get_session)):
    print("Updating user...")
    id = list(user.keys())[0]
    db_user = session.scalar(select(User).where(User.id == int(id)))
    for (key, value) in user[id].items():
        setattr(db_user, key, value)
    session.commit()
    return {"message": "User updated"}

@router.get("/getprofessors", status_code=HTTPStatus.OK, response_model=AdminResponse)
def get_professors_list(session: Session = Depends(get_session)):
    print("Looking for professors in the users DB")
    professors = session.scalars(select(User).where(User.role == "professor")).all()
    return {"users": professors}


@router.get('/me', response_model=UserPublic)
def get_current_user_profile(session: Session = Depends(get_session), current_user: dict = Depends(get_current_user_from_token)):
    """Renvoie le profil de l'utilisateur connecté."""
    dbuser = session.scalar(select(User).where(User.id == current_user["user_id"]))
    if not dbuser:
        raise HTTPException(status_code=404, detail="User not found")
    
    return dbuser

@router.delete("/delete", status_code=HTTPStatus.OK)
def delete_user(id: int, session: Session = Depends(get_session)):
    print("Deleting user ...")
    db_user = session.scalar(select(User).where(User.id == id))
    if not db_user:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail="User not found"
        )

    session.delete(db_user)
    session.commit()
    return {"message": "User deleted successfully."}


@router.post("/addList", status_code=HTTPStatus.CREATED)
def add_new_students(liste : Annotated[list[UserRegister], Body()], session: Session = Depends(get_session)):
    print("Adding list of students ...")
    addedUsers = [["First name", "Last name", "Username", "Password"]]
    for elements in liste:
        username = f"{elements.firstName}{elements.lastName}"
        generatedPwd = generate_password(10)
        hashed_generated_password = hash_password(generatedPwd)
        db_user = session.scalar(select(User).where((User.firstName == elements.firstName) & (User.lastName == elements.lastName)))
        if db_user: 
            session.rollback()
            raise HTTPException(
                status_code=HTTPStatus.CONFLICT, detail=f"User with firstName: {db_user.firstName}, and lastname: {db_user.lastName} already exists."
        )
        email = f"{username}@addbyprof.com"
        dbuser = User(
            firstName=elements.firstName,
            lastName=elements.lastName,
            username=username,
            password=hashed_generated_password,
            email=email,
            role=elements.role,
            classroom_id=elements.classroom_id,
            school=elements.school,
            professor_id=elements.professor_id
        )

        dbuser.authorized = True
        session.add(dbuser)

        addedUsers.append([
            elements.firstName,
            elements.lastName,
            username,
            generatedPwd
        ])
    session.commit()


    createAndSendPDF(addedUsers, "email")
    return {
        "status": "success",
        "message": f"{len(liste)} student(s) added successfully.",
        "count": len(liste),
    }

@router.get("/getMyStudents", status_code=HTTPStatus.OK, response_model=AdminResponse)
def get_students(profID: int, session: Session = Depends(get_session)):
    print("getting the students for the professor with id: ", profID)
    students = session.scalars(select(User).where(User.professor_id == profID)).all()
    return {"users": students}
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import engine
from models.user import User
from core.security import hash_password

from dotenv import dotenv_values

ADMIN_ID = int(dotenv_values("./.env")["ADMIN_ID"])
ADMIN_USERNAME = dotenv_values("./.env")["ADMIN_USERNAME"]
ADMIN_PASSWORD = dotenv_values("./.env")["ADMIN_PASSWORD"]
ADMIN_EMAIL = dotenv_values("./.env")["ADMIN_EMAIL"]

def main() -> None:

    with Session(engine) as session:
        admin = session.scalar(select(User).where(User.id == ADMIN_ID))

        if admin is None:
            admin = User(
                firstName=ADMIN_USERNAME,
                lastName=ADMIN_USERNAME,
                username=ADMIN_USERNAME,
                password=hash_password(ADMIN_PASSWORD),
                email = ADMIN_EMAIL,
                role="admin",
                classroom="",
                school="",
                professor="",
            )
            session.add(admin)

            admin.id = 0
            admin.authorized = True
            admin.first_visit = False

            print("Admin added")

        else: 
            admin.firstName=ADMIN_USERNAME
            admin.lastName=ADMIN_USERNAME
            admin.username = ADMIN_USERNAME
            admin.email = ADMIN_EMAIL
            admin.password = hash_password(ADMIN_PASSWORD)
            admin.authorized = True
            admin.role = "admin"
            print(f"User id={ADMIN_ID} promoted to admin.")
        session.commit()
    return

if __name__ == "__main__":
    main()
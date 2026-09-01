from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models.user import User
from models.groups import Groups
from dotenv import dotenv_values
from routers import users_router, auth_router, group_router, exams_router

app = FastAPI()
env = dotenv_values("./.env")

allowed_origins = env.get("ALLOWED_ORIGINS", "").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

app.include_router(auth_router.router, prefix="/api")
app.include_router(users_router.router, prefix="/api")
app.include_router(group_router.router, prefix="/api")
app.include_router(exams_router.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "StudUp API is running", "status": "Healthy."}

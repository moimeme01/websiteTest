from fastapi import FastAPI

app = FastAPI()

@app.get("/users/")
def user():
    return {"status": "OK"}

@app.post("/register", status_code=201)
def register(data: dict):
    user = data.get("user")
    pwd = data.get("pwd")

    return {
        "message": "Register route works",
        "user": user
    }

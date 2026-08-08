from fastapi import FastAPI

app = FastAPI()

@app.get("/users/")
def user():
    return {"status": "OK"}

from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Open Atlas backend is running"}
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from detector import find_homophones

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://homophone-detector-fullstack-web-ap.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Homophone Detector API"}

@app.get("/homophone/{word}")
def get_homophones(word: str):
    result = find_homophones(word)
    
    return {
        "word": word,
        "homophones": result
    }
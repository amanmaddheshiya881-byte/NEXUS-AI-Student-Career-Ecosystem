
from fastapi import FastAPI
from backend.ai_mentor import router as mentor_router
from fastapi.middleware.cors import CORSMiddleware
from backend.auth import router as auth_router
from backend.nexus_career_engine import router as career_router

app = FastAPI(
    title="NEXUS API",
    description="NEXUS Student & Career Ecosystem",
    version="1.1.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication API
app.include_router(
    auth_router,
    prefix="/api/auth",
    tags=["Authentication"]
)

# AI Career Recommendation API
app.include_router(
    career_router,
    prefix="/api",
    tags=["Career Intelligence"]
)
# AI Mentor API
app.include_router(
    mentor_router,
    prefix="/api",
    tags=["AI Mentor"]
)

@app.get("/")
def home():
    return {
        "message": "Welcome to NEXUS API!",
        "status": "Backend is running successfully"
    }

@app.get("/health")
def health():
    return {"status": "healthy"}

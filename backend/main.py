from fastapi import FastAPI
from backend.auth import router as auth_router

app = FastAPI(
    title="NEXUS API",
    description="NEXUS Student & Career Ecosystem",
    version="1.0.0"
)

app.include_router(
    auth_router,
    prefix="/api/auth",
    tags=["Authentication"]
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
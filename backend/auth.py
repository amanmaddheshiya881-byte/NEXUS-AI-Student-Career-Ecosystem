from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from backend.database import get_db_connection

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class SignupRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str


@router.post("/signup")
def signup(data: SignupRequest):
    if len(data.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    connection = get_db_connection()
    if connection is None:
        raise HTTPException(status_code=500, detail="Database connection failed")

    cursor = connection.cursor()

    try:
        cursor.execute(
            "SELECT id FROM students WHERE email = %s",
            (data.email,)
        )

        if cursor.fetchone():
            raise HTTPException(status_code=409, detail="Email already registered")

        password_hash = pwd_context.hash(data.password)

        cursor.execute(
            "INSERT INTO students (full_name, email, password_hash) VALUES (%s, %s, %s)",
            (data.full_name, data.email, password_hash)
        )

        connection.commit()
        return {"message": "NEXUS account created successfully!"}

    finally:
        cursor.close()
        connection.close()
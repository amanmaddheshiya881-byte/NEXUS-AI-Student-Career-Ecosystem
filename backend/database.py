import os
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv

from pathlib import Path

ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(ENV_PATH)
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": os.getenv("NEXUS_DB_PASSWORD"),
    "database": "nexus_db"
}

def get_db_connection():
    try:
        return mysql.connector.connect(**DB_CONFIG)
    except Error as error:
        print("Database connection error:", error)
        return None
import os
import mysql.connector
from mysql.connector import Error

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
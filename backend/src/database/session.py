from sqlmodel import create_engine, Session
from typing import Generator
from dotenv import load_dotenv
# Use environment variable for database URL
import os
load_dotenv()
# Get database URL from environment, with a default SQLite database for development
DATABASE_URL = os.getenv("DATABASE_URL")
print("Database URL:", DATABASE_URL)
# Create engine
engine = create_engine(DATABASE_URL, echo=True)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
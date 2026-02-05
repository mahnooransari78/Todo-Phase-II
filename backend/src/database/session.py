from sqlmodel import create_engine, Session
from typing import Generator
from dotenv import load_dotenv
# Use environment variable for database URL
import os
load_dotenv()
# Get database URL from environment, with a default SQLite database for development
DATABASE_URL = os.getenv("DATABASE_URL")
print("Database URL:", DATABASE_URL)
# Configure connection arguments based on database type
if DATABASE_URL.startswith("postgresql"):
    connect_kwargs = {
        "connect_timeout": 30,  # Connection timeout in seconds for PostgreSQL
    }
else:
    # SQLite doesn't support connect_timeout, so use empty dict
    connect_kwargs = {}

# Create engine with connection pooling options to handle concurrent requests efficiently
engine = create_engine(
    DATABASE_URL,
    echo=True,
    pool_size=20,  # Number of connection objects to maintain in the pool
    max_overflow=30,  # Number of connections to allow in addition to pool_size
    pool_pre_ping=True,  # Verify connections before using them
    pool_recycle=300,  # Recycle connections after 5 minutes
    connect_args=connect_kwargs
)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
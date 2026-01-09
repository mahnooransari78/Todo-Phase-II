import os
from passlib.context import CryptContext
from dotenv import load_dotenv
load_dotenv()
# Get secret key from environment variable or use default (for development only)
SECRET_KEY = os.getenv("SECRET_KEY", os.getenv("BETTER_AUTH_SECRET", "your-super-secret-key-change-in-production"))
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Generate a hash for a plain password"""
    return pwd_context.hash(password)
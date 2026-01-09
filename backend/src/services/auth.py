from sqlmodel import Session, select
from fastapi import HTTPException, status
from datetime import datetime, timedelta
from uuid import UUID
import jwt
from passlib.context import CryptContext

from ..models.user import User
from ..schemas.user import UserCreate
from ..utils.security import SECRET_KEY, ALGORITHM
from ..utils.auth import get_password_hash, verify_password_hash


class AuthService:
    def __init__(self, session: Session):
        self.session = session
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def register_user(self, user_create: UserCreate) -> User:
        """Register a new user"""
        # Check if user already exists
        existing_user = self.session.exec(
            select(User).where(User.email == user_create.email)
        ).first()

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Hash the password
        hashed_password = get_password_hash(user_create.password)

        # Create new user
        db_user = User(
            email=user_create.email,
            name=user_create.name,
            hashed_password=hashed_password
        )

        self.session.add(db_user)
        self.session.commit()
        self.session.refresh(db_user)

        return db_user

    def authenticate_user(self, email: str, password: str) -> User:
        """Authenticate user with email and password"""
        user = self.session.exec(
            select(User).where(User.email == email)
        ).first()

        if not user or not verify_password_hash(password, user.hashed_password):
            return None

        # Update last login
        user.last_login = datetime.utcnow()
        self.session.add(user)
        self.session.commit()

        return user

    def get_user_by_id(self, user_id: UUID) -> User:
        """Get user by ID"""
        return self.session.get(User, user_id)

    def get_user_by_email(self, email: str) -> User:
        """Get user by email"""
        return self.session.exec(
            select(User).where(User.email == email)
        ).first()
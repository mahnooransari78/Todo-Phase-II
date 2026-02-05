from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session, select
from typing import Annotated
from datetime import datetime, timedelta
from uuid import UUID
import jwt
from passlib.context import CryptContext

from ..database.session import get_session
from ..models.user import User, UserCreate
from ..schemas.user import UserLogin, UserLoginResponse, UserRegisterResponse, UserRead
from ..schemas.auth import AuthResponse, LogoutResponse
from ..utils.auth import create_access_token, verify_password_hash, get_password_hash
from ..utils.security import SECRET_KEY, ALGORITHM

router = APIRouter()
security = HTTPBearer()

pwd_context = CryptContext(schemes=["pbkdf2_sha256", "argon2", "bcrypt"], deprecated="auto")




@router.post("/register", response_model=UserRegisterResponse)
def register(user: UserCreate, session: Session = Depends(get_session)):
    # Check if user already exists
    existing_user = session.exec(select(User).where(User.email == user.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash the password
    hashed_password = get_password_hash(user.password)

    # Create new user
    db_user = User(
        email=user.email,
        name=user.name,
        hashed_password=hashed_password
    )

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    # Create JWT token
    access_token = create_access_token(data={"user_id": str(db_user.id), "email": db_user.email})

    # Convert database user to response schema
    user_response = UserRead(
        id=db_user.id,
        email=db_user.email,
        name=db_user.name,
        email_verified=db_user.email_verified,
        created_at=db_user.created_at,
        updated_at=db_user.updated_at,
        last_login=db_user.last_login
    )

    return UserRegisterResponse(
        success=True,
        user=user_response,
        token=access_token
    )


@router.post("/login", response_model=UserLoginResponse)
def login(user_credentials: UserLogin, session: Session = Depends(get_session)):
    # Find user by email
    user = session.exec(select(User).where(User.email == user_credentials.email)).first()

    if not user or not verify_password_hash(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Update last login
    user.last_login = datetime.now()
    session.add(user)
    session.commit()

    # Create JWT token
    access_token = create_access_token(data={"user_id": str(user.id), "email": user.email})

    # Convert database user to response schema
    user_response = UserRead(
        id=user.id,
        email=user.email,
        name=user.name,
        email_verified=user.email_verified,
        created_at=user.created_at,
        updated_at=user.updated_at,
        last_login=user.last_login
    )

    return UserLoginResponse(
        success=True,
        user=user_response,
        token=access_token
    )


@router.post("/logout", response_model=LogoutResponse)
def logout(credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)]):
    # In a real implementation, you might add the token to a blacklist
    # For now, we just return a success response
    return LogoutResponse(
        success=True,
        message="Successfully logged out"
    )
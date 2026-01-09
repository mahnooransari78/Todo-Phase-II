from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID


class TokenData(BaseModel):
    user_id: UUID
    email: str
    exp: Optional[datetime] = None


class AuthResponse(BaseModel):
    success: bool
    message: Optional[str] = None


class LogoutResponse(AuthResponse):
    pass
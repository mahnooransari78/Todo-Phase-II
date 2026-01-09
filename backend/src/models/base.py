from sqlmodel import SQLModel
from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class BaseClass(SQLModel):
    """Base class for all models"""
    pass


class TimestampMixin:
    """Mixin to add created_at and updated_at fields"""
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
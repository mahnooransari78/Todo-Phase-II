from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID
from .task import TaskRead


class UserBase(BaseModel):
    email: str
    name: str


class UserCreate(UserBase):
    password: str


class UserRead(UserBase):
    id: UUID
    email_verified: bool
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None
    tasks: list[TaskRead] = []


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    email_verified: Optional[bool] = None


class UserLogin(BaseModel):
    email: str
    password: str


class UserLoginResponse(BaseModel):
    success: bool
    user: UserRead
    token: str


class UserRegisterResponse(BaseModel):
    success: bool
    user: UserRead
    token: str

# from pydantic import BaseModel
# from typing import Optional
# from datetime import datetime
# from uuid import UUID
# from .task import TaskRead
# from sqlmodel import  SQLModel

# class UserBase(BaseModel, SQLModel, table=True):
#     email: str
#     name: str


# class UserCreate(UserBase, SQLModel, table=True):
#     password: str


# class UserRead(UserBase, SQLModel, table=True):
#     id: UUID
#     email_verified: bool
#     created_at: datetime
#     updated_at: datetime
#     last_login: Optional[datetime] = None
#     tasks: list[TaskRead] = []


# class UserUpdate(BaseModel, SQLModel, table=True):
#     name: Optional[str] = None
#     email: Optional[str] = None
#     email_verified: Optional[bool] = None


# class UserLogin(BaseModel, SQLModel, table=True):
#     email: str
#     password: str


# class UserLoginResponse(BaseModel, SQLModel, table=True):
#     success: bool
#     user: UserRead
#     token: str


# class UserRegisterResponse(BaseModel, SQLModel, table=True):
#     success: bool
#     user: UserRead
#     token: str
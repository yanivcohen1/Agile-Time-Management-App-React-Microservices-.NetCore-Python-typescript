from typing import Optional
from datetime import datetime
from enum import Enum
from beanie import Document, Link
from pydantic import EmailStr, Field

class Role(str, Enum):
    USER = "user"
    ADMIN = "admin"

class Status(str, Enum):
    BACKLOG = "BACKLOG"
    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"

class User(Document):
    email: EmailStr = Field(unique=True)
    password_hash: str
    full_name: str
    role: Role = Role.USER
    
    class Settings:
        name = "users"

class Todo(Document):
    title: str
    description: Optional[str] = None
    status: Status = Status.BACKLOG
    due_date: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    user: Link[User]

    class Settings:
        name = "todos"

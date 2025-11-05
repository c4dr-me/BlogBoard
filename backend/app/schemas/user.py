from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator
import re

class UserBase(BaseModel):
    username: str

    @field_validator('username')
    def validate_username(cls, v):
        if len(v.strip()) < 3:
            raise ValueError('Username must be at least 3 characters')
        if not re.match(r'^[a-zA-Z0-9_-]+$', v):
            raise ValueError('Username can only contain letters, numbers, underscores, and hyphens')
        return v.strip()


class UserCreate(UserBase):
    email: EmailStr
    password: str

    @field_validator('password')
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters')
        return v

    @field_validator('email')
    def validate_email(cls, v):
        pattern = r'^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$'
        if not re.match(pattern, str(v)):
            raise ValueError('Invalid email format')
        return v


class UserRead(UserBase):
    id: int
    email: Optional[EmailStr] = None

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    username: str
    password: str
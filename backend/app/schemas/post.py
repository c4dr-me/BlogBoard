from datetime import datetime
from pydantic import BaseModel


class PostCreate(BaseModel):
    title: str
    content: str


class PostRead(BaseModel):
    id: int
    title: str
    content: str
    author_id: int
    author_name: str
    created_at: datetime

    class Config:
        from_attributes = True
from typing import Optional, TYPE_CHECKING
from datetime import datetime, timezone, timedelta
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column
from sqlalchemy.dialects.mysql import LONGTEXT

if TYPE_CHECKING:
    from .user import User

IST = timezone(timedelta(hours=5, minutes=30))

class Post(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    content: str = Field(sa_column=Column(LONGTEXT))
    author_id: int = Field(foreign_key="user.id")
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(IST),
        nullable=False
    )
    author: Optional["User"] = Relationship(back_populates="posts")
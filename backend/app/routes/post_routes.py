from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from sqlalchemy.orm import selectinload
from app.db.session import get_session
from app.models.post import Post
from app.schemas.post import PostCreate, PostRead
from app.utils.auth import get_current_user
from datetime import  timezone, timedelta

router = APIRouter(prefix="/posts", tags=["Posts"])
IST = timezone(timedelta(hours=5, minutes=30))

@router.post("/", response_model=PostRead, status_code=status.HTTP_201_CREATED)
def create_post(payload: PostCreate, session: Session = Depends(get_session), current_user=Depends(get_current_user)):
    """Create a new blog post."""
    post = Post(title=payload.title, content=payload.content, author_id=current_user.id,)
    session.add(post)
    session.commit()
    session.refresh(post)
    
    post_dict = post.model_dump()
    post_dict["author_name"] = current_user.username
    return PostRead(**post_dict)

@router.get("/", response_model=List[PostRead])
def list_posts(session: Session = Depends(get_session)):
    """Fetch all public blog posts."""
    statement = select(Post).options(selectinload(Post.author)).order_by(Post.created_at.desc())
    posts = session.exec(statement).all()
    return [
        PostRead(
            **post.model_dump(),
            author_name=post.author.username if post.author else "Unknown"
        )
        for post in posts
    ]

@router.get("/me", response_model=List[PostRead])
def my_posts(session: Session = Depends(get_session), current_user=Depends(get_current_user)):
    """Fetch posts created by the logged-in user."""
    statement = (
        select(Post)
        .options(selectinload(Post.author))
        .where(Post.author_id == current_user.id)
        .order_by(Post.created_at.desc())
    )
    posts = session.exec(statement).all()
    return [
        PostRead(
            **post.model_dump(),
            author_name=current_user.username
        )
        for post in posts
    ]

@router.put("/{post_id}", response_model=PostRead)
def edit_post(post_id: int, payload: PostCreate, session: Session = Depends(get_session), current_user=Depends(get_current_user)):
    """Edit a blog post only if you're the author."""
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this post")

    post.title = payload.title
    post.content = payload.content
    session.add(post)
    session.commit()
    session.refresh(post)
    return {
        **post.model_dump(),
        "author_name": current_user.username
    }
    
@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(post_id: int, session: Session = Depends(get_session), current_user=Depends(get_current_user)):
    """Delete a blog post only if you're the author."""
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")

    session.delete(post)
    session.commit()
    return None
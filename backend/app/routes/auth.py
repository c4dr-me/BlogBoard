from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import Dict, Any
from app.db.session import get_session
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserRead
from app.utils.auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register_user(user: UserCreate, session: Session = Depends(get_session)) -> UserRead:
    """
    Register a new user with validation.
    """
    existing_user = session.exec(
        select(User).where(User.username == user.username)
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )

    existing_email = session.exec(
        select(User).where(User.email == user.email)
    ).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    try:
        hashed_pw = hash_password(user.password)
        new_user = User(
            username=user.username,
            email=user.email,
            password=hashed_pw
        )

        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        
        return new_user

    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating user"
        )


@router.post("/login", response_model=Dict[str, Any])
async def login_user(
    user: UserLogin,
    session: Session = Depends(get_session)
) -> Dict[str, Any]:
    """
    Authenticate user and issue JWT token.
    """
    try:
        db_user = session.exec(
            select(User).where(User.username == user.username)
        ).first()

        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password"
            )

        if not verify_password(user.password, db_user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password"
            )

        token_data = {
            "sub": str(db_user.id),
            "username": db_user.username
        }
        
        token = create_access_token(token_data)

        return {
            "access_token": token,
            "token_type": "bearer",
            "username": db_user.username
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import init_db, run_migrations
from app.routes import auth, post_routes


@asynccontextmanager
async def lifespan(app: FastAPI):
    run_migrations()
    init_db()
    yield


app = FastAPI(
    title="Blog Management Dashboard",
    version="1.0.0",
    description="Internal Blog Dashboard with FastAPI + SQLModel + MySQL + JWT",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(post_routes.router)


@app.get("/", tags=["Root"])
def root():
    return {"message": "🚀 Blog Management Dashboard API running"}

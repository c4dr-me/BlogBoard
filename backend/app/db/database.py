import subprocess
from sqlmodel import SQLModel
from .session import engine

def init_db():
    SQLModel.metadata.create_all(engine)
    print("Tables initialized")

def run_migrations():
    try:
        subprocess.run(["alembic", "upgrade", "head"], check=True)
        print("Alembic migrations applied")
    except Exception as e:
        print(f"Migration skipped or failed: {e}")
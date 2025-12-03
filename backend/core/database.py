from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
# OLD (Error):
# from backend.core.config import settings

# NEW (Correct):
from core.config import settings

# Connect to the running Postgres Docker container
engine = create_engine(settings.DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Helper to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
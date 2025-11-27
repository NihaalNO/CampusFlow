from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

DATABASE_URL = os.getenv('postgresql://postgres:doctor@123@db.vavpaeqhphmbvlywobuj.supabase.co:5432/postgres')  # expected: postgres://user:pass@host:port/dbname

Base = declarative_base()

if DATABASE_URL:
    engine = create_engine(DATABASE_URL, future=True)
    SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)
else:
    # Fallback: in-memory SQLite for local dev if no DATABASE_URL provided
    engine = create_engine('sqlite:///:memory:', echo=False, future=True)
    SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)


def init_db():
    """Create tables. Call this during app startup in dev mode (or use Alembic for migrations)."""
    Base.metadata.create_all(bind=engine)

from typing import List

from pydantic import BaseModel
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

SQLALCHEMY_DATABASE_URL = "sqlite:///./shift_db.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


class DateBase(BaseModel):
    one_timer_reminders: List
    regular_reminders: List


def load_all_data_from_db():
    from routers import get_one_time_reminders, get_regular_reminders

    DateBase.one_timer_reminders = get_one_time_reminders()
    DateBase.regular_reminders = get_regular_reminders()

    return DateBase


def init_db():
    Base.metadata.create_all(bind=engine)

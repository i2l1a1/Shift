from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

SQLALCHEMY_DATABASE_URL = "sqlite:///./shift_db.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def load_all_data_from_db():
    from routers import get_one_time_reminders, get_regular_reminders

    all_events = []

    one_time_reminders = get_one_time_reminders()
    regular_reminders = get_regular_reminders()
    all_events.append(one_time_reminders)
    all_events.append(regular_reminders)

    return all_events

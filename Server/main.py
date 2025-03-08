import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, JSON
from sqlalchemy.orm import declarative_base, sessionmaker
from starlette.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from contextlib import asynccontextmanager
from typing import List

from notifications import plan_one_time_reminder, plan_regular_reminder

SQLALCHEMY_DATABASE_URL = "sqlite:///./shift_db.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


class OneTimeReminder(Base):
    __tablename__ = "one_time_reminders"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, index=True)
    date = Column(String)
    time = Column(String)
    tg_user_id = Column(String)
    job_id = Column(String)


class RegularReminders(Base):
    __tablename__ = "regular_reminders"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, index=True)
    dates = Column(JSON)
    times = Column(JSON)
    tg_user_id = Column(String)
    job_ids = Column(JSON)


Base.metadata.create_all(bind=engine)

scheduler = AsyncIOScheduler()


@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler.start()
    all_events = load_all_data_from_db()
    for item in all_events[0]:  # one time reminders
        job_id = plan_one_time_reminder(scheduler, item.text, item.date, item.time, item.tg_user_id,
                                        delete_one_time_reminder, item.id)
        db = SessionLocal()
        db.query(OneTimeReminder).filter(OneTimeReminder.id == item.id).update({"job_id": job_id})
        db.commit()
        db.close()
    for item in all_events[1]:  # regular reminders
        job_ids = plan_regular_reminder(scheduler, item.text, item.dates, item.times, item.tg_user_id, item.id)
        db = SessionLocal()
        db.query(RegularReminders).filter(RegularReminders.id == item.id).update({"job_ids": job_ids})
        db.commit()
        db.close()

    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class NewOneTimeReminder(BaseModel):
    text: str
    date: str
    time: str
    tg_user_id: str


class NewRegularReminder(BaseModel):
    text: str
    dates: List[str]
    times: List[str]
    tg_user_id: str


@app.post("/new_regular_reminder")
def create_new_regular_reminder(new_regular_reminder: NewRegularReminder):
    db = SessionLocal()
    db_reminder = RegularReminders(
        text=new_regular_reminder.text,
        dates=new_regular_reminder.dates,
        times=new_regular_reminder.times,
        tg_user_id=new_regular_reminder.tg_user_id,
        job_ids=None
    )
    db.add(db_reminder)
    db.commit()
    db.refresh(db_reminder)

    job_ids_after_planning = plan_regular_reminder(scheduler,
                                                   new_regular_reminder.text,
                                                   new_regular_reminder.dates,
                                                   new_regular_reminder.times,
                                                   new_regular_reminder.tg_user_id,
                                                   db_reminder.id)
    db_reminder.job_ids = job_ids_after_planning
    db.commit()
    db.close()

    return {"is_ok": True}


@app.post("/new_one_time_reminder")
def create_new_one_time_reminder(new_one_time_reminder: NewOneTimeReminder):
    db = SessionLocal()
    db_reminder = OneTimeReminder(
        text=new_one_time_reminder.text,
        date=new_one_time_reminder.date,
        time=new_one_time_reminder.time,
        tg_user_id=new_one_time_reminder.tg_user_id,
        job_id=None
    )
    db.add(db_reminder)
    db.commit()
    db.refresh(db_reminder)

    job_id = plan_one_time_reminder(scheduler,
                                    new_one_time_reminder.text,
                                    new_one_time_reminder.date,
                                    new_one_time_reminder.time,
                                    new_one_time_reminder.tg_user_id,
                                    delete_one_time_reminder, db_reminder.id)

    db_reminder.job_id = job_id
    db.commit()
    db.close()

    return {"is_ok": True}


@app.get("/get_one_time_reminders")
def get_one_time_reminders():
    db = SessionLocal()
    reminders = db.query(OneTimeReminder).all()
    db.close()
    return reminders


def load_all_data_from_db():
    all_events = []

    one_time_reminders = get_one_time_reminders()
    regular_reminders = get_regular_reminders()
    all_events.append(one_time_reminders)
    all_events.append(regular_reminders)

    return all_events


@app.post("/delete_one_time_reminder/{reminder_id}")
def delete_one_time_reminder(reminder_id: int, delete_from_scheduler=True):
    db = SessionLocal()
    reminder = db.query(OneTimeReminder).filter(reminder_id == OneTimeReminder.id).first()

    if reminder is None:
        db.close()
        return {"is_ok": False, "error": "Reminder not found"}

    if delete_from_scheduler and reminder.job_id:
        scheduler.remove_job(str(reminder.job_id))

    db.delete(reminder)
    db.commit()
    db.close()

    return {"is_ok": True}


@app.get("/get_regular_reminders")
def get_regular_reminders():
    db = SessionLocal()
    reminders = db.query(RegularReminders).all()
    db.close()
    return reminders


@app.post("/delete_regular_reminder/{reminder_id}")
def delete_regular_reminder(reminder_id: int, delete_from_scheduler=True):
    db = SessionLocal()
    reminder = db.query(RegularReminders).filter(reminder_id == RegularReminders.id).first()

    if reminder is None:
        db.close()
        return {"is_ok": False, "error": "Reminder not found"}

    if delete_from_scheduler and reminder.job_ids:
        for current_job_id in reminder.job_ids:
            scheduler.remove_job(str(current_job_id))

    db.delete(reminder)
    db.commit()
    db.close()

    return {"is_ok": True}


if __name__ == "__main__":
    uvicorn.run("main:app", port=9091, reload=True)

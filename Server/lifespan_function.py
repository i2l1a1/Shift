from contextlib import asynccontextmanager
from fastapi import FastAPI
from db import SessionLocal, load_all_data_from_db, init_db
from db_models import OneTimeReminder, RegularReminders
from notifications import plan_one_time_reminder, plan_regular_reminder
from routers import delete_one_time_reminder
from routers import scheduler


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    scheduler.start()
    all_events_from_db = load_all_data_from_db()
    for item in all_events_from_db.one_timer_reminders:
        job_id = plan_one_time_reminder(scheduler, item.text, item.date, item.time, item.tg_user_id,
                                        delete_one_time_reminder, item.id)
        db = SessionLocal()
        db.query(OneTimeReminder).filter(OneTimeReminder.id == item.id).update({"job_id": job_id})
        db.commit()
        db.close()
    for item in all_events_from_db.regular_reminders:
        job_ids = plan_regular_reminder(scheduler, item.text, item.dates, item.times, item.tg_user_id, item.id)
        db = SessionLocal()
        db.query(RegularReminders).filter(RegularReminders.id == item.id).update({"job_ids": job_ids})
        db.commit()
        db.close()

    yield

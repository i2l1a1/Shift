from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import APIRouter

from db import SessionLocal
from db_models import RegularReminders, OneTimeReminder
from notifications import plan_regular_reminder, plan_one_time_reminder
from pydantic_schemas import NewRegularReminder, NewOneTimeReminder

scheduler = AsyncIOScheduler()

reminders_router = APIRouter()


@reminders_router.post("/new_regular_reminder")
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


@reminders_router.post("/new_one_time_reminder")
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


@reminders_router.get("/get_one_time_reminders")
def get_one_time_reminders():
    db = SessionLocal()
    reminders = db.query(OneTimeReminder).all()
    db.close()
    return reminders


@reminders_router.post("/delete_one_time_reminder/{reminder_id}")
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


@reminders_router.get("/get_regular_reminders")
def get_regular_reminders():
    db = SessionLocal()
    reminders = db.query(RegularReminders).all()
    db.close()
    return reminders


@reminders_router.post("/delete_regular_reminder/{reminder_id}")
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

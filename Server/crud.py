from db import SessionLocal
from db_models import RegularReminders, OneTimeReminder
from notifications import plan_one_time_reminder, plan_regular_reminder
from pydantic_schemas import NewOneTimeReminder, NewRegularReminder


def get_one_time_reminders_crud():
    with SessionLocal() as db:
        reminders = db.query(OneTimeReminder).all()
    return reminders


def get_regular_reminders_crud():
    with SessionLocal() as db:
        reminders = db.query(RegularReminders).all()
    return reminders


def create_new_one_time_reminder_crud(new_one_time_reminder: NewOneTimeReminder, scheduler, action_function):
    with SessionLocal() as db:
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
                                        action_function, db_reminder.id)

        db_reminder.job_id = job_id
        db.commit()
        return {"is_ok": True}


def create_new_regular_reminder_crud(new_regular_reminder: NewRegularReminder, scheduler):
    with SessionLocal() as db:
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
        return {"is_ok": True}


def delete_one_time_reminder_crud(reminder_id: int, scheduler, delete_from_scheduler=True):
    with SessionLocal() as db:
        reminder = db.query(OneTimeReminder).filter(reminder_id == OneTimeReminder.id).first()

        if reminder is None:
            return {"is_ok": False}

        if delete_from_scheduler and reminder.job_id:
            scheduler.remove_job(str(reminder.job_id))

        db.delete(reminder)
        db.commit()
        return {"is_ok": True}


def delete_regular_reminder_crud(reminder_id: int, scheduler, delete_from_scheduler=True):
    with SessionLocal() as db:
        reminder = db.query(RegularReminders).filter(reminder_id == RegularReminders.id).first()

        if reminder is None:
            return {"is_ok": False}

        if delete_from_scheduler and reminder.job_ids:
            for current_job_id in reminder.job_ids:
                scheduler.remove_job(str(current_job_id))

        db.delete(reminder)
        db.commit()

        return {"is_ok": True}

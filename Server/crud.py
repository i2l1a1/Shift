from sqlalchemy import select

from db import SessionLocal
from db_models import RegularReminders, OneTimeReminder
from notifications import plan_one_time_reminder, plan_regular_reminder
from pydantic_schemas import NewOneTimeReminder, NewRegularReminder


async def get_one_time_reminders_crud():
    async with SessionLocal() as db:
        result = await db.execute(select(OneTimeReminder))
        reminders = result.scalars().all()
    return reminders


async def get_regular_reminders_crud():
    async with SessionLocal() as db:
        result = await db.execute(select(RegularReminders))
        reminders = result.scalars().all()
    return reminders


async def create_new_one_time_reminder_crud(new_one_time_reminder: NewOneTimeReminder, scheduler, action_function):
    async with SessionLocal() as db:
        db_reminder = OneTimeReminder(
            text=new_one_time_reminder.text,
            date=new_one_time_reminder.date,
            time=new_one_time_reminder.time,
            tg_user_id=new_one_time_reminder.tg_user_id,
            job_id=None
        )
        db.add(db_reminder)
        await db.commit()
        await db.refresh(db_reminder)

        job_id = await plan_one_time_reminder(scheduler,
                                              new_one_time_reminder.text,
                                              new_one_time_reminder.date,
                                              new_one_time_reminder.time,
                                              new_one_time_reminder.tg_user_id,
                                              action_function, db_reminder.id)

        db_reminder.job_id = job_id
        await db.commit()
        return {"is_ok": True}


async def create_new_regular_reminder_crud(new_regular_reminder: NewRegularReminder, scheduler):
    async with SessionLocal() as db:
        db_reminder = RegularReminders(
            text=new_regular_reminder.text,
            dates=new_regular_reminder.dates,
            times=new_regular_reminder.times,
            tg_user_id=new_regular_reminder.tg_user_id,
            job_ids=None
        )
        db.add(db_reminder)
        await db.commit()
        await db.refresh(db_reminder)

        job_ids_after_planning = await plan_regular_reminder(scheduler,
                                                             new_regular_reminder.text,
                                                             new_regular_reminder.dates,
                                                             new_regular_reminder.times,
                                                             new_regular_reminder.tg_user_id,
                                                             db_reminder.id)
        db_reminder.job_ids = job_ids_after_planning
        await db.commit()
        return {"is_ok": True}


async def delete_one_time_reminder_crud(reminder_id: int, scheduler, delete_from_scheduler=True):
    async with SessionLocal() as db:
        result = await db.execute(select(OneTimeReminder).filter(OneTimeReminder.id == reminder_id))
        reminder = result.scalars().first()

        if reminder is None:
            return {"is_ok": False}

        if delete_from_scheduler and reminder.job_id:
            scheduler.remove_job(str(reminder.job_id))

        await db.delete(reminder)
        await db.commit()

        return {"is_ok": True}


async def delete_regular_reminder_crud(reminder_id: int, scheduler, delete_from_scheduler=True):
    async with SessionLocal() as db:
        result = await db.execute(select(RegularReminders).filter(RegularReminders.id == reminder_id))
        reminder = result.scalars().first()

        if reminder is None:
            return {"is_ok": False}

        if delete_from_scheduler and reminder.job_ids:
            for current_job_id in reminder.job_ids:
                scheduler.remove_job(str(current_job_id))

        await db.delete(reminder)
        await db.commit()

        return {"is_ok": True}

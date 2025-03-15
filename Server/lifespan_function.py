from fastapi import FastAPI
from sqlalchemy import update
from db import SessionLocal, load_all_data_from_db, init_db
from db_models import OneTimeReminder, RegularReminders
from notifications import plan_one_time_reminder, plan_regular_reminder
from routers import delete_one_time_reminder
from routers import scheduler


async def lifespan(app: FastAPI):
    await init_db()
    scheduler.start()
    all_events_from_db = await load_all_data_from_db()

    async with SessionLocal() as db:
        for item in all_events_from_db.one_timer_reminders:
            job_id = await plan_one_time_reminder(
                scheduler, item.text, item.date, item.time, item.tg_user_id,
                delete_one_time_reminder, item.id
            )

            await db.execute(
                update(OneTimeReminder).where(OneTimeReminder.id == item.id).values(job_id=job_id)
            )
            await db.commit()

        for item in all_events_from_db.regular_reminders:
            job_ids = await plan_regular_reminder(scheduler, item.text, item.dates, item.times, item.tg_user_id,
                                                  item.id)

            await db.execute(
                update(RegularReminders)
                .where(RegularReminders.id == item.id)
                .values(job_ids=job_ids)
            )
            await db.commit()

    yield

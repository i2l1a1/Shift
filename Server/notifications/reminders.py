from apscheduler.triggers.cron import CronTrigger

import aiohttp
from environs import Env

from datetime import datetime

from data_base.data_base_init import SessionLocal
from data_base.data_base_models import HabitModel, OneTimeReminder


async def _send_message(user_id, notification_text, reminder_id, with_buttons=False):
    env = Env()
    env.read_env(".env")
    fastapi_url = env("SERVER_URL")

    async with aiohttp.ClientSession(connector=aiohttp.TCPConnector(ssl=False)) as session:
        url = f"{fastapi_url}/send_message_for_user_with_buttons/{user_id}"
        payload = {
            "text": notification_text,
            "habit_id": reminder_id,
            "with_buttons": with_buttons
        }
        await session.post(url, json=payload)


async def _generate_message_on_time(user_id, notification_text,
                                    reminder_id, with_buttons=False,
                                    action_function=None, for_habit=False):
    if for_habit:
        async with SessionLocal() as db:
            db_habit = await db.get(HabitModel, reminder_id)

        if db_habit.starting_date and db_habit.unlock_date_for_stage_3:
            now = datetime.now()
            start_date = datetime.strptime(db_habit.starting_date, "%Y-%m-%d")
            unlock_date = datetime.strptime(db_habit.unlock_date_for_stage_3, "%Y-%m-%d %H:%M:%S")

            if start_date <= now <= unlock_date:
                await _send_message(user_id, notification_text, reminder_id, with_buttons=with_buttons)
    else:
        await _send_message(user_id, notification_text, reminder_id)

        async with SessionLocal() as db:
            db_reminder = await db.get(OneTimeReminder, reminder_id)
            db_reminder.is_expired = True
            await db.commit()

    if action_function:
        await action_function(reminder_id, False)


async def plan_one_time_reminder(scheduler, notification_text, notification_date, notification_time, user_id,
                                 reminder_id):
    target_time_datetime = datetime.strptime(f"{notification_date} {notification_time}", "%Y-%m-%d %H:%M")

    if target_time_datetime > datetime.now():
        job = scheduler.add_job(
            _generate_message_on_time,
            run_date=target_time_datetime,
            kwargs={"user_id": user_id,
                    "notification_text": notification_text,
                    "reminder_id": reminder_id}
        )
        return job.id
    else:
        return None


async def plan_regular_reminder(scheduler, notification_text,
                                dates, times, user_id,
                                reminder_id, with_buttons=False, for_habit=False):
    job_ids = []
    unique_schedules = set()

    if dates and times:
        for day, time in zip(dates, times):
            hour, minute = map(int, time.split(":"))
            schedule_key = (day, hour, minute)

            if schedule_key not in unique_schedules:
                unique_schedules.add(schedule_key)

                job = scheduler.add_job(
                    _generate_message_on_time,
                    trigger=CronTrigger(day_of_week=day, hour=hour, minute=minute),
                    kwargs={
                        "user_id": user_id,
                        "notification_text": notification_text,
                        "reminder_id": reminder_id,
                        "with_buttons": with_buttons,
                        "for_habit": for_habit
                    }
                )
                job_ids.append(job.id)

    return job_ids if job_ids != [] else None

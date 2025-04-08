from datetime import datetime
from apscheduler.triggers.cron import CronTrigger

import aiohttp
from environs import Env


async def _generate_message_on_time(user_id, notification_text, reminder_id, with_buttons=False, action_function=None):
    env = Env()
    env.read_env(".env")
    fastapi_url = "http://127.0.0.1:9092"

    async with aiohttp.ClientSession(connector=aiohttp.TCPConnector(ssl=False)) as session:
        url = f"{fastapi_url}/send_message_for_user_with_buttons/{user_id}"
        payload = {
            "text": notification_text,
            "habit_id": reminder_id,
            "with_buttons": with_buttons
        }
        await session.post(url, json=payload)

    if action_function:
        await action_function(reminder_id, False)


async def plan_one_time_reminder(scheduler, notification_text, notification_date, notification_time, user_id,
                                 action_function, reminder_id):
    target_time_datetime = datetime.strptime(f"{notification_date} {notification_time}", "%Y-%m-%d %H:%M")

    job = scheduler.add_job(
        _generate_message_on_time,
        run_date=target_time_datetime,
        kwargs={'user_id': user_id,
                'notification_text': notification_text,
                'action_function': action_function,
                'reminder_id': reminder_id}
    )

    return job.id


async def plan_regular_reminder(scheduler, notification_text, dates, times, user_id, reminder_id, with_buttons=False):
    job_ids = []
    unique_schedules = set()

    for day, time in zip(dates, times):
        hour, minute = map(int, time.split(":"))
        schedule_key = (day, hour, minute)

        if schedule_key not in unique_schedules:
            unique_schedules.add(schedule_key)
            job = scheduler.add_job(
                _generate_message_on_time,
                trigger=CronTrigger(day_of_week=day, hour=hour, minute=minute),
                kwargs={
                    'user_id': user_id,
                    'notification_text': notification_text,
                    'reminder_id': reminder_id,
                    'with_buttons': with_buttons
                }
            )
            job_ids.append(job.id)

    return job_ids

import aiohttp
from datetime import datetime
from environs import Env
from apscheduler.triggers.cron import CronTrigger


async def _generate_message_on_time(user_id, notification_text, reminder_id, action_function=None):
    env = Env()
    env.read_env(".env")
    bot_token = env("BOT_TOKEN")

    async with aiohttp.ClientSession(connector=aiohttp.TCPConnector(ssl=False)) as session:
        url = f"https://api.telegram.org/bot{bot_token}/sendMessage?chat_id={user_id}&text={notification_text}"
        await session.post(url)

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


async def plan_regular_reminder(scheduler, notification_text, dates, times, user_id, reminder_id):
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
                kwargs={'user_id': user_id,
                        'notification_text': notification_text,
                        'reminder_id': reminder_id}
            )
            job_ids.append(job.id)

    return job_ids

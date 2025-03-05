from datetime import datetime
import requests
from environs import Env


async def _generate_message_no_time(user_id, notification_text):
    env = Env()
    env.read_env(".env")
    bot_token = env("BOT_TOKEN")
    requests.post(
        f"https://api.telegram.org/bot{bot_token}/sendMessage?chat_id={user_id}&text={notification_text}")


def plan_message_about_order_status(scheduler, notification_text, notification_date, notification_time, user_id):
    target_time_datetime = datetime.strptime(f"{notification_date} {notification_time}", "%Y-%m-%d %H:%M")

    print(f"date_time: {target_time_datetime}, text: {notification_text}, user_id: {user_id}")

    scheduler.add_job(
        _generate_message_no_time,
        run_date=target_time_datetime,
        kwargs={'user_id': user_id,
                'notification_text': notification_text}
    )

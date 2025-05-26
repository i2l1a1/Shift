import asyncio
from aiogram import Bot, Dispatcher, types
from environs import Env
from aiogram.filters import Command
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, CallbackQuery
from aiogram.types.web_app_info import WebAppInfo
from fastapi import FastAPI
import uvicorn
from pydantic import BaseModel
import aiohttp
import random

dp = Dispatcher()


class Config:
    bot_token = ""
    webapp_url = ""


config = Config()

env = Env()
env.read_env(".env")
config.bot_token = env("BOT_TOKEN")
config.webapp_url = env("WEBAPP_URL")

bot = Bot(config.bot_token)


async def start_bot():
    await dp.start_polling(bot)


async def start_server():
    uvicorn_config = uvicorn.Config("main:app", port=9092, host="0.0.0.0", log_level="info", reload=True)
    server = uvicorn.Server(uvicorn_config)
    await server.serve()


app = FastAPI()


async def main():
    bot_task = asyncio.create_task(start_bot())
    server_task = asyncio.create_task(start_server())
    await asyncio.gather(bot_task, server_task)


@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    webapp_button = InlineKeyboardButton(
        text="Открыть webapp",
        web_app=WebAppInfo(url=config.webapp_url)
    )
    webapp_keyboard = InlineKeyboardMarkup(inline_keyboard=[[webapp_button]])

    await message.answer("🔥")
    await message.answer("Сообщение с веб аппом...", reply_markup=webapp_keyboard)


class MessageForUser(BaseModel):
    text: str
    habit_id: int
    with_buttons: bool


@app.post("/send_message_for_user_with_buttons/{user_id}")
async def send_message_for_user_with_buttons(user_id: int, message: MessageForUser):
    print("in send_message_for_user_with_buttons")
    if message.with_buttons:
        yes_button = InlineKeyboardButton(
            text="✅",
            callback_data=f"yes_{message.habit_id}"
        )
        no_button = InlineKeyboardButton(
            text="❌",
            callback_data=f"no_{message.habit_id}"
        )
        keyboard = InlineKeyboardMarkup(inline_keyboard=[[no_button, yes_button]])

        await bot.send_message(user_id,
                               f"Выполнили ли вы сегодня привычку «{message.text}»?",
                               reply_markup=keyboard)
    else:
        print("in send_message_for_user_with_buttons without buttons", user_id, message)
        await bot.send_message(user_id, message.text)

    return {"status": "success"}


async def send_habit_confirmation(fastapi_url: str, habit_id: str, user_id: int, pressed_button: str):
    async with aiohttp.ClientSession(connector=aiohttp.TCPConnector(ssl=False)) as session:
        url = f"{fastapi_url}/edit_habit/add_another_result/{habit_id}"
        payload = {
            "pressed_button": pressed_button,
            "tg_user_id": str(user_id)
        }
        await session.post(url, json=payload)


def answer_for_user_button_push(is_successful, user_name):
    success_templates = [
        (
            f"Прекрасно, {user_name}! Сегодня вы сделали ещё один шаг к цели. Продолжайте в том же духе! 💪"
        ),
        (
            f"Отлично, {user_name}! Ваш прогресс вдохновляет. Побалуйте себя небольшой наградой — вы этого заслужили 👍"
        ),
        (
            f"Великолепно, {user_name}!"
            f" Вы успешно выполнили задачу на сегодня 🚀"
        ),
        (
            f"{user_name}, сегодня вы справились на отлично! Не забудьте наградить себя за свои успехи 😀"
        ),
        (
            f"Потрясающе, {user_name}! Вы должны наградить себя за хорошие успехи 😏"
        ),
    ]

    failure_templates = [
        (
            f"{user_name}, не переживайте, всё получится!"
            f" Попытайтесь проанализировать ошибки, чтобы в следующий раз точно выполнить цель 🙏"
        ),
        (
            f"Сбой — это тоже опыт, {user_name}. Подумайте, что можно скорректировать, и вперед к новым победам 💪"
        ),
        (
            f"Не расстраивайтесь, {user_name}. Сегодня не получилось, но вы сильнее любого препятствия 😊"
        ),
        (
            f"{user_name}, не сдавайтесь! Каждый маленький шаг делает вас сильнее, попробуйте снова в следующий раз 💫"
        ),
        (
            f"{user_name}, ничего страшного. Используйте этот опыт, чтобы двигаться дальше к цели ⚡️"
        ),

    ]

    return random.choice(success_templates if is_successful else failure_templates)


@dp.callback_query(lambda c: c.data.startswith("yes_"))
async def process_callback_yes(callback_query: CallbackQuery):
    habit_id = callback_query.data.split("_")[1]
    await bot.answer_callback_query(callback_query.id)

    user_name = callback_query.from_user.first_name if callback_query.from_user.first_name else "друг"
    await callback_query.message.edit_text(answer_for_user_button_push(True, user_name),
                                           reply_markup=None)

    fastapi_url = env("SERVER_URL")
    await send_habit_confirmation(fastapi_url, habit_id, callback_query.from_user.id, "yes")

    print(f"Нажата кнопка 'да' [id={callback_query.from_user.id}, habit_id={habit_id}]")


@dp.callback_query(lambda c: c.data.startswith("no_"))
async def process_callback_no(callback_query: CallbackQuery):
    habit_id = callback_query.data.split("_")[1]
    await bot.answer_callback_query(callback_query.id)

    user_name = callback_query.from_user.first_name if callback_query.from_user.first_name else "друг"
    await callback_query.message.edit_text(answer_for_user_button_push(False, user_name), reply_markup=None)

    fastapi_url = env("SERVER_URL")
    await send_habit_confirmation(fastapi_url, habit_id, callback_query.from_user.id, "no")

    print(f"Нажата кнопка 'нет' [id={callback_query.from_user.id}, habit_id={habit_id}]")


if __name__ == "__main__":
    asyncio.run(main())

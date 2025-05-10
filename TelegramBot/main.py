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
    uvicorn_config = uvicorn.Config("main:app", port=9092, log_level="info", reload=True)
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
                               f"message for user [id={user_id}, reminder_id_in_db={message.habit_id}]: {message.text}",
                               reply_markup=keyboard)
    else:
        await bot.send_message(user_id,
                               f"message for user [id={user_id}, reminder_id_in_db={message.habit_id}]: {message.text}")

    return {"status": "success"}


async def send_habit_confirmation(fastapi_url: str, habit_id: str, user_id: int, pressed_button: str):
    async with aiohttp.ClientSession(connector=aiohttp.TCPConnector(ssl=False)) as session:
        url = f"{fastapi_url}/edit_habit/add_another_result/{habit_id}"
        payload = {
            "pressed_button": pressed_button,
            "tg_user_id": str(user_id)
        }
        await session.post(url, json=payload)


@dp.callback_query(lambda c: c.data.startswith("yes_"))
async def process_callback_yes(callback_query: CallbackQuery):
    habit_id = callback_query.data.split("_")[1]
    await bot.answer_callback_query(callback_query.id)
    await callback_query.message.edit_text("Ура!", reply_markup=None)

    fastapi_url = env("SERVER_URL")
    await send_habit_confirmation(fastapi_url, habit_id, callback_query.from_user.id, "yes")

    print(f"Нажата кнопка 'да' [id={callback_query.from_user.id}, habit_id={habit_id}]")


@dp.callback_query(lambda c: c.data.startswith("no_"))
async def process_callback_no(callback_query: CallbackQuery):
    habit_id = callback_query.data.split("_")[1]
    await bot.answer_callback_query(callback_query.id)
    await callback_query.message.edit_text("Ох(", reply_markup=None)

    fastapi_url = env("SERVER_URL")
    await send_habit_confirmation(fastapi_url, habit_id, callback_query.from_user.id, "no")

    print(f"Нажата кнопка 'нет' [id={callback_query.from_user.id}, habit_id={habit_id}]")


if __name__ == "__main__":
    asyncio.run(main())

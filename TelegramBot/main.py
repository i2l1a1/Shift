import asyncio
from aiogram import Bot, Dispatcher, types
from environs import Env
from aiogram.filters import Command
from aiogram.types import (InlineKeyboardButton, InlineKeyboardMarkup)
from aiogram.types.web_app_info import WebAppInfo

dp = Dispatcher()


class Config:
    bot_token = ""
    webapp_url = ""


config = Config()


async def main():
    env = Env()
    env.read_env(".env")
    config.bot_token = env("BOT_TOKEN")
    config.webapp_url = env("WEBAPP_URL")

    bot = Bot(config.bot_token)

    await dp.start_polling(bot)


@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    user_orders_button = InlineKeyboardButton(
        text="Открыть webapp",
        web_app=WebAppInfo(url=config.webapp_url)
    )
    user_orders_keyboard = InlineKeyboardMarkup(inline_keyboard=[[user_orders_button]])

    await message.answer("🔥")
    await message.answer("Сообщение с веб аппом...", reply_markup=user_orders_keyboard)


asyncio.run(main())

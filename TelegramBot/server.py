from fastapi import FastAPI
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup
from pydantic import BaseModel
import aiohttp

from bot import bot
from lexicon import Texts

app = FastAPI()


class MessageForUser(BaseModel):
    text: str
    habit_id: int
    with_buttons: bool


@app.post("/send_message_for_user_with_buttons/{user_id}")
async def send_message_for_user_with_buttons(user_id: int, message: MessageForUser):
    if message.with_buttons:
        yes_button = InlineKeyboardButton(
            text=Texts.yes_button_for_habits,
            callback_data=f"yes_{message.habit_id}"
        )
        no_button = InlineKeyboardButton(
            text=Texts.no_button_for_habits,
            callback_data=f"no_{message.habit_id}"
        )
        keyboard = InlineKeyboardMarkup(inline_keyboard=[[no_button, yes_button]])

        await bot.send_message(user_id,
                               Texts.habit_question.format(message.text),
                               reply_markup=keyboard)
    else:
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

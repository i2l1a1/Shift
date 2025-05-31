from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, CallbackQuery
from aiogram.types.web_app_info import WebAppInfo
from lexicon import answer_for_user_button_push

from config import config

dp = Dispatcher()
bot = Bot(config.bot_token)


@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    webapp_button = InlineKeyboardButton(
        text="Открыть webapp",
        web_app=WebAppInfo(url=config.webapp_url)
    )
    webapp_keyboard = InlineKeyboardMarkup(inline_keyboard=[[webapp_button]])

    await message.answer("🔥")
    await message.answer("Сообщение с веб аппом...", reply_markup=webapp_keyboard)


@dp.callback_query(lambda c: c.data.startswith("yes_"))
async def process_callback_yes(callback_query: CallbackQuery):
    habit_id = callback_query.data.split("_")[1]
    await bot.answer_callback_query(callback_query.id)

    user_name = callback_query.from_user.first_name if callback_query.from_user.first_name else "друг"
    await callback_query.message.edit_text(answer_for_user_button_push(True, user_name),
                                           reply_markup=None)

    from server import send_habit_confirmation
    fastapi_url = config.server_url
    await send_habit_confirmation(fastapi_url, habit_id, callback_query.from_user.id, "yes")

    print(f"Нажата кнопка 'да' [id={callback_query.from_user.id}, habit_id={habit_id}]")


@dp.callback_query(lambda c: c.data.startswith("no_"))
async def process_callback_no(callback_query: CallbackQuery):
    habit_id = callback_query.data.split("_")[1]
    await bot.answer_callback_query(callback_query.id)

    user_name = callback_query.from_user.first_name if callback_query.from_user.first_name else "друг"
    await callback_query.message.edit_text(answer_for_user_button_push(False, user_name), reply_markup=None)

    from server import send_habit_confirmation
    fastapi_url = config.server_url
    await send_habit_confirmation(fastapi_url, habit_id, callback_query.from_user.id, "no")

    print(f"Нажата кнопка 'нет' [id={callback_query.from_user.id}, habit_id={habit_id}]")

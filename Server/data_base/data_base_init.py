from typing import List

from pydantic import BaseModel

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.asyncio import async_sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine

SQLALCHEMY_DATABASE_URL = "sqlite+aiosqlite:///./shift_db.db"

engine = create_async_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = async_sessionmaker(engine, autocommit=False, autoflush=False)

Base = declarative_base()


class DataBase(BaseModel):
    one_timer_reminders: List
    regular_reminders: List


async def load_all_data_from_db():
    from routers.reminder_routers import get_one_time_reminders, get_regular_reminders

    DataBase.one_timer_reminders = await get_one_time_reminders()
    DataBase.regular_reminders = await get_regular_reminders()

    return DataBase


async def init_db():
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)

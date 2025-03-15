from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import APIRouter

from crud import get_regular_reminders_crud, get_one_time_reminders_crud, create_new_one_time_reminder_crud, \
    create_new_regular_reminder_crud, delete_one_time_reminder_crud, delete_regular_reminder_crud
from pydantic_schemas import NewRegularReminder, NewOneTimeReminder

scheduler = AsyncIOScheduler()

reminders_router = APIRouter()


@reminders_router.post("/new_regular_reminder")
def create_new_regular_reminder(new_regular_reminder: NewRegularReminder):
    return create_new_regular_reminder_crud(new_regular_reminder, scheduler)


@reminders_router.post("/new_one_time_reminder")
def create_new_one_time_reminder(new_one_time_reminder: NewOneTimeReminder):
    return create_new_one_time_reminder_crud(new_one_time_reminder, scheduler, delete_one_time_reminder)


@reminders_router.get("/get_one_time_reminders")
def get_one_time_reminders():
    return get_one_time_reminders_crud()


@reminders_router.post("/delete_one_time_reminder/{reminder_id}")
def delete_one_time_reminder(reminder_id: int, delete_from_scheduler=True):
    return delete_one_time_reminder_crud(reminder_id, scheduler, delete_from_scheduler)


@reminders_router.get("/get_regular_reminders")
def get_regular_reminders():
    return get_regular_reminders_crud()


@reminders_router.post("/delete_regular_reminder/{reminder_id}")
def delete_regular_reminder(reminder_id: int, delete_from_scheduler=True):
    return delete_regular_reminder_crud(reminder_id, scheduler, delete_from_scheduler)

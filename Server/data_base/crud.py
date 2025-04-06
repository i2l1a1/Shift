from sqlalchemy import select

from data_base.data_base_init import SessionLocal
from data_base.data_base_models import RegularReminders, OneTimeReminder, NegativeHabits
from notifications.reminders import plan_one_time_reminder, plan_regular_reminder, plan_one_time_action
from schemas.pydantic_schemas import NewOneTimeReminder, NewRegularReminder, NewNegativeHabit, NewNegativeHabitStage1, \
    NewAnotherResult, NewNumberOfDaysForMindfulness
from datetime import datetime, timedelta


async def get_one_time_reminders_crud():
    async with SessionLocal() as db:
        result = await db.execute(select(OneTimeReminder))
        reminders = result.scalars().all()
    return reminders


async def get_regular_reminders_crud():
    async with SessionLocal() as db:
        result = await db.execute(select(RegularReminders))
        reminders = result.scalars().all()
    return reminders


async def create_new_one_time_reminder_crud(new_one_time_reminder: NewOneTimeReminder, scheduler, action_function):
    async with SessionLocal() as db:
        db_reminder = OneTimeReminder(
            text=new_one_time_reminder.text,
            date=new_one_time_reminder.date,
            time=new_one_time_reminder.time,
            tg_user_id=new_one_time_reminder.tg_user_id,
            job_id=None
        )
        db.add(db_reminder)
        await db.commit()
        await db.refresh(db_reminder)

        job_id = await plan_one_time_reminder(scheduler,
                                              new_one_time_reminder.text,
                                              new_one_time_reminder.date,
                                              new_one_time_reminder.time,
                                              new_one_time_reminder.tg_user_id,
                                              action_function, db_reminder.id)

        db_reminder.job_id = job_id
        await db.commit()
        return {"is_ok": True}


async def create_new_regular_reminder_crud(new_regular_reminder: NewRegularReminder, scheduler):
    async with SessionLocal() as db:
        db_reminder = RegularReminders(
            text=new_regular_reminder.text,
            dates=new_regular_reminder.dates,
            times=new_regular_reminder.times,
            tg_user_id=new_regular_reminder.tg_user_id,
            job_ids=None
        )
        db.add(db_reminder)
        await db.commit()
        await db.refresh(db_reminder)

        job_ids_after_planning = await plan_regular_reminder(scheduler,
                                                             new_regular_reminder.text,
                                                             new_regular_reminder.dates,
                                                             new_regular_reminder.times,
                                                             new_regular_reminder.tg_user_id,
                                                             db_reminder.id)
        db_reminder.job_ids = job_ids_after_planning
        await db.commit()
        return {"is_ok": True}


async def create_new_negative_habit_crud(new_negative_habit: NewNegativeHabit, scheduler):
    async with SessionLocal() as db:
        db_negative_habit = NegativeHabits(
            negative_habit_name=new_negative_habit.negative_habit_name,
            now_state=new_negative_habit.now_state,
            tg_user_id=new_negative_habit.tg_user_id,
            job_ids=None
        )

        db.add(db_negative_habit)
        await db.commit()
        await db.refresh(db_negative_habit)

        return {"id": db_negative_habit.id}


async def delete_one_time_reminder_crud(reminder_id: int, scheduler, delete_from_scheduler=True):
    async with SessionLocal() as db:
        result = await db.execute(select(OneTimeReminder).filter(OneTimeReminder.id == reminder_id))
        reminder = result.scalars().first()

        if reminder is None:
            return {"is_ok": False}

        if delete_from_scheduler and reminder.job_id:
            scheduler.remove_job(str(reminder.job_id))

        await db.delete(reminder)
        await db.commit()

        return {"is_ok": True}


async def delete_regular_reminder_crud(reminder_id: int, scheduler, delete_from_scheduler=True):
    async with SessionLocal() as db:
        result = await db.execute(select(RegularReminders).filter(RegularReminders.id == reminder_id))
        reminder = result.scalars().first()

        if reminder is None:
            return {"is_ok": False}

        if delete_from_scheduler and reminder.job_ids:
            for current_job_id in reminder.job_ids:
                scheduler.remove_job(str(current_job_id))

        await db.delete(reminder)
        await db.commit()

        return {"is_ok": True}


async def edit_negative_habit_stage_1_add_positive_habit_crud(habit_id: int, new_data: NewNegativeHabitStage1,
                                                              scheduler):
    async with SessionLocal() as db:
        db_habit = await db.get(NegativeHabits, habit_id)

        db_habit.positive_instead_negative = new_data.positive_instead_negative
        db_habit.dates = new_data.dates
        db_habit.times = new_data.times

        await db.commit()
        await db.refresh(db_habit)

        # job_ids_after_planning = await plan_regular_reminder(
        #     scheduler,
        #     f"Выполнили ли Вы сегодня привычку «{db_habit.positive_instead_negative}»?",
        #     db_habit.dates,
        #     db_habit.times,
        #     db_habit.tg_user_id,
        #     db_habit.id)
        #
        # db_habit.job_ids = job_ids_after_planning
        # await db.commit()
        return {"is_ok": True}


async def edit_habit_add_another_result_crud(habit_id: int, new_data: NewAnotherResult,
                                             scheduler):
    print(f"[habit_id={habit_id}, tg_user_id={new_data.tg_user_id}] Pressed button: {new_data.pressed_button}")
    async with SessionLocal() as db:
        db_habit = await db.get(NegativeHabits, habit_id)
        if new_data.pressed_button == "yes":
            db_habit.success_counter += 1
        else:
            db_habit.failure_counter += 1

        await db.commit()
        await db.refresh(db_habit)


async def edit_negative_habit_stage_1_add_number_of_days_for_mindfulness_crud(habit_id: int,
                                                                              new_data: NewNumberOfDaysForMindfulness,
                                                                              scheduler):
    async with SessionLocal() as db:
        db_habit = await db.get(NegativeHabits, habit_id)

        if not db_habit.unlock_date_for_stage_1:
            current_date = datetime.now()
            unlock_date = current_date + timedelta(days=new_data.number_of_days)
            # unlock_date = current_date + timedelta(minutes=1)

            db_habit.unlock_date_for_stage_1 = unlock_date.strftime("%Y-%m-%d %H:%M:00")

            job_id = await plan_one_time_action(scheduler,
                                                db_habit.unlock_date_for_stage_1,
                                                edit_negative_habit_stage_1_set_ok_status_for_mindfulness_crud,
                                                db_habit.id)

            await db.commit()
            await db.refresh(db_habit)

        return db_habit.unlock_date_for_stage_1


async def edit_negative_habit_stage_1_set_ok_status_for_mindfulness_crud(habit_id: int):
    async with SessionLocal() as db:
        db_habit = await db.get(NegativeHabits, habit_id)
        db_habit.is_unlocked_for_stage_1 = 1

        await db.commit()
        await db.refresh(db_habit)


async def get_unlock_status_stage_1_crud(habit_id: int):
    async with SessionLocal() as db:
        db_habit = await db.get(NegativeHabits, habit_id)

        return db_habit.is_unlocked_for_stage_1


async def get_negative_habits_crud(user_id: str):
    async with SessionLocal() as db:
        query = select(NegativeHabits).where(NegativeHabits.tg_user_id == str(user_id))
        result = await db.execute(query)
        habits = result.scalars().all()
    return habits


async def edit_now_page_crud(habit_id: int, now_page_url: str):
    async with SessionLocal() as db:
        db_habit = await db.get(NegativeHabits, habit_id)
        print(db_habit)
        db_habit.now_page = now_page_url

        await db.commit()
        await db.refresh(db_habit)


async def get_now_page_for_negative_habit_crud(habit_id: int):
    async with SessionLocal() as db:
        db_habit = await db.get(NegativeHabits, habit_id)

        return db_habit.now_page

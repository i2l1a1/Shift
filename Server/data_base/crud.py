from sqlalchemy import select

from data_base.data_base_init import SessionLocal
from data_base.data_base_models import RegularReminders, OneTimeReminder, HabitModel
from notifications.reminders import plan_one_time_reminder, plan_regular_reminder
from schemas.pydantic_schemas import NewOneTimeReminder, NewRegularReminder, NewHabit, NewHabitStage1, \
    NewAnotherResult, NewNumberOfDays, NewSubgoals, NewTriggerFactorsTestAnswers, NewStartingDate, \
    NewBreakdownTestAnswers, NewStageNumber
from datetime import datetime, timedelta


async def get_one_time_reminders_crud(user_id):
    async with SessionLocal() as db:
        if user_id:
            result = await db.execute(
                select(OneTimeReminder).where(OneTimeReminder.tg_user_id == str(user_id))
            )
        else:
            result = await db.execute(select(OneTimeReminder))
        reminders = result.scalars().all()
    return reminders


async def get_regular_reminders_crud(user_id):
    async with SessionLocal() as db:
        if user_id:
            result = await db.execute(
                select(RegularReminders).where(RegularReminders.tg_user_id == str(user_id))
            )
        else:
            result = await db.execute(select(RegularReminders))
        reminders = result.scalars().all()
    return reminders


async def create_new_one_time_reminder_crud(new_one_time_reminder: NewOneTimeReminder, scheduler):
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
                                              db_reminder.id)

        db_reminder.job_id = job_id

        if job_id is None:
            db_reminder.is_expired = True

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


async def create_new_habit_crud(new_habit: NewHabit, scheduler):
    async with SessionLocal() as db:
        if new_habit.habit_type == "negative":
            db_habit = HabitModel(
                negative_habit_name=new_habit.habit_name,
                now_state=new_habit.now_state,
                tg_user_id=new_habit.tg_user_id,
                job_ids_for_reminders=None,
                habit_type=new_habit.habit_type
            )
        else:
            db_habit = HabitModel(
                positive_habit_name=new_habit.habit_name,
                now_state=new_habit.now_state,
                tg_user_id=new_habit.tg_user_id,
                job_ids_for_reminders=None,
                habit_type=new_habit.habit_type
            )

        db.add(db_habit)
        await db.commit()
        await db.refresh(db_habit)

        return {"id": db_habit.id}


async def delete_one_time_reminder_crud(reminder_id: int, scheduler, delete_from_scheduler=True):
    async with SessionLocal() as db:
        result = await db.execute(select(OneTimeReminder).filter(OneTimeReminder.id == reminder_id))
        reminder = result.scalars().first()

        if reminder is None:
            return {"is_ok": False}

        if delete_from_scheduler and reminder.job_id:
            job = scheduler.get_job(str(reminder.job_id))
            if job:
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


async def edit_habit_stage_1_add_or_change_positive_habit_crud(habit_id: int, new_data: NewHabitStage1,
                                                               scheduler):
    async with SessionLocal() as db:
        db_habit = await db.get(HabitModel, habit_id)

        db_habit.positive_habit_name = new_data.positive_habit_name
        db_habit.dates = new_data.dates
        db_habit.times = new_data.times

        await db.commit()
        await db.refresh(db_habit)

        if db_habit.job_ids_for_reminders:
            for current_job_id in db_habit.job_ids_for_reminders:
                scheduler.remove_job(str(current_job_id))

        job_ids_after_planning = await plan_regular_reminder(
            scheduler,
            db_habit.positive_habit_name,
            db_habit.dates,
            db_habit.times,
            db_habit.tg_user_id,
            db_habit.id,
            for_habit=True,
            with_buttons=True
        )

        db_habit.job_ids_for_reminders = job_ids_after_planning
        await db.commit()

        return {"is_ok": True}


async def edit_habit_add_another_result_crud(habit_id: int, new_data: NewAnotherResult,
                                             scheduler):
    async with SessionLocal() as db:
        db_habit = await db.get(HabitModel, habit_id)
        if new_data.pressed_button == "yes":
            db_habit.success_counter += 1
        else:
            db_habit.failure_counter += 1

        await db.commit()
        await db.refresh(db_habit)


async def edit_negative_habit_stage_1_add_number_of_days_for_mindfulness_crud(habit_id: int,
                                                                              new_data: NewNumberOfDays,
                                                                              scheduler):
    async with SessionLocal() as db:
        db_habit = await db.get(HabitModel, habit_id)

        if not db_habit.unlock_date_for_stage_1:
            current_date = datetime.now()
            # unlock_date = current_date + timedelta(days=new_data.number_of_days)
            unlock_date = current_date + timedelta(minutes=5)

            db_habit.unlock_date_for_stage_1 = unlock_date.strftime("%Y-%m-%d %H:%M:00")

            await db.commit()
            await db.refresh(db_habit)

        return db_habit.unlock_date_for_stage_1


async def edit_habit_stage_2_start_trigger_tracking_crud(habit_id: int,
                                                         new_data: NewNumberOfDays,
                                                         scheduler):
    async with SessionLocal() as db:
        db_habit = await db.get(HabitModel, habit_id)

        if not db_habit.unlock_date_for_stage_2:
            current_date = datetime.now()
            # unlock_date = current_date + timedelta(days=new_data.number_of_days)
            unlock_date = current_date + timedelta(minutes=5)

            db_habit.unlock_date_for_stage_2 = unlock_date.strftime("%Y-%m-%d %H:%M:00")

            await db.commit()
            await db.refresh(db_habit)

        return db_habit.unlock_date_for_stage_2


async def get_unlock_status_stage_1_crud(habit_id: int):
    async with SessionLocal() as db:
        db_habit = await db.get(HabitModel, habit_id)

        if not db_habit.unlock_date_for_stage_1:
            return 0

        unlock_date = datetime.strptime(db_habit.unlock_date_for_stage_1, "%Y-%m-%d %H:%M:%S")
        now_time = datetime.now()

        return 1 if now_time >= unlock_date else 0


async def get_unlock_status_stage_2_crud(habit_id: int):
    async with SessionLocal() as db:
        db_habit = await db.get(HabitModel, habit_id)

        if not db_habit.unlock_date_for_stage_2:
            return 0

        unlock_date = datetime.strptime(db_habit.unlock_date_for_stage_2, "%Y-%m-%d %H:%M:%S")
        now_time = datetime.now()

        return 1 if now_time >= unlock_date else 0


async def get_unlock_status_stage_3_crud(habit_id: int):
    async with SessionLocal() as db:
        db_habit = await db.get(HabitModel, habit_id)

        if not db_habit.unlock_date_for_stage_3:
            return 0

        unlock_date = datetime.strptime(db_habit.unlock_date_for_stage_3, "%Y-%m-%d %H:%M:%S")
        now_time = datetime.now()

        return 1 if now_time >= unlock_date else 0


async def get_unlock_status_stage_4_crud(habit_id: int):
    async with SessionLocal() as db:
        db_habit = await db.get(HabitModel, habit_id)

        if not db_habit.unlock_date_for_stage_4:
            return 0

        unlock_date = datetime.strptime(db_habit.unlock_date_for_stage_4, "%Y-%m-%d %H:%M:%S")
        now_time = datetime.now()

        return 1 if now_time >= unlock_date else 0


async def get_unlock_status_stage_5_crud(habit_id: int):
    async with SessionLocal() as db:
        db_habit = await db.get(HabitModel, habit_id)

        if not db_habit.unlock_date_for_stage_5:
            return 0

        unlock_date = datetime.strptime(db_habit.unlock_date_for_stage_5, "%Y-%m-%d %H:%M:%S")
        now_time = datetime.now()

        return 1 if now_time >= unlock_date else 0


async def get_negative_habits_crud(user_id: str):
    async with SessionLocal() as db:
        query = select(HabitModel).where(HabitModel.tg_user_id == str(user_id))
        result = await db.execute(query)
        habits = result.scalars().all()
    return habits


async def get_all_negative_habits_crud():
    async with SessionLocal() as db:
        query = select(HabitModel)
        result = await db.execute(query)
        habits = result.scalars().all()
    return habits


async def get_negative_habit_crud(habit_id: int):
    async with SessionLocal() as db:
        query = select(HabitModel).where(HabitModel.id == habit_id)
        result = await db.execute(query)
        habits = result.scalars().all()
    return habits


async def edit_now_page_crud(habit_id: int, now_page_url: str):
    async with SessionLocal() as db:
        db_habit = await db.get(HabitModel, habit_id)
        db_habit.now_page = now_page_url

        await db.commit()
        await db.refresh(db_habit)


async def get_now_page_for_negative_habit_crud(habit_id: int):
    async with SessionLocal() as db:
        db_habit = await db.get(HabitModel, habit_id)

        return db_habit.now_page


async def add_subgoals_crud(habit_id: int, new_subgoals: NewSubgoals):
    async with SessionLocal() as db:
        db_habit = await db.get(HabitModel, habit_id)
        db_habit.positive_habit_name = new_subgoals.positive_habit
        db_habit.subgoals = new_subgoals.subgoals

        await db.commit()
        await db.refresh(db_habit)


async def add_trigger_factors_crud(habit_id: int, trigger_factors: NewTriggerFactorsTestAnswers):
    async with SessionLocal() as db:
        db_habit = await db.get(HabitModel, habit_id)
        db_habit.trigger_factors_answer_1 = trigger_factors.trigger_factors_answer_1
        db_habit.trigger_factors_answer_2 = trigger_factors.trigger_factors_answer_2
        db_habit.trigger_factors_answer_3 = trigger_factors.trigger_factors_answer_3
        db_habit.trigger_factors_answer_4 = trigger_factors.trigger_factors_answer_4
        db_habit.trigger_factors_answer_5 = trigger_factors.trigger_factors_answer_5

        await db.commit()
        await db.refresh(db_habit)


async def add_breakdown_factors_crud(habit_id: int, breakdown: NewBreakdownTestAnswers):
    async with SessionLocal() as db:
        db_habit = await db.get(HabitModel, habit_id)
        db_habit.breakdown_places = breakdown.places
        db_habit.breakdown_actions = breakdown.actions
        db_habit.breakdown_when = breakdown.when
        db_habit.breakdown_who = breakdown.who

        await db.commit()
        await db.refresh(db_habit)


async def add_starting_date_crud(habit_id: int, starting_date: NewStartingDate):
    async with SessionLocal() as db:
        db_habit = await db.get(HabitModel, habit_id)
        db_habit.starting_date = starting_date.date

        await db.commit()
        await db.refresh(db_habit)


async def edit_negative_habit_stage_3_start_effort_stage_crud(habit_id, number_of_days, scheduler):
    async with SessionLocal() as db:
        db_habit = await db.get(HabitModel, habit_id)

        if not db_habit.unlock_date_for_stage_3:
            current_date = datetime.now()
            # unlock_date = current_date + timedelta(days=new_data.number_of_days)
            unlock_date = current_date + timedelta(minutes=30)

            db_habit.unlock_date_for_stage_3 = unlock_date.strftime("%Y-%m-%d %H:%M:00")

            await db.commit()
            await db.refresh(db_habit)

        return db_habit.unlock_date_for_stage_3


async def edit_negative_habit_stage_4_start_breakdown_tracking_crud(habit_id, number_of_days, scheduler):
    async with SessionLocal() as db:
        db_habit = await db.get(HabitModel, habit_id)

        if not db_habit.unlock_date_for_stage_4:
            current_date = datetime.now()
            # unlock_date = current_date + timedelta(days=new_data.number_of_days)
            unlock_date = current_date + timedelta(minutes=5)

            db_habit.unlock_date_for_stage_4 = unlock_date.strftime("%Y-%m-%d %H:%M:00")

            await db.commit()
            await db.refresh(db_habit)

        return db_habit.unlock_date_for_stage_4


async def edit_negative_habit_stage_5_start_list_creating_crud(habit_id, number_of_days):
    async with SessionLocal() as db:
        db_habit = await db.get(HabitModel, habit_id)

        if not db_habit.unlock_date_for_stage_5:
            current_date = datetime.now()
            # unlock_date = current_date + timedelta(days=new_data.number_of_days)
            unlock_date = current_date + timedelta(minutes=5)

            db_habit.unlock_date_for_stage_5 = unlock_date.strftime("%Y-%m-%d %H:%M:00")

            await db.commit()
            await db.refresh(db_habit)

        return db_habit.unlock_date_for_stage_5


async def change_stage_crud(habit_id, stage_number: NewStageNumber):
    async with SessionLocal() as db:
        db_habit = await db.get(HabitModel, habit_id)
        db_habit.now_state = stage_number.stage_number

        await db.commit()
        await db.refresh(db_habit)


async def delete_habit_crud(habit_id, scheduler, delete_from_scheduler=True):
    async with SessionLocal() as db:
        result = await db.execute(select(HabitModel).filter(HabitModel.id == habit_id))
        habit = result.scalars().first()

        if habit is None:
            return {"is_ok": False}

        if delete_from_scheduler and habit.job_ids_for_reminders:
            for current_job_id in habit.job_ids_for_reminders:
                scheduler.remove_job(str(current_job_id))

        await db.delete(habit)
        await db.commit()

        return {"is_ok": True}

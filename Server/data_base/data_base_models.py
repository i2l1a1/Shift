from sqlalchemy import Column, Integer, String, JSON
from data_base.data_base_init import Base


class OneTimeReminder(Base):
    __tablename__ = "one_time_reminders"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, index=True)
    date = Column(String)
    time = Column(String)
    tg_user_id = Column(String)
    job_id = Column(String)


class RegularReminders(Base):
    __tablename__ = "regular_reminders"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, index=True)
    dates = Column(JSON)
    times = Column(JSON)
    tg_user_id = Column(String)
    job_ids = Column(JSON)


class NegativeHabits(Base):
    __tablename__ = "negative_habits"

    id = Column(Integer, primary_key=True, index=True)
    negative_habit_name = Column(String)
    positive_instead_negative = Column(String)
    dates = Column(JSON)
    times = Column(JSON)
    now_state = Column(Integer)
    tg_user_id = Column(String)
    job_ids = Column(JSON)
    success_counter = Column(Integer, default=0)
    failure_counter = Column(Integer, default=0)
    unlock_date_for_stage_1 = Column(String)
    is_unlocked_for_stage_1 = Column(Integer, default=0)
    now_page = Column(String)
    subgoals = Column(JSON)
    trigger_factors_time_of_days = Column(String)
    trigger_factors_situations = Column(String)
    trigger_factors_triggers = Column(String)
    trigger_factors_behaviour = Column(String)
    trigger_factors_consequences = Column(String)
    unlock_date_for_stage_2 = Column(String)
    is_unlocked_for_stage_2 = Column(Integer, default=0)
    starting_date = Column(String)

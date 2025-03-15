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

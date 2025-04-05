from pydantic import BaseModel
from typing import List


class NewOneTimeReminder(BaseModel):
    text: str
    date: str
    time: str
    tg_user_id: str


class NewRegularReminder(BaseModel):
    text: str
    dates: List[str]
    times: List[str]
    tg_user_id: str


class NewNegativeHabit(BaseModel):
    now_state: int
    negative_habit_name: str
    tg_user_id: str


class NewNegativeHabitStage1(BaseModel):
    positive_instead_negative: str
    dates: List[str]
    times: List[str]


class NewAnotherResult(BaseModel):
    pressed_button: str
    tg_user_id: str

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


class NewHabit(BaseModel):
    now_state: int
    habit_name: str
    tg_user_id: str
    habit_type: str


class NewHabitStage1(BaseModel):
    positive_habit_name: str
    dates: List[str]
    times: List[str]


class NewAnotherResult(BaseModel):
    pressed_button: str
    tg_user_id: str


class NewNumberOfDays(BaseModel):
    number_of_days: int


class NowPageUrl(BaseModel):
    page_url: str


class NewSubgoals(BaseModel):
    positive_habit: str
    subgoals: List[str]


class NewTriggerFactorsTestAnswers(BaseModel):
    trigger_factors_answer_1: str
    trigger_factors_answer_2: str
    trigger_factors_answer_3: str
    trigger_factors_answer_4: str
    trigger_factors_answer_5: str


class NewStartingDate(BaseModel):
    date: str


class NewBreakdownTestAnswers(BaseModel):
    places: str
    actions: str
    when: str
    who: str


class NewStageNumber(BaseModel):
    stage_number: int

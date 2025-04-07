from routers.init_scheduler import scheduler
from fastapi import APIRouter

from data_base.crud import create_new_negative_habit_crud, edit_negative_habit_stage_1_add_positive_habit_crud, \
    edit_habit_add_another_result_crud, \
    edit_negative_habit_stage_1_add_number_of_days_for_mindfulness_crud, get_unlock_status_stage_1_crud, \
    get_negative_habits_crud, edit_now_page_crud, get_now_page_for_negative_habit_crud, get_negative_habit_crud, \
    add_subgoals_crud, add_trigger_factors_crud, edit_negative_habit_stage_2_start_trigger_tracking_crud, \
    get_unlock_status_stage_2_crud, add_starting_date_crud
from schemas.pydantic_schemas import NewNegativeHabit, NewNegativeHabitStage1, NewAnotherResult, \
    NewNumberOfDays, NowPageUrl, NewSubgoals, NewTriggerFactorsTestAnswers, NewStartingDate

habits_router = APIRouter()


@habits_router.post("/new_negative_habit")
async def create_new_negative_habit(new_negative_habit: NewNegativeHabit):
    return await create_new_negative_habit_crud(new_negative_habit, scheduler)


@habits_router.post("/edit_negative_habit/stage_1/add_positive_habit/{habit_id}")
async def edit_negative_habit_stage_1_add_positive_habit(habit_id: int,
                                                         new_negative_habit_stage_1: NewNegativeHabitStage1):
    print(new_negative_habit_stage_1)
    return await edit_negative_habit_stage_1_add_positive_habit_crud(habit_id, new_negative_habit_stage_1, scheduler)


@habits_router.post("/edit_negative_habit/add_another_result/{habit_id}")
async def edit_negative_habit_stage_1_add_positive_habit(habit_id: int,
                                                         new_another_result: NewAnotherResult):
    return await edit_habit_add_another_result_crud(habit_id, new_another_result, scheduler)


@habits_router.post("/edit_negative_habit/stage_1/add_number_of_days_for_mindfulness/{habit_id}")
async def edit_negative_habit_stage_1_add_number_of_days_for_mindfulness(habit_id: int,
                                                                         number_of_days: NewNumberOfDays):
    return await edit_negative_habit_stage_1_add_number_of_days_for_mindfulness_crud(habit_id, number_of_days,
                                                                                     scheduler)


@habits_router.post("/edit_negative_habit/stage_2/start_trigger_tracking/{habit_id}")
async def edit_negative_habit_start_trigger_tracking(habit_id: int, number_of_days: NewNumberOfDays):
    return await edit_negative_habit_stage_2_start_trigger_tracking_crud(habit_id, number_of_days,
                                                                         scheduler)


@habits_router.get("/stage_1/get_unlock_status_stage_1/{habit_id}")
async def get_unlock_status_stage_1(habit_id: int):
    return await get_unlock_status_stage_1_crud(habit_id)


@habits_router.get("/stage_2/get_unlock_status_stage_2/{habit_id}")
async def get_unlock_status_stage_2(habit_id: int):
    return await get_unlock_status_stage_2_crud(habit_id)


@habits_router.get("/get_negative_habits/{user_id}")
async def get_negative_habits(user_id: str):
    return await get_negative_habits_crud(user_id)


@habits_router.get("/get_negative_habit/{habit_id}")
async def get_negative_habit(habit_id: int):
    return await get_negative_habit_crud(habit_id)


@habits_router.post("/edit_negative_habit/edit_now_page/{habit_id}")
async def edit_now_page(habit_id: int, now_page_url: NowPageUrl):
    return await edit_now_page_crud(habit_id, now_page_url.page_url)


@habits_router.post("/edit_negative_habit/stage_2/add_subgoals/{habit_id}")
async def add_subgoals(habit_id: int, new_subgoals: NewSubgoals):
    return await add_subgoals_crud(habit_id, new_subgoals)


@habits_router.get("/get_now_page_for_negative_habit/{habit_id}")
async def get_now_page_for_negative_habit(habit_id: int):
    return await get_now_page_for_negative_habit_crud(habit_id)


@habits_router.post("/edit_negative_habit/stage_2/add_trigger_factors/{habit_id}")
async def add_trigger_factors(habit_id: int, trigger_factors: NewTriggerFactorsTestAnswers):
    return await add_trigger_factors_crud(habit_id, trigger_factors)


@habits_router.post("/edit_negative_habit/stage_2/add_starting_date/{habit_id}")
async def add_starting_date(habit_id: int, new_starting_date: NewStartingDate):
    return await add_starting_date_crud(habit_id, new_starting_date)

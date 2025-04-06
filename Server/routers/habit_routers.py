from routers.init_scheduler import scheduler
from fastapi import APIRouter

from data_base.crud import create_new_negative_habit_crud, edit_negative_habit_stage_1_add_positive_habit_crud, \
    edit_habit_add_another_result_crud, \
    edit_negative_habit_stage_1_add_number_of_days_for_mindfulness_crud, get_unlock_status_stage_1_crud, \
    get_negative_habits_crud, edit_now_page_crud, get_now_page_for_negative_habit_crud
from schemas.pydantic_schemas import NewNegativeHabit, NewNegativeHabitStage1, NewAnotherResult, \
    NewNumberOfDaysForMindfulness, NowPageUrl

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
                                                                         number_of_days: NewNumberOfDaysForMindfulness):
    return await edit_negative_habit_stage_1_add_number_of_days_for_mindfulness_crud(habit_id, number_of_days,
                                                                                     scheduler)


@habits_router.get("/stage_1/get_unlock_status_stage_1/{habit_id}")
async def get_unlock_status_stage_1(habit_id: int):
    return await get_unlock_status_stage_1_crud(habit_id)


@habits_router.get("/get_negative_habits/{user_id}")
async def get_negative_habits(user_id: str):
    return await get_negative_habits_crud(user_id)


@habits_router.post("/edit_negative_habit/edit_now_page/{habit_id}")
async def edit_now_page(habit_id: int, now_page_url: NowPageUrl):
    print(habit_id, now_page_url)
    return await edit_now_page_crud(habit_id, now_page_url.page_url)


@habits_router.get("/get_now_page_for_negative_habit/{habit_id}")
async def get_now_page_for_negative_habit(habit_id: int):
    return await get_now_page_for_negative_habit_crud(habit_id)

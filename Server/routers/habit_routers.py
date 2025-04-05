from routers.init_scheduler import scheduler
from fastapi import APIRouter

from data_base.crud import create_new_negative_habit_crud, edit_negative_habit_stage_1_add_positive_habit_crud, \
    edit_habit_add_another_result_crud
from schemas.pydantic_schemas import NewNegativeHabit, NewNegativeHabitStage1, NewAnotherResult

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

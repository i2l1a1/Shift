import uvicorn
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from routers.reminder_routers import reminders_router
from routers.habit_routers import habits_router
from init_server.lifespan_function import lifespan

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(reminders_router)
app.include_router(habits_router)

if __name__ == "__main__":
    uvicorn.run("main:app", port=9091, reload=True)

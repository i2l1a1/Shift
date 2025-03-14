import uvicorn
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from routers import reminders_router
from lifespan_function import lifespan

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(reminders_router)

if __name__ == "__main__":
    uvicorn.run("main:app", port=9091, reload=True)

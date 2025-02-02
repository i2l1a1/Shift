import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from starlette.middleware.cors import CORSMiddleware

SQLALCHEMY_DATABASE_URL = "sqlite:///./shift_db.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


class OneTimeReminder(Base):
    __tablename__ = "one_time_reminders"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, index=True)
    date = Column(String)
    time = Column(String)


Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class NewOneTimeReminder(BaseModel):
    text: str
    date: str
    time: str


@app.post("/new_one_time_reminder")
def create_new_one_time_reminder(new_one_time_reminder: NewOneTimeReminder):
    db = SessionLocal()
    db_reminder = OneTimeReminder(
        text=new_one_time_reminder.text,
        date=new_one_time_reminder.date,
        time=new_one_time_reminder.time
    )
    db.add(db_reminder)
    db.commit()
    db.refresh(db_reminder)
    db.close()
    return {"is_ok": True}


@app.get("/get_one_time_reminders")
def get_one_time_reminders():
    db = SessionLocal()
    reminders = db.query(OneTimeReminder).all()
    db.close()
    return reminders


@app.post("/delete_one_time_reminder/{reminder_id}")
def get_one_time_reminders(reminder_id):
    db = SessionLocal()
    reminder = db.query(OneTimeReminder).filter(OneTimeReminder.id == reminder_id).first()
    db.delete(reminder)
    db.commit()
    db.close()

    return {"is_ok": True}


if __name__ == "__main__":
    uvicorn.run("main:app", port=9091, reload=True)

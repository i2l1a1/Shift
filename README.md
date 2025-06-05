# Shift

**Telegram Bot for Building Habits & Managing Reminders.**

---

## Overview

Shift is a Telegram bot with Mini App that helps users build positive habits and quit harmful ones through a structured,
five-stage workflow, based on _“Changeology: 5 Steps to Realizing Your Goals and Resolutions”_ by John Norcross. It also
supports one-time and recurring reminders. The core idea is to guide users step by step, track progress, and send timely
notifications for habits within Telegram.

---

## Tech Stack

- **Backend:** Python, FastAPI, Uvicorn, SQLAlchemy (SQLite), APScheduler
- **Telegram-bot:** aiogram
- **Frontend:** HTML, CSS, JavaScript
- **Hosting:** Vercel (Mini App), VPS from Timeweb (FastAPI server & bot)

---

## Installation and Setup

### For users

Just click on the [link](https://t.me/your_shift_bot) to start.

### For developers

1. Rent a VPS/VDS server with Linux and assign the URL address to this server.
2. Create Telegram Bot via [BotFather](https://t.me/BotFather).
3. Clone this repository.
4. Go to `WebApp/tools/networking_tools.js` and change `server_url` to your server URL (this URL was created in the 1 step).
5. Deploy frontend (the `WebApp` folder) and assign the URL address. I've
   used [Vercel](https://vercel.com/ilias-projects-7a4dc7fc).
6. Go to the `Server` folder (`cd Server`) and rename `.env.example` into `.env`.
7. Go to the `TelegramBot` folder (`cd ../TelegramBot`) and put the real data to `.env.example`: `BOT_TOKEN` (from the 2 step) and `WEBAPP_URL`(from the 5 step).
8. Rename `.env.example` into `.env`.
9. Execute `cd .. && ./install`.
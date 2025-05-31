import asyncio
import uvicorn
from bot import dp, bot


async def start_bot():
    await dp.start_polling(bot)


async def start_server():
    uvicorn_config = uvicorn.Config("server:app", port=9092, host="0.0.0.0", log_level="info", reload=True)
    server = uvicorn.Server(uvicorn_config)
    await server.serve()


async def main():
    bot_task = asyncio.create_task(start_bot())
    server_task = asyncio.create_task(start_server())
    await asyncio.gather(bot_task, server_task)


if __name__ == "__main__":
    asyncio.run(main())

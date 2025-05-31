from environs import Env


class Config:
    bot_token: str = ""
    webapp_url: str = ""
    server_url: str = ""


env = Env()
env.read_env(".env")

config = Config()
config.bot_token = env("BOT_TOKEN")
config.webapp_url = env("WEBAPP_URL")
config.server_url = env("SERVER_URL")

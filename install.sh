#!/usr/bin/env bash
set -euo pipefail

cd Server

python3 -m venv venv

source venv/bin/activate

pip install --upgrade pip
pip install -r requirements.txt

nohup python main.py > server.log 2>&1 &

deactivate
cd ..

cd TelegramBot

python3 -m venv venv

source venv/bin/activate

pip install --upgrade pip
pip install -r requirements.txt

nohup python main.py > bot.log 2>&1 &

deactivate
cd ..
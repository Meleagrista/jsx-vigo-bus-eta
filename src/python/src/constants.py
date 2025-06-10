import os

from src import ROOT_DIR

CONFIG_DIR = ROOT_DIR / "config"
ENV_FILE = CONFIG_DIR / ".env"
LOG_FILE = CONFIG_DIR / ".log"

default_terminal_width = 150
CONSOLE_WIDTH = int(os.environ.get("CONSOLE_WIDTH", default_terminal_width))
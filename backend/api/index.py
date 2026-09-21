import os
import sys

# main.py and its sibling packages (database/, tools/, agents/) live one
# directory up from here (backend/), not inside api/ itself — add that
# directory to sys.path so "from main import app" and main.py's own
# "from database.database import ..." style imports keep working.
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from main import app  # noqa: E402

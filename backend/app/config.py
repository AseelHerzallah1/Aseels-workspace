"""Central configuration, loaded from environment variables."""
import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
CONTENT_DIR = BASE_DIR / "content"
DATA_DIR = BASE_DIR / "data"
INDEX_PATH = DATA_DIR / "knowledge.json"

# Who the bot is about
PERSON_NAME = os.getenv("PERSON_NAME", "Aseel")

# Groq (LLM) settings
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

# Embeddings + retrieval settings
EMBED_MODEL = os.getenv("EMBED_MODEL", "BAAI/bge-small-en-v1.5")
TOP_K = int(os.getenv("TOP_K", "5"))

# CORS: comma-separated list of allowed frontend origins
ALLOWED_ORIGINS = [
    o.strip()
    for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
    if o.strip()
]

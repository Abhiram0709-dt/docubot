import os
from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path)

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
VECTORSTORE_DIR = os.getenv("VECTORSTORE_DIR", "./vectorstore")
if not GOOGLE_API_KEY:
    print("WARNING: GEMINI_API_KEY not found in environment variables! Gemini LLM will not work.")
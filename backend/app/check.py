import os
from dotenv import load_dotenv
load_dotenv(".env")
print("GOOGLE_API_KEY:", os.getenv("GOOGLE_API_KEY"))  # Add this line
import google.generativeai as genai
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
for m in genai.list_models():
    print(m.name, m.supported_generation_methods)
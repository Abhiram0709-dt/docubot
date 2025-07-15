from sentence_transformers import SentenceTransformer
import google.generativeai as genai
from .config import GOOGLE_API_KEY, EMBEDDING_MODEL

genai.configure(api_key=GOOGLE_API_KEY)
model = SentenceTransformer(EMBEDDING_MODEL)

def embed_texts(texts):
    return model.encode(texts).tolist()

def generate_answer(question, context_chunks):
    prompt = (
        "You are a helpful assistant. Use the following context to answer the question.\n\n"
        "Context:\n"
        + "\n---\n".join(context_chunks)
        + f"\n\nQuestion: {question}\nAnswer:"
    )
    gemini_model = genai.GenerativeModel("gemini-2.0-flash-lite")
    response = gemini_model.generate_content(prompt)
    return response.text.strip() 
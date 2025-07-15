# DocuBot

DocuBot is a full-stack AI-powered document Q&A application. Upload your documents (PDF, DOCX, TXT) and ask questions about their content using natural language. Powered by a Retrieval-Augmented Generation (RAG) pipeline.

## Features

- Upload PDF, DOCX, or TXT files
- Extracts and chunks document text
- Embeds chunks using OpenAI or HuggingFace models
- Stores embeddings in a vector store (Chroma/FAISS)
- Ask questions and get answers with context from your documents
- Clean React + Tailwind UI
- View, delete, and chat with your documents
- See source context used in answers

## Setup

### Backend

1. `cd backend`
2. `python -m venv venv && source venv/bin/activate` (or `venv\Scripts\activate` on Windows)
3. `pip install -r requirements.txt`
4. Create `.env` in `backend/app/` with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key
   EMBEDDING_MODEL=all-MiniLM-L6-v2
   VECTORSTORE_DIR=./vectorstore
   ```
5. `uvicorn app.main:app --reload`

### Frontend

1. `cd frontend`
2. `npm install`
3. `npm start`
4. Visit [http://localhost:3000](http://localhost:3000)

## Usage

- Upload a document
- Select it from the list
- Ask questions in the chat interface
- See the answer and the context used

## Tech Stack

- **Backend:** FastAPI, LangChain, Chroma/FAISS, OpenAI/HuggingFace, PyMuPDF, docx2txt
- **Frontend:** React, Tailwind CSS, Axios

## Optional Features

- MongoDB for metadata and chat history
- JWT-based multi-user sessions
- Highlighting source text in answers
- Multiple file uploads and parallel embedding

---

**Enjoy using DocuBot!** 
import os
import uuid
from datetime import datetime
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .models import *
from .utils import extract_text_from_pdf, extract_text_from_docx, extract_text_from_txt, chunk_text
from .vectorstore import get_collection, delete_collection
from .mongodb import documents_collection
from .rag import embed_texts, generate_answer

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.post("/upload", response_model=UploadResponse)
async def upload_document(file: UploadFile = File(...)):
    ext = file.filename.split(".")[-1].lower()
    doc_id = str(uuid.uuid4())
    save_path = os.path.join(UPLOAD_DIR, f"{doc_id}_{file.filename}")
    with open(save_path, "wb") as f:
        f.write(await file.read())

    # Extract text
    if ext == "pdf":
        text = extract_text_from_pdf(save_path)
    elif ext == "docx":
        text = extract_text_from_docx(save_path)
    elif ext == "txt":
        text = extract_text_from_txt(save_path)
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type.")

    if not text.strip():
        raise HTTPException(status_code=400, detail="Extracted text is empty.")

    # Chunk and embed
    chunks = chunk_text(text)
    print(f"[UPLOAD] Total chunks: {len(chunks)}")
    for i, chunk in enumerate(chunks[:5]):
        print(f"[UPLOAD] Chunk {i}: {repr(chunk[:100])}...")

    if not chunks:
        raise HTTPException(status_code=500, detail="Chunking failed. No text chunks generated.")

    embeddings = embed_texts(chunks)
    print(f"[UPLOAD] Embedding shape: {len(embeddings)} x {len(embeddings[0]) if embeddings else 0}")

    collection = get_collection(doc_id)
    collection.add(
        documents=chunks,
        embeddings=embeddings,
        metadatas=[{"chunk_id": i} for i in range(len(chunks))],
        ids=[str(i) for i in range(len(chunks))]
    )
    print(f"[UPLOAD] Added to vectorstore with doc_id: {doc_id}")

    doc_meta = {
        "doc_id": doc_id,
        "filename": file.filename,
        "upload_time": datetime.utcnow().isoformat(),
        "chunks": len(chunks),
    }
    documents_collection.insert_one(doc_meta)
    return UploadResponse(doc_id=doc_id, filename=file.filename)


@app.get("/documents", response_model=list[DocumentMetadata])
def list_documents():
    docs = list(documents_collection.find({}, {"_id": 0}))
    return [DocumentMetadata(**doc) for doc in docs]


@app.delete("/documents/{doc_id}")
def delete_document(doc_id: str):
    doc = documents_collection.find_one({"doc_id": doc_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    try:
        delete_collection(doc_id)
    except Exception as e:
        print(f"[DELETE] Warning: Could not delete vectorstore collection for {doc_id}: {e}")
    documents_collection.delete_one({"doc_id": doc_id})
    return {"detail": "Document deleted"}


@app.post("/ask", response_model=QuestionResponse)
def ask_question(req: QuestionRequest):
    print(f"[ASK] Received question for doc_id: {req.doc_id}")
    doc = documents_collection.find_one({"doc_id": req.doc_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    collection = get_collection(req.doc_id)
    print("[ASK] Vectorstore collection loaded.")

    q_emb = embed_texts([req.question])[0]
    print(f"[ASK] Query embedding (first 5 values): {q_emb[:5]}")

    results = collection.query(
        query_embeddings=[q_emb],
        n_results=12,
        include=["documents", "distances", "metadatas"]
    )

    context_chunks = results.get("documents", [[]])[0]
    distances = results.get("distances", [[]])[0]

    print("[ASK] Retrieved context chunks:")
    for i, (chunk, dist) in enumerate(zip(context_chunks, distances)):
        print(f"  Chunk {i}: Distance={dist:.4f}, Text={repr(chunk[:80])}...")

    if not context_chunks:
        print("[ASK] No relevant chunks found.")

    answer = generate_answer(req.question, context_chunks)
    return QuestionResponse(answer=answer, context_chunks=context_chunks)

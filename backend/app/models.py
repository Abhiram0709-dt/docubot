from pydantic import BaseModel
from typing import List, Optional

class DocumentMetadata(BaseModel):
    doc_id: str
    filename: str
    upload_time: str

class UploadResponse(BaseModel):
    doc_id: str
    filename: str

class QuestionRequest(BaseModel):
    doc_id: str
    question: str

class QuestionResponse(BaseModel):
    answer: str
    context_chunks: List[str]
    highlighted_chunks: Optional[List[str]] = None

class DeleteRequest(BaseModel):
    doc_id: str 
import os
import chromadb
from chromadb.config import Settings

def get_chroma_client():
    return chromadb.Client(Settings(
        persist_directory=os.getenv("VECTORSTORE_DIR", "./vectorstore")
    ))

def get_collection(doc_id):
    client = get_chroma_client()
    return client.get_or_create_collection(doc_id)

def delete_collection(doc_id):
    client = get_chroma_client()
    client.delete_collection(doc_id) 
import React, { useEffect, useState } from "react";
import FileUpload from "./components/FileUpload.jsx";
import DocumentList from "./components/DocumentList.jsx";
import Chat from "./components/Chat.jsx";
import { listDocuments, deleteDocument } from "./api.js";

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const fetchDocs = async () => {
    const res = await listDocuments();
    setDocuments(res.data);
    if (res.data.length && !selectedId) setSelectedId(res.data[0].doc_id);
  };

  useEffect(() => {
    fetchDocs();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (id) => {
    await deleteDocument(id);
    fetchDocs();
    if (selectedId === id) setSelectedId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow py-4 px-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
          <span role="img" aria-label="robot">🤖</span> DocuBot
        </h1>
        <span className="text-gray-400 text-sm">AI Document Q&A</span>
      </header>
      <main className="flex max-w-6xl mx-auto mt-8 rounded-lg shadow-lg overflow-hidden bg-white min-h-[70vh]">
        {/* Sidebar */}
        <aside className="w-80 bg-gradient-to-b from-indigo-50 to-white border-r p-6 flex flex-col gap-6">
          <FileUpload onUpload={fetchDocs} />
          <DocumentList
            documents={documents}
            onDelete={handleDelete}
            onSelect={setSelectedId}
            selectedId={selectedId}
          />
        </aside>
        {/* Chat Area */}
        <section className="flex-1 flex flex-col p-8 bg-white">
          {selectedId ? (
            <Chat docId={selectedId} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Select or upload a document to start chatting.
            </div>
          )}
        </section>
      </main>
      <footer className="text-center text-xs text-gray-400 py-4">
        &copy; {new Date().getFullYear()} DocuBot. Powered by AI.
      </footer>
    </div>
  );
} 
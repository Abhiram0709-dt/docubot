import React from "react";

export default function DocumentList({
  documents,
  onDelete,
  onSelect,
  selectedId,
}) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-indigo-700">Your Documents</h3>
      {documents.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          <span role="img" aria-label="empty" className="text-2xl">📁</span>
          <p className="text-sm mt-2">No documents uploaded yet</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {documents.map((doc) => (
            <li
              key={doc.doc_id}
              className={`flex justify-between items-center p-3 rounded-lg cursor-pointer border transition ${
                selectedId === doc.doc_id
                  ? "bg-indigo-100 border-indigo-400 shadow-md"
                  : "bg-white border-gray-200 hover:bg-indigo-50 hover:border-indigo-300"
              }`}
              onClick={() => onSelect(doc.doc_id)}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span role="img" aria-label="document" className="text-lg">📄</span>
                <span className="truncate text-sm">{doc.filename}</span>
              </div>
              <button
                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(doc.doc_id);
                }}
                title="Delete document"
              >
                <span role="img" aria-label="delete">🗑️</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 
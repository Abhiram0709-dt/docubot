import React, { useRef, useState } from "react";
import { uploadDocument } from "../api.js";

export default function FileUpload({ onUpload }) {
  const fileInput = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (fileInput.current?.files?.length) {
      setUploading(true);
      await uploadDocument(fileInput.current.files[0]);
      setUploading(false);
      onUpload();
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-indigo-700">Upload Document</h3>
      <form onSubmit={handleUpload} className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-indigo-300 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition">
        <div className="text-center">
          <span role="img" aria-label="upload" className="text-2xl">📄</span>
          <p className="text-sm text-gray-600 mt-2">Drop files here or click to upload</p>
        </div>
        <input
          type="file"
          ref={fileInput}
          accept=".pdf,.docx,.txt"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
        />
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition w-full disabled:opacity-50"
          type="submit"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Document"}
        </button>
      </form>
    </div>
  );
} 
import React, { useState, useRef, useEffect } from "react";
import { askQuestion } from "../api.js";
import Spinner from "./Spinner.jsx";

const userAvatar = "https://ui-avatars.com/api/?name=You&background=4f46e5&color=fff";
const botAvatar = "https://ui-avatars.com/api/?name=Bot&background=6366f1&color=fff";

export default function Chat({ docId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { role: "user", content: input }]);
    setLoading(true);
    try {
      const res = await askQuestion(docId, input);
      setMessages((msgs) => [
        ...msgs,
        {
          role: "assistant",
          content: res.data.answer,
          context: res.data.context_chunks,
        },
      ]);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { role: "assistant", content: "Error getting answer." },
      ]);
    }
    setInput("");
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex-1 overflow-y-auto space-y-4 pr-2"
        ref={chatRef}
        style={{ maxHeight: "60vh" }}
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className="flex items-end gap-2">
              {msg.role === "assistant" && (
                <img src={botAvatar} alt="Bot" className="w-8 h-8 rounded-full border" />
              )}
              <div
                className={`px-4 py-2 rounded-2xl shadow ${
                  msg.role === "user"
                    ? "bg-indigo-500 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.content}
                {msg.context && (
                  <div className="text-xs mt-2 text-indigo-700">
                    <b>Context:</b>
                    <ul>
                      {msg.context.map((chunk, idx) => (
                        <li key={idx} className="bg-indigo-50 p-1 rounded my-1">
                          {chunk}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {msg.role === "user" && (
                <img src={userAvatar} alt="You" className="w-8 h-8 rounded-full border" />
              )}
            </div>
          </div>
        ))}
        {loading && <Spinner />}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2 mt-4">
        <input
          className="flex-1 border-2 border-indigo-200 rounded px-3 py-2 focus:outline-none focus:border-indigo-500 transition"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
        />
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded transition"
          type="submit"
          disabled={loading}
        >
          Send
        </button>
      </form>
    </div>
  );
} 
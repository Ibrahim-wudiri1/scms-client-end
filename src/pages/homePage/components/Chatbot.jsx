import React, { useState } from "react";
import { MessageCircle } from "lucide-react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi 👋 Ask me anything!" }
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input) return;

    let reply = "ShopSys helps manage shops easily.";
    if (input.toLowerCase().includes("offline")) {
      reply = "Yes! It works offline.";
    }

    setMessages([
      ...messages,
      { from: "user", text: input },
      { from: "bot", text: reply }
    ]);
    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-emerald-500 p-4 rounded-full text-white"
      >
        <MessageCircle />
      </button>

      {open && (
        <div className="fixed bottom-20 right-6 w-80 bg-white p-4 rounded-xl shadow">
          <div className="h-40 overflow-y-auto">
            {messages.map((m, i) => (
              <p key={i}>{m.text}</p>
            ))}
          </div>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full border p-2 mt-2"
          />

          <button onClick={send} className="mt-2 bg-emerald-500 w-full text-white p-2">
            Send
          </button>
        </div>
      )}
    </>
  );
}
import { useState } from "react";
import api from "../services/api";

function ChatAssistant() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAI = async () => {
    if (!prompt.trim()) return;

    setLoading(true);

    try {
      const res = await api.post("/chat", {
        prompt: prompt,
      });

      setResponse(res.data.response);
    } catch (error) {
      setResponse("Error connecting to AI backend.");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        flex: 1,
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
      }}
    >
      <h2>AI Assistant</h2>

      <textarea
        rows="8"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your interaction with the HCP..."
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
        }}
      />

      <button
        onClick={handleAI}
        disabled={loading}
        style={{
          background: "#16a34a",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {loading ? "Thinking..." : "Log with AI"}
      </button>

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          background: "#f8fafc",
          borderRadius: "8px",
          minHeight: "120px",
        }}
      >
        <strong>AI Response</strong>

        <p>{response}</p>
      </div>
    </div>
  );
}

export default ChatAssistant;
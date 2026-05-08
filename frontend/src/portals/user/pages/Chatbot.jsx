import { useState, useRef, useEffect } from "react";
import api from "../../../shared/services/api";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm your Smart Shopping Assistant. Ask me about products, deals, or your orders!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    setLoading(true);
    try {
      const res = await api.post("/ai/chat", { message: userMsg, context: "user" });
      setMessages((m) => [...m, { role: "assistant", text: res.data.reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "Sorry, I couldn't connect to the AI. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.avatar}>🤖</div>
        <div>
          <h2 style={styles.name}>Shopping Assistant</h2>
          <span style={styles.onlineDot}>● Online</span>
        </div>
      </div>

      <div style={styles.messages}>
        {messages.map((m, i) => (
          <div key={i} style={{ ...styles.msgRow, justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            {m.role === "assistant" && <div style={styles.botAvatar}>🤖</div>}
            <div style={{ ...styles.bubble, ...(m.role === "user" ? styles.userBubble : styles.botBubble) }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ ...styles.msgRow, justifyContent: "flex-start" }}>
            <div style={styles.botAvatar}>🤖</div>
            <div style={styles.botBubble}><span style={styles.typing}>●●●</span></div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={styles.inputRow}>
        <input
          value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask about products, offers, orders…"
          style={styles.input}
        />
        <button onClick={send} disabled={loading} style={styles.sendBtn}>Send</button>
      </div>
      <style>{`
        input:focus { outline: none; border-color: #6366f1 !important; }
        button:hover:not(:disabled) { background: #4f46e5 !important; }
        @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: 760, margin: "0 auto",
    background: "#16192a", border: "1px solid #252840", borderRadius: 16,
    display: "flex", flexDirection: "column", height: "calc(100vh - 130px)"
  },
  header: {
    padding: "16px 24px", borderBottom: "1px solid #252840",
    display: "flex", alignItems: "center", gap: 14
  },
  avatar: { fontSize: 32 },
  name: { fontSize: 16, fontWeight: 700, color: "#f1f5f9" },
  onlineDot: { fontSize: 12, color: "#22c55e" },
  messages: { flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 14 },
  msgRow: { display: "flex", gap: 10, alignItems: "flex-end" },
  botAvatar: { fontSize: 22, flexShrink: 0 },
  bubble: { maxWidth: "72%", padding: "12px 16px", borderRadius: 14, fontSize: 14, lineHeight: 1.6 },
  userBubble: { background: "#6366f1", color: "#fff", borderBottomRightRadius: 4 },
  botBubble: { background: "#1e2235", color: "#e2e8f0", borderBottomLeftRadius: 4, border: "1px solid #252840" },
  typing: { animation: "pulse 1.2s infinite", letterSpacing: 4 },
  inputRow: { padding: "14px 20px", borderTop: "1px solid #252840", display: "flex", gap: 10 },
  input: {
    flex: 1, background: "#0f1117", border: "1px solid #252840", borderRadius: 10,
    padding: "11px 16px", color: "#f1f5f9", fontSize: 14
  },
  sendBtn: {
    padding: "11px 22px", background: "#6366f1", color: "#fff", border: "none",
    borderRadius: 10, fontWeight: 700, cursor: "pointer", transition: "background 0.2s"
  }
};
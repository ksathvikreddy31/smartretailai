import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../../../shared/services/api";

const MessageContext = createContext();

export const useMessages = () => {
  const ctx = useContext(MessageContext);
  if (!ctx) throw new Error("useMessages must be used inside MessageProvider");
  return ctx;
};

export const MessageProvider = ({ children, userId }) => {
  const [sentMessages, setSentMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch sent messages on mount
  useEffect(() => {
    if (userId) {
      fetchSentMessages();
    }
  }, [userId]);

  const fetchSentMessages = async () => {
    try {
      const res = await api.get(`/retail/messages/sent/${userId}`);
      setSentMessages(res.data || []);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  const sendMessage = async (receiverId = 1) => {
    if (!messageInput.trim()) {
      setError("Message cannot be empty");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await api.post("/retail/messages", {
        receiver_id: receiverId,
        content: messageInput,
      });

      setSentMessages((prev) => [res.data, ...prev]);
      setMessageInput("");
      setSuccessMsg("Message sent successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Failed to send message:", err);
      const errorMsg =
        err.response?.data?.detail || "Failed to send message. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MessageContext.Provider
      value={{
        sentMessages,
        messageInput,
        setMessageInput,
        sendMessage,
        loading,
        error,
        successMsg,
        fetchSentMessages,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

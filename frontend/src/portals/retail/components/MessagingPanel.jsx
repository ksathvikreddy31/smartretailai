import React, { useState } from "react";
import { HiOutlinePaperAirplane, HiOutlineCheckCircle } from "react-icons/hi2";
import { useMessages } from "../context/MessageContext";
import useAuth from "../../../shared/hooks/useAuth";

export default function MessagingPanel() {
  const { messageInput, setMessageInput, sendMessage, loading, error, successMsg, sentMessages } = useMessages();
  const { user } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(1); // Send to admin (user ID 1)
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
      <h2 className="text-xl font-bold text-slate-900">Contact Warehouse Admin</h2>
      <p className="text-sm text-slate-500">Send messages to warehouse admin for inquiries and support</p>

      {/* Messages History */}
      <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 h-64 overflow-y-auto space-y-3">
        {sentMessages.length === 0 ? (
          <p className="text-center text-slate-400 py-8">No messages yet. Start a conversation!</p>
        ) : (
          sentMessages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white rounded-lg border border-slate-100 p-3 flex items-start gap-3 hover:shadow-sm transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                    You
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(msg.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-slate-700 mt-2">{msg.content}</p>
              </div>
              {msg.is_read && (
                <div className="text-emerald-500 text-lg flex-shrink-0" title="Read by admin">
                  <HiOutlineCheckCircle />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2">
            <HiOutlineCheckCircle /> {successMsg}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !messageInput.trim()}
            className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 transition-colors font-medium flex items-center gap-2 text-sm"
          >
            {loading ? "Sending..." : <>
              <HiOutlinePaperAirplane /> Send
            </>}
          </button>
        </div>
      </form>
    </div>
  );
}

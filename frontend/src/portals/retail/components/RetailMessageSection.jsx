import { useState, useEffect, useCallback } from "react";
import api from "../../../shared/services/api";
import { HiOutlineChatBubbleLeftRight, HiOutlinePaperAirplane, HiOutlineClock, HiOutlineCheckBadge } from "react-icons/hi2";

export default function RetailMessageSection({ userId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [selectedAdminId, setSelectedAdminId] = useState(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await api.get(`/retail/messages/sent/${userId}`);
      setMessages(res.data || []);
    } catch (err) {
      console.error("Failed to fetch sent messages:", err);
    }
  }, [userId]);

  useEffect(() => {
    fetchAdmins();
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, [userId, fetchMessages]);

  const fetchAdmins = async () => {
    try {
      const res = await api.get("/auth/admins");
      setAdmins(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedAdminId(res.data[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch admins:", err);
    }
  };



  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedAdminId) return;

    setLoading(true);
    try {
      await api.post("/retail/messages", {
        receiver_id: selectedAdminId,
        content: newMessage,
      });
      setNewMessage("");
      fetchMessages();
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col h-[500px] animate-in slide-in-from-right duration-500">
      <div className="p-5 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-xl">
            <HiOutlineChatBubbleLeftRight className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Warehouse Support</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-500">ADMIN ONLINE</span>
            </div>
          </div>
        </div>
        
        {admins.length > 0 && (
          <select 
            value={selectedAdminId || ""} 
            onChange={(e) => setSelectedAdminId(parseInt(e.target.value))}
            className="text-[10px] bg-slate-800 border border-slate-700 text-slate-300 rounded px-2 py-1 focus:outline-none"
          >
            {admins.map(admin => (
              <option key={admin.id} value={admin.id}>To: {admin.email.split('@')[0]}</option>
            ))}
          </select>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
            <HiOutlineChatBubbleLeftRight className="w-12 h-12 text-slate-600 mb-3" />
            <p className="text-xs text-slate-500 max-w-[180px]">No conversation history with warehouse admin yet.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex flex-col items-end animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-indigo-600 text-white p-3.5 rounded-2xl rounded-tr-none max-w-[85%] shadow-lg shadow-indigo-600/10">
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
              <div className="flex items-center gap-2 mt-1.5 px-1">
                <span className="text-[9px] font-bold text-slate-600 uppercase">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {msg.is_read ? (
                  <HiOutlineCheckBadge className="w-3 h-3 text-emerald-500" />
                ) : (
                  <HiOutlineClock className="w-3 h-3 text-slate-700" />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <form onSubmit={handleSendMessage} className="relative group">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message to admin..."
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl pl-5 pr-14 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="absolute right-2 top-2 bottom-2 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all flex items-center justify-center shadow-lg shadow-indigo-600/20"
          >
            <HiOutlinePaperAirplane className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

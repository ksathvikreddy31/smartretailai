import React, { useState } from "react";
import { HiOutlineBell, HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi2";
import { useAdminNotifications } from "../context/AdminNotificationContext";

export default function NotificationBell() {
  const {
    unreadCount,
    messages,
    restockRequests,
    markMessageAsRead,
    approveRestockRequest,
    rejectRestockRequest,
  } = useAdminNotifications();

  const [showDropdown, setShowDropdown] = useState(false);
  const [adminNotes, setAdminNotes] = useState({});

  const pendingRequests = restockRequests.filter((r) => r.status === "Pending");
  const unreadMessages = messages.filter((m) => !m.is_read);

  const handleApprove = async (requestId) => {
    const notes = adminNotes[requestId] || "";
    const success = await approveRestockRequest(requestId, notes);
    if (success) {
      setAdminNotes((prev) => {
        const updated = { ...prev };
        delete updated[requestId];
        return updated;
      });
    }
  };

  const handleReject = async (requestId) => {
    const notes = adminNotes[requestId] || "Request rejected by admin";
    const success = await rejectRestockRequest(requestId, notes);
    if (success) {
      setAdminNotes((prev) => {
        const updated = { ...prev };
        delete updated[requestId];
        return updated;
      });
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-2 bg-white rounded-full border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors relative"
        title="Notifications"
      >
        <HiOutlineBell className="w-6 h-6 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showDropdown && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-2xl border border-slate-100 shadow-lg z-50 max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 sticky top-0 bg-white">
            <h3 className="font-bold text-slate-900">Notifications</h3>
            <p className="text-xs text-slate-500 mt-1">
              {unreadMessages.length} unread message(s), {pendingRequests.length} pending request(s)
            </p>
          </div>

          {/* Messages Section */}
          {unreadMessages.length > 0 && (
            <div className="border-b border-slate-100">
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-600 uppercase">New Messages</p>
              </div>
              <div className="divide-y divide-slate-100">
                {unreadMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => markMessageAsRead(msg.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 text-sm">User #{msg.sender_id}</p>
                        <p className="text-sm text-slate-600 mt-1 line-clamp-2">{msg.content}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(msg.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markMessageAsRead(msg.id);
                        }}
                        className="text-slate-400 hover:text-slate-600 flex-shrink-0"
                        title="Mark as read"
                      >
                        <HiOutlineCheckCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Restock Requests Section */}
          {pendingRequests.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-600 uppercase">
                  Pending Restock Requests
                </p>
              </div>
              <div className="divide-y divide-slate-100">
                {pendingRequests.map((req) => (
                  <div key={req.id} className="p-4 bg-amber-50 border-b border-amber-100">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="font-medium text-slate-800 text-sm">
                          Product #{req.warehouse_product_id}
                        </p>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Quantity: <span className="font-semibold">{req.requested_quantity}</span>
                        </p>
                        {req.message && (
                          <p className="text-xs text-slate-600 mt-1 italic">"{req.message}"</p>
                        )}
                      </div>
                      <span className="bg-amber-200 text-amber-900 text-xs font-bold px-2 py-1 rounded whitespace-nowrap">
                        {req.status}
                      </span>
                    </div>

                    {/* Admin Notes */}
                    <input
                      type="text"
                      placeholder="Add notes (optional)..."
                      value={adminNotes[req.id] || ""}
                      onChange={(e) =>
                        setAdminNotes((prev) => ({
                          ...prev,
                          [req.id]: e.target.value,
                        }))
                      }
                      className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded mb-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="flex-1 px-2 py-1.5 bg-emerald-600 text-white text-xs rounded font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1"
                      >
                        <HiOutlineCheckCircle className="w-3 h-3" /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        className="flex-1 px-2 py-1.5 bg-red-600 text-white text-xs rounded font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
                      >
                        <HiOutlineXCircle className="w-3 h-3" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {unreadMessages.length === 0 && pendingRequests.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-slate-500 text-sm">No new notifications</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

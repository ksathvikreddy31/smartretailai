import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../../../shared/services/api";

const AdminNotificationContext = createContext();

export const useAdminNotifications = () => {
  const ctx = useContext(AdminNotificationContext);
  if (!ctx) throw new Error("useAdminNotifications must be used inside AdminNotificationProvider");
  return ctx;
};

export const AdminNotificationProvider = ({ children, userId = 1 }) => {
  const [messages, setMessages] = useState([]);
  const [restockRequests, setRestockRequests] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const loading = false;

  // Fetch data on mount and set up polling
  const fetchData = useCallback(async () => {
    try {
      const [messagesRes, restockRes, unreadRes] = await Promise.all([
        api.get(`/retail/messages/received/${userId}`),
        api.get("/retail/restock"),
        api.get(`/retail/messages/unread-count/${userId}`),
      ]);

      setMessages(messagesRes.data || []);
      setRestockRequests(restockRes.data || []);
      setUnreadCount(unreadRes.data?.unread_count || 0);
    } catch (err) {
      console.error("Failed to fetch admin notifications:", err);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchData();
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
    }
  }, [userId, fetchData]);



  const markMessageAsRead = async (messageId) => {
    try {
      await api.patch(`/retail/messages/${messageId}/read`);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, is_read: true } : msg
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark message as read:", err);
    }
  };

  const approveRestockRequest = async (requestId, adminNotes) => {
    try {
      await api.patch(`/retail/restock/${requestId}`, {
        status: "Approved",
        admin_notes: adminNotes,
      });
      setRestockRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: "Approved" } : req
        )
      );
      return true;
    } catch (err) {
      console.error("Failed to approve request:", err);
      return false;
    }
  };

  const rejectRestockRequest = async (requestId, adminNotes) => {
    try {
      await api.patch(`/retail/restock/${requestId}`, {
        status: "Rejected",
        admin_notes: adminNotes,
      });
      setRestockRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: "Rejected" } : req
        )
      );
      return true;
    } catch (err) {
      console.error("Failed to reject request:", err);
      return false;
    }
  };

  return (
    <AdminNotificationContext.Provider
      value={{
        messages,
        restockRequests,
        unreadCount,
        loading,
        fetchData,
        markMessageAsRead,
        approveRestockRequest,
        rejectRestockRequest,
      }}
    >
      {children}
    </AdminNotificationContext.Provider>
  );
};

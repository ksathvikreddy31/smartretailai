import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../../../shared/services/api";

const RestockContext = createContext();

export const useRestock = () => {
  const ctx = useContext(RestockContext);
  if (!ctx) throw new Error("useRestock must be used inside RestockProvider");
  return ctx;
};

export const RestockProvider = ({ children, userId }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [inventory, setInventory] = useState([]);

  // Fetch restock requests and inventory on mount
  useEffect(() => {
    if (userId) {
      fetchRequests();
      fetchInventory();
    }
  }, [userId]);

  const fetchRequests = async () => {
    try {
      const res = await api.get(`/retail/restock/${userId}`);
      setRequests(res.data || []);
    } catch (err) {
      console.error("Failed to fetch restock requests:", err);
    }
  };

  const fetchInventory = async () => {
    try {
      const res = await api.get("/products/warehouse");
      setInventory(res.data || []);
    } catch (err) {
      console.error("Failed to fetch inventory:", err);
    }
  };

  const createRequest = async (warehouseProductId, quantity, message) => {
    if (!warehouseProductId || quantity <= 0) {
      setError("Please select a valid product and quantity");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await api.post("/retail/restock", {
        warehouse_product_id: warehouseProductId,
        requested_quantity: quantity,
        message: message || null,
      });

      setRequests((prev) => [res.data, ...prev]);
      setSuccessMsg("Restock request submitted successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
      return res.data;
    } catch (err) {
      console.error("Failed to create restock request:", err);
      const errorMsg =
        err.response?.data?.detail || "Failed to submit request. Please try again.";
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "#f59e0b",
      Approved: "#22c55e",
      Rejected: "#ef4444",
      Dispatched: "#6366f1",
    };
    return colors[status] || "#64748b";
  };

  const getProductName = (productId) => {
    const product = inventory.find((p) => p.id === productId);
    return product?.name || "Unknown Product";
  };

  return (
    <RestockContext.Provider
      value={{
        requests,
        loading,
        error,
        successMsg,
        inventory,
        createRequest,
        fetchRequests,
        getStatusColor,
        getProductName,
      }}
    >
      {children}
    </RestockContext.Provider>
  );
};

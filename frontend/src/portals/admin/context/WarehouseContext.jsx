import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../../../shared/services/api";

const WarehouseContext = createContext();

export const useWarehouse = () => useContext(WarehouseContext);

export const WarehouseProvider = ({ children }) => {
  const [inventory, setInventory] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [invRes, restockRes] = await Promise.all([
        api.get("/products/warehouse"),
        api.get("/retail/restock")
      ]);
      setInventory(invRes.data || []);
      setApprovals(restockRes.data || []);
    } catch (err) {
      console.error("Failed to fetch warehouse data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const addProduct = async (productData) => {
    try {
      const payload = {
        name: productData.name,
        quantity: parseInt(productData.quantity || productData.stock || 0),
        price: parseFloat(productData.price || 0),
        image_url: productData.image_url || productData.image,
        category: productData.category
      };
      const res = await api.post("/products/warehouse", payload);
      setInventory(prev => [res.data, ...prev]);
      return true;
    } catch (err) {
      console.error("Failed to add product:", err);
      alert(`Error: ${err.response?.data?.detail || err.message}`);
      return false;
    }
  };

  const updateProduct = async (id, updatedData) => {
    try {
      const res = await api.patch(`/products/warehouse/${id}`, updatedData);
      setInventory(prev => prev.map(item => item.id === id ? res.data : item));
    } catch (err) {
      console.error("Failed to update product:", err);
    }
  };

  const updateStock = async (id, newQuantity) => {
    try {
      const res = await api.patch(`/products/warehouse/${id}/stock?quantity=${newQuantity}`);
      setInventory(prev => prev.map(item => item.id === id ? res.data : item));
    } catch (err) {
      console.error("Failed to update stock:", err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/warehouse/${id}`);
      setInventory(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  const approveRequest = async (requestId, adminNotes = "") => {
    try {
      await api.patch(`/retail/restock/${requestId}`, {
        status: "Approved",
        admin_notes: adminNotes
      });
      // Refresh both inventory and approvals
      fetchAllData();
      alert("Restock request approved!");
      return true;
    } catch (err) {
      console.error("Approval failed:", err);
      alert(err.response?.data?.detail || "Failed to approve request.");
      return false;
    }
  };

  const rejectRequest = async (requestId, adminNotes = "Rejected by admin") => {
    try {
      await api.patch(`/retail/restock/${requestId}`, {
        status: "Rejected",
        admin_notes: adminNotes
      });
      fetchAllData();
      alert("Restock request rejected.");
      return true;
    } catch (err) {
      console.error("Rejection failed:", err);
      alert(err.response?.data?.detail || "Failed to reject request.");
      return false;
    }
  };

  // Helper to map DB data to UI format
  const uiInventory = inventory.map(item => ({
    ...item,
    stock: item.quantity,
    status: item.quantity === 0 ? "Out of Stock" : item.quantity < 10 ? "Low Stock" : "In Stock"
  }));

  const uiApprovals = approvals.map(req => ({
    ...req,
    type: "Restock Request",
    from: req.retailer_name || `Retailer #${req.retailer_id}`,
    item: req.product_name || `Product #${req.warehouse_product_id}`,
    qty: req.requested_quantity,
    date: new Date(req.created_at).toLocaleDateString(),
  }));

  const uiDispatches = approvals
    .filter(req => req.status === "Approved")
    .map(req => ({
      id: req.id,
      order: `Restock #${req.id}`,
      destination: req.retailer_name || `Retailer #${req.retailer_id}`,
      productName: req.product_name,
      items: req.requested_quantity,
      status: "In Transit",
      eta: "2-3 Days"
    }));

  const uiLogs = approvals
    .filter(req => req.status !== "Pending")
    .map(req => ({
      id: req.id,
      retailerName: req.retailer_name || "N/A",
      retailerEmail: req.retailer_email || "N/A",
      productName: req.product_name || "Product",
      quantity: req.requested_quantity,
      timestamp: new Date(req.updated_at).toLocaleString()
    }));

  const confirmReceipt = async (dispatch) => {
    try {
      await api.patch(`/retail/restock/${dispatch.id}`, { status: "Dispatched" });
      fetchAllData();
      alert("Receipt confirmed!");
    } catch (err) {
      console.error("Failed to confirm receipt:", err);
    }
  };

  return (
    <WarehouseContext.Provider value={{ 
      inventory: uiInventory, 
      approvals: uiApprovals.filter(a => a.status === "Pending"),
      dispatches: uiDispatches, 
      logs: uiLogs,
      loading,
      addProduct, 
      updateProduct, 
      updateStock,
      deleteProduct, 
      approveRequest, 
      rejectRequest, 
      confirmReceipt,
      refresh: fetchAllData 
    }}>
      {children}
    </WarehouseContext.Provider>
  );
};

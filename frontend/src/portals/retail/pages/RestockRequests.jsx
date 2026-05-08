import { useState, useContext, useEffect, useCallback } from "react";
import { AuthContext } from "../../../shared/context/AuthContext";
import api from "../../../shared/services/api";
import {
  HiOutlinePlus,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineTrash,
  HiOutlineCheck,
} from "react-icons/hi2";

const STATUS_CONFIG = {
  Pending: {
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    icon: HiOutlineClock,
  },
  Approved: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    icon: HiOutlineCheckCircle,
  },
  Rejected: {
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    icon: HiOutlineXCircle,
  },
  Dispatched: {
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    icon: HiOutlineCheckCircle,
  },
};

export default function RestockRequests() {
  const [requests, setRequests] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [form, setForm] = useState({ product: "", qty: "", message: "" });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusAlert, setStatusAlert] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const { user } = useContext(AuthContext);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchRequests = useCallback(async () => {
    try {
      const res = await api.get(`/retail/restock/${user.id}`);
      setRequests(res.data || []);
    } catch (err) {
      console.error("Failed to fetch restock requests:", err);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchRequests();
      fetchInventory();
    }
  }, [user, fetchRequests]);

  const fetchInventory = async () => {
    try {
      const res = await api.get("/products/warehouse");
      setInventory(res.data || []);
    } catch (err) {
      console.error("Failed to fetch inventory:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.product || !form.qty) return;

    setLoading(true);
    try {
      const res = await api.post("/retail/restock", {
        warehouse_product_id: parseInt(form.product),
        requested_quantity: parseInt(form.qty),
        message: form.message || null,
      });

      setRequests([res.data, ...requests]);
      setForm({ product: "", qty: "", message: "" });
      setShowForm(false);
      setStatusAlert({
        type: "success",
        text: "Restock request submitted successfully!",
      });
      setTimeout(() => setStatusAlert(null), 3000);
    } catch (err) {
      setStatusAlert({
        type: "error",
        text: err.response?.data?.detail || "Submission failed",
      });
      setTimeout(() => setStatusAlert(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Clear this log entry?")) return;
    try {
      await api.delete(`/retail/restock/${id}`);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    } catch (err) {
      alert("Failed to delete log entry");
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Clear ${selectedIds.length} selected log entries?`))
      return;
    try {
      await Promise.all(
        selectedIds.map((id) => api.delete(`/retail/restock/${id}`)),
      );
      setRequests((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
      setSelectedIds([]);
      setStatusAlert({
        type: "success",
        text: "Selected logs cleared successfully",
      });
      setTimeout(() => setStatusAlert(null), 3000);
    } catch (err) {
      alert("Failed to clear some log entries");
      fetchRequests();
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === requests.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(requests.map((r) => r.id));
    }
  };

  const getProductName = (productId) => {
    const product = inventory.find((p) => p.id === productId);
    return product?.name || `Product #${productId}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Restock Logs
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            History of restocking requests and fulfillment
          </p>
        </div>
        <div className="flex gap-3">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 rounded-xl font-bold transition-all"
            >
              <HiOutlineTrash className="w-5 h-5" />
              Clear Selected ({selectedIds.length})
            </button>
          )}
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20"
          >
            <HiOutlinePlus className="w-5 h-5" />
            New Request
          </button>
        </div>
      </div>

      {statusAlert && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm animate-in slide-in-from-top duration-300 ${statusAlert.type === "success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}`}
        >
          <HiOutlineCheckCircle className="w-5 h-5" />
          {statusAlert.text}
        </div>
      )}

      {/* Request Form */}
      {showForm && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl animate-in zoom-in-95 duration-200">
          <h3 className="text-lg font-bold text-white mb-4">
            Create New Request
          </h3>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Select Product
              </label>
              <select
                value={form.product}
                onChange={(e) => setForm({ ...form, product: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">-- Choose Product --</option>
                {inventory.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.quantity} in stock)
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={form.qty}
                onChange={(e) => setForm({ ...form, qty: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0"
                required
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Note (Optional)
              </label>
              <input
                type="text"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Reason for restock..."
              />
            </div>
            <div className="md:col-span-3 flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 text-sm font-bold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20"
              >
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Requests History */}
      <div className="space-y-4">
        {requests.length > 0 && (
          <div className="flex items-center justify-between px-5 py-2">
            <button
              onClick={toggleSelectAll}
              className="text-xs font-bold text-slate-500 hover:text-indigo-400 flex items-center gap-2 transition-colors"
            >
              <div
                className={`w-4 h-4 rounded border ${selectedIds.length === requests.length ? "bg-indigo-600 border-indigo-600" : "border-slate-700"} flex items-center justify-center`}
              >
                {selectedIds.length === requests.length && (
                  <HiOutlineCheck className="w-3 h-3 text-white" />
                )}
              </div>
              {selectedIds.length === requests.length
                ? "Deselect All"
                : "Select All Requests"}
            </button>
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">
              Showing {requests.length} Entries
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {requests.length === 0 ? (
            <div className="py-20 text-center bg-slate-900/50 border border-slate-800 border-dashed rounded-3xl">
              <p className="text-slate-500">No restock history found.</p>
            </div>
          ) : (
            requests.map((req) => {
              const config = STATUS_CONFIG[req.status] || STATUS_CONFIG.Pending;
              const Icon = config.icon;
              const isSelected = selectedIds.includes(req.id);

              return (
                <div
                  key={req.id}
                  className={`bg-slate-900 border ${isSelected ? "border-indigo-500 shadow-lg shadow-indigo-500/5" : "border-slate-800"} rounded-2xl p-5 hover:border-slate-700 transition-all group relative`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleSelect(req.id)}
                        className={`w-6 h-6 rounded-lg border ${isSelected ? "bg-indigo-600 border-indigo-600" : "border-slate-700 group-hover:border-slate-500"} flex items-center justify-center transition-all`}
                      >
                        {isSelected && (
                          <HiOutlineCheck className="w-4 h-4 text-white" />
                        )}
                      </button>

                      <div
                        className={`w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center`}
                      >
                        <Icon className={`w-6 h-6 ${config.color}`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg">
                          {getProductName(req.warehouse_product_id)}
                        </h4>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs font-medium text-slate-500">
                            {new Date(req.created_at).toLocaleDateString()}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-700" />
                          <span className="text-xs font-bold text-indigo-400">
                            Qty: {req.requested_quantity}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex flex-col md:items-end gap-2">
                        <div
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${config.bg} ${config.color} ${config.border}`}
                        >
                          {req.status}
                        </div>
                        {req.admin_notes && (
                          <div className="text-xs text-slate-400 italic bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50 max-w-xs">
                            " {req.admin_notes} "
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleDelete(req.id)}
                        className="p-2.5 bg-slate-800 hover:bg-rose-500/20 text-slate-500 hover:text-rose-500 rounded-xl transition-all"
                        title="Delete log"
                      >
                        <HiOutlineTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {req.message && (
                    <div className="mt-4 pt-4 border-t border-slate-800 flex items-start gap-2">
                      <span className="text-[10px] font-bold text-slate-600 uppercase mt-0.5">
                        Your Note:
                      </span>
                      <p className="text-xs text-slate-400">{req.message}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// import { useState, useEffect } from "react";
// import api from "../../../shared/services/api";
// import {
//   HiOutlineCube,
//   HiOutlinePaperAirplane,
//   HiXMark,
//   HiOutlineCpuChip,
//   HiOutlineExclamationCircle,
// } from "react-icons/hi2";

// export default function ManualStockManager() {
//   const [inventory, setInventory] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [manualQty, setManualQty] = useState(150);
//   const [autoAgentActive, setAutoAgentActive] = useState({});

//   useEffect(() => {
//     fetchInventory();
//   }, []);

//   const fetchInventory = async () => {
//     try {
//       const res = await api.get("/products/warehouse");
//       setInventory(res.data || []);
//     } catch (err) {
//       console.error("Failed to fetch products:", err);
//     }
//   };

//   const handleManualRequest = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post("/retail/restock", {
//         warehouse_product_id: selectedProduct.id,
//         requested_quantity: parseInt(manualQty),
//         message: "Manual stock ingestion request",
//       });

//       setIsModalOpen(false);
//       setManualQty(150); // Reset to default
//       alert(
//         `Success! Requested ${manualQty} units for ${selectedProduct.name}`,
//       );
//     } catch (err) {
//       alert("Failed to submit request. Please try again.");
//     }
//   };

//   return (
//     <div className="p-6 space-y-8 animate-in fade-in duration-500">
//       <header>
//         <h1 className="text-3xl font-bold text-white tracking-tight">
//           Stock Management
//         </h1>
//         <p className="text-slate-400 mt-1">
//           Manual ingestion and automation control
//         </p>
//       </header>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {inventory.map((product) => (
//           <div
//             key={product.id}
//             className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all group"
//           >
//             <div className="flex justify-between items-start mb-4">
//               <div className="bg-indigo-500/10 p-3 rounded-xl">
//                 <HiOutlineCube className="w-6 h-6 text-indigo-400" />
//               </div>

//               {/* Agent Toggle - Ready for your future Agent logic */}
//               <div className="flex flex-col items-end gap-2">
//                 <span
//                   className={`text-[10px] font-bold uppercase tracking-widest ${autoAgentActive[product.id] ? "text-emerald-400" : "text-slate-500"}`}
//                 >
//                   Agent {autoAgentActive[product.id] ? "Online" : "Off"}
//                 </span>
//                 <button
//                   onClick={() =>
//                     setAutoAgentActive((prev) => ({
//                       ...prev,
//                       [product.id]: !prev[product.id],
//                     }))
//                   }
//                   className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${autoAgentActive[product.id] ? "bg-emerald-600" : "bg-slate-700"}`}
//                 >
//                   <span
//                     className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${autoAgentActive[product.id] ? "translate-x-6" : "translate-x-1"}`}
//                   />
//                 </button>
//               </div>
//             </div>

//             <div>
//               <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
//                 {product.name}
//               </h3>
//               <div className="flex items-baseline gap-2 mt-1">
//                 <span className="text-3xl font-black text-white">
//                   {product.quantity}
//                 </span>
//                 <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">
//                   In Stock
//                 </span>
//               </div>
//             </div>

//             <div className="mt-6">
//               {autoAgentActive[product.id] ? (
//                 <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
//                   <HiOutlineCpuChip className="w-4 h-4" />
//                   Agent Monitoring Active
//                 </div>
//               ) : (
//                 <button
//                   onClick={() => {
//                     setSelectedProduct(product);
//                     setIsModalOpen(true);
//                   }}
//                   className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20"
//                 >
//                   <HiOutlinePaperAirplane className="w-4 h-4 rotate-45" />
//                   Request Manual Ingest
//                 </button>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* --- MANUAL INGESTION MODAL --- */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           {/* Backdrop */}
//           <div
//             className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
//             onClick={() => setIsModalOpen(false)}
//           />

//           {/* Modal Content */}
//           <div className="relative bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-bold text-white">
//                 Manual Stock Ingest
//               </h2>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-slate-500 hover:text-white transition-colors"
//               >
//                 <HiXMark size={24} />
//               </button>
//             </div>

//             <div className="mb-6 p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex items-start gap-3">
//               <HiOutlineExclamationCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
//               <p className="text-xs text-slate-400 leading-relaxed">
//                 You are requesting a manual stock ingestion for{" "}
//                 <strong className="text-indigo-300">
//                   {selectedProduct?.name}
//                 </strong>
//                 . This request will be sent to the admin for approval.
//               </p>
//             </div>

//             <form onSubmit={handleManualRequest} className="space-y-6">
//               <div>
//                 <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
//                   Ingestion Quantity
//                 </label>
//                 <input
//                   type="number"
//                   value={manualQty}
//                   onChange={(e) => setManualQty(e.target.value)}
//                   className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-lg"
//                   required
//                   min="1"
//                 />
//               </div>

//               <div className="flex gap-3 pt-2">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-white transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="flex-[2] py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all"
//                 >
//                   Confirm Request
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

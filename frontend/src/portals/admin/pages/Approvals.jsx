import { useState } from "react";
import StatusChip from "../components/StatusChip";
import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineInformationCircle, HiOutlineClock, HiOutlineArchiveBox, HiXMark } from "react-icons/hi2";
import { useWarehouse } from "../context/WarehouseContext";

const chipType = (s) => {
  if (s === "Approved") return "success";
  if (s === "Rejected") return "danger";
  return "warning";
};

export default function Approvals() {
  const { approvals, approveRequest, rejectRequest, loading } = useWarehouse();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [activeTab, setActiveTab] = useState("pending");

  const pendingRequests = approvals.filter(a => a.status === "Pending");
  const processedRequests = approvals.filter(a => a.status !== "Pending");

  const handleApprove = async (id) => {
    const success = await approveRequest(id, adminNotes);
    if (success) {
      setSelectedRequest(null);
      setAdminNotes("");
    }
  };

  const handleReject = async (id) => {
    const success = await rejectRequest(id, adminNotes || "Request rejected by warehouse admin.");
    if (success) {
      setSelectedRequest(null);
      setAdminNotes("");
    }
  };

  if (loading && approvals.length === 0) return <div className="p-8 text-center text-slate-500">Loading requests...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Approvals & Requests</h1>
          <p className="text-sm text-slate-500 mt-1">Manage restocking requests from retailers</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'pending' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <HiOutlineClock className="w-4 h-4" />
            Pending ({pendingRequests.length})
          </button>
          <button 
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'history' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <HiOutlineArchiveBox className="w-4 h-4" />
            History
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {["ID", "From", "Details", "Date", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {(activeTab === "pending" ? pendingRequests : processedRequests).length === 0 ? (
              <tr>
                <td colSpan="6" className="px-5 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <HiOutlineArchiveBox className="w-8 h-8 opacity-20" />
                    <p>No {activeTab} requests found</p>
                  </div>
                </td>
              </tr>
            ) : (
              (activeTab === "pending" ? pendingRequests : processedRequests).map((a) => (
                <tr key={a.id} className={`hover:bg-slate-50/50 transition-colors ${selectedRequest === a.id ? 'bg-indigo-50/30' : ''}`}>
                  <td className="px-5 py-4 font-medium text-indigo-600">REQ-{a.id}</td>
                  <td className="px-5 py-4 text-slate-700">{a.from}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800">{a.item}</span>
                      <span className="text-xs text-slate-500">Quantity: {a.qty}</span>
                      {a.message && (
                        <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-400 italic">
                          <HiOutlineInformationCircle className="w-3 h-3" /> "{a.message}"
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-500">{a.date}</td>
                  <td className="px-5 py-4">
                    <StatusChip type={chipType(a.status)}>{a.status}</StatusChip>
                  </td>
                  <td className="px-5 py-4">
                    {a.status === "Pending" ? (
                      <button 
                        onClick={() => { setSelectedRequest(a.id); setAdminNotes(""); }}
                        className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm"
                      >
                        Review
                      </button>
                    ) : (
                      <div className="text-[11px] text-slate-400">
                        {a.admin_notes && <p className="italic mb-1">"{a.admin_notes}"</p>}
                        <span>Processed</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 relative">
            <button 
              onClick={() => setSelectedRequest(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10"
            >
              <HiXMark className="w-6 h-6" />
            </button>
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Review Request REQ-{selectedRequest}</h3>
              <p className="text-sm text-slate-500">Decide whether to approve or reject this restock.</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Admin Comments</label>
                <textarea 
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Reason for approval/rejection..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
                />
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex gap-3">
              <button 
                onClick={() => handleReject(selectedRequest)}
                className="flex-1 py-2.5 bg-white border border-slate-200 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-50 hover:border-rose-200 transition-all flex items-center justify-center gap-2"
              >
                <HiOutlineXCircle className="w-5 h-5" /> Reject
              </button>
              <button 
                onClick={() => handleApprove(selectedRequest)}
                className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
              >
                <HiOutlineCheckCircle className="w-5 h-5" /> Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

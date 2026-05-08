import { useState, useEffect } from "react";
import api from "../../../shared/services/api";

export default function SalesHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const r = await api.get("/orders/retailer-orders");
      // Filter for non-pending orders or show all
      setHistory(r.data);
    } catch (err) {
      console.error(err);
      setHistory(DEMO_HISTORY);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h1 className="text-3xl font-black text-white mb-1">Sales History</h1>
        <p className="text-slate-500 text-sm">Comprehensive log of your business transactions</p>
      </div>

      {loading ? (
        <div className="py-24 text-center text-slate-400">Loading history...</div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Order ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Items</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {history.map((h) => (
                <tr key={h.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-5 text-sm font-mono text-indigo-400">#RE-{h.id}</td>
                  <td className="px-6 py-5 text-sm text-slate-400">{new Date(h.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-medium text-white">User_{h.user_id}</p>
                    <p className="text-[10px] text-slate-600">ID: {h.user_id}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-1 flex-wrap">
                      {h.items?.map((i, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-800 rounded text-[10px] text-slate-300">
                          {i.product_name} (x{i.quantity})
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-white">₹{h.total_price.toLocaleString()}</td>
                  <td className="px-6 py-5 text-right">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                      h.status === "Approved" || h.status === "Completed" 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>
                      {h.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {history.length === 0 && (
            <div className="py-20 text-center text-slate-600 italic">No historical records found</div>
          )}
        </div>
      )}
    </div>
  );
}

const DEMO_HISTORY = [
  { id: 8802, user_id: 45, total_price: 120.00, status: "Approved", created_at: "2026-05-05T14:20:00Z", items: [{ product_name: "Gaming Mouse", quantity: 2 }] },
  { id: 8790, user_id: 12, total_price: 54000.00, status: "Completed", created_at: "2026-04-30T09:15:00Z", items: [{ product_name: "MacBook Pro M1", quantity: 1 }] },
];

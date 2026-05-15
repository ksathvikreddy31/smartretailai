import { useState, useEffect } from "react";
import api from "../../../shared/services/api";

export default function SalesHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchHistory();

    const intervalId = setInterval(fetchHistory, 5000);

    return () => clearInterval(intervalId);
  }, []);

  // =========================================
  // FETCH SALES HISTORY
  // =========================================
  const fetchHistory = async () => {
    try {
      const r = await api.get("/orders/retailer-orders");

      setHistory(r.data);
    } catch (err) {
      console.error(err);

      setHistory(DEMO_HISTORY);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // DOWNLOAD SALES CSV
  // =========================================
  const downloadCSV = async () => {
    try {
      setDownloading(true);

      const response = await api.get("/backup/sales-csv", {
        responseType: "blob",
      });

      // -------------------------------------
      // CREATE DOWNLOAD URL
      // -------------------------------------
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // -------------------------------------
      // CREATE TEMP LINK
      // -------------------------------------
      const link = document.createElement("a");

      link.href = url;

      link.setAttribute("download", "sales_backup.csv");

      document.body.appendChild(link);

      // -------------------------------------
      // TRIGGER DOWNLOAD
      // -------------------------------------
      link.click();

      // -------------------------------------
      // CLEANUP
      // -------------------------------------
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("CSV Download Failed:", error);

      alert("Failed to download CSV");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">Sales History</h1>

          <p className="text-slate-500 text-sm">
            Comprehensive log of your business transactions
          </p>
        </div>

        {/* DOWNLOAD CSV BUTTON */}
        <button
          onClick={downloadCSV}
          disabled={downloading}
          className="
            px-5 py-3
            rounded-xl
            bg-indigo-600
            hover:bg-indigo-500
            disabled:bg-slate-700
            text-white
            text-sm
            font-semibold
            transition-all
            duration-300
            shadow-lg
            shadow-indigo-500/20
          "
        >
          {downloading ? "Downloading..." : "Download CSV"}
        </button>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="py-24 text-center text-slate-400">
          Loading history...
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-left border-collapse">
            {/* TABLE HEAD */}
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Order ID
                </th>

                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Date
                </th>

                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Customer
                </th>

                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Items
                </th>

                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Amount
                </th>

                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">
                  Status
                </th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody className="divide-y divide-slate-800/50">
              {history.map((h) => (
                <tr
                  key={h.id}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  {/* ORDER ID */}
                  <td className="px-6 py-5 text-sm font-mono text-indigo-400">
                    #RE-{h.id}
                  </td>

                  {/* DATE */}
                  <td className="px-6 py-5 text-sm text-slate-400">
                    {new Date(h.created_at).toLocaleDateString()}
                  </td>

                  {/* CUSTOMER */}
                  <td className="px-6 py-5">
                    <p className="text-sm font-medium text-white">
                      User_{h.user_id}
                    </p>

                    <p className="text-[10px] text-slate-600">
                      ID: {h.user_id}
                    </p>
                  </td>

                  {/* ITEMS */}
                  <td className="px-6 py-5">
                    <div className="flex gap-1 flex-wrap">
                      {h.items?.map((i, idx) => (
                        <span
                          key={idx}
                          className="
                            px-2 py-0.5
                            bg-slate-800
                            rounded
                            text-[10px]
                            text-slate-300
                          "
                        >
                          {i.product_name} (x{i.quantity})
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* AMOUNT */}
                  <td className="px-6 py-5 text-sm font-bold text-white">
                    ₹{h.total_price.toLocaleString()}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-5 text-right">
                    <span
                      className={`
                        px-3 py-1
                        rounded-full
                        text-[10px]
                        font-bold
                        border
                        ${
                          h.status === "Approved" ||
                          h.status === "Completed" ||
                          h.status === "Delivered"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }
                      `}
                    >
                      {h.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* EMPTY STATE */}
          {history.length === 0 && (
            <div className="py-20 text-center text-slate-600 italic">
              No historical records found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const DEMO_HISTORY = [
  {
    id: 8802,
    user_id: 45,
    total_price: 120.0,
    status: "Approved",
    created_at: "2026-05-05T14:20:00Z",
    items: [
      {
        product_name: "Gaming Mouse",
        quantity: 2,
      },
    ],
  },

  {
    id: 8790,
    user_id: 12,
    total_price: 54000.0,
    status: "Delivered",
    created_at: "2026-04-30T09:15:00Z",
    items: [
      {
        product_name: "MacBook Pro M1",
        quantity: 1,
      },
    ],
  },
];

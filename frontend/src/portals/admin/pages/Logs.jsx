import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { useState } from "react";
import { useWarehouse } from "../context/WarehouseContext";

export default function Logs() {
  const { logs } = useWarehouse();
  const [search, setSearch] = useState("");
  const filtered = logs.filter((d) => 
    d.productName.toLowerCase().includes(search.toLowerCase()) || 
    d.retailerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Order Logs</h1>
          <p className="text-sm text-slate-500 mt-1">Audit trail for all completed transactions</p>
        </div>
        <div className="relative">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search logs..."
            className="pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 transition-all w-64" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {["Log ID", "Retailer Name", "Retailer Email", "Product Name", "Quantity", "Timestamp"].map((h) => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-4 font-medium text-indigo-600">{r.id}</td>
                <td className="px-5 py-4 font-medium text-slate-800">{r.retailerName}</td>
                <td className="px-5 py-4 text-slate-500">{r.retailerEmail}</td>
                <td className="px-5 py-4 text-slate-800">{r.productName}</td>
                <td className="px-5 py-4 text-slate-600">{r.quantity.toLocaleString()}</td>
                <td className="px-5 py-4 text-slate-500">{r.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import StatusChip from "../components/StatusChip";
import { HiOutlineCheck } from "react-icons/hi2";
import { useWarehouse } from "../context/WarehouseContext";

const chipType = (s) => s === "Delivered" ? "success" : s === "In Transit" ? "info" : "warning";

export default function Dispatch() {
  const { dispatches, confirmReceipt } = useWarehouse();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dispatch</h1>
        <p className="text-sm text-slate-500 mt-1">Track shipments and logistics</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {["Dispatch ID", "Order", "Destination", "Items", "Status", "ETA", ""].map((h) => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {dispatches.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-4 font-medium text-indigo-600">{d.id}</td>
                <td className="px-5 py-4 text-slate-700">{d.order}</td>
                <td className="px-5 py-4 text-slate-600">{d.destination}</td>
                <td className="px-5 py-4 text-slate-600">{d.items} ({d.productName})</td>
                <td className="px-5 py-4"><StatusChip type={chipType(d.status)}>{d.status}</StatusChip></td>
                <td className="px-5 py-4 text-slate-500">{d.eta}</td>
                <td className="px-5 py-4">
                  <button onClick={() => confirmReceipt(d)} title="Confirm Receipt" className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"><HiOutlineCheck className="text-base" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

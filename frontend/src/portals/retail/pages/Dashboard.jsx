// import { useContext } from "react";
// import RetailMessageSection from "../components/RetailMessageSection";
// import { AuthContext } from "../../../shared/context/AuthContext";

// const KPI_DATA = [
//   { label: "Total Products", value: "1,284", change: "+12", up: true, icon: "📦" },
//   { label: "Low Stock Items", value: "23", change: "-5", up: false, icon: "⚠️" },
//   { label: "Today's Sales", value: "₹84,320", change: "+18%", up: true, icon: "💰" },
//   { label: "Pending Restocks", value: "7", change: "+3", up: false, icon: "🔄" },
// ];

// const RECENT_ALERTS = [
//   { product: "USB-C Hub 7-in-1", stock: 4, threshold: 10, severity: "critical" },
//   { product: "Mechanical Keyboard", stock: 8, threshold: 15, severity: "warning" },
//   { product: "4K Webcam", stock: 22, threshold: 20, severity: "info" },
// ];

// export default function RetailDashboard() {
//   const { user } = useContext(AuthContext);

//   return (
//     <div className="space-y-8 animate-in fade-in duration-500">
//       <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Retail Dashboard</h1>
//           <p className="text-slate-400 text-sm">Real-time overview of your store performance</p>
//         </div>
//         <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg shadow-sm">
//           <span className="text-sm font-medium text-slate-300">
//             {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
//           </span>
//         </div>
//       </div>

//       {/* KPI Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {KPI_DATA.map((kpi, idx) => (
//           <div
//             key={kpi.label}
//             className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-700 transition-all duration-200"
//             style={{ animationDelay: `${idx * 100}ms` }}
//           >
//             <div className="flex justify-between items-start mb-4">
//               <span className="text-sm font-medium text-slate-400">{kpi.label}</span>
//               <span className="text-xl p-2 bg-slate-800 rounded-xl">{kpi.icon}</span>
//             </div>
//             <div className="text-3xl font-bold text-white mb-2 tracking-tight">{kpi.value}</div>
//             <div className={`flex items-center text-xs font-semibold ${kpi.up ? "text-emerald-400" : "text-rose-400"}`}>
//               <span className="mr-1">{kpi.up ? "↑" : "↓"}</span>
//               {kpi.change} <span className="text-slate-500 font-normal ml-2">vs yesterday</span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Alerts and Messaging */}
//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//         <div className="xl:col-span-2">
//           <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//             <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             Smart Stock Alerts
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {RECENT_ALERTS.map((a) => {
//               const isCritical = a.severity === "critical";
//               const isWarning = a.severity === "warning";
//               const colorClass = isCritical ? "text-rose-400" : isWarning ? "text-amber-400" : "text-indigo-400";
//               const bgClass = isCritical ? "bg-rose-500/10 border-rose-500/20" : isWarning ? "bg-amber-500/10 border-amber-500/20" : "bg-indigo-500/10 border-indigo-500/20";
//               const dotClass = isCritical ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" : isWarning ? "bg-amber-500" : "bg-indigo-500";

//               return (
//                 <div key={a.product} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-start gap-4 transition-transform hover:-translate-y-1 duration-200">
//                   <div className={`w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0 ${dotClass}`} />
//                   <div className="flex-1 min-w-0">
//                     <span className="text-base font-semibold text-slate-100 truncate block mb-1">{a.product}</span>
//                     <div className="flex items-center text-sm text-slate-400 gap-3">
//                       <span className="flex items-center gap-1">
//                         <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
//                         {a.stock}
//                       </span>
//                       <span className="text-slate-600">|</span>
//                       <span className="flex items-center gap-1">
//                         <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
//                         {a.threshold}
//                       </span>
//                     </div>
//                   </div>
//                   <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${colorClass} ${bgClass}`}>
//                     {a.severity}
//                   </span>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         <div className="xl:col-span-1">
//           <RetailMessageSection userId={user?.id || 2} />
//         </div>
//       </div>
//     </div>
//   );
// }

import { useCallback, useContext, useEffect, useState } from "react";

import RetailMessageSection from "../components/RetailMessageSection";

import { AuthContext } from "../../../shared/context/AuthContext";

import api from "../../../shared/services/api";

export default function RetailDashboard() {
  const { user } = useContext(AuthContext);

  const [dashboard, setDashboard] = useState(null);

  // ==================================
  // FETCH DASHBOARD
  // ==================================
  const fetchDashboard = useCallback(async () => {
    try {
      const res = await api.get(
        `/dashboard/retail-dashboard?retailer_id=${user?.id || 2}`,
      );

      console.log("DASHBOARD DATA:", res.data);

      setDashboard(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // ==================================
  // LOADING
  // ==================================
  if (!dashboard) {
    return <div className="text-white p-10">Loading dashboard...</div>;
  }

  // ==================================
  // KPI DATA
  // ==================================
  const KPI_DATA = [
    {
      label: "Total Products",

      value: dashboard.total_products,

      icon: "📦",
    },

    {
      label: "Low Stock Items",

      value: dashboard.low_stock_items,

      icon: "⚠️",
    },

    {
      label: "Today's Sales",

      value: `₹${dashboard.today_sales}`,

      icon: "💰",
    },

    {
      label: "Pending Restocks",

      value: dashboard.pending_restocks,

      icon: "🔄",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
            Retail Dashboard
          </h1>

          <p className="text-slate-400 text-sm">
            Real-time overview of your store performance
          </p>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {KPI_DATA.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm text-slate-400">{kpi.label}</span>

              <span className="text-xl p-2 bg-slate-800 rounded-xl">
                {kpi.icon}
              </span>
            </div>

            <div className="text-3xl font-bold text-white">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* STOCK ALERTS */}
        <div className="xl:col-span-2">
          <h2 className="text-lg font-semibold text-white mb-4">
            Smart Stock Alerts
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboard.alerts.map((a) => {
              const isCritical = a.severity === "critical";

              const isWarning = a.severity === "warning";

              const colorClass = isCritical
                ? "text-rose-400"
                : isWarning
                  ? "text-amber-400"
                  : "text-indigo-400";

              return (
                <div
                  key={a.product}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-5"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-semibold">
                        {a.product}
                      </div>

                      <div className="text-sm text-slate-400">
                        Current Stock: {a.stock}
                      </div>
                    </div>

                    <span
                      className={`${colorClass} text-xs font-bold uppercase`}
                    >
                      {a.severity}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* KEEP EXISTING CHAT */}
        <div className="xl:col-span-1">
          <RetailMessageSection userId={user?.id || 2} />
        </div>
      </div>
    </div>
  );
}

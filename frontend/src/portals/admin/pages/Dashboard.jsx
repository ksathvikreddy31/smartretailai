// import { HiOutlineCube, HiOutlineUsers, HiOutlineTruck, HiOutlineClipboardDocumentCheck } from "react-icons/hi2";
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
// import { useWarehouse } from "../context/WarehouseContext";
// import { useState, useMemo } from "react";
// import NotificationBell from "../components/NotificationBell";

// const COLORS = ["#6366f1", "#8b5cf6", "#0ea5e9", "#10b981", "#f59e0b"];

// const RECENT_DUMMY = [
//   { action: "New restock request approved", user: "Store #4", time: "5 min ago", type: "success" },
//   { action: "Anomaly detected in Electronics", user: "AI System", time: "12 min ago", type: "warning" },
//   { action: "Dispatch completed for Order #2841", user: "Warehouse", time: "1 hr ago", type: "info" },
//   { action: "New user registration", user: "john@example.com", time: "2 hrs ago", type: "neutral" },
// ];

// export default function Dashboard() {
//   const { addProduct, approvals, inventory } = useWarehouse();

//   const [formData, setFormData] = useState({ name: "", stock: "", price: "", image: "" });
//   const [loading, setLoading] = useState(false);

//   // Dynamic Stats
//   const stats = useMemo(() => {
//     const totalItems = inventory.reduce((acc, item) => acc + (item.stock || 0), 0);
//     const pendingApprovals = approvals.filter(a => a.status === "Pending").length;

//     return [
//       { label: "Total Inventory Stock", value: totalItems.toLocaleString(), change: "+5.3%", icon: HiOutlineCube, color: "bg-indigo-100 text-indigo-600" },
//       { label: "Total Product Types", value: inventory.length.toLocaleString(), change: "+12.1%", icon: HiOutlineUsers, color: "bg-violet-100 text-violet-600" },
//       { label: "Recent Dispatches", value: "38", change: "-3", icon: HiOutlineTruck, color: "bg-amber-100 text-amber-600" },
//       { label: "Pending Approvals", value: pendingApprovals.toString(), change: "+2", icon: HiOutlineClipboardDocumentCheck, color: "bg-emerald-100 text-emerald-600" },
//     ];
//   }, [inventory, approvals]);

//   // Dynamic Pie Data (Mock categories if not present, otherwise count)
//   const pieData = useMemo(() => {
//     if (inventory.length === 0) return [{ name: "No Data", value: 1 }];

//     // Group by name first char or something if no category field
//     const groups = inventory.reduce((acc, item) => {
//       const cat = item.name.split(' ')[0]; // Simple heuristic
//       acc[cat] = (acc[cat] || 0) + (item.stock || 0);
//       return acc;
//     }, {});

//     return Object.entries(groups)
//       .map(([name, value]) => ({ name, value }))
//       .sort((a, b) => b.value - a.value)
//       .slice(0, 5);
//   }, [inventory]);

//   const handleAddProduct = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const success = await addProduct({
//         name: formData.name,
//         quantity: parseInt(formData.stock),
//         price: parseFloat(formData.price),
//         image_url: formData.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop"
//       });

//       if (success) {
//         setFormData({ name: "", stock: "", price: "", image: "" });
//         alert("Product added successfully!");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-8 animate-in fade-in duration-700">
//       <div className="flex justify-between items-start">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Warehouse Overview</h1>
//           <p className="text-slate-500 mt-1">Real-time inventory and fulfillment metrics</p>
//         </div>
//         <NotificationBell />
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
//         {stats.map((s) => (
//           <div key={s.label} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
//             <div className="flex items-center justify-between mb-4">
//               <div className={`w-12 h-12 rounded-2xl ${s.color} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
//                 <s.icon className="text-2xl" />
//               </div>
//               <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider">{s.change}</span>
//             </div>
//             <p className="text-3xl font-black text-slate-900">{s.value}</p>
//             <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{s.label}</p>
//           </div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Category distribution */}
//         <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex flex-col">
//           <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
//             <span className="w-1.5 h-6 bg-indigo-600 rounded-full" /> Stock Distribution
//           </h3>
//           <div className="h-[300px] relative">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value" stroke="none">
//                   {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
//                 </Pie>
//                 <Tooltip
//                   contentStyle={{ borderRadius: 20, border: "none", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)", padding: "12px 16px" }}
//                   itemStyle={{ fontWeight: 'bold', fontSize: '12px' }}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
//               <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Total</span>
//               <span className="text-2xl font-black text-slate-800">{inventory.length}</span>
//             </div>
//           </div>
//           <div className="flex flex-wrap gap-4 justify-center mt-6">
//             {pieData.map((d, i) => (
//               <span key={d.name} className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
//                 <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} /> {d.name}
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* Activity */}
//         <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
//           <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
//             <span className="w-1.5 h-6 bg-violet-600 rounded-full" /> System Activity
//           </h3>
//           <div className="space-y-6">
//             {RECENT_DUMMY.map((r, i) => (
//               <div key={i} className="flex items-center gap-4 group cursor-default">
//                 <div className={`w-2.5 h-2.5 rounded-full ring-4 ${r.type === "success" ? "bg-emerald-500 ring-emerald-50" : r.type === "warning" ? "bg-amber-500 ring-amber-50" : r.type === "info" ? "bg-blue-500 ring-blue-50" : "bg-slate-300 ring-slate-50"}`} />
//                 <div className="flex-1">
//                   <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{r.action}</p>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{r.user} · {r.time}</p>
//                 </div>
//                 <button className="text-slate-300 hover:text-slate-500 transition-colors">
//                   <HiOutlineClipboardDocumentCheck className="w-4 h-4" />
//                 </button>
//               </div>
//             ))}
//           </div>
//           <button className="w-full mt-8 py-3 rounded-xl border border-slate-100 text-xs font-bold text-slate-400 hover:bg-slate-50 hover:text-indigo-600 transition-all uppercase tracking-widest">
//             View All Logs
//           </button>
//         </div>
//       </div>

//       {/* Add Product Form */}
//       <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl p-10 relative overflow-hidden group">
//         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full -mr-32 -mt-32" />
//         <div className="relative z-10">
//           <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-3">
//             Quick Stock Entry
//             <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-md tracking-tighter uppercase">Admin Tool</span>
//           </h3>
//           <p className="text-slate-400 text-sm mb-8 max-w-md">Easily inject new products into the global warehouse inventory. Changes reflect instantly across all systems.</p>

//           <form className="grid grid-cols-1 md:grid-cols-4 gap-6" onSubmit={handleAddProduct}>
//             <div className="md:col-span-2">
//               <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Product Designation</label>
//               <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600" placeholder="e.g. RTX 4090 Graphics Card" />
//             </div>
//             <div>
//               <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Initial Units</label>
//               <input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600" placeholder="0" />
//             </div>
//             <div>
//               <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Unit Valuation</label>
//               <div className="relative">
//                 <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
//                 <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl pl-10 pr-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600" placeholder="0.00" />
//               </div>
//             </div>
//             <div className="md:col-span-3">
//               <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Image Resource Locator</label>
//               <input type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600" placeholder="https://images.unsplash.com/..." />
//             </div>
//             <div className="flex items-end">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl font-black transition-all shadow-xl shadow-indigo-600/20 active:scale-95 uppercase tracking-widest text-xs"
//               >
//                 {loading ? "Syncing..." : "Inject into Stock"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

import {
  HiOutlineCube,
  HiOutlineUsers,
  HiOutlineTruck,
  HiOutlineClipboardDocumentCheck,
} from "react-icons/hi2";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useWarehouse } from "../context/WarehouseContext";
import { useState, useMemo } from "react";
import { CATEGORIES } from "../../shared/components/CategorySelector";
import NotificationBell from "../components/NotificationBell";

const COLORS = ["#6366f1", "#8b5cf6", "#0ea5e9", "#10b981", "#f59e0b"];

const RECENT_DUMMY = [
  {
    action: "New restock request approved",
    user: "Store #4",
    time: "5 min ago",
    type: "success",
  },
  {
    action: "Anomaly detected in Electronics",
    user: "AI System",
    time: "12 min ago",
    type: "warning",
  },
  {
    action: "Dispatch completed for Order #2841",
    user: "Warehouse",
    time: "1 hr ago",
    type: "info",
  },
  {
    action: "New user registration",
    user: "john@example.com",
    time: "2 hrs ago",
    type: "neutral",
  },
];

export default function Dashboard() {
  const { addProduct, approvals, inventory } = useWarehouse();

  const [formData, setFormData] = useState({
    name: "",
    stock: "",
    price: "",
    image: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);

  // Dynamic Stats
  const stats = useMemo(() => {
    const totalItems = inventory.reduce(
      (acc, item) => acc + (item.stock || 0),
      0,
    );
    const pendingApprovals = approvals.filter(
      (a) => a.status === "Pending",
    ).length;

    return [
      {
        label: "Total Inventory Stock",
        value: totalItems.toLocaleString(),
        change: "+5.3%",
        icon: HiOutlineCube,
        color: "bg-indigo-100 text-indigo-600",
      },
      {
        label: "Total Product Types",
        value: inventory.length.toLocaleString(),
        change: "+12.1%",
        icon: HiOutlineUsers,
        color: "bg-violet-100 text-violet-600",
      },
      {
        label: "Recent Dispatches",
        value: "38",
        change: "-3",
        icon: HiOutlineTruck,
        color: "bg-amber-100 text-amber-600",
      },
      {
        label: "Pending Approvals",
        value: pendingApprovals.toString(),
        change: "+2",
        icon: HiOutlineClipboardDocumentCheck,
        color: "bg-emerald-100 text-emerald-600",
      },
    ];
  }, [inventory, approvals]);

  // Dynamic Pie Data
  const pieData = useMemo(() => {
    if (inventory.length === 0) return [{ name: "No Data", value: 1 }];

    const groups = inventory.reduce((acc, item) => {
      const cat = item.category || "Uncategorized";
      acc[cat] = (acc[cat] || 0) + (item.stock || 0);
      return acc;
    }, {});

    return Object.entries(groups)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [inventory]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await addProduct({
        name: formData.name,
        quantity: parseInt(formData.stock),
        price: parseFloat(formData.price),
        category: formData.category,
        image_url:
          formData.image ||
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
      });

      if (success) {
        setFormData({
          name: "",
          stock: "",
          price: "",
          image: "",
          category: "",
        });
        alert("Product added successfully!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Warehouse Overview
          </h1>
          <p className="text-slate-500 mt-1">
            Real-time inventory and fulfillment metrics
          </p>
        </div>
        <NotificationBell />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-2xl ${s.color} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}
              >
                <s.icon className="text-2xl" />
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider">
                {s.change}
              </span>
            </div>
            <p className="text-3xl font-black text-slate-900">{s.value}</p>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category distribution */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex flex-col">
          <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-indigo-600 rounded-full" /> Stock
            Distribution
          </h3>
          <div className="h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 20,
                    border: "none",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                    padding: "12px 16px",
                  }}
                  itemStyle={{ fontWeight: "bold", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                Total
              </span>
              <span className="text-2xl font-black text-slate-800">
                {inventory.length}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 justify-center mt-6">
            {pieData.map((d, i) => (
              <span
                key={d.name}
                className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: COLORS[i % COLORS.length] }}
                />{" "}
                {d.name}
              </span>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-violet-600 rounded-full" /> System
            Activity
          </h3>
          <div className="space-y-6">
            {RECENT_DUMMY.map((r, i) => (
              <div
                key={i}
                className="flex items-center gap-4 group cursor-default"
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full ring-4 ${r.type === "success" ? "bg-emerald-500 ring-emerald-50" : r.type === "warning" ? "bg-amber-500 ring-amber-50" : r.type === "info" ? "bg-blue-500 ring-blue-50" : "bg-slate-300 ring-slate-50"}`}
                />
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                    {r.action}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                    {r.user} · {r.time}
                  </p>
                </div>
                <button className="text-slate-300 hover:text-slate-500 transition-colors">
                  <HiOutlineClipboardDocumentCheck className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 rounded-xl border border-slate-100 text-xs font-bold text-slate-400 hover:bg-slate-50 hover:text-indigo-600 transition-all uppercase tracking-widest">
            View All Logs
          </button>
        </div>
      </div>

      {/* Add Product Form */}
      <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl p-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full -mr-32 -mt-32" />
        <div className="relative z-10">
          <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-3">
            Quick Stock Entry
            <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-md tracking-tighter uppercase">
              Admin Tool
            </span>
          </h3>
          <p className="text-slate-400 text-sm mb-8 max-w-md">
            Easily inject new products into the global warehouse inventory.
            Changes reflect instantly across all systems.
          </p>

          <form
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
            onSubmit={handleAddProduct}
          >
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">
                Product Designation
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                placeholder="e.g. RTX 4090 Graphics Card"
              />
            </div>

            {/* Added Category Dropdown */}
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">
                Category Selection
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
              >
                <option value="" className="bg-slate-900 text-slate-500">
                  Select Category
                </option>
                {CATEGORIES.map((cat) => (
                  <option
                    key={cat.value}
                    value={cat.value}
                    className="bg-slate-900 text-white"
                  >
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">
                Initial Units
              </label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">
                Unit Valuation
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl pl-10 pr-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">
                Image Resource Locator
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl font-black transition-all shadow-xl shadow-indigo-600/20 active:scale-95 uppercase tracking-widest text-xs"
              >
                {loading ? "Syncing..." : "Inject into Stock"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

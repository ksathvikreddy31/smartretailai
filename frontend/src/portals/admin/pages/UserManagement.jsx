// import { useEffect, useState } from "react";

// import StatusChip from "../components/StatusChip";

// import { HiOutlinePencilSquare, HiOutlineTrash } from "react-icons/hi2";

// import api from "../../../shared/services/api";

// const roleStyle = (r) =>
//   r === "admin" ? "info" : r === "retail" ? "warning" : "neutral";

// const statusStyle = (s) => (s === "Active" ? "success" : "danger");

// export default function UserManagement() {
//   const [users, setUsers] = useState([]);

//   const [loading, setLoading] = useState(true);

//   // =====================================
//   // FETCH RETAILERS
//   // =====================================

//   useEffect(() => {
//     fetchRetailers();
//   }, []);

//   const fetchRetailers = async () => {
//     try {
//       const response = await api.get("/admin/retailers");

//       if (response.data.success) {
//         setUsers(response.data.retailers);
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =====================================
//   // DELETE RETAILER
//   // =====================================

//   const deleteRetailer = async (id) => {
//     const confirmDelete = window.confirm("Delete this retailer?");

//     if (!confirmDelete) return;

//     try {
//       console.log("Deleting retailer with ID:", id);
//       const res = await api.delete(`/admin/retailers/${id}`);
//       console.log("Delete response:", res.data);

//       if (res.data.success) {
//         // Optimistically update the UI by removing the user from state
//         setUsers((prev) => prev.filter((user) => user.id !== id));
//       } else {
//         alert(res.data.message || "Failed to delete retailer");
//       }
//     } catch (err) {
//       console.error("Delete error:", err);
//       alert("Failed to delete retailer");
//     }
//   };

//   // =====================================
//   // UPDATE RETAILER
//   // =====================================

//   const updateRetailer = async (id) => {
//     try {
//       console.log("Updating retailer status for ID:", id);
//       const res = await api.put(`/admin/retailers/${id}`);
//       console.log("Update response:", res.data);

//       if (res.data.success) {
//         fetchRetailers();
//       } else {
//         alert(res.data.message || "Failed to update retailer");
//       }
//     } catch (err) {
//       console.error("Update error:", err);
//       alert("Failed to update retailer");
//     }
//   };

//   // =====================================
//   // LOADING
//   // =====================================

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-[70vh]">
//         Loading retailers...
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* HEADER */}

//       <div>
//         <h1 className="text-2xl font-bold text-slate-900">
//           Retailer Management
//         </h1>

//         <p className="text-sm text-slate-500 mt-1">
//           Manage retailers buying warehouse stock
//         </p>
//       </div>

//       {/* TABLE */}

//       <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="bg-slate-50 border-b border-slate-100">
//               {["Retailer", "Email", "Role", "Status", "Joined", "Actions"].map(
//                 (h) => (
//                   <th
//                     key={h}
//                     className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider"
//                   >
//                     {h}
//                   </th>
//                 ),
//               )}
//             </tr>
//           </thead>

//           <tbody className="divide-y divide-slate-50">
//             {users.map((u) => (
//               <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
//                 {/* USER */}

//                 <td className="px-5 py-4">
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
//                       {u.name[0]}
//                     </div>

//                     <span className="font-medium text-slate-800">{u.name}</span>
//                   </div>
//                 </td>

//                 {/* EMAIL */}

//                 <td className="px-5 py-4 text-slate-500">{u.email}</td>

//                 {/* ROLE */}

//                 <td className="px-5 py-4">
//                   <StatusChip type={roleStyle(u.role)}>{u.role}</StatusChip>
//                 </td>

//                 {/* STATUS */}

//                 <td className="px-5 py-4">
//                   <StatusChip type={statusStyle(u.status)}>
//                     {u.status}
//                   </StatusChip>
//                 </td>

//                 {/* JOINED */}

//                 <td className="px-5 py-4 text-slate-500">{u.joined}</td>

//                 {/* ACTIONS */}

//                 <td className="px-5 py-4">
//                   <div className="flex gap-1.5">
//                     {/* EDIT */}

//                     <button
//                       onClick={() => updateRetailer(u.id)}
//                       className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
//                     >
//                       <HiOutlinePencilSquare className="text-base" />
//                     </button>

//                     {/* DELETE */}

//                     <button
//                       onClick={() => deleteRetailer(u.id)}
//                       className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
//                     >
//                       <HiOutlineTrash className="text-base" />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";

import StatusChip from "../components/StatusChip";

import { HiOutlinePencilSquare, HiOutlineTrash } from "react-icons/hi2";

import api from "../../../shared/services/api";

const roleStyle = (r) =>
  r === "admin" ? "info" : r === "retail" ? "warning" : "neutral";

const statusStyle = (s) => (s === "Active" ? "success" : "danger");

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  // =====================================
  // FETCH RETAILERS
  // =====================================

  useEffect(() => {
    fetchRetailers();
  }, []);

  const fetchRetailers = async () => {
    try {
      const response = await api.get("/admin/retailers");

      console.log("Retailers:", response.data);

      if (response.data.success) {
        setUsers(response.data.retailers);
      }
    } catch (err) {
      console.error("Fetch retailers error:", err);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // REMOVE FROM UI ONLY
  // =====================================

  const deleteRetailer = (id) => {
    const confirmDelete = window.confirm(
      "Remove retailer from this table only?",
    );

    if (!confirmDelete) return;

    // ===================================
    // REMOVE ONLY FROM FRONTEND STATE
    // ===================================

    setUsers((prev) => prev.filter((user) => user.id !== id));

    console.log("Retailer removed from UI only");
  };

  // =====================================
  // UPDATE RETAILER
  // =====================================

  const updateRetailer = async (id) => {
    try {
      console.log("Updating retailer:", id);

      const res = await api.put(`/admin/retailers/${id}`);

      console.log("Update response:", res.data);

      if (res.data.success) {
        fetchRetailers();
      } else {
        alert(res.data.message || "Failed to update retailer");
      }
    } catch (err) {
      console.error("Update error:", err);

      alert("Failed to update retailer");
    }
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-slate-500">
        Loading retailers...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Retailer Management
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Manage retailers buying warehouse stock
        </p>
      </div>

      {/* TABLE */}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {["Retailer", "Email", "Role", "Status", "Joined", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {users.length > 0 ? (
              users.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  {/* USER */}

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                        {u.name?.[0] || "R"}
                      </div>

                      <span className="font-medium text-slate-800">
                        {u.name}
                      </span>
                    </div>
                  </td>

                  {/* EMAIL */}

                  <td className="px-5 py-4 text-slate-500">{u.email}</td>

                  {/* ROLE */}

                  <td className="px-5 py-4">
                    <StatusChip type={roleStyle(u.role)}>{u.role}</StatusChip>
                  </td>

                  {/* STATUS */}

                  <td className="px-5 py-4">
                    <StatusChip type={statusStyle(u.status)}>
                      {u.status}
                    </StatusChip>
                  </td>

                  {/* JOINED */}

                  <td className="px-5 py-4 text-slate-500">{u.joined}</td>

                  {/* ACTIONS */}

                  <td className="px-5 py-4">
                    <div className="flex gap-1.5">
                      {/* EDIT */}

                      <button
                        onClick={() => updateRetailer(u.id)}
                        title="Update Retailer"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                      >
                        <HiOutlinePencilSquare className="text-base" />
                      </button>

                      {/* REMOVE FROM TABLE */}

                      <button
                        onClick={() => deleteRetailer(u.id)}
                        title="Remove from table only"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <HiOutlineTrash className="text-base" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-10 text-slate-400">
                  No retailers available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

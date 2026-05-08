// // import StatusChip from "../components/StatusChip";
// // import { CATEGORIES } from "../../shared/components/CategorySelector";
// // import {
// //   HiOutlineMagnifyingGlass,
// //   HiPlus,
// //   HiMinus,
// //   HiOutlinePencilSquare,
// //   HiXMark,
// //   HiOutlineTrash,
// // } from "react-icons/hi2";
// // import { useState } from "react";
// // import { useWarehouse } from "../context/WarehouseContext";

// // const chipType = (s) =>
// //   s === "In Stock" ? "success" : s === "Low Stock" ? "warning" : "danger";

// // export default function Inventory() {
// //   const {
// //     inventory,
// //     updateStock,
// //     updateProduct,
// //     deleteProduct,
// //     addProduct,
// //     loading,
// //   } = useWarehouse();
// //   const [search, setSearch] = useState("");
// //   const [selectedCategory, setSelectedCategory] = useState("");
// //   const [editingStockId, setEditingStockId] = useState(null);
// //   const [tempStockValue, setTempStockValue] = useState("");
// //   const [editingProduct, setEditingProduct] = useState(null);
// //   const [showAddModal, setShowAddModal] = useState(false);
// //   const [newProduct, setNewProduct] = useState({
// //     name: "",
// //     price: "",
// //     quantity: "",
// //     image_url: "",
// //     category: "",
// //   });

// //   const handleAddProduct = async (e) => {
// //     e.preventDefault();
// //     const success = await addProduct(newProduct);
// //     if (success) {
// //       setShowAddModal(false);
// //       setNewProduct({
// //         name: "",
// //         price: "",
// //         quantity: "",
// //         image_url: "",
// //         category: "",
// //       });
// //     }
// //   };

// //   const filtered = inventory.filter((d) => {
// //     const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
// //     const matchesCategory =
// //       !selectedCategory || d.category === selectedCategory;
// //     return matchesSearch && matchesCategory;
// //   });

// //   const handleIncrement = (item) => updateStock(item.id, item.stock + 1);
// //   const handleDecrement = (item) => {
// //     if (item.stock > 0) updateStock(item.id, item.stock - 1);
// //   };

// //   const startStockEdit = (item) => {
// //     setEditingStockId(item.id);
// //     setTempStockValue(item.stock.toString());
// //   };

// //   const handleStockKeyDown = (e, id) => {
// //     if (e.key === "Enter") saveStock(id);
// //     else if (e.key === "Escape") setEditingStockId(null);
// //   };

// //   const saveStock = (id) => {
// //     const newStock = parseInt(tempStockValue, 10);
// //     if (!isNaN(newStock) && newStock >= 0) updateStock(id, newStock);
// //     setEditingStockId(null);
// //   };

// //   const handleSaveProduct = (e) => {
// //     e.preventDefault();
// //     updateProduct(editingProduct.id, {
// //       name: editingProduct.name,
// //       price: parseFloat(editingProduct.price) || 0,
// //       image_url: editingProduct.image_url,
// //       category: editingProduct.category,
// //     });
// //     setEditingProduct(null);
// //   };

// //   if (loading && inventory.length === 0) {
// //     return (
// //       <div className="flex flex-col items-center justify-center min-h-[400px]">
// //         <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
// //         <p className="text-slate-500 font-medium">Loading inventory...</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="space-y-6 relative">
// //       <div className="flex items-center justify-between gap-4">
// //         <div>
// //           <h1 className="text-2xl font-bold text-slate-900">Inventory</h1>
// //           <p className="text-sm text-slate-500 mt-1">
// //             Warehouse stock management
// //           </p>
// //         </div>
// //         <div className="flex items-center gap-3">
// //           <button
// //             onClick={() => setShowAddModal(true)}
// //             className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-200 active:scale-[0.98] transition-all"
// //           >
// //             <HiPlus className="text-base" /> Add Product
// //           </button>

// //           <select
// //             value={selectedCategory}
// //             onChange={(e) => setSelectedCategory(e.target.value)}
// //             className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
// //           >
// //             <option value="" className="text-slate-900">
// //               All Categories
// //             </option>
// //             {CATEGORIES.map((cat) => (
// //               <option
// //                 key={cat.value}
// //                 value={cat.value}
// //                 className="text-slate-900"
// //               >
// //                 {cat.label}
// //               </option>
// //             ))}
// //           </select>

// //           <div className="relative">
// //             <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
// //             <input
// //               value={search}
// //               onChange={(e) => setSearch(e.target.value)}
// //               placeholder="Search inventory..."
// //               className="pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 transition-all w-64"
// //             />
// //           </div>
// //         </div>
// //       </div>

// //       {filtered.length === 0 ? (
// //         <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 border-dashed">
// //           <p className="text-slate-400">
// //             No products found in warehouse inventory.
// //           </p>
// //         </div>
// //       ) : (
// //         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
// //           {filtered.map((item) => (
// //             <div
// //               key={item.id}
// //               className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow relative group"
// //             >
// //               <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10">
// //                 <button
// //                   onClick={() => setEditingProduct(item)}
// //                   className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-600 shadow-sm flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all"
// //                 >
// //                   <HiOutlinePencilSquare className="w-4 h-4" />
// //                 </button>
// //                 <button
// //                   onClick={() => {
// //                     if (window.confirm(`Delete "${item.name}"?`))
// //                       deleteProduct(item.id);
// //                   }}
// //                   className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-600 shadow-sm flex items-center justify-center hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
// //                 >
// //                   <HiOutlineTrash className="w-4 h-4" />
// //                 </button>
// //               </div>
// //               <img
// //                 src={
// //                   item.image_url ||
// //                   "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop"
// //                 }
// //                 alt={item.name}
// //                 className="w-full h-40 object-cover"
// //               />
// //               <div className="p-4 flex flex-col flex-grow">
// //                 <div className="flex justify-between items-start mb-2 gap-2">
// //                   <h3 className="font-bold text-slate-800 leading-tight">
// //                     {item.name}
// //                   </h3>
// //                   <span className="text-sm text-slate-500 font-medium whitespace-nowrap">
// //                     ${item.price}
// //                   </span>
// //                 </div>
// //                 <div className="mb-2">
// //                   <span className="text-[10px] bg-white text-black border border-slate-200 px-2 py-1 rounded-full font-bold uppercase tracking-tight shadow-sm">
// //                     {item.category}
// //                   </span>
// //                 </div>
// //                 <div className="mb-4">
// //                   <StatusChip type={chipType(item.status)}>
// //                     {item.status}
// //                   </StatusChip>
// //                 </div>
// //                 <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
// //                   <div className="flex flex-col">
// //                     <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">
// //                       Stock
// //                     </span>
// //                     {editingStockId === item.id ? (
// //                       <input
// //                         type="number"
// //                         autoFocus
// //                         className="w-20 text-2xl font-bold text-slate-900 border-b-2 border-indigo-500 focus:outline-none bg-transparent"
// //                         value={tempStockValue}
// //                         onChange={(e) => setTempStockValue(e.target.value)}
// //                         onKeyDown={(e) => handleStockKeyDown(e, item.id)}
// //                         onBlur={() => saveStock(item.id)}
// //                       />
// //                     ) : (
// //                       <span
// //                         className="text-2xl font-bold text-slate-900 cursor-pointer hover:text-indigo-600"
// //                         onClick={() => startStockEdit(item)}
// //                       >
// //                         {item.stock}
// //                       </span>
// //                     )}
// //                   </div>
// //                   <div className="flex items-center gap-2">
// //                     <button
// //                       onClick={() => handleDecrement(item)}
// //                       className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
// //                     >
// //                       <HiMinus className="w-4 h-4" />
// //                     </button>
// //                     <button
// //                       onClick={() => handleIncrement(item)}
// //                       className="w-8 h-8 rounded-full bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center text-indigo-600"
// //                     >
// //                       <HiPlus className="w-4 h-4" />
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       )}

// //       {/* Add Product Modal */}
// //       {showAddModal && (
// //         <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
// //           <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
// //             <div className="flex items-center justify-between p-6 border-b border-slate-100">
// //               <h2 className="text-xl font-bold text-slate-800">
// //                 Add New Warehouse Product
// //               </h2>
// //               <button
// //                 onClick={() => setShowAddModal(false)}
// //                 className="text-slate-400 hover:text-slate-600"
// //               >
// //                 <HiXMark className="w-6 h-6" />
// //               </button>
// //             </div>
// //             <form onSubmit={handleAddProduct} className="p-6 space-y-4">
// //               <div>
// //                 <label className="block text-sm font-medium text-slate-700 mb-1">
// //                   Product Name
// //                 </label>
// //                 <input
// //                   type="text"
// //                   required
// //                   value={newProduct.name}
// //                   onChange={(e) =>
// //                     setNewProduct({ ...newProduct, name: e.target.value })
// //                   }
// //                   className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none text-slate-900"
// //                 />
// //               </div>
// //               <div className="grid grid-cols-2 gap-4">
// //                 <div>
// //                   <label className="block text-sm font-medium text-slate-700 mb-1">
// //                     Price
// //                   </label>
// //                   <input
// //                     type="number"
// //                     step="0.01"
// //                     required
// //                     value={newProduct.price}
// //                     onChange={(e) =>
// //                       setNewProduct({ ...newProduct, price: e.target.value })
// //                     }
// //                     className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none text-slate-900"
// //                   />
// //                 </div>
// //                 <div>
// //                   <label className="block text-sm font-medium text-slate-700 mb-1">
// //                     Initial Quantity
// //                   </label>
// //                   <input
// //                     type="number"
// //                     required
// //                     value={newProduct.quantity}
// //                     onChange={(e) =>
// //                       setNewProduct({ ...newProduct, quantity: e.target.value })
// //                     }
// //                     className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none text-slate-900"
// //                   />
// //                 </div>
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-medium text-slate-700 mb-1">
// //                   Category
// //                 </label>
// //                 <select
// //                   required
// //                   value={newProduct.category}
// //                   onChange={(e) =>
// //                     setNewProduct({ ...newProduct, category: e.target.value })
// //                   }
// //                   className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
// //                 >
// //                   <option value="" className="text-slate-900">
// //                     -- Select Category --
// //                   </option>
// //                   {CATEGORIES.map((cat) => (
// //                     <option
// //                       key={cat.value}
// //                       value={cat.value}
// //                       className="text-slate-900"
// //                     >
// //                       {cat.label}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-medium text-slate-700 mb-1">
// //                   Image URL
// //                 </label>
// //                 <input
// //                   type="url"
// //                   value={newProduct.image_url}
// //                   onChange={(e) =>
// //                     setNewProduct({ ...newProduct, image_url: e.target.value })
// //                   }
// //                   className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none text-slate-900"
// //                 />
// //               </div>
// //               <div className="pt-4 flex gap-3">
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowAddModal(false)}
// //                   className="flex-1 px-4 py-2 bg-slate-100 rounded-xl font-medium text-sm"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   type="submit"
// //                   className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium text-sm"
// //                 >
// //                   Add to Warehouse
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}

// //       {editingProduct && (
// //         <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
// //           <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
// //             <div className="flex items-center justify-between p-6 border-b border-slate-100">
// //               <h2 className="text-xl font-bold text-slate-800">Edit Product</h2>
// //               <button
// //                 onClick={() => setEditingProduct(null)}
// //                 className="text-slate-400 hover:text-slate-600"
// //               >
// //                 <HiXMark className="w-6 h-6" />
// //               </button>
// //             </div>
// //             <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
// //               <div>
// //                 <label className="block text-sm font-medium text-slate-700 mb-1">
// //                   Product Name
// //                 </label>
// //                 <input
// //                   type="text"
// //                   required
// //                   value={editingProduct.name}
// //                   onChange={(e) =>
// //                     setEditingProduct({
// //                       ...editingProduct,
// //                       name: e.target.value,
// //                     })
// //                   }
// //                   className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none text-slate-900"
// //                 />
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-medium text-slate-700 mb-1">
// //                   Price
// //                 </label>
// //                 <input
// //                   type="number"
// //                   step="0.01"
// //                   required
// //                   value={editingProduct.price}
// //                   onChange={(e) =>
// //                     setEditingProduct({
// //                       ...editingProduct,
// //                       price: e.target.value,
// //                     })
// //                   }
// //                   className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none text-slate-900"
// //                 />
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-medium text-slate-700 mb-1">
// //                   Category
// //                 </label>
// //                 <select
// //                   value={editingProduct.category || ""}
// //                   onChange={(e) =>
// //                     setEditingProduct({
// //                       ...editingProduct,
// //                       category: e.target.value,
// //                     })
// //                   }
// //                   className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
// //                 >
// //                   <option value="" className="text-slate-900">
// //                     -- Select Category --
// //                   </option>
// //                   {CATEGORIES.map((cat) => (
// //                     <option
// //                       key={cat.value}
// //                       value={cat.value}
// //                       className="text-slate-900"
// //                     >
// //                       {cat.label}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-medium text-slate-700 mb-1">
// //                   Image URL
// //                 </label>
// //                 <input
// //                   type="url"
// //                   value={editingProduct.image_url || ""}
// //                   onChange={(e) =>
// //                     setEditingProduct({
// //                       ...editingProduct,
// //                       image_url: e.target.value,
// //                     })
// //                   }
// //                   className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none text-slate-900"
// //                 />
// //               </div>
// //               <div className="pt-4 flex gap-3">
// //                 <button
// //                   type="button"
// //                   onClick={() => setEditingProduct(null)}
// //                   className="flex-1 px-4 py-2 bg-slate-100 rounded-xl font-medium text-sm"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   type="submit"
// //                   className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium text-sm"
// //                 >
// //                   Save Changes
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// import StatusChip from "../components/StatusChip";
// import { CATEGORIES } from "../../shared/components/CategorySelector";
// import {
//   HiOutlineMagnifyingGlass,
//   HiPlus,
//   HiMinus,
//   HiOutlinePencilSquare,
//   HiXMark,
//   HiOutlineTrash,
// } from "react-icons/hi2";
// import { useState } from "react";
// import { useWarehouse } from "../context/WarehouseContext";

// const chipType = (s) =>
//   s === "In Stock" ? "success" : s === "Low Stock" ? "warning" : "danger";

// export default function Inventory() {
//   const {
//     inventory,
//     updateStock,
//     updateProduct,
//     deleteProduct,
//     addProduct,
//     loading,
//   } = useWarehouse();
//   const [search, setSearch] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [editingStockId, setEditingStockId] = useState(null);
//   const [tempStockValue, setTempStockValue] = useState("");
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [newProduct, setNewProduct] = useState({
//     name: "",
//     price: "",
//     quantity: "",
//     image_url: "",
//     category: "",
//   });

//   const handleAddProduct = async (e) => {
//     e.preventDefault();
//     const success = await addProduct(newProduct);
//     if (success) {
//       setShowAddModal(false);
//       setNewProduct({
//         name: "",
//         price: "",
//         quantity: "",
//         image_url: "",
//         category: "",
//       });
//     }
//   };

//   const filtered = inventory.filter((d) => {
//     const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
//     const matchesCategory =
//       !selectedCategory || d.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   const handleIncrement = (item) => updateStock(item.id, item.stock + 1);
//   const handleDecrement = (item) => {
//     if (item.stock > 0) updateStock(item.id, item.stock - 1);
//   };

//   const startStockEdit = (item) => {
//     setEditingStockId(item.id);
//     setTempStockValue(item.stock.toString());
//   };

//   const handleStockKeyDown = (e, id) => {
//     if (e.key === "Enter") saveStock(id);
//     else if (e.key === "Escape") setEditingStockId(null);
//   };

//   const saveStock = (id) => {
//     const newStock = parseInt(tempStockValue, 10);
//     if (!isNaN(newStock) && newStock >= 0) updateStock(id, newStock);
//     setEditingStockId(null);
//   };

//   const handleSaveProduct = (e) => {
//     e.preventDefault();
//     updateProduct(editingProduct.id, {
//       name: editingProduct.name,
//       price: parseFloat(editingProduct.price) || 0,
//       image_url: editingProduct.image_url,
//       category: editingProduct.category,
//     });
//     setEditingProduct(null);
//   };

//   if (loading && inventory.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[400px]">
//         <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
//         <p className="text-slate-500 font-medium">Loading inventory...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 relative">
//       <div className="flex items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900">Inventory</h1>
//           <p className="text-sm text-slate-500 mt-1">
//             Warehouse stock management
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => setShowAddModal(true)}
//             className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-200 active:scale-[0.98] transition-all"
//           >
//             <HiPlus className="text-base" /> Add Product
//           </button>

//           <select
//             value={selectedCategory}
//             onChange={(e) => setSelectedCategory(e.target.value)}
//             className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
//           >
//             <option value="" className="text-slate-900">
//               All Categories
//             </option>
//             {CATEGORIES.map((cat) => (
//               <option
//                 key={cat.value}
//                 value={cat.value}
//                 className="text-slate-900"
//               >
//                 {cat.label}
//               </option>
//             ))}
//           </select>

//           <div className="relative">
//             <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//             <input
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search inventory..."
//               className="pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 transition-all w-64"
//             />
//           </div>
//         </div>
//       </div>

//       {filtered.length === 0 ? (
//         <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 border-dashed">
//           <p className="text-slate-400">
//             No products found in warehouse inventory.
//           </p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {filtered.map((item) => (
//             <div
//               key={item.id}
//               className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow relative group"
//             >
//               <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10">
//                 <button
//                   onClick={() => setEditingProduct(item)}
//                   className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-600 shadow-sm flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all"
//                 >
//                   <HiOutlinePencilSquare className="w-4 h-4" />
//                 </button>
//                 <button
//                   onClick={() => {
//                     if (window.confirm(`Delete "${item.name}"?`))
//                       deleteProduct(item.id);
//                   }}
//                   className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-600 shadow-sm flex items-center justify-center hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
//                 >
//                   <HiOutlineTrash className="w-4 h-4" />
//                 </button>
//               </div>
//               <img
//                 src={
//                   item.image_url ||
//                   "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop"
//                 }
//                 alt={item.name}
//                 className="w-full h-40 object-cover"
//               />
//               <div className="p-4 flex flex-col flex-grow">
//                 <div className="flex justify-between items-start mb-2 gap-2">
//                   <h3 className="font-bold text-slate-800 leading-tight">
//                     {item.name}
//                   </h3>
//                   <span className="text-sm text-slate-500 font-medium whitespace-nowrap">
//                     ${item.price}
//                   </span>
//                 </div>
//                 <div className="mb-2">
//                   <span className="text-[10px] bg-white text-black border border-slate-200 px-2 py-1 rounded-full font-bold uppercase tracking-tight shadow-sm">
//                     {item.category}
//                   </span>
//                 </div>
//                 <div className="mb-4">
//                   <StatusChip type={chipType(item.status)}>
//                     {item.status}
//                   </StatusChip>
//                 </div>
//                 <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
//                   <div className="flex flex-col">
//                     <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">
//                       Stock
//                     </span>
//                     {editingStockId === item.id ? (
//                       <input
//                         type="number"
//                         autoFocus
//                         className="w-20 text-2xl font-bold text-slate-900 border-b-2 border-indigo-500 focus:outline-none bg-transparent"
//                         value={tempStockValue}
//                         onChange={(e) => setTempStockValue(e.target.value)}
//                         onKeyDown={(e) => handleStockKeyDown(e, item.id)}
//                         onBlur={() => saveStock(item.id)}
//                       />
//                     ) : (
//                       <span
//                         className="text-2xl font-bold text-slate-900 cursor-pointer hover:text-indigo-600"
//                         onClick={() => startStockEdit(item)}
//                       >
//                         {item.stock}
//                       </span>
//                     )}
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => handleDecrement(item)}
//                       className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
//                     >
//                       <HiMinus className="w-4 h-4" />
//                     </button>
//                     <button
//                       onClick={() => handleIncrement(item)}
//                       className="w-8 h-8 rounded-full bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center text-indigo-600"
//                     >
//                       <HiPlus className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Add Product Modal */}
//       {showAddModal && (
//         <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
//             <div className="flex items-center justify-between p-6 border-b border-slate-100">
//               <h2 className="text-xl font-bold text-slate-800">
//                 Add New Warehouse Product
//               </h2>
//               <button
//                 onClick={() => setShowAddModal(false)}
//                 className="text-slate-400 hover:text-slate-600"
//               >
//                 <HiXMark className="w-6 h-6" />
//               </button>
//             </div>
//             <form onSubmit={handleAddProduct} className="p-6 space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Product Name
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={newProduct.name}
//                   onChange={(e) =>
//                     setNewProduct({ ...newProduct, name: e.target.value })
//                   }
//                   className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none text-slate-900"
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-1">
//                     Price
//                   </label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     required
//                     value={newProduct.price}
//                     onChange={(e) =>
//                       setNewProduct({ ...newProduct, price: e.target.value })
//                     }
//                     className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none text-slate-900"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-1">
//                     Initial Quantity
//                   </label>
//                   <input
//                     type="number"
//                     required
//                     value={newProduct.quantity}
//                     onChange={(e) =>
//                       setNewProduct({ ...newProduct, quantity: e.target.value })
//                     }
//                     className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none text-slate-900"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Category
//                 </label>
//                 <select
//                   required
//                   value={newProduct.category}
//                   onChange={(e) =>
//                     setNewProduct({ ...newProduct, category: e.target.value })
//                   }
//                   className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
//                 >
//                   <option value="" className="text-slate-900">
//                     -- Select Category --
//                   </option>
//                   {CATEGORIES.map((cat) => (
//                     <option
//                       key={cat.value}
//                       value={cat.value}
//                       className="text-slate-900"
//                     >
//                       {cat.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Image URL
//                 </label>
//                 <input
//                   type="url"
//                   value={newProduct.image_url}
//                   onChange={(e) =>
//                     setNewProduct({ ...newProduct, image_url: e.target.value })
//                   }
//                   className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none text-slate-900"
//                 />
//               </div>
//               <div className="pt-4 flex gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setShowAddModal(false)}
//                   className="flex-1 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl font-semibold text-sm hover:bg-red-100 hover:border-red-200 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium text-sm"
//                 >
//                   Add to Warehouse
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {editingProduct && (
//         <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
//             <div className="flex items-center justify-between p-6 border-b border-slate-100">
//               <h2 className="text-xl font-bold text-slate-800">Edit Product</h2>
//               <button
//                 onClick={() => setEditingProduct(null)}
//                 className="text-slate-400 hover:text-slate-600"
//               >
//                 <HiXMark className="w-6 h-6" />
//               </button>
//             </div>
//             <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Product Name
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={editingProduct.name}
//                   onChange={(e) =>
//                     setEditingProduct({
//                       ...editingProduct,
//                       name: e.target.value,
//                     })
//                   }
//                   className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none text-slate-900"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Price
//                 </label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   required
//                   value={editingProduct.price}
//                   onChange={(e) =>
//                     setEditingProduct({
//                       ...editingProduct,
//                       price: e.target.value,
//                     })
//                   }
//                   className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none text-slate-900"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Category
//                 </label>
//                 <select
//                   value={editingProduct.category || ""}
//                   onChange={(e) =>
//                     setEditingProduct({
//                       ...editingProduct,
//                       category: e.target.value,
//                     })
//                   }
//                   className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
//                 >
//                   <option value="" className="text-slate-900">
//                     -- Select Category --
//                   </option>
//                   {CATEGORIES.map((cat) => (
//                     <option
//                       key={cat.value}
//                       value={cat.value}
//                       className="text-slate-900"
//                     >
//                       {cat.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Image URL
//                 </label>
//                 <input
//                   type="url"
//                   value={editingProduct.image_url || ""}
//                   onChange={(e) =>
//                     setEditingProduct({
//                       ...editingProduct,
//                       image_url: e.target.value,
//                     })
//                   }
//                   className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none text-slate-900"
//                 />
//               </div>
//               <div className="pt-4 flex gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setEditingProduct(null)}
//                   className="flex-1 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl font-semibold text-sm hover:bg-red-100 hover:border-red-200 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium text-sm"
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import StatusChip from "../components/StatusChip";
import { CATEGORIES } from "../../shared/components/CategorySelector";
import {
  HiOutlineMagnifyingGlass,
  HiPlus,
  HiMinus,
  HiOutlinePencilSquare,
  HiXMark,
  HiOutlineTrash,
} from "react-icons/hi2";
import { useState } from "react";
import { useWarehouse } from "../context/WarehouseContext";

const chipType = (s) =>
  s === "In Stock" ? "success" : s === "Low Stock" ? "warning" : "danger";

export default function Inventory() {
  const {
    inventory,
    updateStock,
    updateProduct,
    deleteProduct,
    addProduct,
    loading,
  } = useWarehouse();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editingStockId, setEditingStockId] = useState(null);
  const [tempStockValue, setTempStockValue] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    image_url: "",
    category: "",
  });

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const success = await addProduct(newProduct);
    if (success) {
      setShowAddModal(false);
      setNewProduct({
        name: "",
        price: "",
        quantity: "",
        image_url: "",
        category: "",
      });
    }
  };

  const filtered = inventory.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      !selectedCategory || d.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleIncrement = (item) => updateStock(item.id, item.stock + 1);
  const handleDecrement = (item) => {
    if (item.stock > 0) updateStock(item.id, item.stock - 1);
  };

  const startStockEdit = (item) => {
    setEditingStockId(item.id);
    setTempStockValue(item.stock.toString());
  };

  const handleStockKeyDown = (e, id) => {
    if (e.key === "Enter") saveStock(id);
    else if (e.key === "Escape") setEditingStockId(null);
  };

  const saveStock = (id) => {
    const newStock = parseInt(tempStockValue, 10);
    if (!isNaN(newStock) && newStock >= 0) updateStock(id, newStock);
    setEditingStockId(null);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    updateProduct(editingProduct.id, {
      name: editingProduct.name,
      price: parseFloat(editingProduct.price) || 0,
      image_url: editingProduct.image_url,
      category: editingProduct.category,
    });
    setEditingProduct(null);
  };

  if (loading && inventory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Loading inventory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory</h1>
          <p className="text-sm text-slate-500 mt-1">
            Warehouse stock management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-200 active:scale-[0.98] transition-all"
          >
            <HiPlus className="text-base" /> Add Product
          </button>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="" className="text-slate-900">
              All Categories
            </option>
            {CATEGORIES.map((cat) => (
              <option
                key={cat.value}
                value={cat.value}
                className="text-slate-900"
              >
                {cat.label}
              </option>
            ))}
          </select>

          <div className="relative">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search inventory..."
              className="pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 transition-all w-64"
            />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 border-dashed">
          <p className="text-slate-400">
            No products found in warehouse inventory.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow relative group"
            >
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10">
                <button
                  onClick={() => setEditingProduct(item)}
                  className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-600 shadow-sm flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                >
                  <HiOutlinePencilSquare className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete "${item.name}"?`))
                      deleteProduct(item.id);
                  }}
                  className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-600 shadow-sm flex items-center justify-center hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
                >
                  <HiOutlineTrash className="w-4 h-4" />
                </button>
              </div>
              <img
                src={
                  item.image_url ||
                  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop"
                }
                alt={item.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <h3 className="font-bold text-slate-800 leading-tight">
                    {item.name}
                  </h3>
                  <span className="text-sm text-slate-500 font-medium whitespace-nowrap">
                    ${item.price}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-[10px] bg-white text-black border border-slate-200 px-2 py-1 rounded-full font-bold uppercase tracking-tight shadow-sm">
                    {item.category}
                  </span>
                </div>
                <div className="mb-4">
                  <StatusChip type={chipType(item.status)}>
                    {item.status}
                  </StatusChip>
                </div>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">
                      Stock
                    </span>
                    {editingStockId === item.id ? (
                      <input
                        type="number"
                        autoFocus
                        className="w-20 text-2xl font-bold text-slate-900 border-b-2 border-indigo-500 focus:outline-none bg-transparent"
                        value={tempStockValue}
                        onChange={(e) => setTempStockValue(e.target.value)}
                        onKeyDown={(e) => handleStockKeyDown(e, item.id)}
                        onBlur={() => saveStock(item.id)}
                      />
                    ) : (
                      <span
                        className="text-2xl font-bold text-slate-900 cursor-pointer hover:text-indigo-600"
                        onClick={() => startStockEdit(item)}
                      >
                        {item.stock}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDecrement(item)}
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
                    >
                      <HiMinus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleIncrement(item)}
                      className="w-8 h-8 rounded-full bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center text-indigo-600"
                    >
                      <HiPlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">
                Add New Warehouse Product
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <HiXMark className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Initial Quantity
                  </label>
                  <input
                    type="number"
                    required
                    value={newProduct.quantity}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, quantity: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none text-slate-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Category
                </label>
                <select
                  required
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                >
                  <option value="" className="text-slate-900">
                    -- Select Category --
                  </option>
                  {CATEGORIES.map((cat) => (
                    <option
                      key={cat.value}
                      value={cat.value}
                      className="text-slate-900"
                    >
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={newProduct.image_url}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image_url: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none text-slate-900"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl font-semibold text-sm hover:bg-red-100 hover:border-red-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium text-sm"
                >
                  Add to Warehouse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingProduct && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Edit Product</h2>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <HiXMark className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none text-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      price: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none text-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={editingProduct.category || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      category: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                >
                  <option value="" className="text-slate-900">
                    -- Select Category --
                  </option>
                  {CATEGORIES.map((cat) => (
                    <option
                      key={cat.value}
                      value={cat.value}
                      className="text-slate-900"
                    >
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={editingProduct.image_url || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      image_url: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none text-slate-900"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl font-semibold text-sm hover:bg-red-100 hover:border-red-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium text-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

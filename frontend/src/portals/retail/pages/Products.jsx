// import { useState, useEffect, useContext, useCallback } from "react";
// import API from "../../../shared/services/api";
// import { AuthContext } from "../../../shared/context/AuthContext";
// import { CATEGORIES } from "../../shared/components/CategorySelector";
// import AlertBadge from "../components/AlertBadge";
// import { HiOutlinePlus, HiOutlinePencilSquare, HiOutlineTrash, HiOutlineMagnifyingGlass, HiOutlineXMark } from "react-icons/hi2";

// const badgeType = (s) => s === "In Stock" ? "success" : s === "Low Stock" ? "warning" : "danger";

// export default function Products() {
//   const [products, setProducts] = useState([]);
//   const [inventory, setInventory] = useState([]);
//   const [search, setSearch] = useState("");
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const { user } = useContext(AuthContext);

//   const [formData, setFormData] = useState({
//     inventory_product_id: "", quantity: "", price: "", category: "",
//   });

//   const [editFormData, setEditFormData] = useState({
//     quantity: "", price: "", category: "",
//   });

//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   const fetchProducts = useCallback(async () => {
//     try {
//       const res = await API.get(`/products/retailer/${user.id}`);
//       setProducts(res.data || []);
//     } catch (err) {
//       console.error("Failed to fetch products:", err);
//     }
//   }, [user?.id]);

//   useEffect(() => {
//     if (user?.id) {
//       fetchProducts();
//       fetchInventory();
//       const interval = setInterval(fetchProducts, 10000);
//       return () => clearInterval(interval);
//     }
//   }, [user, fetchProducts]);

//   const fetchInventory = async () => {
//     try {
//       const res = await API.get("/products/warehouse");
//       setInventory(res.data || []);
//     } catch (err) {
//       console.error("Failed to fetch inventory:", err);
//     }
//   };

//   const handleAddProduct = async (e) => {
//     e.preventDefault();
//     if (!formData.inventory_product_id || !formData.quantity || !formData.price || !formData.category) {
//       alert("Please fill all fields"); return;
//     }
//     const selectedItem = inventory.find((item) => item.id === parseInt(formData.inventory_product_id));
//     if (!selectedItem) return;
//     if (parseInt(formData.quantity) > selectedItem.quantity) {
//       alert(`Only ${selectedItem.quantity} units available in warehouse!`); return;
//     }
//     setLoading(true);
//     try {
//       const payload = {
//         name: selectedItem.name, price: parseFloat(formData.price),
//         quantity: parseInt(formData.quantity), image_url: selectedItem.image_url,
//         retailer_id: user.id, category: formData.category,
//       };
//       await API.post("/products/retailer", payload);
//       fetchProducts(); fetchInventory();
//       setFormData({ inventory_product_id: "", quantity: "", price: "", category: "" });
//       setShowAddForm(false);
//       alert("Product added successfully!");
//     } catch (err) {
//       console.error("Failed to add product:", err);
//       alert(err.response?.data?.detail || "Failed to add product");
//     } finally { setLoading(false); }
//   };

//   const handleEditProduct = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await API.patch(`/products/retailer/${editingProduct.id}`, {
//         quantity: parseInt(editFormData.quantity),
//         category: editFormData.category,
//         price: parseFloat(editFormData.price),
//       });
//       fetchProducts(); fetchInventory();
//       setEditingProduct(null);
//       alert("Product updated successfully!");
//     } catch (err) {
//       alert(err.response?.data?.detail || "Failed to update product");
//     } finally { setLoading(false); }
//   };

//   const handleDeleteProduct = async (productId) => {
//     if (!window.confirm("Delete this product? Stock will be returned to warehouse.")) return;
//     try {
//       await API.delete(`/products/retailer/${productId}`);
//       fetchProducts(); fetchInventory();
//       alert("Product deleted successfully!");
//     } catch (err) {
//       alert(err.response?.data?.detail || "Failed to delete product");
//     }
//   };

//   const startEditing = (product) => {
//     setEditingProduct(product);
//     setEditFormData({ quantity: product.quantity, category: product.category || "", price: product.price });
//   };

//   const filteredProducts = products.filter((p) =>
//     p.name.toLowerCase().includes(search.toLowerCase())
//   );

//   const getStockStatus = (quantity) => {
//     return quantity === 0 ? "Out of Stock" : quantity < 10 ? "Low Stock" : "In Stock";
//   };

//   const selectedInventoryItem = inventory.find(i => i.id === parseInt(formData.inventory_product_id));
//   const isStockUnavailable = selectedInventoryItem && selectedInventoryItem.quantity <= 0;

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900">Retail Products</h1>
//           <p className="text-sm text-slate-500 mt-1">Manage your store inventory</p>
//         </div>
//         <button onClick={() => { setShowAddForm(!showAddForm); setEditingProduct(null); }}
//           className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-200 active:scale-[0.98] transition-all">
//           <HiOutlinePlus className="text-base" /> Add Product
//         </button>
//       </div>

//       <div className="relative">
//         <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//         <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..."
//           className="pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 transition-all w-full" />
//       </div>

//       {showAddForm && (
//         <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 animate-in slide-in-from-top duration-300">
//           <div className="flex justify-between items-center">
//             <h3 className="font-semibold text-slate-800">Add Product from Inventory</h3>
//             <button onClick={() => setShowAddForm(false)}><HiOutlineXMark className="w-5 h-5 text-slate-400" /></button>
//           </div>
//           <form onSubmit={handleAddProduct}>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-xs font-medium text-slate-700 mb-1">Select Product *</label>
//                 <select value={formData.inventory_product_id}
//                   onChange={(e) => setFormData({ ...formData, inventory_product_id: e.target.value })}
//                   className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900" required>
//                   <option value="" className="text-slate-900">-- Choose a product --</option>
//                   {Object.entries(
//                     inventory.reduce((acc, item) => {
//                       const cat = item.category || "Other";
//                       if (!acc[cat]) acc[cat] = [];
//                       acc[cat].push(item);
//                       return acc;
//                     }, {})
//                   ).map(([category, items]) => (
//                     <optgroup key={category} label={category} className="text-slate-900">
//                       {items.map((item) => (
//                         <option key={item.id} value={item.id} disabled={item.quantity <= 0} className="text-slate-900">
//                           {item.name} ({item.quantity > 0 ? `${item.quantity} available` : "OUT OF STOCK"})
//                         </option>
//                       ))}
//                     </optgroup>
//                   ))}
//                 </select>
//                 {isStockUnavailable && <p className="text-rose-500 text-[10px] mt-1 font-bold">Stock Unavailable</p>}
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-slate-700 mb-1">Category *</label>
//                 <select value={formData.category}
//                   onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//                   className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900" required>
//                   <option value="" className="text-slate-900">-- Select Category --</option>
//                   {CATEGORIES.map((cat) => (
//                     <option key={cat.value} value={cat.value} className="text-slate-900">{cat.label}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-slate-700 mb-1">Quantity *</label>
//                 <input type="number" min="1" max={selectedInventoryItem?.quantity || 1}
//                   value={formData.quantity}
//                   onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
//                   className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900"
//                   placeholder="e.g. 10" required disabled={isStockUnavailable} />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-slate-700 mb-1">Price (Retail) *</label>
//                 <input type="number" step="0.01" value={formData.price}
//                   onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//                   className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900"
//                   placeholder="e.g. 25.99" required disabled={isStockUnavailable} />
//               </div>
//             </div>
//             <div className="flex gap-2 mt-4">
//               <button type="submit" disabled={loading || isStockUnavailable || !formData.inventory_product_id}
//                 className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-50">
//                 {loading ? "Adding..." : "Add Product"}
//               </button>
//               <button type="button" onClick={() => setShowAddForm(false)}
//                 className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium">
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {editingProduct && (
//         <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
//           <div className="flex justify-between items-center">
//             <h3 className="font-semibold text-slate-800">Edit: {editingProduct.name}</h3>
//             <button onClick={() => setEditingProduct(null)}><HiOutlineXMark className="w-5 h-5 text-slate-400" /></button>
//           </div>
//           <form onSubmit={handleEditProduct}>
//             <div className="grid grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-xs font-medium text-slate-700 mb-1">Quantity</label>
//                 <input type="number" min="0" value={editFormData.quantity}
//                   onChange={(e) => setEditFormData({ ...editFormData, quantity: e.target.value })}
//                   className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900" required />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-slate-700 mb-1">Price (Retail)</label>
//                 <input type="number" step="0.01" value={editFormData.price}
//                   onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
//                   className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900" required />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
//                 <select value={editFormData.category}
//                   onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
//                   className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900">
//                   <option value="" className="text-slate-900">-- Select Category --</option>
//                   {CATEGORIES.map((cat) => (
//                     <option key={cat.value} value={cat.value} className="text-slate-900">{cat.label}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//             <div className="flex gap-2 mt-4">
//               <button type="submit" disabled={loading}
//                 className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
//                 {loading ? "Updating..." : "Update Product"}
//               </button>
//               <button type="button" onClick={() => setEditingProduct(null)}
//                 className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium">
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {Object.entries(
//         filteredProducts.reduce((acc, product) => {
//           const cat = product.category || "Other";
//           if (!acc[cat]) acc[cat] = [];
//           acc[cat].push(product);
//           return acc;
//         }, {})
//       ).map(([category, items]) => (
//         <div key={category} className="space-y-4">
//           <div className="flex items-center gap-4 py-2">
//             <h2 className="text-lg font-bold text-slate-800 whitespace-nowrap">{category}</h2>
//             <div className="h-[1px] w-full bg-slate-100"></div>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {items.map((product) => (
//               <div key={product.id}
//                 className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow relative group">
//                 <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10">
//                   <button onClick={() => startEditing(product)}
//                     className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-600 shadow-sm flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all"
//                     title="Edit Product">
//                     <HiOutlinePencilSquare className="w-4 h-4" />
//                   </button>
//                   <button onClick={() => handleDeleteProduct(product.id)}
//                     className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-600 shadow-sm flex items-center justify-center hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
//                     title="Delete Product">
//                     <HiOutlineTrash className="w-4 h-4" />
//                   </button>
//                 </div>
//                 <img src={product.image_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop"}
//                   alt={product.name} className="w-full h-40 object-cover bg-slate-100" />
//                 <div className="p-4 flex flex-col flex-grow">
//                   <h3 className="font-bold text-slate-800 leading-tight mb-2">{product.name}</h3>
//                   <div className="flex justify-between items-center mb-3">
//                     <span className="text-sm font-semibold text-indigo-600">${product.price?.toFixed(2)}</span>
//                     <AlertBadge type={badgeType(getStockStatus(product.quantity))}>
//                       {getStockStatus(product.quantity)}
//                     </AlertBadge>
//                   </div>
//                   {product.category && (
//                     <div className="mb-3">
//                       <span className="text-[10px] bg-white text-black border border-slate-200 px-2 py-1 rounded-full font-bold uppercase tracking-tight shadow-sm">
//                         {product.category}
//                       </span>
//                     </div>
//                   )}
//                   <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
//                     <div>
//                       <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Stock</span>
//                       <p className="text-2xl font-bold text-slate-900">{product.quantity}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}

//       {filteredProducts.length === 0 && (
//         <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
//           <p className="text-slate-500 font-medium">No products found</p>
//           <p className="text-sm text-slate-400 mt-1">Add products from your warehouse inventory to get started</p>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect, useContext, useCallback, useMemo } from "react"; // Added useMemo
import API from "../../../shared/services/api";
import { AuthContext } from "../../../shared/context/AuthContext";
import { CATEGORIES } from "../../shared/components/CategorySelector";
import AlertBadge from "../components/AlertBadge";
import {
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineMagnifyingGlass,
  HiOutlineXMark,
} from "react-icons/hi2";

const badgeType = (s) =>
  s === "In Stock" ? "success" : s === "Low Stock" ? "warning" : "danger";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All"); // New state for filtering
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    inventory_product_id: "",
    quantity: "",
    price: "",
    category: "",
  });

  const [editFormData, setEditFormData] = useState({
    quantity: "",
    price: "",
    category: "",
  });

  const fetchProducts = useCallback(async () => {
    try {
      const res = await API.get(`/products/retailer/${user.id}`);
      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchProducts();
      fetchInventory();
      const interval = setInterval(fetchProducts, 10000);
      return () => clearInterval(interval);
    }
  }, [user, fetchProducts]);

  const fetchInventory = async () => {
    try {
      const res = await API.get("/products/warehouse");
      setInventory(res.data || []);
    } catch (err) {
      console.error("Failed to fetch inventory:", err);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (
      !formData.inventory_product_id ||
      !formData.quantity ||
      !formData.price ||
      !formData.category
    ) {
      alert("Please fill all fields");
      return;
    }
    const selectedItem = inventory.find(
      (item) => item.id === parseInt(formData.inventory_product_id),
    );
    if (!selectedItem) return;
    if (parseInt(formData.quantity) > selectedItem.quantity) {
      alert(`Only ${selectedItem.quantity} units available in warehouse!`);
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: selectedItem.name,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        image_url: selectedItem.image_url,
        retailer_id: user.id,
        category: formData.category,
      };
      await API.post("/products/retailer", payload);
      fetchProducts();
      fetchInventory();
      setFormData({
        inventory_product_id: "",
        quantity: "",
        price: "",
        category: "",
      });
      setShowAddForm(false);
      alert("Product added successfully!");
    } catch (err) {
      console.error("Failed to add product:", err);
      alert(err.response?.data?.detail || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.patch(`/products/retailer/${editingProduct.id}`, {
        quantity: parseInt(editFormData.quantity),
        category: editFormData.category,
        price: parseFloat(editFormData.price),
      });
      fetchProducts();
      fetchInventory();
      setEditingProduct(null);
      alert("Product updated successfully!");
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (
      !window.confirm(
        "Delete this product? Stock will be returned to warehouse.",
      )
    )
      return;
    try {
      await API.delete(`/products/retailer/${productId}`);
      fetchProducts();
      fetchInventory();
      alert("Product deleted successfully!");
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to delete product");
    }
  };

  const startEditing = (product) => {
    setEditingProduct(product);
    setEditFormData({
      quantity: product.quantity,
      category: product.category || "",
      price: product.price,
    });
  };

  // Modified Filtering Logic: Filters by search AND selected category
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (quantity) => {
    return quantity === 0
      ? "Out of Stock"
      : quantity < 10
        ? "Low Stock"
        : "In Stock";
  };

  const selectedInventoryItem = inventory.find(
    (i) => i.id === parseInt(formData.inventory_product_id),
  );
  const isStockUnavailable =
    selectedInventoryItem && selectedInventoryItem.quantity <= 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Retail Products</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your store inventory
          </p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingProduct(null);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-200 active:scale-[0.98] transition-all w-fit"
        >
          <HiOutlinePlus className="text-base" /> Add Product
        </button>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 transition-all w-full"
          />
        </div>

        {/* Category Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
              selectedCategory === "All"
                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300"
            }`}
          >
            All Products
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                selectedCategory === cat.value
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Forms (Add/Edit) remain unchanged in logic but included for layout */}
      {showAddForm && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 animate-in slide-in-from-top duration-300">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-slate-800">
              Add Product from Inventory
            </h3>
            <button onClick={() => setShowAddForm(false)}>
              <HiOutlineXMark className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          <form onSubmit={handleAddProduct}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Select Product *
                </label>
                <select
                  value={formData.inventory_product_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      inventory_product_id: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900"
                  required
                >
                  <option value="" className="text-slate-900">
                    -- Choose a product --
                  </option>
                  {Object.entries(
                    inventory.reduce((acc, item) => {
                      const cat = item.category || "Other";
                      if (!acc[cat]) acc[cat] = [];
                      acc[cat].push(item);
                      return acc;
                    }, {}),
                  ).map(([category, items]) => (
                    <optgroup
                      key={category}
                      label={category}
                      className="text-slate-900"
                    >
                      {items.map((item) => (
                        <option
                          key={item.id}
                          value={item.id}
                          disabled={item.quantity <= 0}
                          className="text-slate-900"
                        >
                          {item.name} (
                          {item.quantity > 0
                            ? `${item.quantity} available`
                            : "OUT OF STOCK"}
                          )
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                {isStockUnavailable && (
                  <p className="text-rose-500 text-[10px] mt-1 font-bold">
                    Stock Unavailable
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900"
                  required
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
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedInventoryItem?.quantity || 1}
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900"
                  placeholder="e.g. 10"
                  required
                  disabled={isStockUnavailable}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Price (Retail) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900"
                  placeholder="e.g. 25.99"
                  required
                  disabled={isStockUnavailable}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                disabled={
                  loading ||
                  isStockUnavailable ||
                  !formData.inventory_product_id
                }
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Product"}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {editingProduct && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-slate-800">
              Edit: {editingProduct.name}
            </h3>
            <button onClick={() => setEditingProduct(null)}>
              <HiOutlineXMark className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          <form onSubmit={handleEditProduct}>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={editFormData.quantity}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      quantity: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Price (Retail)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editFormData.price}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, price: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={editFormData.category}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      category: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900"
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
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
              >
                {loading ? "Updating..." : "Update Product"}
              </button>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Render Product List grouped by Category */}
      {Object.entries(
        filteredProducts.reduce((acc, product) => {
          const cat = product.category || "Other";
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(product);
          return acc;
        }, {}),
      ).map(([category, items]) => (
        <div key={category} className="space-y-4">
          <div className="flex items-center gap-4 py-2">
            <h2 className="text-lg font-bold text-slate-800 whitespace-nowrap">
              {category}
            </h2>
            <div className="h-[1px] w-full bg-slate-100"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow relative group"
              >
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10">
                  <button
                    onClick={() => startEditing(product)}
                    className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-600 shadow-sm flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                    title="Edit Product"
                  >
                    <HiOutlinePencilSquare className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-600 shadow-sm flex items-center justify-center hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
                    title="Delete Product"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                </div>
                <img
                  src={
                    product.image_url ||
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop"
                  }
                  alt={product.name}
                  className="w-full h-40 object-cover bg-slate-100"
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-slate-800 leading-tight mb-2">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-indigo-600">
                      ${product.price?.toFixed(2)}
                    </span>
                    <AlertBadge
                      type={badgeType(getStockStatus(product.quantity))}
                    >
                      {getStockStatus(product.quantity)}
                    </AlertBadge>
                  </div>
                  {product.category && (
                    <div className="mb-3">
                      <span className="text-[10px] bg-white text-black border border-slate-200 px-2 py-1 rounded-full font-bold uppercase tracking-tight shadow-sm">
                        {product.category}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                    <div>
                      <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                        Stock
                      </span>
                      <p className="text-2xl font-bold text-slate-900">
                        {product.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-slate-500 font-medium">No products found</p>
          <p className="text-sm text-slate-400 mt-1">
            {selectedCategory !== "All"
              ? `No products currently available in ${selectedCategory}`
              : "Add products from your warehouse inventory to get started"}
          </p>
        </div>
      )}
    </div>
  );
}

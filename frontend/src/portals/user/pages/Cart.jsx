import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../shared/services/api";

export default function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const r = await api.get("/orders/cart");
      setItems(r.data);
    } catch (err) {
      console.error(err);
      // Fallback for demo
      setItems(DEMO_CART);
    } finally {
      setLoading(false);
    }
  };

  const updateQty = async (id, qty) => {
    if (qty < 1) return removeItem(id);
    try {
      await api.patch(`/orders/cart/${id}`, { quantity: qty });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (id) => {
    try {
      await api.delete(`/orders/cart/${id}`);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const subtotal = items.reduce((s, i) => s + (i.product_price || 0) * i.quantity, 0);

  // Group items by retailer
  const groups = items.reduce((acc, item) => {
    const rid = item.retailer_id || "unknown";
    if (!acc[rid]) acc[rid] = { name: item.retailer_name || "Unknown Retailer", items: [] };
    acc[rid].items.push(item);
    return acc;
  }, {});

  if (loading) return <div className="py-24 text-center text-slate-400">Loading your cart...</div>;

  if (items.length === 0)
    return (
      <div className="max-w-3xl mx-auto px-6 py-32 text-center animate-slide-up">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-white mb-2">Your cart is feeling light</h2>
        <p className="text-slate-500 mb-8">Add some items to get started with your premium shopping experience.</p>
        <Link to="/user" className="premium-btn inline-flex">Explore Products</Link>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-slide-up">
      <h1 className="text-3xl font-black text-white mb-10 flex items-center gap-3">
        Your Selection
        <span className="text-sm font-medium px-3 py-1 bg-slate-800 rounded-full text-slate-400">{items.length} items</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          {Object.entries(groups).map(([rid, group]) => (
            <div key={rid} className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                Products from {group.name}
              </h3>
              <div className="space-y-4">
                {group.items.map((item) => (
                  <div key={item.id} className="glass-card p-4 flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-slate-800">
                      <img src={item.product_image_url} alt={item.product_name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <h4 className="text-lg font-bold text-white truncate">{item.product_name}</h4>
                      <p className="text-slate-500 text-sm">₹{item.product_price?.toLocaleString()} each</p>
                    </div>
                    <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-800">
                      <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-8 h-8 text-slate-500 hover:text-white">−</button>
                      <span className="w-8 text-center text-sm font-bold text-white">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-8 h-8 text-slate-500 hover:text-white">+</button>
                    </div>
                    <div className="text-right min-w-[100px]">
                      <p className="text-lg font-bold text-white">₹{(item.product_price * item.quantity).toLocaleString()}</p>
                      <button onClick={() => removeItem(item.id)} className="text-xs text-rose-500 hover:text-rose-400 mt-1 font-medium">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="glass-card p-8 sticky top-24 border-indigo-500/20 bg-indigo-500/5">
            <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="text-white font-medium">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span className="text-emerald-400 font-medium">FREE</span>
              </div>
              <div className="h-[1px] bg-slate-800 my-4" />
              <div className="flex justify-between items-end">
                <span className="text-slate-300 font-bold">Total Amount</span>
                <span className="text-3xl font-black text-white">₹{subtotal.toLocaleString()}</span>
              </div>
            </div>
            <button 
              onClick={() => navigate("/user/checkout")}
              className="premium-btn w-full py-4 text-base"
            >
              Secure Checkout
            </button>
            <p className="text-[10px] text-center text-slate-500 mt-4 uppercase tracking-widest font-bold">
              Powered by Antigravity Pay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const DEMO_CART = [
  { id: 1, product_name: "Wireless Headphones", product_price: 2499, quantity: 1, retailer_id: 2, retailer_name: "TechStore", product_image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" },
  { id: 2, product_name: "USB-C Hub 7-in-1", product_price: 1899, quantity: 1, retailer_id: 2, retailer_name: "TechStore", product_image_url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500" },
  { id: 3, product_name: "Smart Watch Pro", product_price: 8999, quantity: 1, retailer_id: 3, retailer_name: "AuraWear", product_image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500" },
];

import { useState, useEffect } from "react";
import api from "../../../shared/services/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchOrders = async () => {
    try {
      const r = await api.get("/orders/my-orders");
      setOrders(r.data);
    } catch (err) {
      console.error(err);
      setOrders(DEMO_ORDERS);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Completed": return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "Delivered": return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "Cancelled": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default: return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
  };

  const getProgressWidth = (status) => {
    if (status === "Approved") return "66%";
    if (status === "Delivered" || status === "Completed") return "100%";
    return "33%";
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-slide-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">My Orders</h1>
          <p className="text-slate-500">Track and manage your recent purchases</p>
        </div>
        <button onClick={fetchOrders} className="secondary-btn py-2 text-sm">Refresh Status</button>
      </div>

      {loading ? (
        <div className="py-24 text-center text-slate-400">Syncing with warehouse...</div>
      ) : orders.length === 0 ? (
        <div className="glass-card p-20 text-center">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="text-xl font-bold text-white mb-2">No orders yet</h3>
          <p className="text-slate-500">Your shopping journey starts here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="glass-card overflow-hidden">
              <div className="p-6 border-b border-slate-800/50 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Order ID</p>
                    <p className="text-white font-mono text-sm">#ORD-{order.id.toString().padStart(5, '0')}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Date</p>
                    <p className="text-white text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total</p>
                    <p className="text-xl font-black text-white">₹{order.total_price.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-900/30">
                <div className="space-y-4">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-xl">📦</div>
                        <div>
                          <p className="text-white font-medium">{item.product_name || "Product"}</p>
                          <p className="text-slate-500 text-xs">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-slate-300 font-medium">₹{(item.price_at_purchase * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                
                {/* Progress Tracker (Visual Only) */}
                <div className="mt-8 pt-8 border-t border-slate-800/50">
                  <div className="relative h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-indigo-500 transition-all duration-1000"
                      style={{ width: getProgressWidth(order.status) }}
                    />
                  </div>
                  <div className="flex justify-between mt-3 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                    <span className={order.status === "In Progress" || order.status === "Pending Approval" ? "text-indigo-400" : ""}>In Progress</span>
                    <span className={order.status === "Approved" ? "text-indigo-400" : ""}>Approved</span>
                    <span className={order.status === "Delivered" || order.status === "Completed" ? "text-indigo-400" : ""}>Delivered</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const DEMO_ORDERS = [
  { id: 8801, created_at: new Date().toISOString(), total_price: 2499, status: "In Progress", items: [{ id: 1, product_name: "Wireless Headphones", quantity: 1, price_at_purchase: 2499 }] },
  { id: 8795, created_at: "2026-05-01T10:00:00Z", total_price: 10898, status: "Approved", items: [{ id: 2, product_name: "Smart Watch Pro", quantity: 1, price_at_purchase: 8999 }, { id: 3, product_name: "USB-C Hub", quantity: 1, price_at_purchase: 1899 }] },
];

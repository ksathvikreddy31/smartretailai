import { useState, useEffect } from "react";
import api from "../../../shared/services/api";

export default function RetailOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const r = await api.get("/orders/retailer-orders?status=pending");
      setOrders(r.data);
    } catch (err) {
      console.error(err);
      setOrders(DEMO_ORDERS);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (orderId) => {
    try {
      await api.patch(`/orders/${orderId}/status?status=Approved`);
      alert("Order Approved!");
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to approve order.");
    }
  };

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">Incoming Orders</h1>
          <p className="text-slate-500 text-sm">Review and approve pending requests for your stock</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-bold rounded-full border border-amber-500/20 uppercase tracking-widest">
            {orders.length} Pending
          </span>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center text-slate-400">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="glass-card p-20 text-center border-dashed border-slate-800">
          <div className="text-5xl mb-4">📥</div>
          <h3 className="text-xl font-bold text-white mb-2">No pending orders</h3>
          <p className="text-slate-500">Orders will appear here once customers purchase your products.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <div key={order.id} className="glass-card overflow-hidden flex flex-col md:flex-row">
              <div className="p-8 flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Order ID</span>
                    <h3 className="text-xl font-bold text-white font-mono">#RE-{order.id}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Customer ID</span>
                    <p className="text-slate-300 font-medium">User_{order.user_id}</p>
                    <span className="inline-block mt-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase tracking-widest">
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Ordered Items</h4>
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center text-sm">📦</div>
                        <span className="text-slate-200 font-medium">{item.product_name || "Product"}</span>
                      </div>
                      <span className="text-indigo-400 font-bold">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/50 p-8 md:w-80 border-t md:border-t-0 md:border-l border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-500 text-sm">Subtotal</span>
                    <span className="text-slate-300 font-medium">₹{order.total_price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-slate-500 text-sm">Payment Status</span>
                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">SUCCESS</span>
                  </div>
                  <div className="h-[1px] bg-slate-800 mb-4" />
                  <div className="flex justify-between items-end mb-8">
                    <span className="text-slate-400 text-xs uppercase font-bold">Total Earning</span>
                    <span className="text-2xl font-black text-white">₹{order.total_price.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleApprove(order.id)}
                    className="premium-btn flex-1 py-3 text-sm"
                  >
                    Approve Order
                  </button>
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
  { id: 8801, user_id: 22, total_price: 2499, status: "In Progress", items: [{ id: 1, product_name: "Apple iPhone 15", quantity: 1 }] },
];

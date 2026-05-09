import { useState } from "react";
import api from "../../../shared/services/api";

export default function ProductCard({ product }) {
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await api.post("/orders/cart", {
        product_id: product.id,
        quantity: qty
      });
      alert("Added to cart!");
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart. Are you logged in?");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="glass-card overflow-hidden group">
      {/* Image Section */}
      <div className="block relative h-64 overflow-hidden">
        <img 
          src={product.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-indigo-600/90 backdrop-blur-md text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
            {product.category || "General"}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
            {product.name}
          </h3>
        </div>
        
        <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
          Sold by <span className="text-slate-300 font-medium">{product.retailer_name || "Official Retailer"}</span>
        </p>

        <div className="flex items-center justify-between mb-6">
          <span className="text-2xl font-black text-white">
            ₹{product.price.toLocaleString()}
          </span>
          <div className="flex items-center bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
            <button 
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-bold text-white">{qty}</span>
            <button 
              onClick={() => setQty(qty + 1)}
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <button 
          onClick={handleAddToCart}
          disabled={adding}
          className={`w-full premium-btn py-3 text-sm ${adding ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {adding ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}

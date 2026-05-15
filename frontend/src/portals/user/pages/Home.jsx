import { useState, useEffect, useMemo } from "react";
import api from "../../../shared/services/api";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // These match the categories used by your retailers
  const FIXED_CATEGORIES = [
    "All",
    "Consumer Electronics",
    "Fashion & Apparel",
    "Health & Personal Care",
    "Home & Kitchen Essentials",
  ];

  useEffect(() => {
    // Fetching actual products from retail owners
    api
      .get("/products/all")
      .then((r) => {
        setProducts(r.data || []);
      })
      .catch((err) => {
        console.error("Error fetching live products:", err);
        setProducts([]); // No fallback to demo data
      })
      .finally(() => setLoading(false));
  }, []);

  // Filtering logic based on real product data
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      const matchesCategory = category === "All" || p.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-slide-up">
      {/* Hero Section */}
      <div className="relative mb-16 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
          <span className="gradient-text">Smart Marketplace</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Discover premium products from verified retailers, powered by AI
          precision.
        </p>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto glass-card p-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-transparent border-none focus:ring-0 text-white px-6 py-3 placeholder:text-slate-500"
            />
          </div>
          <div className="h-10 w-[1px] bg-slate-800 hidden md:block self-center" />

          {/* Category Selector with your four specific categories */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-slate-300 px-6 py-3 cursor-pointer appearance-none min-w-[200px]"
          >
            {FIXED_CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-slate-900 text-white">
                {cat}
              </option>
            ))}
          </select>
          <button className="premium-btn py-2 px-8">Search</button>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-slate-400 animate-pulse">
            Fetching latest retailer products...
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">
              {category === "All" ? "Recommended for You" : `${category}`}
            </h2>
            <span className="text-sm text-slate-500">
              {filtered.length} products available
            </span>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 glass-card border border-dashed border-slate-800">
              <span className="text-6xl mb-4 block">🔍</span>
              <h3 className="text-xl font-semibold text-white mb-2">
                No products found
              </h3>
              <p className="text-slate-400">
                There are currently no products available in this category.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
                className="mt-4 text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
              >
                Clear all filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

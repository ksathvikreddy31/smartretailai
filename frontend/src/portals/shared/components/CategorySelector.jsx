import { HiOutlineEye } from "react-icons/hi2";

const CATEGORIES = [
  { value: "Consumer Electronics", label: "💻 Consumer Electronics", description: "Phones, Laptops, Gadgets" },
  { value: "Fashion & Apparel", label: "👔 Fashion & Apparel", description: "Clothing, Shoes, Accessories" },
  { value: "Health & Personal Care", label: "💆 Health & Personal Care", description: "Skincare, Medicine, Grooming" },
  { value: "Home & Kitchen Essentials", label: "🏠 Home & Kitchen Essentials", description: "Appliances, Cookware, Decor" },
];

export default function CategorySelector({ value, onChange, label = "Product Category", required = false }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 pr-10 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer"
          required={required}
        >
          <option value="">-- Select a Category --</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        <HiOutlineEye className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
      </div>
      {value && (
        <p className="text-xs text-slate-400 mt-1">
          {CATEGORIES.find((cat) => cat.value === value)?.description}
        </p>
      )}
    </div>
  );
}

export { CATEGORIES };

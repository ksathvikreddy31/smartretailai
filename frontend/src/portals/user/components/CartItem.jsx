import { HiOutlineTrash, HiMinus, HiPlus } from "react-icons/hi2";

export default function CartItem({ item, onUpdateQty, onRemove }) {
  const { id, name, price, quantity = 1, image } = item;

  return (
    <div className="flex items-center gap-5 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Image */}
      <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-contain p-2" />
        ) : (
          <span className="text-2xl">📦</span>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-slate-800 truncate">{name}</h4>
        <p className="text-sm text-slate-500 mt-0.5">
          ${typeof price === "number" ? price.toFixed(2) : price} each
        </p>
      </div>

      {/* Qty Controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onUpdateQty?.(id, Math.max(1, quantity - 1))}
          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors duration-150"
        >
          <HiMinus className="text-xs" />
        </button>
        <span className="w-10 text-center font-semibold text-slate-700">{quantity}</span>
        <button
          onClick={() => onUpdateQty?.(id, quantity + 1)}
          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors duration-150"
        >
          <HiPlus className="text-xs" />
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right min-w-[80px]">
        <p className="font-bold text-slate-900">${(price * quantity).toFixed(2)}</p>
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove?.(id)}
        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
      >
        <HiOutlineTrash className="text-lg" />
      </button>
    </div>
  );
}

import React from "react";
import { HiOutlineUserCircle, HiOutlineBell } from "react-icons/hi2";

export default function Header({ title, subtitle, children }) {
  return (
    <header className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        {children}
        <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">Admin Account</p>
            <p className="text-xs text-slate-500 uppercase font-medium">Warehouse Manager</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
            <HiOutlineUserCircle className="w-6 h-6 text-slate-600" />
          </div>
        </div>
      </div>
    </header>
  );
}

import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30 font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <Outlet />
      </main>
    </div>
  );
}
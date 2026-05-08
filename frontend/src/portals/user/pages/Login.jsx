import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../../shared/hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
    } catch (err) {
      if (!err.response) {
        setError("Backend Server is Offline. Please start the server on Port 8001.");
      } else {
        // Safely extract error message from various response formats
        let errorMsg = "Invalid email or password";
        if (err?.response?.data?.detail) {
          const detail = err.response.data.detail;
          errorMsg = typeof detail === "string" ? detail : JSON.stringify(detail);
        }
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 sm:p-10 shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <span className="text-xl text-indigo-400">◈</span>
          </div>
          <span className="text-xl font-bold text-slate-100 tracking-tight">SmartRetail AI</span>
        </div>
        
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome back</h1>
        <p className="text-slate-400 text-sm mb-8">Sign in to your portal to continue</p>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Email Address</label>
            <input
              name="email" type="email" value={form.email} onChange={handle}
              placeholder="you@example.com" required 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Password</label>
            <input
              name="password" type="password" value={form.password} onChange={handle}
              placeholder="••••••••" required 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white/70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </>
            ) : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
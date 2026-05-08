import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../shared/hooks/useAuth";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", role: "user" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form.email, form.password, form.role);
      navigate("/login");
    } catch (err) {
      // Safely extract error message from various response formats
      let errorMsg = "Registration failed";
      if (err?.response?.data?.detail) {
        const detail = err.response.data.detail;
        errorMsg = typeof detail === "string" ? detail : JSON.stringify(detail);
      } else if (err?.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>◈</span>
          <span style={styles.logoText}>SmartRetail AI</span>
        </div>
        <h1 style={styles.title}>Create account</h1>
        <p style={styles.sub}>Join the platform</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={submit} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input name="email" type="email" value={form.email} onChange={handle}
            placeholder="you@example.com" required style={styles.input} />

          <label style={styles.label}>Password</label>
          <input name="password" type="password" value={form.password} onChange={handle}
            placeholder="Min 8 characters" required style={styles.input} />

          <label style={styles.label}>Role</label>
          <select name="role" value={form.role} onChange={handle} style={styles.select}>
            <option value="user">Customer (User)</option>
            <option value="retail">Retail Manager</option>
            <option value="admin">Warehouse Admin</option>
          </select>

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? "Creating…" : "Create Account"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus, select:focus { outline: none; border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
        button:hover:not(:disabled) { background: #4f46e5 !important; }
        button:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh", background: "linear-gradient(135deg, #0f1117 0%, #1a1d2e 100%)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: 24
  },
  card: {
    background: "#16192a", border: "1px solid #252840", borderRadius: 16,
    padding: "48px 40px", width: "100%", maxWidth: 420,
    boxShadow: "0 25px 60px rgba(0,0,0,0.5)"
  },
  logo: { display: "flex", alignItems: "center", gap: 10, marginBottom: 32 },
  logoIcon: { fontSize: 24, color: "#6366f1" },
  logoText: { fontSize: 18, fontWeight: 700, color: "#e2e8f0", letterSpacing: "-0.5px" },
  title: { fontSize: 28, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 },
  sub: { fontSize: 14, color: "#64748b", marginBottom: 32 },
  error: {
    background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
    color: "#f87171", borderRadius: 8, padding: "10px 14px", marginBottom: 20, fontSize: 14
  },
  form: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 4, marginTop: 10 },
  input: {
    background: "#0f1117", border: "1px solid #252840", borderRadius: 8, padding: "12px 14px",
    color: "#f1f5f9", fontSize: 14, transition: "all 0.2s"
  },
  select: {
    background: "#0f1117", border: "1px solid #252840", borderRadius: 8, padding: "12px 14px",
    color: "#f1f5f9", fontSize: 14, cursor: "pointer"
  },
  btn: {
    marginTop: 24, padding: "13px", background: "#6366f1", color: "#fff",
    border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600,
    cursor: "pointer", transition: "all 0.2s"
  },
  footer: { textAlign: "center", marginTop: 24, fontSize: 14, color: "#64748b" },
  link: { color: "#818cf8", textDecoration: "none", fontWeight: 600 }
};
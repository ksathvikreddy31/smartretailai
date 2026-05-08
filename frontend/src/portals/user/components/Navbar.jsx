import { Link, useLocation } from "react-router-dom";
import useAuth from "../../../shared/hooks/useAuth";

const NAV_ITEMS = [
  { label: "Shop", to: "/user" },
  { label: "Cart", to: "/user/cart" },
  { label: "Orders", to: "/user/orders" },
  { label: "AI Assistant", to: "/user/chatbot" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const loc = useLocation();

  return (
    <nav style={styles.nav}>
      <Link to="/user" style={styles.brand}>
        <span style={styles.brandIcon}>◈</span> SmartRetail
      </Link>
      <div style={styles.links}>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.to} to={item.to}
            style={{ ...styles.link, ...(loc.pathname === item.to ? styles.active : {}) }}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div style={styles.right}>
        <span style={styles.email}>{user?.email}</span>
        <button onClick={logout} style={styles.logoutBtn}>Logout</button>
      </div>
      <style>{`
        a { text-decoration: none; }
        button:hover { background: #ef4444 !important; }
      `}</style>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex", alignItems: "center", gap: 32, padding: "0 24px",
    height: 60, background: "#16192a", borderBottom: "1px solid #252840",
    position: "sticky", top: 0, zIndex: 100
  },
  brand: { fontSize: 18, fontWeight: 800, color: "#818cf8", display: "flex", alignItems: "center", gap: 8 },
  brandIcon: { color: "#6366f1" },
  links: { display: "flex", gap: 8, flex: 1 },
  link: { fontSize: 14, fontWeight: 500, color: "#94a3b8", padding: "6px 12px", borderRadius: 6, transition: "all 0.2s" },
  active: { color: "#818cf8", background: "rgba(99,102,241,0.12)" },
  right: { display: "flex", alignItems: "center", gap: 12, marginLeft: "auto" },
  email: { fontSize: 13, color: "#64748b" },
  logoutBtn: {
    fontSize: 13, padding: "6px 14px", background: "rgba(239,68,68,0.15)",
    color: "#f87171", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 6,
    cursor: "pointer", transition: "all 0.2s"
  }
};
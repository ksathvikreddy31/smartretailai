import { Link, useLocation } from "react-router-dom";
import useAuth from "../../../shared/hooks/useAuth";

const NAV = [
  { icon: "▦", label: "Dashboard", to: "/admin" },
  { icon: "🏭", label: "Inventory", to: "/admin/inventory" },
  { icon: "✅", label: "Approvals", to: "/admin/approvals" },
  { icon: "🚚", label: "Dispatch", to: "/admin/dispatch" },
  { icon: "📋", label: "Order Logs", to: "/admin/logs" },
  { icon: "👥", label: "User Management", to: "/admin/users" },
];

export default function Sidebar() {
  const loc = useLocation();
  const { user, logout } = useAuth();

  return (
    <aside style={styles.sidebar}>
      <div style={styles.brand}>
        <span style={styles.brandIcon}>◈</span>
        <div>
          <div style={styles.brandName}>SmartRetail</div>
          <div style={styles.brandRole}>Admin Portal</div>
        </div>
      </div>

      <nav style={styles.nav}>
        {NAV.map((item) => {
          const active = loc.pathname === item.to;
          return (
            <Link key={item.to} to={item.to} style={{ ...styles.navItem, ...(active ? styles.navActive : {}) }}>
              <span style={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div style={styles.footer}>
        <div style={styles.userInfo}>
          <div style={styles.userAvatar}>{user?.email?.[0]?.toUpperCase()}</div>
          <div>
            <div style={styles.userEmail}>{user?.email}</div>
            <div style={styles.userRole}>Warehouse Admin</div>
          </div>
        </div>
        <button onClick={logout} style={styles.logoutBtn}>↩ Logout</button>
      </div>
      <style>{`a { text-decoration: none; }`}</style>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 240, background: "#16192a", borderRight: "1px solid #252840",
    display: "flex", flexDirection: "column", padding: "20px 0"
  },
  brand: { display: "flex", alignItems: "center", gap: 12, padding: "4px 20px 28px" },
  brandIcon: { fontSize: 22, color: "#f59e0b" },
  brandName: { fontSize: 15, fontWeight: 800, color: "#f1f5f9" },
  brandRole: { fontSize: 11, color: "#f59e0b", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 },
  nav: { flex: 1, display: "flex", flexDirection: "column", gap: 2, padding: "0 12px" },
  navItem: {
    display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8,
    color: "#64748b", fontSize: 13, fontWeight: 500, transition: "all 0.2s"
  },
  navActive: { color: "#fcd34d", background: "rgba(245,158,11,0.1)" },
  navIcon: { fontSize: 16, width: 20 },
  footer: { padding: "20px 16px 0", borderTop: "1px solid #252840", marginTop: "auto" },
  userInfo: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12 },
  userAvatar: {
    width: 32, height: 32, borderRadius: "50%", background: "#f59e0b",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 13, fontWeight: 700, color: "#0f1117", flexShrink: 0
  },
  userEmail: { fontSize: 12, color: "#94a3b8", fontWeight: 600 },
  userRole: { fontSize: 11, color: "#475569" },
  logoutBtn: {
    width: "100%", padding: "8px", background: "transparent",
    border: "1px solid #252840", color: "#64748b", borderRadius: 7,
    fontSize: 12, cursor: "pointer"
  }
};
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { WarehouseProvider } from "../context/WarehouseContext";
import { AdminNotificationProvider } from "../context/AdminNotificationContext";
import { useContext } from "react";
import { AuthContext } from "../../../shared/context/AuthContext";

export default function AdminLayout() {
  const { user } = useContext(AuthContext);
  return (
    <WarehouseProvider>
      <AdminNotificationProvider userId={user?.id || 1}>
        <div style={{ display: "flex", minHeight: "100vh", background: "#0f1117" }}>
          <Sidebar />
          <main style={{ flex: 1, padding: 28, overflow: "auto", background: "#f8fafc" }}>
            <Outlet />
          </main>
        </div>
      </AdminNotificationProvider>
    </WarehouseProvider>
  );
}
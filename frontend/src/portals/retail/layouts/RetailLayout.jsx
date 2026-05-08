import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function RetailLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f1117" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: 28, overflow: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
}
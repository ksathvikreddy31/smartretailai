import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./shared/components/ProtectedRoute";

// Lazy loading components for performance
const UserLayout = React.lazy(() => import("./portals/user/layouts/UserLayout"));
const Home = React.lazy(() => import("./portals/user/pages/Home"));
const Cart = React.lazy(() => import("./portals/user/pages/Cart"));
const Checkout = React.lazy(() => import("./portals/user/pages/Checkout"));
const Orders = React.lazy(() => import("./portals/user/pages/Orders"));
const Login = React.lazy(() => import("./portals/user/pages/Login"));
const Register = React.lazy(() => import("./portals/user/pages/Register"));
const UserChatbot = React.lazy(() => import("./portals/user/pages/Chatbot"));

const RetailLayout = React.lazy(() => import("./portals/retail/layouts/RetailLayout"));
const RetailDashboard = React.lazy(() => import("./portals/retail/pages/Dashboard"));
const Products = React.lazy(() => import("./portals/retail/pages/Products"));
const DemandForecast = React.lazy(() => import("./portals/retail/pages/DemandForecast"));
const RestockRequests = React.lazy(() => import("./portals/retail/pages/RestockRequests"));
const RetailOrders = React.lazy(() => import("./portals/retail/pages/Orders"));
const SalesHistory = React.lazy(() => import("./portals/retail/pages/SalesHistory"));
const RetailChatbot = React.lazy(() => import("./portals/retail/pages/Chatbot"));

const AdminLayout = React.lazy(() => import("./portals/admin/layouts/AdminLayout"));
const AdminDashboard = React.lazy(() => import("./portals/admin/pages/Dashboard"));
const Inventory = React.lazy(() => import("./portals/admin/pages/Inventory"));
const Approvals = React.lazy(() => import("./portals/admin/pages/Approvals"));
const Dispatch = React.lazy(() => import("./portals/admin/pages/Dispatch"));
const Logs = React.lazy(() => import("./portals/admin/pages/Logs"));
const UserManagement = React.lazy(() => import("./portals/admin/pages/UserManagement"));

// Loading Fallback Component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* User Portal */}
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<Orders />} />
          <Route path="chatbot" element={<UserChatbot />} />
        </Route>

        {/* Retail Portal */}
        <Route
          path="/retail"
          element={
            <ProtectedRoute allowedRoles={["retail"]}>
              <RetailLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<RetailDashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="forecast" element={<DemandForecast />} />
          <Route path="restock" element={<RestockRequests />} />
          <Route path="orders" element={<RetailOrders />} />
          <Route path="history" element={<SalesHistory />} />
          <Route path="chatbot" element={<RetailChatbot />} />
        </Route>

        {/* Admin Portal */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="approvals" element={<Approvals />} />
          <Route path="dispatch" element={<Dispatch />} />
          <Route path="logs" element={<Logs />} />
          <Route path="users" element={<UserManagement />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}
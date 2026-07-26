import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import OrderConfirmed from "./pages/OrderConfirmed";
import Inquiry from "./pages/Inquiry";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

// =====================================================
// PROTECTED ADMIN ROUTE
// =====================================================

function ProtectedAdminRoute({ children }) {
  // Session storage check
  const isAdminLoggedIn = sessionStorage.getItem("adminLoggedIn") === "true";

  // Login nahi hai
  // to Admin Login page par redirect

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  // Login hai
  // to Dashboard show

  return children;
}

// =====================================================
// APP
// =====================================================

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* HOME */}

        <Route path="/" element={<Home />} />

        {/* ORDER CONFIRMED */}

        <Route path="/order-confirmed" element={<OrderConfirmed />} />

        {/* INQUIRY */}

        <Route path="/inquiry" element={<Inquiry />} />

        {/* ADMIN LOGIN */}

        <Route path="/admin/login" element={<AdminLogin />} />

        {/* PROTECTED ADMIN DASHBOARD */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />

        {/* ADMIN URL */}

        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

        {/* INVALID URL */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

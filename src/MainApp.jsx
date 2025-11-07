// src/MainApp.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import LandingPage from "./LandingPage";
import App from "./App";
import About from "./About";
import ContactUs from "./ContactUs";
import Themes from "./Themes";
import { useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ add this import

// ✅ Subcomponent so we can use hooks inside Router
function AppRoutes() {
  const { user, isGuest } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 🚀 Auto redirect when user logs in (Google, Email, or Guest)
    if ((user || isGuest) && location.pathname === "/") {
      navigate("/app");
    }
  }, [user, isGuest, location, navigate]);

  return (
    <>
      {/* 🧭 Fixed Navbar */}
      <Navbar />

      {/* 📜 Page Routes */}
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Protected Routes */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />
        <Route
          path="/themes"
          element={
            <ProtectedRoute>
              <Themes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <ContactUs />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function MainApp() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default MainApp;
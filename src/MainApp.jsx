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

// ✅ Subcomponent so we can use hooks inside Router
function AppRoutes() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 🚀 Redirect automatically when user logs in (Google, Email, or Guest)
    if (user && location.pathname === "/") {
      navigate("/app");
    }
  }, [user, location, navigate]);

  return (
    <>
      {/* 🧭 Fixed Navbar */}
      <Navbar />

      {/* 📜 Page Routes */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<App />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/themes" element={<Themes />} />
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
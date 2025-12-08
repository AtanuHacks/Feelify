// src/MainApp.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar"; // Check if this file is in src or src/components
import LandingPage from "./LandingPage";
import App from "./App";
import About from "./About";
import ContactUs from "./ContactUs";
import Themes from "./Themes";
import ProtectedRoute from "./components/ProtectedRoute"; 
import { AuthProvider } from "./contexts/AuthContext"; // ✅ Imported

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
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
    // ✅ WRAPPED: The AuthProvider must be OUTSIDE the Router to provide user state globally
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default MainApp;
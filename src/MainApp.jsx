// src/MainApp.jsx
import React from "react"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import LandingPage from "./LandingPage";
import App from "./App";
import About from "./About";
import ContactUs from "./ContactUs";
import Themes from "./Themes";
import ProtectedRoute from "./components/ProtectedRoute"; 
import { AuthProvider } from "./contexts/AuthContext";

function AppRoutes() {
  // ❌ DELETED: The useEffect that redirected user automatically is GONE.
  // Now, clicking the Logo will keep you on the Landing Page.

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Protected Routes still require login to view content */}
        <Route path="/app" element={<ProtectedRoute><App /></ProtectedRoute>} />
        <Route path="/themes" element={<ProtectedRoute><Themes /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute><ContactUs /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

function MainApp() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default MainApp;
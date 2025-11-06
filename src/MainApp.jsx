import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import LandingPage from "./LandingPage";
import App from "./App";
import About from "./About";
import ContactUs from "./ContactUs";

function MainApp() {
  return (
    <Router>
      {/* 🧭 Fixed Navbar */}
      <Navbar />

      {/* 📜 Page Routes */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<App />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>
    </Router>
  );
}

export default MainApp;
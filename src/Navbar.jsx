// src/components/Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Info, Mail, Palette, User } from "lucide-react";

function Navbar() {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/10 backdrop-blur-lg border-b border-white/20 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center text-black">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide flex items-center gap-2">
          ✨ <span>Feelify</span> 🌈
        </Link>

        {/* Tabs with icons */}
        <div className="flex space-x-6 text-white/90 font-medium items-center">
          <Link
            to="/"
            className={`flex items-center gap-2 hover:text-black ${
              location.pathname === "/" ? "text-white font-semibold" : ""
            }`}
          >
            <Home className="w-4 h-4" /> Home
          </Link>

          <Link
            to="/themes"
            className={`flex items-center gap-2 hover:text-black ${
              location.pathname === "/themes" ? "text-white font-semibold" : ""
            }`}
          >
            <Palette className="w-4 h-4" /> Saved Themes
          </Link>

          <Link
            to="/about"
            className={`flex items-center gap-2 hover:text-black ${
              location.pathname === "/about" ? "text-white font-semibold" : ""
            }`}
          >
            <Info className="w-4 h-4" /> About
          </Link>

          <Link
            to="/contact"
            className={`flex items-center gap-2 hover:text-black ${
              location.pathname === "/contact" ? "text-white font-semibold" : ""
            }`}
          >
            <Mail className="w-4 h-4" /> Contact Us
          </Link>
        </div>

        {/* Profile Icon with Text */}
        <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition">
          <User className="w-6 h-6" />
          <span>Profile</span>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
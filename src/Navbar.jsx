import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Info, Mail, Palette, User } from "lucide-react";
import { useCallback } from "react";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = useCallback(() => {
    // Always go to /app
    navigate("/app");
    // Dispatch a custom event to reset mood in App.jsx
    window.dispatchEvent(new Event("resetMood"));
  }, [navigate]);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/10 backdrop-blur-lg border-b border-white/20 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center text-black">
        {/* Logo */}
        <button
          onClick={handleLogoClick}
          className="text-2xl font-bold tracking-wide flex items-center gap-2 hover:scale-105 hover:text-yellow-200 transition-all duration-300"
        >
          ✨ <span>Feelify</span> 🌈
        </button>

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
            <Palette className="w-4 h-4" /> Favourite Themes
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

        {/* Profile Icon */}
        <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition">
          <User className="w-6 h-6" />
          <span>Profile</span>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

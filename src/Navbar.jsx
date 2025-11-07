import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Info, Mail, Palette, User } from "lucide-react";
import { useCallback, useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import ProfilePanel from "./components/ProfilePanel";
import LoginModal from "./components/LoginModal";

function Navbar() {
  const { user } = useAuth();
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = useCallback(() => {
    navigate("/"); // ✅ Always go to landing page
    window.dispatchEvent(new Event("resetMood")); // still triggers your reset
  }, [navigate]);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/10 backdrop-blur-lg border-b border-white/20 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center text-black">
        {/* Logo */}
        <button
          onClick={handleLogoClick}
          className="text-2xl font-bold tracking-wide flex items-center gap-0 hover:scale-105 hover:text-yellow-200 transition-all duration-300"
        >
          <img
            src="/public/logo.png"   // make sure the path is correct
            alt="Feelify logo"
            className="w-8 h-8 inline-block"
          />
          <span>Feelify</span>
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
            <Palette className="w-4 h-4" /> View Themes
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

        {/* 👤 Profile / Login */}
        <button
          onClick={() => {
            if (user) setShowProfilePanel(true);
            else setShowLogin(true);
          }}
          className="flex items-center gap-2 hover:opacity-80 transition text-white"
        >
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="User"
              className="w-8 h-8 rounded-full border border-white/40 shadow-sm"
            />
          ) : (
            <User className="w-6 h-6" />
          )}
          <span>{user ? user.displayName?.split(" ")[0] || "Profile" : "Login"}</span>
        </button>

        {/* ✅ Firebase Login Modal */}
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

        {/* ✅ Profile Panel */}
        {showProfilePanel && <ProfilePanel onClose={() => setShowProfilePanel(false)} />}
      </div>
    </nav>
  );
}

export default Navbar;
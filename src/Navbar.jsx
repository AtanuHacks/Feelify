// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Info, Mail, Palette, User, Menu, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useAuth } from "./contexts/AuthContext"; // ✅ Re-connected!
import ProfilePanel from "./components/ProfilePanel";
import LoginModal from "./components/LoginModal";
import Logo from "./assets/logo.png"; // Ensure this path is correct

function Navbar() {
  const { user } = useAuth(); // ✅ Now getting real user data
  
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = useCallback(() => {
    navigate("/");
    window.dispatchEvent(new Event("resetMood"));
  }, [navigate]);

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/10 backdrop-blur-lg border-b border-white/20 z-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex justify-between items-center text-white">
        {/* 🔹 Logo */}
        <button
          onClick={handleLogoClick}
          className="text-2xl font-bold tracking-wide flex items-center gap-1 hover:scale-105 hover:text-yellow-200 transition-all duration-300"
        >
          {/* Ensure Logo exists, or remove img tag if not needed */}
          <img src={Logo} alt="Feelify" className="w-8 h-8 inline-block" /> 
          <span>Feelify</span>
        </button>

        {/* 🔹 Desktop Menu */}
        <div className="hidden md:flex space-x-6 text-white/90 font-medium items-center">
          <Link to="/" onClick={handleNavClick} className={`flex items-center gap-2 hover:text-black ${location.pathname === "/" ? "text-white font-semibold" : ""}`}>
            <Home className="w-4 h-4" /> Home
          </Link>

          <Link to="/themes" onClick={handleNavClick} className={`flex items-center gap-2 hover:text-black ${location.pathname === "/themes" ? "text-white font-semibold" : ""}`}>
            <Palette className="w-4 h-4" /> View Themes
          </Link>

          <Link to="/about" onClick={handleNavClick} className={`flex items-center gap-2 hover:text-black ${location.pathname === "/about" ? "text-white font-semibold" : ""}`}>
            <Info className="w-4 h-4" /> About
          </Link>

          <Link to="/contact" onClick={handleNavClick} className={`flex items-center gap-2 hover:text-black ${location.pathname === "/contact" ? "text-white font-semibold" : ""}`}>
            <Mail className="w-4 h-4" /> Contact Us
          </Link>
        </div>

        {/* 🔹 Profile/Login (always visible) */}
        <button
          onClick={() => {
            if (user) setShowProfilePanel(true);
            else setShowLogin(true);
          }}
          className="flex items-center gap-2 hover:opacity-80 transition text-white"
        >
          {/* Appwrite doesn't have photoURL by default, so we check for it or show Icon */}
          {user?.prefs?.photoURL ? (
            <img
              src={user.prefs.photoURL}
              alt="User"
              className="w-8 h-8 rounded-full border border-white/40 shadow-sm"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/40">
               <User className="w-5 h-5" />
            </div>
          )}
          
          <span className="hidden sm:inline">
            {/* Appwrite uses 'name', not 'displayName' */}
            {user ? user.name?.split(" ")[0] || "Profile" : "Login"}
          </span>
        </button>

        {/* 🔹 Mobile Menu Toggle */}
        <button className="md:hidden text-white ml-3" onClick={() => setMenuOpen((prev) => !prev)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* 🔹 Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/10 backdrop-blur-md border-t border-white/20 px-6 py-4 flex flex-col space-y-3 text-white/90 font-medium">
          <Link to="/" onClick={handleNavClick} className="flex items-center gap-2 hover:text-yellow-200">
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link to="/themes" onClick={handleNavClick} className="flex items-center gap-2 hover:text-yellow-200">
            <Palette className="w-4 h-4" /> Themes
          </Link>
          <Link to="/about" onClick={handleNavClick} className="flex items-center gap-2 hover:text-yellow-200">
            <Info className="w-4 h-4" /> About
          </Link>
          <Link to="/contact" onClick={handleNavClick} className="flex items-center gap-2 hover:text-yellow-200">
            <Mail className="w-4 h-4" /> Contact
          </Link>
        </div>
      )}

      {/* 🔹 Modals */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showProfilePanel && <ProfilePanel onClose={() => setShowProfilePanel(false)} />}
    </nav>
  );
}

export default Navbar;
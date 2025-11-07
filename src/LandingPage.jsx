import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Info, Mail, Palette, User } from "lucide-react";
import LoginModal from "./components/LoginModal";
import Logo from "./assets/logo.png";

function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-white text-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        backgroundSize: "400% 400%",
        animation: "gradientMove 8s ease infinite",
      }}
    >
      {/* 🧭 MAIN LANDING CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="p-6 max-w-3xl mt-24"
      >
        <h1 className="text-6xl font-extrabold mb-6 drop-shadow-lg text-white flex items-center justify-center gap-1">
        <img
          src={Logo}
          alt="Feelify"
          className="w-20 h-20 inline-block"
        />
        Feelify
      </h1>

        <p className="text-xl text-white/90 mb-8 leading-relaxed">
          Experience the power of emotion-driven design.  
          Let AI sense your mood and adapt the world around you 💫
        </p>

        <motion.button
          onClick={() => setShowLogin(true)} // 👈 opens firebase login modal
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white/20 px-8 py-3 rounded-full text-white font-semibold shadow-lg hover:bg-white/30 transition-all border border-white/40"
        >
          Get Started 🚀
        </motion.button>
      </motion.div>

      {/* 🧾 FOOTER */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 text-sm text-white/80"
      >
        © 2025 Feelify | Built with ❤ by BitWizards ✨
      </motion.div>

      {/* ✅ Firebase Login Modal */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      {/* Animation */}
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}

export default LandingPage;
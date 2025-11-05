import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link, useLocation } from "react-router-dom";

import { Home, Info, Mail, Palette, User } from "lucide-react";

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
        <h1 className="text-6xl font-extrabold mb-6 drop-shadow-lg">
          ✨ Feelify 🌈
        </h1>

        <p className="text-xl text-white/90 mb-8 leading-relaxed">
          Experience the power of emotion-driven design.  
          Let AI sense your mood and adapt the world around you 💫
        </p>

        <motion.button
          onClick={() => setShowLogin(true)} // 👈 opens login box
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

      {/* 💫 LOGIN MODAL */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-lg border border-white/30 rounded-2xl p-8 w-[90%] max-w-md text-white shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <h2 className="text-4xl font-extrabold mb-4">✨Feelify</h2>
              <h3 className="text-3xl font-bold mb-6">Login to Feel the Vibe 🌈</h3>

              <div className="flex flex-col space-y-4 text-left">
                <input
                  type="text"
                  placeholder="Name"
                  className="bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <input
                  type="text"
                  placeholder="Username"
                  className="bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                />

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowLogin(false);
                    navigate("/app");
                  }}
                  className="bg-white/30 border border-white/40 rounded-lg py-2 font-semibold hover:bg-white/40 transition"
                >
                  Login
                </motion.button>

                <button
                  onClick={() => {
                    setShowLogin(false);
                    navigate("/app");
                  }}
                  className="text-white/80 hover:text-white text-sm mt-2"
                >
                  Continue as Guest 👤
                </button>
              </div>

              <button
                onClick={() => setShowLogin(false)}
                className="absolute top-3 right-4 text-white/70 hover:text-white text-lg"
              >
                ✖
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
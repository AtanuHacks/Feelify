// src/components/ProfilePanel.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext"; // ✅ Connect to Auth

export default function ProfilePanel({ onClose }) {
  const { user, logout } = useAuth(); // ✅ Get real user and logout function

  const handleLogout = async () => {
    try {
      await logout();
      onClose(); // Close panel
      window.location.href = "/"; // Force refresh/redirect to home
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white/20 backdrop-blur-lg border border-white/30 p-6 rounded-2xl shadow-2xl text-center w-[90%] max-w-md relative"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 🖼 Profile Picture Placeholder */}
          <div className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-white/50 shadow-lg bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-4xl text-white font-bold">
             {/* Show first letter of name */}
             {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>

          {/* 👤 User Info */}
          <h3 className="text-xl font-bold text-white mb-1">
            {user.name || "User"}
          </h3>
          <p className="text-white/80 text-sm mb-5">
            {user.email}
          </p>

          {/* 🔘 Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleLogout}
              className="bg-red-400 hover:bg-red-500 text-white font-semibold py-2 rounded-lg shadow transition-all"
            >
              Sign Out
            </button>

            <button
              onClick={onClose}
              className="text-sm text-white/80 underline hover:text-white"
            >
              Close
            </button>
          </div>

          {/* ❌ Close Icon */}
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-white/70 hover:text-white text-lg"
          >
            ✖
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
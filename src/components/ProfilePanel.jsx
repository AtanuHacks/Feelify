// src/components/ProfilePanel.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

export default function ProfilePanel({ onClose }) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      console.log("⏳ Logging out...");
      
      // 1. Destroy Appwrite Session
      await logout();
      
      // 2. Clear Local Storage (Themes, etc.)
      localStorage.clear(); 
      
      // 3. Clear Session Storage
      sessionStorage.clear();

      console.log("✅ Logged out completely.");
      onClose();
      
      // 4. Force hard reload to clear React state
      window.location.href = "/"; 
    } catch (error) {
      console.error("Logout failed:", error);
      // Force reload anyway
      window.location.href = "/";
    }
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-1000"
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
          {/* 🖼 Profile Picture */}
          <div className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-white/50 shadow-lg bg-linear-to-br from-purple-400 to-blue-500 flex items-center justify-center text-4xl text-white font-bold overflow-hidden">
             {/* Use 'user.prefs.photoURL' if available, otherwise User Name Initial */}
             {user.prefs?.photoURL ? (
                <img src={user.prefs.photoURL} alt="Profile" className="w-full h-full object-cover" />
             ) : (
                user.name ? user.name.charAt(0).toUpperCase() : "U"
             )}
          </div>

          <h3 className="text-xl font-bold text-white mb-1">
            {user.name || "User"}
          </h3>
          <p className="text-white/80 text-sm mb-5">
            {user.email}
          </p>

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
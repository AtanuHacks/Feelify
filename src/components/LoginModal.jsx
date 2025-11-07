// src/components/LoginModal.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import ModalPortal from "./ModalPortal";

export default function LoginModal({ onClose }) {
  const {
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
    continueAsGuest,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignup) await signupWithEmail(email, password, name);
      else await loginWithEmail(email, password);
      onClose();
    } catch (err) {
      alert("Authentication error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalPortal>
        <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white/20 backdrop-blur-lg border border-white/30 p-8 rounded-2xl shadow-2xl text-center w-[90%] max-w-md relative flex flex-col justify-center"
          // ✅ removed the translateY(30px)
          // ✅ added a gentle vertical padding for natural centering
          style={{
            marginTop: "2em", // gentle offset if desired
          }}
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 40 }}
          transition={{ duration: 0.35 }}
        >
          {/* ✨ Header */}
          <h2 className="text-3xl font-extrabold mb-2 text-white">✨ Feelify</h2>
          <h3 className="text-lg font-semibold mb-6 text-white/90">
            {isSignup ? "Create a New Account 🌈" : "Login to Feel the Vibe 💫"}
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* 🆕 Name field only in Sign-up mode */}
            {isSignup && (
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-2 rounded-lg bg-white/30 border border-white/40 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                required
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 rounded-lg bg-white/30 border border-white/40 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 rounded-lg bg-white/30 border border-white/40 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-lg transition-all"
            >
              {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
            </button>
          </form>

          {/* 🔁 Switch between login/signup */}
          <button
            onClick={() => setIsSignup((v) => !v)}
            className="text-sm text-white/80 underline mt-3"
          >
            {isSignup ? "Already have an account? Login" : "Create new account"}
          </button>

          {/* 🔹 Divider */}
          <div className="my-4 text-white/70">──────── or ────────</div>

          {/* 🔐 Social + Guest Options */}
          <div className="flex flex-col gap-2">
            <button
              onClick={async () => {
                await loginWithGoogle();
                onClose();
              }}
              className="bg-white/90 text-gray-900 font-semibold py-2 rounded-lg hover:bg-white transition"
            >
              Continue with Google
            </button>

            <button
              onClick={async () => {
                await continueAsGuest(); // 👈 this sets user
                onClose();               // 👈 this closes modal
              }}
              className="bg-white/60 text-gray-900 font-semibold py-2 rounded-lg hover:bg-white/70 transition"
            >
              Continue as Guest 👤
            </button>
          </div>

          {/* ❌ Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-white/70 hover:text-white text-lg"
          >
            ✖
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
    </ModalPortal>
      
  );
}
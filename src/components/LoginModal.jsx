// src/components/LoginModal.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; // ✅ Added for redirection
import { useAuth } from "../contexts/AuthContext"; // ✅ Added to fix the crash
import ModalPortal from "./ModalPortal";

const LoginModal = ({ onClose }) => {
  const { login, signup } = useAuth(); // ✅ Get the real functions
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignup) {
        // Create Account + Login
        await signup(email, password, name);
      } else {
        // Just Login
        await login(email, password);
      }
      
      // ✅ Success!
      onClose(); // Close the popup
      navigate("/app"); // Redirect to Dashboard
    } catch (err) {
      console.error(err);
      // Appwrite errors are usually descriptive
      setError(err.message || "Failed to authenticate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalPortal>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white/10 border border-white/20 p-8 rounded-2xl shadow-2xl w-96 backdrop-blur-md relative"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white"
          >
            ✕
          </button>

          {/* Header */}
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {isSignup ? "Join Feelify" : "Welcome Back"}
          </h2>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 text-red-200 p-3 rounded mb-4 text-sm text-center border border-red-500/30">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isSignup && (
              <input
                type="text"
                placeholder="Display Name"
                className="p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/50 focus:bg-white/10 transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}
            <input
              type="email"
              placeholder="Email"
              className="p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/50 focus:bg-white/10 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/50 focus:bg-white/10 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8} // Appwrite usually requires 8 chars
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className={`mt-2 py-3 rounded-lg bg-linear-to-r from-blue-500 to-purple-600 text-white font-bold shadow-lg transition ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:shadow-blue-500/30"
              }`}
              type="submit"
            >
              {loading ? "Processing..." : isSignup ? "Sign Up" : "Log In"}
            </motion.button>
          </form>

          {/* Toggle Login/Signup */}
          <p className="mt-4 text-center text-white/60 text-sm">
            {isSignup ? "Already have an account? " : "New to Feelify? "}
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setError(""); // Clear errors when switching
              }}
              className="text-blue-300 hover:text-blue-200 underline font-semibold transition"
            >
              {isSignup ? "Log In" : "Sign Up"}
            </button>
          </p>
        </motion.div>
      </motion.div>
    </ModalPortal>
  );
};

export default LoginModal;
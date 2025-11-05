import React from "react";
import { motion } from "framer-motion";

function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "100px 20px 60px",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-lg bg-white/20 rounded-2xl shadow-xl p-8 max-w-3xl text-center text-white"
      >
        <h1 className="text-4xl font-extrabold mb-6 drop-shadow-lg">
          About <span className="text-white/90">Feelify 🎧</span>
        </h1>

        <p className="text-white/90 text-lg leading-relaxed mb-6">
          <strong>Feelify</strong> is an innovative emotion-driven experience that
          blends AI and design. Using real-time mood detection through your
          camera and text, Feelify transforms your environment — colors, themes,
          and vibes — to match your emotional state.
        </p>

        <p className="text-white/80 text-md italic mb-6">
          “Let your emotions shape the colors of your world.” ✨
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4"
        >
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default About;
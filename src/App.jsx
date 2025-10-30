import axios from "axios";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function App() {
  const [mood, setMood] = useState("neutral");
  const [input, setInput] = useState("");
  const [theme, setTheme] = useState({
    gradient: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
    description: "Calm and balanced.",
  });

  // 🧭 Full-screen fix
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  useEffect(() => {
    const handleResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 💾 Manage saved themes
  const [savedThemes, setSavedThemes] = useState(() => {
    const data = localStorage.getItem("savedThemes");
    return data ? JSON.parse(data) : [];
  });

  const moodThemes = {
    joy: {
      gradient: "linear-gradient(135deg, #f9d423 0%, #ff4e50 100%)",
      description: "Bright and cheerful!",
    },
    sadness: {
      gradient: "linear-gradient(135deg, #83a4d4 0%, #b6fbff 100%)",
      description: "Calm and reflective.",
    },
    anger: {
      gradient: "linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)",
      description: "Intense and passionate.",
    },
    fear: {
      gradient: "linear-gradient(135deg, #8360c3 0%, #2ebf91 100%)",
      description: "Cautious and alert.",
    },
    surprise: {
      gradient: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
      description: "Curious and amazed.",
    },
    love: {
      gradient: "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)",
      description: "Warm and affectionate.",
    },
    neutral: {
      gradient: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
      description: "Balanced and steady.",
    },
  };

  // 🎭 Detect mood using Hugging Face API
  const detectMood = async () => {
    if (!input.trim()) {
      alert("Please enter some text!");
      return;
    }

    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base",
        { inputs: input },
        {
          headers: {
            Authorization: `Bearer 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`, // Replace this with your real key
          },
        }
      );

      const emotion = response.data[0][0].label.toLowerCase();
      setMood(emotion);
      setTheme(moodThemes[emotion] || moodThemes["neutral"]);
    } catch (error) {
      console.error(error);
      alert("Error detecting mood. Try again later!");
    }
  };

  // 💾 Save current theme
  const saveCurrentTheme = () => {
    const newTheme = { mood, ...theme };
    const updatedThemes = [...savedThemes, newTheme];
    setSavedThemes(updatedThemes);
    localStorage.setItem("savedThemes", JSON.stringify(updatedThemes));
    alert(`Saved theme for ${mood.toUpperCase()}!`);
  };

  // 📤 Export themes as JSON
  const exportThemes = () => {
    if (savedThemes.length === 0) {
      alert("No saved themes to export!");
      return;
    }
    const blob = new Blob([JSON.stringify(savedThemes, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "saved_themes.json";
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      style={{
        background: theme.gradient,
        height: `${viewportHeight}px`, // ✅ full device height
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        transition: "background 1s ease",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="backdrop-blur-lg bg-white/20 rounded-2xl shadow-xl p-8 text-center w-96 max-w-[90%]"
      >
        <h1 className="text-4xl font-extrabold mb-4 text-white drop-shadow-lg">
          ✨ Feelify 🌈
        </h1>
        <p className="text-black mb-6">
          Discover your emotional vibe instantly!
        </p>

        <input
          type="text"
          placeholder="Type how you feel..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-3 rounded-lg border-2 border-gray-200 bg-transparent text-blue-600 placeholder-blue-600/70 outline-none text-center text-lg mb-4"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={detectMood}
          className="bg-white/80 text-gray-800 font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-white transition"
        >
          Detect Mood
        </motion.button>

        <motion.div
          key={mood}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6"
        >
          <h2 className="text-2xl font-bold text-white drop-shadow">
            {mood.toUpperCase()}
          </h2>
          <p className="text-white/90 mt-2">{theme.description}</p>
        </motion.div>

        {/* 💾 Save & 📤 Export Buttons */}
        <div className="flex justify-center gap-3 mt-6">
          <button
            onClick={saveCurrentTheme}
            className="bg-white/70 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white"
          >
            💾 Save Theme
          </button>
          <button
            onClick={exportThemes}
            className="bg-white/70 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white"
          >
            📤 Export
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default App;
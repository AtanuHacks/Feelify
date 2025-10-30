import axios from "axios";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useCameraMood from "./useCameraMood";


function App() {
  const [mood, setMood] = useState("neutral");
  const [input, setInput] = useState("");
  const { videoRef, cameraMood } = useCameraMood(); 

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

  const [theme, setTheme] = useState({
    gradient: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
    description: "Calm and balanced.",
  });
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [savedThemes, setSavedThemes] = useState(() => {
    const data = localStorage.getItem("savedThemes");
    return data ? JSON.parse(data) : [];
  });
  const [showSaved, setShowSaved] = useState(false); // 👈 toggle state

  useEffect(() => {
    const handleResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!cameraMood) return;

    const moodMap = {
      happy: "joy",
      sad: "sadness",
      angry: "anger",
      fearful: "fear",
      surprised: "surprise",
      neutral: "neutral"
    };

    const mappedMood = moodMap[cameraMood] || "neutral";
    setMood(mappedMood);
    setTheme(moodThemes[mappedMood]);
  }, [cameraMood]);




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
            Authorization: `Bearer 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`,
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

  const saveCurrentTheme = () => {
    // Check if theme for this mood already exists
    const alreadySaved = savedThemes.some((item) => item.mood === mood);

    if (alreadySaved) {
      alert(`Theme for ${mood.toUpperCase()} is already saved!`);
      return;
  }

  const newTheme = { mood, ...theme };
  const updatedThemes = [...savedThemes, newTheme];
  setSavedThemes(updatedThemes);
  localStorage.setItem("savedThemes", JSON.stringify(updatedThemes));
  alert(`Saved theme for ${mood.toUpperCase()}!`);
};

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

  const removeTheme = (index) => {
    const updated = savedThemes.filter((_, i) => i !== index);
    setSavedThemes(updated);
    localStorage.setItem("savedThemes", JSON.stringify(updated));
  };

  const clearAllThemes = () => {
    setSavedThemes([]);
    localStorage.removeItem("savedThemes");
  };

  const applyTheme = (item) => {
    setTheme({ gradient: item.gradient, description: item.description });
    setMood(item.mood);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      style={{
        background: theme.gradient,
        height: `${viewportHeight}px`,
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
        className="backdrop-blur-lg bg-white/20 rounded-2xl shadow-xl p-6 md:p-6 text-center w-[450px] md:w-[550px] max-w-[95%]"
      >
        <h1 className="text-4xl font-extrabold mb-4 text-white drop-shadow-lg">
          ✨ Feelify 🌈
        </h1>
        <p className="text-black mb-6">Discover your emotional vibe instantly!</p>

        <input
          type="text"
          placeholder="Type how you feel..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-3 rounded-lg border-2 border-gray-200 bg-transparent text-blue-600 placeholder-blue-600/70 outline-none text-center text-lg mb-4"
        />

        <div className="w-full px-2">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-58 rounded-lg border border-white/30 shadow-md object-cover"
        ></video>


          <p className="mt-2 text-white text-lg font-semibold">
            Camera Mood: {cameraMood ? cameraMood.toUpperCase() : "Detecting..."}
          </p>

        </div>


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

        {/* 🔽 Toggle Button */}
        {savedThemes.length > 0 && (
          <div className="mt-6">
            <button
              onClick={() => setShowSaved((prev) => !prev)}
              className="text-white/90 underline text-sm hover:text-white transition"
            >
              {showSaved ? "Hide Saved Themes ▲" : "View Saved Themes ▼"}
            </button>

            {/* 📜 Collapsible Saved Section */}
            <AnimatePresence>
              {showSaved && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="bg-white/10 rounded-xl p-4 mt-3 overflow-hidden backdrop-blur-md"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      Saved Themes 💾
                    </h3>
                    <button
                      onClick={clearAllThemes}
                      className="text-xs bg-white/30 hover:bg-white/50 text-gray-900 font-semibold px-2 py-1 rounded-md transition"
                    >
                      Clear All
                    </button>
                  </div>

                  <ul className="space-y-2 max-h-56 overflow-y-auto">
                    {savedThemes.map((item, index) => (
                      <li
                        key={index}
                        onClick={() => applyTheme(item)}
                        className="flex justify-between items-start text-white/90 text-sm bg-white/20 rounded-lg p-2 cursor-pointer hover:bg-white/30 transition"
                      >
                        <div className="text-left">
                          <strong>{item.mood.toUpperCase()}</strong>
                          <p className="text-xs text-white/80 mt-1">
                            {item.description}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeTheme(index);
                          }}
                          className="ml-3 text-xs bg-white/30 hover:bg-white/50 text-gray-900 font-semibold px-2 py-1 rounded-md transition"
                        >
                          ✖
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default App;
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useCameraMood from "./useCameraMood";

function App() {
  const [mood, setMood] = useState("");
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
    // neutral: {
    //   gradient: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
    //   description: "Balanced and steady.",
    // },
  };

  const defaultTheme = {
  gradient: "linear-gradient(135deg, #667eea, #764ba2)",
  description: "Welcome to Feelify — Discover your emotional vibe 🌈",
};

  const [theme, setTheme] = useState(defaultTheme);
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight : 800
  );
  const [savedThemes, setSavedThemes] = useState(() => {
    try {
      const data = localStorage.getItem("savedThemes");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });
  const [showSaved, setShowSaved] = useState(false);

  // --- Voice recognition related ---
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  // Move voice-start function into component scope so JSX can access it
  const startVoiceInput = () => {
    // pick standard or webkit prefixed
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser!");
      return;
    }

    // If already created and listening, stop it (toggle)
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      console.log("🎙 Listening...");
    };

    recognition.onresult = (event) => {
      try {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        console.log("🗣 You said:", transcript);
      } catch (err) {
        console.error("Parsing result error:", err);
      }
    };

    recognition.onerror = (event) => {
      console.error("❌ Voice input error:", event.error);
      // stop and set state
      setIsListening(false);
      recognition.stop();
      alert("Could not recognize your voice. Try again.");
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log("🎙 Stopped listening");
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // cleanup recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onresult = null;
          recognitionRef.current.onstart = null;
          recognitionRef.current.onend = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.stop();
        } catch {
          /* ignore cleanup errors */
        }
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
  if (!cameraMood) {
    // When no camera mood detected yet, show default theme only once
    setMood("");
    setTheme(defaultTheme);
    return;
  }

  const moodMap = {
    happy: "joy",
    sad: "sadness",
    angry: "anger",
    fearful: "fear",
    surprised: "surprise",
  };

  const mappedMood = moodMap[cameraMood.toLowerCase()];
  if (mappedMood && moodThemes[mappedMood]) {
    setMood(mappedMood);
    setTheme(moodThemes[mappedMood]);
  } else {
    // If mood is unknown, fallback to default theme (not neutral)
    setMood("");
    setTheme(defaultTheme);
  }
}, [cameraMood]);

  const detectMood = async () => {
  // ✅ If text is empty, do NOT detect through API, show message
      if (!input.trim()) {
        alert("Please type how you feel or use the microphone 🎤.");
        return;
      }

      try {
        const response = await axios.post("http://localhost:5000/api/detect-mood", {
          text: input,
        });

        const predictions = response.data[0];
        
        // ✅ Pick the highest score emotion
        const bestEmotion = predictions.reduce((max, obj) =>
          obj.score > max.score ? obj : max
        );

        const emotion = bestEmotion.label.toLowerCase();

        console.log("Detected Text Emotion:", emotion);

        if (moodThemes[emotion]) {
          setTheme(moodThemes[emotion]);
        } else {
          alert("Unknown emotion detected. Try again!");
          setTheme(defaultTheme);
          setMood("");
        }

      } catch (error) {
        console.error("❌ Error detecting mood:", error);
        alert("Error detecting mood. Please try again.");
      }
    };

  const saveCurrentTheme = () => {
    const alreadySaved = savedThemes.some((item) => item.mood === mood);
    if (alreadySaved) {
      alert(`Theme for ${mood.toUpperCase()} is already saved!`);
      return;
    }
    const newTheme = { mood, ...theme };
    const updatedThemes = [...savedThemes, newTheme];
    setSavedThemes(updatedThemes);
    try {
      localStorage.setItem("savedThemes", JSON.stringify(updatedThemes));
    } catch {
      /* ignore localStorage errors */
    }
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
    try {
      localStorage.setItem("savedThemes", JSON.stringify(updated));
    } catch {}
  };

  const clearAllThemes = () => {
    setSavedThemes([]);
    try {
      localStorage.removeItem("savedThemes");
    } catch {}
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
      background: theme ? theme.gradient : "linear-gradient(135deg, #667eea, #764ba2)", // fallback default
      minHeight: `${viewportHeight - 80}px`, // leaves room for navbar height
      width: "100vw",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      paddingTop: "70px", // gap below navbar
      paddingBottom: "30px", // bottom space
      paddingLeft: "20px",
      paddingRight: "20px",
      boxSizing: "border-box",
      overflow: "hidden",
      transition: "background 1s ease",
      fontFamily: "'Poppins', sans-serif",
    }}
>
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="backdrop-blur-lg bg-white/20 rounded-2xl shadow-xl p-6 md:p-6 text-center w-[450px] md:w-[550px] max-w-[95%] mb-8 mx-4 "
      >
      
      <p className="text-3xl font-extrabold text-center text-black drop-shadow-[0_0_10px_rgba(255,255,255,0.7)] tracking-tight mb-8">
        Let your emotions shape the colors of your world ✨
      </p>

        {/* 🎤 Input + Mic Button */}
        <div className="relative w-full mb-4">
          <input
            type="text"
            placeholder="Type how you feel..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-3 pr-12 rounded-lg border-2 border-gray-200 bg-transparent text-white-200 placeholder-white outline-none text-center text-lg"
          />

          {/* 🎤 Mic Button (same UI) */}
          {/* 🎤 Mic Button (Google-style) */}
          <button
            onClick={startVoiceInput}
            className={`absolute right-3 top-1/2 -translate-y-1/2 mic-btn ${isListening ? "listening" : ""}`}
            title="Speak your mood"
          >
            <i className={`fa-solid fa-microphone${isListening ? "-slash" : ""}`}></i>
          </button>
        </div>

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
      key={mood || "default"}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-6"
    >
      {mood ? (
        <>
          <h2 className="text-2xl font-bold text-white drop-shadow">
            {mood.toUpperCase()}
          </h2>
          <p className="text-white/90 mt-2">{theme.description}</p>
        </>
      ) : (
        <p className="text-white/90 text-lg font-medium italic">
          {theme.description}
        </p>
      )}
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
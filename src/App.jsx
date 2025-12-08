// src/App.jsx
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useCameraMood from "./useCameraMood";
import { useAuth } from "./contexts/AuthContext"; // We use the real auth now!
import LoginModal from "./components/LoginModal";
import ProfilePanel from "./components/ProfilePanel";

// --- APPWRITE IMPORTS ---
import { databases } from "./appwrite"; 
import { ID } from "appwrite"; 

// --- 🔴 PASTE YOUR IDs HERE 🔴 ---
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID; // 'FeelifyDB'
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID; // 'UserPreferences'

function App() {
  const { user } = useAuth(); // Get the logged-in user
  const [showLogin, setShowLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [mood, setMood] = useState("");
  const [input, setInput] = useState("");
  const {
    videoRef,
    cameraMood,
    cameraActive,
    startCamera,
    stopCamera,
    detectCameraMoodOnce,
  } = useCameraMood();

  // Reset handler
  useEffect(() => {
    const resetHandler = () => {
      setMood("");
      setInput("");
      setTheme(defaultTheme);
    };
    window.addEventListener("resetMood", resetHandler);
    return () => window.removeEventListener("resetMood", resetHandler);
  }, []);

  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  // -----------------------------
  // THEMES CONFIGURATION
  // -----------------------------
  const moodThemes = {
    joy: {
      gradient: "linear-gradient(135deg,#f9d423,#ff4e50)",
      description: "Bright and cheerful!",
      button: { bg: "#ffcc00", hover: "#ffb300", text: "#000" },
    },
    sadness: {
      gradient: "linear-gradient(135deg,#bdc3c7,#2c3e50)",
      description: "Calm, introspective, and quietly emotional.",
      button: { bg: "#a9b0b8", hover: "#8f98a1", text: "#000" },
    },
    anger: {
      gradient: "linear-gradient(135deg,#ff416c,#ff4b2b)",
      description: "Intense and passionate.",
      button: { bg: "#ff5c5c", hover: "#ff3030", text: "#fff" },
    },
    fear: {
      gradient: "linear-gradient(135deg,#8360c3,#2ebf91)",
      description: "Cautious and alert.",
      button: { bg: "#5cd6b0", hover: "#4bb497", text: "#000" },
    },
    surprise: {
      gradient: "linear-gradient(135deg,#ff9a9e,#fad0c4)",
      description: "Curious and amazed.",
      button: { bg: "#ffb6c1", hover: "#ffa6b5", text: "#000" },
    },
    love: {
      gradient: "linear-gradient(135deg,#ff758c,#ff7eb3)",
      description: "Warm and affectionate.",
      button: { bg: "#ff9eb5", hover: "#ff86a0", text: "#000" },
    },
    neutral: {
      gradient: "linear-gradient(135deg,#89f7fe,#66a6ff)",
      description: "Balanced and steady.",
      button: { bg: "#a0e1ff", hover: "#8dd4ff", text: "#000" },
    },
    disgust: {
      gradient: "linear-gradient(135deg,#76b852,#8DC26F)",
      description: "Repulsed but aware — facing what feels unpleasant.",
      button: { bg: "#8cc46e", hover: "#79b25d", text: "#000" },
    },
  };

  const moodEmojis = {
    joy: "😄", sadness: "😢", anger: "😡", fear: "😨",
    surprise: "😲", love: "❤", neutral: "😐", disgust: "🤢",
  };

  const defaultTheme = {
    gradient: "linear-gradient(135deg,#667eea,#764ba2)",
    description: "Welcome to Feelify — Discover your emotional vibe 🌈",
    button: { bg: "#fff", hover: "#e0e0e0", text: "#000" },
  };

  const [theme, setTheme] = useState(defaultTheme);

  // Initialize savedThemes (try local storage first for speed)
  const [savedThemes, setSavedThemes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("savedThemes")) || [];
    } catch {
      return [];
    }
  });
  const [showSaved, setShowSaved] = useState(false);

  // -----------------------------
  // APPWRITE DATABASE LOGIC ☁️
  // -----------------------------

  // 1. Load themes when user logs in
  useEffect(() => {
    if (!user?.$id) return; // If not logged in, do nothing

    const fetchCloudThemes = async () => {
      try {
        // We try to find a document that matches the User's ID
        const doc = await databases.getDocument(
          DATABASE_ID,
          COLLECTION_ID,
          user.$id 
        );
        if (doc.savedThemes) {
          const cloudThemes = JSON.parse(doc.savedThemes);
          setSavedThemes(cloudThemes);
          localStorage.setItem("savedThemes", JSON.stringify(cloudThemes));
        }
      } catch (error) {
        // 404 means "Document not found" -> User hasn't saved anything yet. That's fine.
        if (error.code !== 404) {
          console.error("Failed to load cloud themes:", error);
        }
      }
    };

    fetchCloudThemes();
  }, [user]);

  // 2. Save themes to Cloud
  const saveToCloud = async (newThemes) => {
    if (!user?.$id) return;

    const themeString = JSON.stringify(newThemes);

    try {
      // Try to UPDATE existing document
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        user.$id,
        { savedThemes: themeString }
      );
      console.log("Synced to Appwrite Cloud ✅");
    } catch (error) {
      // If update fails (404), CREATE the document
      if (error.code === 404) {
        await databases.createDocument(
          DATABASE_ID,
          COLLECTION_ID,
          user.$id, // We use User ID as Document ID so it's easy to find
          { savedThemes: themeString }
        );
        console.log("Created new Cloud Save ✅");
      } else {
        console.error("Save failed:", error);
      }
    }
  };

  // -----------------------------
  // UTILITIES & HANDLERS
  // -----------------------------
  const normalizeEmotion = (emotion) => {
    const e = emotion.toLowerCase();
    const map = {
      happy: "joy", joy: "joy", sad: "sadness", sadness: "sadness",
      angry: "anger", anger: "anger", fearful: "fear", fear: "fear",
      surprised: "surprise", surprise: "surprise", disgust: "disgust",
      neutral: "neutral", love: "love", affection: "love", romantic: "love",
      crush: "love", heart: "love",
    };
    if (["love", "romantic", "affection", "heart", "crush"].some((w) => e.includes(w))) return "love";
    return map[e] || e;
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Voice not supported");
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      return;
    }
    const r = new SpeechRecognition();
    r.onstart = () => setIsListening(true);
    r.onresult = (e) => setInput(e.results[0][0].transcript);
    r.onend = () => setIsListening(false);
    r.start();
    recognitionRef.current = r;
  };

  const detectMood = async () => {
    // FORCE LOGIN: If no user, show login modal
    if (!user) {
        setShowLogin(true);
        return;
    }
    
    if (!input.trim()) return alert("Type or speak your mood 🎤");
    const lower = input.toLowerCase();
    const loveWords = ["love", "romantic", "affection", "heart", "crush"];
    if (loveWords.some((word) => lower.includes(word))) {
      setMood("love");
      setTheme(moodThemes["love"]);
      return;
    }

    try {
      const res = await axios.post("https://feelify-of1k.onrender.com/api/detect-mood", { text: input });
      const best = res.data[0].reduce((a, b) => (a.score > b.score ? a : b));
      const normalized = normalizeEmotion(best.label.toLowerCase());
      setMood(normalized);
      setTheme(moodThemes[normalized] || defaultTheme);
    } catch (err) {
      console.error("Mood detection error:", err);
      alert("Error detecting mood");
    }
  };

  const detectFromCamera = async () => {
    // FORCE LOGIN
    if (!user) {
        setShowLogin(true);
        return;
    }

    if (!cameraActive) return alert("Turn on camera first 📷");
    const detected = await detectCameraMoodOnce();
    if (detected) {
      const normalized = normalizeEmotion(detected.toLowerCase());
      setMood(normalized);
      setTheme(moodThemes[normalized] || defaultTheme);
    }
  };

  const saveCurrentTheme = async () => {
    if (!user) return setShowLogin(true);
    if (!mood) return alert("Detect mood first!");
    if (savedThemes.some((t) => t.mood === mood)) return alert("Already saved!");

    const updated = [...savedThemes, { mood, ...theme }];
    setSavedThemes(updated);
    localStorage.setItem("savedThemes", JSON.stringify(updated));
    
    // 🔥 SYNC TO APPWRITE
    await saveToCloud(updated);
  };

  const removeTheme = async (i) => {
    const u = savedThemes.filter((_, x) => x !== i);
    setSavedThemes(u);
    localStorage.setItem("savedThemes", JSON.stringify(u));
    // 🔥 SYNC TO APPWRITE
    await saveToCloud(u);
  };

  const clearAllThemes = async () => {
    localStorage.removeItem("savedThemes");
    setSavedThemes([]);
    // 🔥 SYNC TO APPWRITE
    await saveToCloud([]);
  };

  const exportThemes = () => {
    if (!savedThemes.length) return alert("Nothing to export");
    const blob = new Blob([JSON.stringify(savedThemes, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "saved_themes.json";
    link.click();
  };

  const applyTheme = (t) => {
    setTheme(t);
    setMood(t.mood);
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <motion.div
      style={{ background: theme.gradient, minHeight: "100vh", paddingTop: "80px" }}
      className="flex flex-col items-center"
    >
      <motion.div
        className="backdrop-blur-lg bg-white/20 rounded-2xl shadow-xl p-6 w-[550px] max-w-[90%] text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Mood Display */}
        <motion.div
          key={mood || "default"}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-5"
        >
          {mood ? (
            <>
              <h2 className="text-3xl font-extrabold text-white drop-shadow">
                {moodEmojis[mood]} {mood.toUpperCase()}
              </h2>
              <p className="text-white/90 mt-1 text-lg italic">{theme.description}</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white drop-shadow mb-1">
                {defaultTheme.description}
              </h2>
            </>
          )}
        </motion.div>

        {/* Input + Mic + Camera */}
        <div className="relative w-full mb-4">
          <input
            className="w-full p-3 pr-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-black placeholder-black/70 text-center focus:outline-none focus:ring-2 focus:ring-white/50 transition"
            placeholder="Type how you feel..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          {/* Mic */}
          <motion.button
            onClick={startVoiceInput}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={`absolute right-12 top-1/2 -translate-y-1/2 text-xl ${
              isListening ? "text-red-400 drop-shadow-[0_0_8px_#ff4d4d]" : "text-white hover:text-red-300"
            }`}
            title="Speak your mood"
          >
            🎤
          </motion.button>

          {/* Camera */}
          <motion.button
            onClick={() => (cameraActive ? stopCamera() : startCamera())}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-xl ${
              cameraActive ? "text-green-400 drop-shadow-[0_0_8px_#00ff88]" : "text-white hover:text-green-300"
            }`}
            title={cameraActive ? "Stop camera" : "Start camera"}
          >
            📷
          </motion.button>
        </div>

        {/* Camera Preview */}
        <AnimatePresence>
          {cameraActive && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="w-full flex justify-center"
            >
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full rounded-2xl border border-white/40 shadow-lg mt-2 z-10"
                style={{ maxHeight: "240px", objectFit: "cover", backgroundColor: "black" }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Detect Buttons */}
        {cameraActive && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={detectFromCamera}
            className="w-67 py-3 rounded-full font-bold shadow-md transition mt-3"
            style={{
              background: theme.button?.bg || "#ffd369",
              color: theme.button?.text || "#000",
              boxShadow: `0 0 12px ${theme.button?.hover || "#ffd369"}`,
            }}
          >
            🎭 Detect from Camera
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={detectMood}
          className="w-80 py-3 rounded-full font-bold shadow-md transition mt-3"
          style={{
            background: theme.button?.bg || "#fff",
            color: theme.button?.text || "#000",
            boxShadow: `0 0 12px ${theme.button?.hover || "#fff"}`,
          }}
        >
          💫 Detect Mood
        </motion.button>

        {/* Save & Export */}
        <div className="flex gap-3 justify-center mt-5">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={saveCurrentTheme}
            className="px-4 py-2 rounded-lg font-semibold transition"
            style={{
              background: theme.button?.bg || "rgba(255,255,255,0.7)",
              color: theme.button?.text || "#000",
              boxShadow: `0 0 10px ${theme.button?.hover || "rgba(255,255,255,0.6)"}`,
            }}
          >
            💾 Save Theme
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportThemes}
            className="px-4 py-2 rounded-lg font-semibold transition"
            style={{
              background: theme.button?.bg || "rgba(255,255,255,0.7)",
              color: theme.button?.text || "#000",
              boxShadow: `0 0 10px ${theme.button?.hover || "rgba(255,255,255,0.6)"}`,
            }}
          >
            📤 Export
          </motion.button>
        </div>

        {/* Saved Themes List */}
        {savedThemes.length > 0 && (
          <>
            <button className="mt-4 text-white underline" onClick={() => setShowSaved((x) => !x)}>
              {showSaved ? "Hide Saved ▲" : "View Saved ▼"}
            </button>
            <AnimatePresence>
              {showSaved && (
                <motion.div className="bg-white/10 rounded-xl p-3 mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <button className="text-xs bg-white/30 px-2 py-1 rounded mb-2" onClick={clearAllThemes}>
                    Clear All
                  </button>
                  {savedThemes.map((t, i) => (
                    <div
                      key={i}
                      className="bg-white/20 p-2 rounded mb-1 flex justify-between items-center"
                      onClick={() => applyTheme(t)}
                    >
                      <span>{moodEmojis[t.mood]} {t.mood.toUpperCase()}</span>
                      <button
                        className="bg-white/40 px-2 py-1 text-xs rounded"
                        onClick={(e) => { e.stopPropagation(); removeTheme(i); }}
                      >
                        ✖
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </motion.div>

      {/* Modals */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showProfile && <ProfilePanel onClose={() => setShowProfile(false)} />}
    </motion.div>
  );
}

export default App;
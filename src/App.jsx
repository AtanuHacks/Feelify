import axios from "axios";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useCameraMood from "./useCameraMood";

function App() {
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

  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  const moodThemes = {
    joy: { gradient: "linear-gradient(135deg,#f9d423,#ff4e50)", description: "Bright and cheerful!" },
    sadness: { gradient: "linear-gradient(135deg,#83a4d4,#b6fbff)", description: "Calm and reflective." },
    anger: { gradient: "linear-gradient(135deg,#ff416c,#ff4b2b)", description: "Intense and passionate." },
    fear: { gradient: "linear-gradient(135deg,#8360c3,#2ebf91)", description: "Cautious and alert." },
    surprise: { gradient: "linear-gradient(135deg,#ff9a9e,#fad0c4)", description: "Curious and amazed." },
    love: { gradient: "linear-gradient(135deg,#ff758c,#ff7eb3)", description: "Warm and affectionate." },
    neutral: { gradient: "linear-gradient(135deg,#89f7fe,#66a6ff)", description: "Balanced and steady." },
    disgust: { gradient: "linear-gradient(135deg,#76b852,#8DC26F)", description: "Repulsed but aware — facing what feels unpleasant."} 
  };

  const moodEmojis = {
    joy: "😄", sadness: "😢", anger: "😡", fear: "😨",
    surprise: "😲", love: "❤", neutral: "😐"
  };

  const defaultTheme = {
    gradient: "linear-gradient(135deg,#667eea,#764ba2)",
    description: "Welcome to Feelify — Discover your emotional vibe 🌈",
  };

  const [theme, setTheme] = useState(defaultTheme);
  const [savedThemes, setSavedThemes] = useState(() => {
    try { return JSON.parse(localStorage.getItem("savedThemes")) || []; }
    catch { return []; }
  });
  const [showSaved, setShowSaved] = useState(false);

  // Normalize
  const normalizeEmotion = (emotion) => {
    const map = {
      happy: "joy", sad: "sadness", sadness: "sadness",
      angry: "anger", anger: "anger",
      fearful: "fear", fear: "fear",
      surprised: "surprise", surprise: "surprise",
      love: "love", neutral: "neutral"
    };
    return map[emotion] || emotion;
  };

  // 🎤 Voice input
  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Voice not supported");

    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop(); return;
    }

    const r = new SpeechRecognition();
    r.onstart = () => setIsListening(true);
    r.onresult = (e) => setInput(e.results[0][0].transcript);
    r.onend = () => setIsListening(false);
    r.start();
    recognitionRef.current = r;
  };

  // 💬 Text mood detect
  const detectMood = async () => {
    if (!input.trim()) return alert("Type or speak your mood 🎤");

    try {
      const res = await axios.post("http://localhost:5000/api/detect-mood", { text: input });
      const best = res.data[0].reduce((a,b)=> (a.score > b.score ? a : b));
      const normalized = normalizeEmotion(best.label.toLowerCase());
      setMood(normalized);
      setTheme(moodThemes[normalized] || defaultTheme);
    } catch {
      alert("Error detecting mood");
    }
  };

  // 🎭 Camera mood detect
  const detectFromCamera = async () => {
    if (!cameraActive) return alert("Turn on camera first 📷");
    const detected = await detectCameraMoodOnce();
    if (detected) {
      const normalized = normalizeEmotion(detected.toLowerCase());
      setMood(normalized);
      setTheme(moodThemes[normalized] || defaultTheme);
    }
  };

  // 💾 Save / Export
  const saveCurrentTheme = () => {
    if (!mood) return alert("Detect mood first!");
    if (savedThemes.some(t => t.mood === mood)) return alert("Already saved!");
    const updated = [...savedThemes, { mood, ...theme }];
    setSavedThemes(updated);
    localStorage.setItem("savedThemes", JSON.stringify(updated));
  };

  const exportThemes = () => {
    if (!savedThemes.length) return alert("Nothing to export");
    const blob = new Blob([JSON.stringify(savedThemes,null,2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "saved_themes.json";
    link.click();
  };

  const applyTheme = (t) => { setTheme(t); setMood(t.mood); };
  const removeTheme = (i) => {
    const u = savedThemes.filter((_,x)=>x!==i);
    setSavedThemes(u);
    localStorage.setItem("savedThemes", JSON.stringify(u));
  };
  const clearAllThemes = () => { localStorage.removeItem("savedThemes"); setSavedThemes([]); };

  return (
    <motion.div
      style={{ background: theme.gradient, minHeight: "100vh", paddingTop: "80px" }}
      className="flex flex-col items-center"
    >
      {/* 🪞 Glass Card */}
<motion.div
  className="backdrop-blur-lg bg-white/20 rounded-2xl shadow-xl p-6 w-[550px] max-w-[90%] text-center"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>

  {/* 🌟 Mood Display (Top Section) */}
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

  {/* 🌈 Input + Mic + Camera */}
  <div className="relative w-full mb-4">
    <input
      className="w-full p-3 pr-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-black placeholder-black/70 text-center focus:outline-none focus:ring-2 focus:ring-white/50 transition"
      placeholder="Type how you feel..."
      value={input}
      onChange={(e) => setInput(e.target.value)}
    />

    {/* 🎤 Mic */}
    <motion.button
      onClick={startVoiceInput}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      className={`absolute right-12 top-1/2 -translate-y-1/2 text-xl ${
        isListening
          ? "text-red-400 drop-shadow-[0_0_8px_#ff4d4d]"
          : "text-white hover:text-red-300"
      }`}
      title="Speak your mood"
    >
      🎤
    </motion.button>

    {/* 📷 Camera */}
    <motion.button
      onClick={() => (cameraActive ? stopCamera() : startCamera())}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      className={`absolute right-3 top-1/2 -translate-y-1/2 text-xl ${
        cameraActive
          ? "text-green-400 drop-shadow-[0_0_8px_#00ff88]"
          : "text-white hover:text-green-300"
      }`}
      title={cameraActive ? "Stop camera" : "Start camera"}
    >
      📷
    </motion.button>
  </div>

  {/* 🎥 Camera Preview */}
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

  {/* 🎭 Detect from Camera */}
  {cameraActive && (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={detectFromCamera}
      className="w-67 py-3 rounded-full font-bold bg-yellow-300 hover:bg-yellow-400 text-black shadow-md transition mt-3"
    >
      🎭 Detect from Camera
    </motion.button>
  )}

  {/* 💫 Detect Mood */}
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={detectMood}
    className="w-80 py-3 rounded-full font-bold bg-indigo-400 hover:bg-indigo-500 text-black shadow-md transition mt-3"
  >
    💫 Detect Mood
  </motion.button>

  {/* 💾 Save & Export */}
  <div className="flex gap-3 justify-center mt-5">
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      onClick={saveCurrentTheme}
      className="bg-white/70 px-4 py-2 rounded-lg text-gray-800 font-semibold hover:bg-white hover:shadow-[0_0_10px_rgba(255,255,255,0.6)] transition"
    >
      💾 Save Theme
    </motion.button>

    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      onClick={exportThemes}
      className="bg-white/70 px-4 py-2 rounded-lg text-gray-800 font-semibold hover:bg-white hover:shadow-[0_0_10px_rgba(255,255,255,0.6)] transition"
    >
      📤 Export
    </motion.button>
  </div>

  {/* 📂 Saved Themes */}
  {savedThemes.length > 0 && (
    <>
      <button className="mt-4 text-white underline" onClick={()=>setShowSaved(x=>!x)}>
        {showSaved ? "Hide Saved ▲" : "View Saved ▼"}
      </button>

      <AnimatePresence>
        {showSaved && (
          <motion.div
            className="bg-white/10 rounded-xl p-3 mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button className="text-xs bg-white/30 px-2 py-1 rounded mb-2" onClick={clearAllThemes}>
              Clear All
            </button>
            {savedThemes.map((t,i)=>(
              <div key={i} className="bg-white/20 p-2 rounded mb-1 flex justify-between items-center" onClick={()=>applyTheme(t)}>
                <span>{moodEmojis[t.mood]} {t.mood.toUpperCase()}</span>
                <button className="bg-white/40 px-2 py-1 text-xs rounded" onClick={(e)=>{e.stopPropagation(); removeTheme(i);}}>✖</button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )}
</motion.div>

    </motion.div>
  );
}

export default App;

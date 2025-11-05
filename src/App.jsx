import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useCameraMood from "./useCameraMood";

function App() {
  const [mood, setMood] = useState("");
  const [input, setInput] = useState("");

  const { videoRef, cameraMood, cameraActive, startCamera, stopCamera, detectCameraMoodOnce } = useCameraMood();

  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  // ✅ Mood themes
  const moodThemes = {
    joy: { gradient: "linear-gradient(135deg,#f9d423,#ff4e50)", description: "Bright and cheerful!" },
    sadness: { gradient: "linear-gradient(135deg,#83a4d4,#b6fbff)", description: "Calm and reflective." },
    anger: { gradient: "linear-gradient(135deg,#ff416c,#ff4b2b)", description: "Intense and passionate." },
    fear: { gradient: "linear-gradient(135deg,#8360c3,#2ebf91)", description: "Cautious and alert." },
    surprise: { gradient: "linear-gradient(135deg,#ff9a9e,#fad0c4)", description: "Curious and amazed." },
    love: { gradient: "linear-gradient(135deg,#ff758c,#ff7eb3)", description: "Warm and affectionate." },
    neutral: { gradient: "linear-gradient(135deg,#89f7fe,#66a6ff)", description: "Balanced and steady." },
  };

  // ✅ Emoji map
  const moodEmojis = {
    joy: "😄", sadness: "😢", anger: "😡", fear: "😨",
    surprise: "😲", love: "❤️", neutral: "😐"
  };

  // ✅ Default theme
  const defaultTheme = {
    gradient: "linear-gradient(135deg,#667eea,#764ba2)",
    description: "Welcome to Feelify — Discover your emotional vibe 🌈"
  };

  const [theme, setTheme] = useState(defaultTheme);
  const [savedThemes, setSavedThemes] = useState(() => {
    try { return JSON.parse(localStorage.getItem("savedThemes")) || []; }
    catch { return []; }
  });
  const [showSaved, setShowSaved] = useState(false);

  // ✅ Emotion normalization function
  const normalizeEmotion = (emotion) => {
    const map = {
      happy: "joy",
      sad: "sadness",
      sadness: "sadness",
      angry: "anger",
      anger: "anger",
      fearful: "fear",
      fear: "fear",
      surprised: "surprise",
      surprise: "surprise",
      love: "love",
      neutral: "neutral"
    };
    return map[emotion] || emotion;
  };

  // 🎤 Voice Input
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

  // ✅ Detect mood from text
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

  // ✅ Detect mood from camera (manual)
  const detectFromCamera = async () => {
    if (!cameraActive) return alert("Turn on camera first 📷");

    await detectCameraMoodOnce();
    const normalized = normalizeEmotion(cameraMood?.toLowerCase());
    setMood(normalized);
    setTheme(moodThemes[normalized] || defaultTheme);
  };

  // ✅ Save Theme
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

  const clearAllThemes = () => {
    localStorage.removeItem("savedThemes");
    setSavedThemes([]);
  };

  return (
    <motion.div style={{ background: theme.gradient, minHeight: "100vh", paddingTop: "80px" }}>
      <motion.div className="backdrop-blur-lg bg-white/20 rounded-2xl shadow-xl p-6 text-center w-[450px] mx-auto">

        {/* Heading */}
        <p className="text-3xl font-extrabold text-black mb-6">
          Let your emotions shape the colors of your world ✨
        </p>

        {/* Title w/ emoji */}
        <p className="text-white/90 mb-4">{theme.description}</p>

        {/* Input + Mic + Camera inside box */}
        <div className="relative mb-3">
          <input 
            className="w-full p-3 pr-20 rounded-lg border bg-transparent text-white text-center"
            placeholder="Type your mood..."
            value={input}
            onChange={(e)=>setInput(e.target.value)}
          />

          {/* Mic Button */}
          <button
            onClick={startVoiceInput}
            className={`absolute right-12 top-1/2 -translate-y-1/2 text-xl transition ${
              isListening ? "text-red-400 scale-110" : "text-white hover:text-yellow-300"
            }`}
            title="Speak your mood"
          >
            🎤
          </button>

          {/* Camera Icon Button */}
          <button
            onClick={() => cameraActive ? stopCamera() : startCamera()}
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-xl transition ${
              cameraActive ? "text-green-400 scale-110" : "text-white hover:text-blue-300"
            }`}
            title={cameraActive ? "Stop camera" : "Start camera"}
          >
            📷
          </button>
        </div>


        {/* Camera */}
        <video ref={videoRef} autoPlay muted className="w-full rounded-lg border mb-2"/>


        {/* 🎭 Camera detect button */}
        {cameraActive && (
          <motion.button whileHover={{ scale: 1.05 }} onClick={detectFromCamera}
            className="w-full mt-2 py-2 rounded-xl font-bold"
            style={{ background:"#ffd369", color:"#333", boxShadow:"0 0 12px #ffd369" }}>
            🎭 Detect from Camera
          </motion.button>
        )}

        {/* 💫 Text detect button */}
        <motion.button whileHover={{ scale: 1.05 }} onClick={detectMood}
          className="w-full mt-2 py-2 rounded-xl font-bold"
          style={{ background:"#fff", color:"#000", boxShadow:"0 0 12px #fff" }}>
          💫 Detect Mood
        </motion.button>

        {/* Save & Export */}
        <div className="flex gap-2 justify-center mt-4">
          <button className="bg-white/70 px-4 py-2 rounded-lg" onClick={saveCurrentTheme}>💾 Save Theme</button>
          <button className="bg-white/70 px-4 py-2 rounded-lg" onClick={exportThemes}>📤 Export</button>
        </div>

        {/* Saved Themes */}
        {savedThemes.length > 0 && (
          <>
            <button className="mt-4 text-white underline" onClick={()=>setShowSaved(x=>!x)}>
              {showSaved ? "Hide Saved ▲" : "View Saved ▼"}
            </button>

            <AnimatePresence>
              {showSaved && (
                <motion.div className="bg-white/10 rounded-xl p-3 mt-3">
                  <button className="text-xs bg-white/30 px-2 py-1 rounded mb-2"
                    onClick={clearAllThemes}>Clear All</button>

                  {savedThemes.map((t,i)=>(
                    <div key={i} className="bg-white/20 p-2 rounded mb-1 flex justify-between"
                      onClick={()=>applyTheme(t)}>
                      <span>{moodEmojis[t.mood]} {t.mood.toUpperCase()}</span>
                      <button className="bg-white/40 px-2 py-1 text-xs rounded"
                        onClick={(e)=>{e.stopPropagation(); removeTheme(i);}}>
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
    </motion.div>
  );
}

export default App;

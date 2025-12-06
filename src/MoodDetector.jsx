import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const MoodDetector = () => {
  const [input, setInput] = useState("");
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // 🔑 Paste your Gemini API key here
  const genAI = new GoogleGenerativeAI(API_KEY);

  const detectMood = async () => {
  if (!input.trim()) return alert("Please enter how you feel!");
  setLoading(true);

  try {
    const response = await fetch("/.netlify/functions/detectMood", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });

    const data = await response.json();
    if (data.mood) setMood(data.mood);
    else alert("Could not detect mood. Try again!");
  } catch (err) {
    console.error(err);
    alert("Server error. Try again!");
  } finally {
    setLoading(false);
  }
};

  const getMoodColor = (mood) => {
    switch (mood) {
      case "happy": return "bg-yellow-300";
      case "sad": return "bg-blue-300";
      case "angry": return "bg-red-400";
      case "calm": return "bg-green-200";
      case "excited": return "bg-pink-300";
      default: return "bg-gray-200";
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center text-center transition-all duration-500 ${getMoodColor(mood)}`}>
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Feelify 💫</h1>

      <textarea
        className="border-2 border-gray-400 rounded-xl p-4 w-80 h-24 mb-4 text-lg focus:ring focus:ring-indigo-400"
        placeholder="Type how you feel..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>

      <button
        onClick={detectMood}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-xl font-semibold shadow-md transition-all"
      >
        {loading ? "Detecting..." : "Detect Mood"}
      </button>

      {mood && (
        <div className="mt-6 text-2xl font-medium">
          You seem <span className="font-bold capitalize">{mood}</span> today! 🌈
        </div>
      )}
    </div>
  );
};

export default MoodDetector;
import axios from "axios";
import { useState } from "react";

function App() {
  const [mood, setMood] = useState("neutral");
  const [input, setInput] = useState("");
  const [theme, setTheme] = useState({
    color: "#e0e0e0",
    description: "Calm and balanced.",
  });

  const moodThemes = {
    joy: { color: "#FFD700", description: "Bright and cheerful!" },
    sadness: { color: "#87CEFA", description: "Calm and reflective." },
    anger: { color: "#FF6347", description: "Intense and passionate." },
    fear: { color: "#9370DB", description: "Cautious and alert." },
    surprise: { color: "#FFA500", description: "Curious and amazed." },
    love: { color: "#FF69B4", description: "Warm and affectionate." },
    neutral: { color: "#B0C4DE", description: "Balanced and steady." },
  };

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
            Authorization: 'Bearer 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' // Optional for free usage
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

  return (
    <div
      style={{
        backgroundColor: theme.color,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        transition: "background-color 0.5s ease",
      }}
    >
      <h1 className="text-3xl font-bold">Feelify 🌈</h1>
      <input
        type="text"
        placeholder="Type how you feel..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="p-2 m-3 rounded border text-center"
      />
      <button
        onClick={detectMood}
        className="bg-white text-black px-4 py-2 rounded shadow hover:bg-gray-200 transition"
      >
        Detect Mood
      </button>
      <div className="mt-4 text-center">
        <h2 className="text-xl font-semibold">Mood: {mood}</h2>
        <p>{theme.description}</p>
      </div>
    </div>
  );
}

export default App;
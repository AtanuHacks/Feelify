// server.js
import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/detect-mood", async (req, res) => {
  const { text } = req.body;

  try {
    const hfResponse = await axios.post(
      "https://router.huggingface.co/hf-inference/models/j-hartmann/emotion-english-distilroberta-base",
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        },
      }
    );

        console.log("HF response:", hfResponse.data);
        res.json(hfResponse.data);
        
  } catch (err) {
    console.error("Backend error:", err.response?.data || err.message);
    res.status(500).json({ error: "HF API failed" });
  }
});

app.listen(5000, () => console.log("✅ Backend running on port 5000"));
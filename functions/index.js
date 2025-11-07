const functions = require("firebase-functions");
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// 🔹 Hugging Face API key (we will set it safely next step)
const HF_KEY = functions.config().hf?.key || "";

// 🔹 Route
app.post("/detect-mood", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "No text provided" });

  try {
    const hfResponse = await axios.post(
      "https://router.huggingface.co/hf-inference/models/j-hartmann/emotion-english-distilroberta-base",
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer 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`,
        },
      }
    );

    res.json(hfResponse.data);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Hugging Face API failed" });
  }
});

// 🔹 Export function
exports.api = functions.https.onRequest(app);

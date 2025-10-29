import fetch from "node-fetch";

export const handler = async (event) => {
  const { input } = JSON.parse(event.body);
  const API_KEY = "AIzaSyCODOrRg2QZ28epbX84EBECnUO9Zj26WoM";

  const prompt = `Analyze the emotion in this sentence and return only one mood word: happy, sad, angry, calm, neutral, excited. Sentence: "${input}"`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    const mood =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.toLowerCase() || "neutral";

    return {
      statusCode: 200,
      body: JSON.stringify({ mood }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to detect mood" }),
    };
  }
};
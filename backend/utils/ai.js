
const axios = require("axios");

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY missing in .env file");
}

const generateWithAI = async (prompt) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("❌ AI Error:", error.response?.data || error.message);
    throw new Error("AI generation failed");
  }
};

module.exports = generateWithAI;

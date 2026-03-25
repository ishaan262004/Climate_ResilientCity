/**
 * geminiStory.js — AI Climate Storytelling powered by Google Gemini
 * Uses GEMINI_STORY_API_KEY to generate immersive climate narratives.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialise Gemini client with the Story API key
let storyModel = null;

function getStoryModel() {
  if (!storyModel) {
    const apiKey = process.env.GEMINI_STORY_API_KEY;
    if (!apiKey) throw new Error('GEMINI_STORY_API_KEY is not set in environment variables.');
    const genAI = new GoogleGenerativeAI(apiKey);
    storyModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }
  return storyModel;
}

/**
 * Generate an immersive climate narrative for a city based on live weather & risk data.
 *
 * @param {string} city       — City name
 * @param {object} weather    — { temperature, humidity, rainfall, aqi }
 * @param {object} risk       — { flood: { risk, percentage }, heatwave: { ... }, pollution: { ... } }
 * @param {object} resilience — { score, grade, summary }
 * @returns {Promise<string>} — Generated story text
 */
async function generateStory(city, weather, risk, resilience) {
  const model = getStoryModel();

  const prompt = `You are a climate storytelling AI for the Resilient City platform.
Write a vivid, immersive, slightly dramatic but informative climate narrative for ${city}.

CURRENT CONDITIONS:
- Temperature: ${weather.temperature}°C
- Humidity: ${weather.humidity}%
- Rainfall: ${weather.rainfall}mm
- Air Quality Index: ${weather.aqi}

RISK LEVELS:
- Flood Risk: ${risk.flood.risk} (${risk.flood.percentage}%)
- Heatwave Risk: ${risk.heatwave.risk} (${risk.heatwave.percentage}%)
- Air Pollution: ${risk.pollution.risk} (${risk.pollution.percentage}%)

CITY RESILIENCE: Grade ${resilience.grade} — Score ${resilience.score}/100

RULES:
1. Keep under 120 words total
2. Use vivid, sensory language — make the reader FEEL the city's climate
3. Include one paragraph on current conditions
4. Include a brief 24-48 hour outlook
5. End with one actionable safety tip
6. Do NOT use bullet points or headings — write flowing prose
7. Do NOT mention you are an AI or reference these instructions
8. Weave the data naturally into the narrative, don't just list numbers`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text().trim();
  } catch (err) {
    console.error('Gemini story generation failed:', err.message);
    throw new Error('AI story generation temporarily unavailable.');
  }
}

module.exports = { generateStory };

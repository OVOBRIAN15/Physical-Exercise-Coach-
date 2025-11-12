
import { GoogleGenAI } from "@google/genai";
import { User } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development environments where the key might not be set.
  // In a production environment, the key is expected to be present.
  console.warn("API_KEY is not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateFitnessPlan = async (prompt: string): Promise<string> => {
  if (!API_KEY) {
    return Promise.resolve("API Key not configured. Please set the API_KEY environment variable.");
  }
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a friendly, motivating fitness coach. Your tone should be encouraging and personal, like you're texting a friend. Generate a concise, well-structured weekly fitness and nutrition plan based on the user's goals. Use markdown for formatting. Keep it simple and direct. You can add one or two emojis like ❤️‍🔥 or 🫶 to add some personality, but don't overdo it. User's goals: "${prompt}"`,
      config: {
        temperature: 0.75,
        topP: 0.95,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating fitness plan:", error);
    return "Sorry, I couldn't generate a plan at the moment. Please try again later.";
  }
};

export const generateDailyTip = async (user: User): Promise<string> => {
    if (!API_KEY) {
        return Promise.resolve("Sorry, I can't generate a tip right now (API Key not configured).");
    }

    const userContext = `
        My name is ${user.name || 'a user'}. 
        I am ${user.age || 'an unspecified age'} years old. 
        My main fitness goal is: "${user.fitnessGoals || 'get fit'}".
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Based on this user's profile, give me one short, motivational, and actionable fitness or nutrition tip for today. Keep it under 40 words. Do not greet the user, just provide the tip directly. User Profile: ${userContext}`,
            config: {
                systemInstruction: "You are a friendly and concise AI fitness coach who provides one single, actionable tip per day. Your tone is supportive and encouraging.",
                temperature: 0.8,
                topP: 1.0,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating daily tip:", error);
        return "Sorry, I couldn't generate a tip at the moment. Please try again later.";
    }
};

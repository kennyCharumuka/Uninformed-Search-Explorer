
import { GoogleGenAI } from "@google/genai";
import { AlgorithmType } from "../types";

export async function getAlgorithmDeepDive(algorithm: AlgorithmType, topic: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    As a world-class computer science professor, explain the following topic about ${algorithm} search algorithm:
    "${topic}"
    
    Keep the explanation:
    1. Technically accurate but accessible.
    2. Focused on search theory (Completeness, Optimality, Complexity).
    3. Use Markdown formatting.
    4. Maximum 250 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I couldn't process that request right now. Please check your connection or try again.";
  }
}

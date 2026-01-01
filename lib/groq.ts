import Groq from "groq-sdk";

export const MODELS = {
  VERSATILE: "llama-3.3-70b-versatile", // Updated from llama-3.1-70b-versatile (decommissioned)
  INSTANT: "llama-3.1-8b-instant", // Still available
  // Alternative models if needed:
  // VERSATILE: "mixtral-8x7b-32768",
  // VERSATILE: "llama-3.1-70b-versatile", // Deprecated
} as const;

let groqInstance: Groq | null = null;

export function getGroqClient(): Groq {
  if (!groqInstance) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not set in environment variables");
    }
    groqInstance = new Groq({
      apiKey,
    });
  }
  return groqInstance;
}

export const groq = {
  get chat() {
    return getGroqClient().chat;
  },
};


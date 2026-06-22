import Groq from "groq-sdk";

let groqClient = null;

export function getGroqClient() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("Missing GROQ_API_KEY environment variable.");
  }
  if (!groqClient) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqClient;
}

// Model used for both extraction and question generation.
// llama-3.3-70b-versatile is Groq's strongest general-purpose model
// as of writing; swap here if the team wants to test others.
export const GROQ_MODEL = "llama-3.3-70b-versatile";

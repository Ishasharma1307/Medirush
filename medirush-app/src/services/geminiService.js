// Gemini AI Service for MediRush Symptom Checker
// Uses Gemini to power intelligent, contextual medical conversations

import { GoogleGenerativeAI } from "@google/generative-ai";

// Using a public demo key pattern — replace with your own Gemini API key
// Get one free at: https://aistudio.google.com/app/apikey
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const SYSTEM_PROMPT = `You are MediRush AI, an advanced medical triage assistant embedded in a healthcare app. Your role is to have a natural, empathetic conversation with patients to understand their symptoms and health situation.

BEHAVIOR RULES:
1. Ask ONE focused follow-up question at a time based on what the user just said
2. Be conversational, warm, and reassuring — not robotic or clinical
3. Adapt your questions to what the patient tells you (if they mention fever, ask about temperature; if pain, ask location and severity)
4. After 3-4 exchanges, you will have enough context — then say EXACTLY: "ANALYSIS_READY" followed by a structured JSON summary

QUESTION STRATEGY (adapt dynamically):
- Start: Understand the main complaint
- Follow up: Severity, duration, associated symptoms
- Context: Age, relevant medical history, current medications
- Clarify anything unusual or concerning

WHEN YOU HAVE ENOUGH INFO (after ~3-4 exchanges), respond with EXACTLY this format:
ANALYSIS_READY
{"symptoms": "detailed symptom description", "duration": "how long", "severity": "mild/moderate/severe", "age": "if mentioned", "history": "any medical history", "medications": "any medications", "fullSummary": "complete natural language medical summary for ML model analysis"}

IMPORTANT: 
- Never diagnose. Say things like "this could indicate..." or "let me analyze this"
- If patient mentions chest pain, difficulty breathing, severe bleeding, unconsciousness — immediately respond with: EMERGENCY_DETECTED
- Keep each response SHORT (1-2 sentences + question). Be natural and human.`;

let genAI = null;
let chatSession = null;

export const initGemini = () => {
  if (!GEMINI_API_KEY) {
    console.warn("Gemini API key not found. Set VITE_GEMINI_API_KEY in .env");
    return false;
  }
  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    return true;
  } catch (e) {
    console.error("Failed to init Gemini:", e);
    return false;
  }
};

export const startMedicalChat = () => {
  if (!genAI) {
    const ok = initGemini();
    if (!ok) return false;
  }
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT,
    });
    chatSession = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 300,
        temperature: 0.7,
      },
    });
    return true;
  } catch (e) {
    console.error("Failed to start chat:", e);
    return false;
  }
};

export const sendMessageToGemini = async (userMessage) => {
  if (!chatSession) {
    throw new Error("Chat not initialized");
  }
  const result = await chatSession.sendMessage(userMessage);
  const text = result.response.text();
  return text;
};

export const isGeminiAvailable = () => !!GEMINI_API_KEY;

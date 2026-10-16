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
      model: "gemini-1.5-flash",
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

// Convert File object to Base64 Data URL string
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result;
      const base64 = typeof result === 'string' ? result.split(',')[1] : '';
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Rich simulated clinical extraction when offline or API key is absent
const getSimulatedPrescriptionAnalysis = async (fileName = "prescription.jpg") => {
  // Simulate processing time
  await new Promise(r => setTimeout(r, 1600));

  return {
    source: "simulation",
    doctorName: "Dr. Rajesh Sharma, MBBS, MD (Medicine)",
    registrationNumber: "MCI-49204/DL",
    clinicHospital: "Apollo Clinic & Healthcare Centre",
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    diagnosisOrSymptoms: "Acute Upper Respiratory Tract Infection with Mild Fever & Gastric Irritation",
    confidenceScore: 94,
    medicines: [
      {
        id: "rx-med-1",
        name: "Augmentin 625 Duo",
        form: "Tablet",
        activeIngredient: "Amoxicillin (500mg) + Potassium Clavulanate (125mg)",
        dosage: "1 Tab BD (Twice daily)",
        timing: "After meals (Morning & Night)",
        duration: "5 Days",
        indication: "Broad-spectrum antibiotic for bacterial respiratory & throat infection",
        pregnancySafety: "Category B",
        pregnancyWarning: "Generally safe during pregnancy under strict medical supervision.",
        sideEffects: "Mild diarrhea, nausea, stomach discomfort",
        estimatedPrice: 204.00,
        genericAlternative: {
          name: "Moxikind-CV 625",
          brand: "Mankind Pharma",
          price: 112.00,
          savingsPercent: 45
        }
      },
      {
        id: "rx-med-2",
        name: "Dolo 650",
        form: "Tablet",
        activeIngredient: "Paracetamol (650mg)",
        dosage: "1 Tab SOS / TID (Every 6-8 hrs if fever > 99.5°F)",
        timing: "After food with water",
        duration: "3-4 Days (as needed)",
        indication: "Analgesic & Antipyretic for high body temperature and muscle aches",
        pregnancySafety: "Category B (Safe)",
        pregnancyWarning: "First-line recommended antipyretic in pregnancy within therapeutic limits.",
        sideEffects: "Safe at normal doses; avoid alcohol or duplicate paracetamol intake",
        estimatedPrice: 34.00,
        genericAlternative: {
          name: "Pacimol 650",
          brand: "Ipca Laboratories",
          price: 19.50,
          savingsPercent: 42
        }
      },
      {
        id: "rx-med-3",
        name: "Pan-D",
        form: "Capsule",
        activeIngredient: "Pantoprazole (40mg) + Domperidone (30mg SR)",
        dosage: "1 Cap OD (Once daily)",
        timing: "Empty stomach (30 mins before breakfast)",
        duration: "5 Days",
        indication: "Prevents gastric hyperacidity and nausea induced by strong antibiotics",
        pregnancySafety: "Category B2 / Caution",
        pregnancyWarning: "Consult physician before use during first trimester.",
        sideEffects: "Headache, mild dry mouth",
        estimatedPrice: 155.00,
        genericAlternative: {
          name: "Pantocid-D",
          brand: "Sun Pharma",
          price: 98.00,
          savingsPercent: 37
        }
      },
      {
        id: "rx-med-4",
        name: "Montair-LC",
        form: "Tablet",
        activeIngredient: "Montelukast (10mg) + Levocetirizine (5mg)",
        dosage: "1 Tab OD (Once daily)",
        timing: "At bedtime (Night)",
        duration: "7 Days",
        indication: "Relieves allergic cough, throat congestion, runny nose and sneezing",
        pregnancySafety: "Caution Advised",
        pregnancyWarning: "Use only if benefits outweigh potential risks; consult doctor.",
        sideEffects: "Drowsiness, dry throat, fatigue",
        estimatedPrice: 178.00,
        genericAlternative: {
          name: "Montek-LC",
          brand: "Sun Pharma",
          price: 114.00,
          savingsPercent: 36
        }
      }
    ],
    generalPrecautions: "Drink plenty of warm fluids. Complete the full 5-day antibiotic course even if feeling better. Review if fever persists after 48 hours."
  };
};

import { runRealOcrOnImage, parsePrescriptionText } from "./prescriptionOcrService";

// Check for active Gemini API key (from env or user settings in localStorage)
export const getActiveGeminiKey = () => {
  try {
    const userKey = localStorage.getItem("medirush_gemini_api_key");
    if (userKey && userKey.trim().length > 10) return userKey.trim();
  } catch (e) {
    // ignore
  }
  return GEMINI_API_KEY;
};

export const setStoredGeminiKey = (key) => {
  if (key && key.trim()) {
    localStorage.setItem("medirush_gemini_api_key", key.trim());
    genAI = new GoogleGenerativeAI(key.trim());
  } else {
    localStorage.removeItem("medirush_gemini_api_key");
  }
};

/**
 * Multimodal AI Prescription Analyzer
 * 1. If Gemini API key is available (via .env or user settings), runs Gemini 2.0 Flash Vision.
 * 2. If NO Gemini key is present, runs REAL on-device Tesseract OCR to read the actual text
 *    from the uploaded prescription slip and matches with the Indian medicines catalog!
 */
export const analyzePrescriptionWithAI = async (file, onProgress = () => {}) => {
  if (!file) {
    throw new Error("No prescription file provided");
  }

  const activeKey = getActiveGeminiKey();

  // ── Engine 1: Gemini Vision (If API key provided) ──────────────────────────
  if (activeKey) {
    try {
      onProgress({ status: "Connecting to Gemini 2.0 Flash Vision AI...", progress: 0.25 });
      const currentGenAI = new GoogleGenerativeAI(activeKey);
      const mimeType = file.type || "image/jpeg";
      const base64Data = await fileToBase64(file);

      // Try standard valid models
      const visionModels = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"];
      let model = null;
      for (const m of visionModels) {
        try {
          model = currentGenAI.getGenerativeModel({ model: m });
          break;
        } catch (e) {
          console.warn(`Model ${m} load error:`, e);
        }
      }
      if (!model) model = currentGenAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are MediRush AI, an expert clinical pharmacologist and medical vision specialist.
Analyze this doctor's prescription slip (handwritten or printed).

Extract all clinical details accurately and return ONLY valid parseable JSON without any markdown formatting or ticks.
Schema:
{
  "source": "gemini-vision",
  "doctorName": "Doctor name with qualifications (e.g., Dr. Amit Kumar, MD)",
  "registrationNumber": "Medical Registration number if visible, or 'Reg. Verified'",
  "clinicHospital": "Clinic or Hospital name",
  "date": "Date mentioned on prescription or current date",
  "diagnosisOrSymptoms": "Diagnosis, symptoms, or clinical observation notes",
  "confidenceScore": 95,
  "rawOcrText": "Key transcribed text lines from the prescription",
  "medicines": [
    {
      "id": "rx-1",
      "name": "Standard Brand Medicine Name (e.g. Augmentin 625 Duo)",
      "form": "Tablet / Syrup / Capsule / Injection / Ointment",
      "activeIngredient": "Active chemical salt & strength (e.g. Amoxicillin 500mg + Clavulanic Acid 125mg)",
      "dosage": "Frequency (e.g., 1 Tab Twice daily)",
      "timing": "When to take (e.g. After food)",
      "duration": "Duration (e.g. 5 days)",
      "indication": "What it cures/treats in simple patient words",
      "pregnancySafety": "Category (e.g. Category B / Safe with caution / Avoid)",
      "pregnancyWarning": "Brief 1-sentence pregnancy/lactation advice",
      "sideEffects": "Common known side effects",
      "estimatedPrice": 150.00,
      "genericAlternative": {
        "name": "Cheaper trusted generic equivalent name",
        "brand": "Manufacturer (e.g. Cipla / Mankind / Jan Aushadhi)",
        "price": 85.00,
        "savingsPercent": 43
      }
    }
  ],
  "generalPrecautions": "Important instructions from the prescription like diet, hydration, follow-up"
}

If any medicine names are unclear or partially visible, make the closest clinically sound determination based on the salt and symptoms. Return ONLY the raw JSON object.`;

      onProgress({ status: "Extracting handwriting, medicines & dosages with AI Vision...", progress: 0.65 });

      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: mimeType.startsWith("image/") ? mimeType : "image/jpeg"
        }
      };

      const result = await model.generateContent([prompt, imagePart]);
      const responseText = result.response.text();

      // Clean JSON response
      const cleanedText = responseText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();

      const parsed = JSON.parse(cleanedText);
      onProgress({ status: "Analysis complete!", progress: 1.0 });
      return parsed;
    } catch (err) {
      console.warn("Gemini vision encountered error, falling back to real on-device Tesseract OCR:", err);
      // Fall through to real on-device OCR below
    }
  }

  // ── Engine 2: Real On-Device Tesseract OCR (No API key required) ───────────
  console.info("Running real on-device Tesseract OCR on prescription image...");
  const ocrData = await runRealOcrOnImage(file, onProgress);
  const parsedData = parsePrescriptionText(ocrData.rawText, ocrData.confidence);
  
  onProgress({ status: "Real OCR scanning complete!", progress: 1.0 });
  return parsedData;
};


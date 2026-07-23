/**
 * Dynamic Question Engine for MediRush AI Symptom Checker
 * Detects symptom keywords from user input and returns relevant follow-up questions
 */

// Keyword groups mapped to condition categories
export const SYMPTOM_CATEGORIES = {
  fever: {
    keywords: ["fever", "bukhar", "temperature", "hot", "chills", "shivering", "sweating", "sweat", "103", "102", "101"],
    followUps: [
      "How high is your fever? Is it above 101°F? Are you having chills or sweating?",
      "Did the fever come on suddenly, or did it gradually increase over time?"
    ]
  },
  cough: {
    keywords: ["cough", "khansi", "throat", "cold", "nasal", "runny nose", "congestion", "sneeze", "sneezing", "mucus", "phlegm", "sore throat", "hoarse"],
    followUps: [
      "Is it a dry cough or a wet cough with mucus or phlegm? Is your throat sore?",
      "Is the cough worse at night, or do you have any nasal congestion or runny nose?"
    ]
  },
  pain: {
    keywords: ["pain", "dard", "ache", "hurt", "hurting", "headache", "sirdard", "migraine", "joint", "body ache"],
    followUps: [
      "Where exactly is the pain located? Is it constant or does it come and go?",
      "On a scale of 1-10, how severe is the pain? Does anything make it better or worse?"
    ]
  },
  stomach: {
    keywords: ["stomach", "abdomen", "belly", "peth", "nausea", "vomit", "vomiting", "diarrhea", "loose motion", "indigestion", "gas", "bloating", "constipation", "ulcer", "acidity"],
    followUps: [
      "Is the discomfort constant or does it happen after eating? Any vomiting or loose motion?",
      "Is there any burning sensation in your stomach or chest? How many times have you vomited or had loose motions?"
    ]
  },
  breathing: {
    keywords: ["breath", "breathing", "breathless", "saans", "chest", "wheeze", "wheezing", "asthma", "lungs", "shortness of breath", "can't breathe", "tight chest"],
    followUps: [
      "Is the breathing difficulty constant or only during physical activity? Does your chest feel tight?",
      "Do you have any history of asthma or lung conditions? Did this start suddenly or gradually?"
    ]
  },
  skin: {
    keywords: ["rash", "itching", "itch", "allergy", "hives", "skin", "red spots", "bumps", "blisters", "swelling", "swollen", "redness"],
    followUps: [
      "Where on your body is the rash or itching located? Does it spread or stay in one place?",
      "Did the rash appear suddenly? Have you eaten or used anything new recently (food, soap, medicine)?"
    ]
  },
  neurological: {
    keywords: ["dizzy", "dizziness", "fainting", "faint", "unconscious", "numbness", "numb", "tingling", "vision", "blurry", "blur", "confusion", "memory"],
    followUps: [
      "Are you feeling dizzy or having balance issues? Did you faint or feel like you would?",
      "Are you experiencing any numbness, tingling, or sudden vision changes?"
    ]
  },
  cardiac: {
    keywords: ["heart", "chest pain", "palpitation", "palpitations", "rapid heartbeat", "irregular", "pulse", "pressure in chest", "left arm"],
    followUps: [
      "Is there any chest tightness, pressure, or pain that radiates to your arm, jaw, or back?",
      "Are you experiencing rapid heartbeat or palpitations? Do you feel short of breath along with this?"
    ]
  },
  urinary: {
    keywords: ["urine", "urination", "pee", "burning urination", "frequent urination", "kidney", "bladder", "uti", "back pain", "blood in urine"],
    followUps: [
      "Is there a burning sensation when urinating? How frequently are you urinating?",
      "Do you have any pain in your lower back or sides? Any unusual color in your urine?"
    ]
  },
  mental: {
    keywords: ["anxiety", "stress", "depressed", "depression", "sleep", "insomnia", "tired", "fatigue", "exhausted", "panic", "mood", "mental", "sadness"],
    followUps: [
      "How long have you been feeling this way? Is it affecting your sleep or daily activities?",
      "Are you experiencing any physical symptoms like racing heart, difficulty breathing, or muscle tension?"
    ]
  }
};

// General follow-up questions (always asked after condition-specific ones)
export const GENERAL_FOLLOWUPS = [
  "How long have you been experiencing these symptoms? (e.g., 1 day, 3 days, a week)",
  "What is your age group? Do you have any existing medical conditions like diabetes, hypertension, or asthma?",
  "Are you currently taking any medications? And have you tried anything for relief so far?"
];

/**
 * Detects symptom categories from user text
 * @param {string} text - User input text
 * @returns {string[]} - Array of detected category keys
 */
export const detectCategories = (text) => {
  const lower = text.toLowerCase();
  const detected = [];
  
  for (const [category, data] of Object.entries(SYMPTOM_CATEGORIES)) {
    if (data.keywords.some(kw => lower.includes(kw))) {
      detected.push(category);
    }
  }
  
  return detected;
};

/**
 * Gets the next follow-up question for detected categories
 * @param {string[]} detectedCategories - Categories detected so far
 * @param {number[]} askedFollowUpIndices - Indices of already-asked follow-up questions
 * @param {number} generalQuestionsAsked - Number of general questions already asked
 * @returns {{ question: string, type: 'specific' | 'general' | null }}
 */
export const getNextQuestion = (detectedCategories, askedSpecificCount, generalQuestionsAsked) => {
  // First, ask condition-specific follow-ups (max 1 per session for UX)
  for (const category of detectedCategories) {
    const followUps = SYMPTOM_CATEGORIES[category]?.followUps || [];
    if (askedSpecificCount < followUps.length && askedSpecificCount < 1) {
      return { question: followUps[askedSpecificCount], type: 'specific' };
    }
  }
  
  // Then ask general follow-ups (max 3)
  if (generalQuestionsAsked < GENERAL_FOLLOWUPS.length) {
    return { question: GENERAL_FOLLOWUPS[generalQuestionsAsked], type: 'general' };
  }
  
  // All questions answered
  return { question: null, type: null };
};

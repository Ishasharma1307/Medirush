export const commonSymptoms = [
  "Fever",
  "Headache",
  "Cough / Cold",
  "Sore Throat",
  "Stomach Pain",
  "Body Ache",
  "Weakness",
  "Nausea",
  "Vomiting",
  "Diarrhea",
  "Breathing Issue",
  "Chest Pain",
  "Dizziness",
  "Allergy / Rash",
  "Chills / Shivering",
  "Muscle Cramps",
  "Severe Bleeding",
  "Blurry Vision",
  "Joint Pain"
];

export const durationOptions = [
  "Just started today",
  "1-2 days",
  "3-5 days",
  "1-2 weeks",
  "More than a month"
];

export const severityOptions = [
  "Very Mild (barely noticeable)",
  "Mild (manageable)",
  "Moderate (uncomfortable)",
  "Severe (interferes with daily life)",
  "Extreme (unbearable)"
];

export const chatBotQuestions = [
  {
    id: 'q1',
    text: "Hello! I am the MediRush AI Assistant. To ensure your safety, I'll ask a few quick questions. What symptoms are you experiencing today?",
    options: commonSymptoms,
    key: "symptoms",
    multiSelect: true
  },
  {
    id: 'q1b',
    text: "Have you checked your temperature?",
    options: ["Normal (No fever)", "Mild fever (99-100°F)", "High fever (101-102°F)", "Very High fever (103°F+)", "I haven't checked"],
    key: "temperature",
    multiSelect: false
  },
  {
    id: 'q2',
    text: "Since when have you been feeling this way?",
    options: durationOptions,
    key: "duration",
    multiSelect: false
  },
  {
    id: 'q3',
    text: "How would you rate the overall severity or pain level?",
    options: severityOptions,
    key: "severity",
    multiSelect: false
  },
  {
    id: 'q3b',
    text: "What is your age group?",
    options: ["Under 18", "18 - 30", "31 - 50", "51 - 65", "65+"],
    key: "age",
    multiSelect: false
  },
  {
    id: 'q4',
    text: "Do you have any existing medical conditions or allergies we should know about?",
    options: ["No existing conditions", "Diabetes", "Hypertension (High BP)", "Asthma", "Heart Disease", "Drug Allergies", "Thyroid", "Pregnant"],
    key: "history",
    multiSelect: true
  }
];

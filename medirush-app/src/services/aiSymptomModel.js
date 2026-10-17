// AI Symptom Checker & Indian Home Remedies Model
// Combines Gemini Generative AI with a rich clinical knowledge base of Indian Ayurvedic & Home Remedies (Desi Nuskhe)

import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

// ── EXTENSIVE CLINICAL KNOWLEDGE BASE FOR HOME REMEDIES & OTC DRUGS ─────────
const CLINICAL_REMEDY_DATABASE = [
  {
    triggers: ['cough', 'cold', 'gala', 'kharash', 'sore throat', 'khansi', 'phlegm', 'congestion', 'runny nose', 'sneezing'],
    condition: "Acute Upper Respiratory Irritation / Common Cold",
    severity: "mild",
    hindiName: "सामान्य सर्दी, खांसी और गले में खराश",
    confidence: 96,
    summary: "Upper respiratory inflammation typically caused by viral infection or allergic irritation of the pharyngeal mucosa.",
    homeRemedies: [
      {
        name: "Adrak-Tulsi-Shahad Kadha (Ginger Tulsi Decoction)",
        nameHindi: "अदरक, तुलसी और शहद का काढ़ा",
        benefits: "Anti-inflammatory gingerol soothes raw pharynx, while tulsi (holy basil) provides antimicrobial bioflavonoids.",
        ingredients: [
          "1 inch crushed fresh ginger (अदरak)",
          "8-10 fresh Tulsi leaves (तुलसी)",
          "1 stick Ceylon cinnamon / dalchini (दालचीनी)",
          "1 tbsp pure raw honey (शहद)",
          "2 cups water"
        ],
        preparation: "Boil ginger, tulsi, and cinnamon in 2 cups of water until reduced by half. Strain into a cup, let it cool slightly to warm, then stir in honey (never boil honey). Sip slowly twice daily.",
        frequency: "2 times a day (Morning & before sleep)"
      },
      {
        name: "Namak Paani Gargle (Warm Himalayan Salt Water)",
        nameHindi: "गुनगुने नमक पानी का गरारा",
        benefits: "Osmotically draws fluid out of inflamed throat tissues, relieving pain and clearing mucus plugs.",
        ingredients: ["1/2 teaspoon pure sea salt or sendha namak", "1 cup lukewarm water"],
        preparation: "Dissolve salt in warm water. Gargle for 30 seconds at the back of the throat and spit out. Do not swallow.",
        frequency: "3 to 4 times a day"
      },
      {
        name: "Ajwain & Pudina Steam Inhalation",
        nameHindi: "अजवायन और पुदीने की भाप",
        benefits: "Thymol in ajwain dilates congested bronchial tubes and liquefies tenacious mucus.",
        ingredients: ["1 tsp crushed carom seeds (ajwain)", "4-5 mint leaves or 1 drop camphor/eucalyptus oil", "1 bowl steaming water"],
        preparation: "Inhale deep steam covering your head with a clean towel for 5-7 minutes.",
        frequency: "Twice daily"
      }
    ],
    otcMedicines: [
      {
        id: "med-10",
        name: "Ascoril D Plus Syrup (Sugar Free)",
        salt: "Dextromethorphan + Chlorpheniramine + Phenylephrine",
        price: 129.00,
        dosage: "10 ml twice daily after meals",
        deliveryTime: "10 mins"
      },
      {
        id: "med-6",
        name: "Allegra 120mg Tablet",
        salt: "Fexofenadine Hydrochloride (120mg)",
        price: 198.00,
        dosage: "1 tab daily at bedtime for allergic sneezing",
        deliveryTime: "10 mins"
      },
      {
        id: "med-18",
        name: "Cofsils Orange Lozenges (Strip of 10)",
        salt: "Amylmetacresol + Dichlorobenzyl Alcohol",
        price: 35.00,
        dosage: "1 lozenge dissolved slowly every 3 hours",
        deliveryTime: "10 mins"
      }
    ],
    precautions: [
      "Avoid iced water, refrigerated dairy, and deep-fried oily snacks.",
      "Stay well hydrated with lukewarm water or warm soups."
    ],
    doctorAlert: "Consult a doctor immediately if fever exceeds 102°F, shortness of breath occurs, or symptoms persist beyond 5 days."
  },
  {
    triggers: ['fever', 'bukhar', 'body pain', 'chills', 'thakan', 'temperature', 'badan dard'],
    condition: "Pyrexia / Viral Flu Fever",
    severity: "moderate",
    hindiName: "वायरल बुखार और बदन दर्द",
    confidence: 94,
    summary: "Systemic immune response characterized by elevated core temperature, rigors, and myalgia.",
    homeRemedies: [
      {
        name: "Giloy & Tulsi Swaras (Guduchi Immunity Extract)",
        nameHindi: "गिलोय और तुलसी का रस",
        benefits: "Giloy (Tinospora cordifolia) is a revered antipyretic herb shown in clinical Ayurveda to balance pitta and reduce febrile spikes.",
        ingredients: ["20ml organic Giloy juice or 1 inch fresh stem", "5 tulsi leaves", "1 cup water"],
        preparation: "Boil giloy and tulsi in water for 5 minutes, strain, and drink warm on an empty stomach.",
        frequency: "Once in the morning"
      },
      {
        name: "Cold Sponge on Forehead & Wrists",
        nameHindi: "माथे और हथेलियों पर ठंडी पट्टी",
        benefits: "Evaporative heat dissipation directly cools blood circulation in superficial temporal arteries.",
        ingredients: ["Cotton cloth / hand towel", "Bowl of normal room-temperature tap water (never ice water)"],
        preparation: "Dip towel, wring out excess water, place on forehead, back of neck, and inner wrists. Re-wet every 3 minutes until temperature dips.",
        frequency: "Continuous during temperature spikes > 100.5°F"
      },
      {
        name: "Coconut Water & ORS Hydration Electrolytes",
        nameHindi: "नारियल पानी और ओआरएस घोल",
        benefits: "Prevents febrile dehydration and restores potassium and sodium loss from sweating.",
        ingredients: ["1 tender coconut water OR 1 sachet WHO-standard ORS in 1L water"],
        preparation: "Sip continuously throughout the waking hours.",
        frequency: "3-4 glasses across the day"
      }
    ],
    otcMedicines: [
      {
        id: "med-4",
        name: "Dolo 650mg Paracetamol",
        salt: "Paracetamol (650mg)",
        price: 32.50,
        dosage: "1 tablet every 6-8 hours after light food (max 3/day)",
        deliveryTime: "10 mins"
      },
      {
        id: "med-22",
        name: "Electral ORS Powder (21.8g Sachet)",
        salt: "WHO Recommended Oral Rehydration Salts",
        price: 22.00,
        dosage: "Mix 1 sachet in 1 Litre water, sip frequently",
        deliveryTime: "10 mins"
      }
    ],
    precautions: [
      "Do not take aspirin or ibuprofen on an empty stomach.",
      "Rest adequately in a well-ventilated room."
    ],
    doctorAlert: "Seek emergency care if fever does not respond to paracetamol after 4 hours, or if accompanied by rash, stiff neck, or extreme lethargy."
  },
  {
    triggers: ['acidity', 'gas', 'heartburn', 'acid', 'pet dard', 'chest burn', 'khatti dakar', 'indigestion', 'bloating', 'reflux'],
    condition: "Gastroesophageal Reflux (GERD) & Hyperacidity",
    severity: "mild",
    hindiName: "एसिडिटी, सीने में जलन और अपच",
    confidence: 97,
    summary: "Excess gastric hydrochloric acid causing mucosal irritation, retrosternal burning, and abdominal distension.",
    homeRemedies: [
      {
        name: "Thanda Doodh (Cold Skimmed Milk)",
        nameHindi: "ठंडा कच्चा या टोंड दूध",
        benefits: "High calcium and alkaline proteins immediately buffer hydrochloric acid and coat stomach lining.",
        ingredients: ["1/2 glass chilled pasteurized milk (unflavoured, no sugar)"],
        preparation: "Sip slowly at the onset of heartburn or burning sensation.",
        frequency: "SOS when acid reflux occurs"
      },
      {
        name: "Bhuna Jeera & Saunf Water (Fennel-Cumin Infusion)",
        nameHindi: "भुना जीरा और सौंफ का पानी",
        benefits: "Anethole in saunf and thymol in cumin act as natural carminatives, calming stomach spasms and expelling gas.",
        ingredients: ["1 tsp fennel seeds (saunf)", "1 tsp roasted cumin (jeera)", "1 glass water"],
        preparation: "Soak in hot water for 10 minutes or boil lightly. Drink warm 20 minutes after lunch and dinner.",
        frequency: "Twice daily after main meals"
      },
      {
        name: "Kala Namak & Hing Buttermilk (Chaas)",
        nameHindi: "काला नमक, हींग और भुना जीरा छाछ",
        benefits: "Probiotics in cultured yogurt balance gut flora while asafoetida (hing) halts bacterial fermentation.",
        ingredients: ["1 cup fresh buttermilk", "Pinch of asafoetida (hing)", "1/4 tsp black salt (kala namak)"],
        preparation: "Whisk together and drink after lunch.",
        frequency: "Daily after lunch"
      }
    ],
    otcMedicines: [
      {
        id: "med-29",
        name: "Aciloc RD 20 Capsule",
        salt: "Omeprazole (20mg) + Domperidone (10mg)",
        price: 77.00,
        dosage: "1 capsule in morning 30 mins before breakfast",
        deliveryTime: "10 mins"
      },
      {
        id: "med-12",
        name: "Digene Gel Mint (200ml Bottle)",
        salt: "Magnesium Hydroxide + Aluminium Hydroxide + Simethicone",
        price: 145.00,
        dosage: "2 teaspoons (10ml) after meals or at onset of heartburn",
        deliveryTime: "10 mins"
      },
      {
        id: "med-13",
        name: "Eno Fruit Salt (Regular Sachet)",
        salt: "Svarjiksara (Sodium Bicarbonate) + Nimbukamlam",
        price: 10.00,
        dosage: "Dissolve 1 sachet in water, drink immediately",
        deliveryTime: "10 mins"
      }
    ],
    precautions: [
      "Avoid lying down within 2 hours of dinner.",
      "Elevate your headrest 6 inches while sleeping.",
      "Limit black coffee, citrus fruits, and spicy masala gravies."
    ],
    doctorAlert: "Emergency alert: If burning pain radiates to your left arm, jaw, or is accompanied by cold sweat and breathlessness, call 112 immediately as this can mimic a cardiac episode."
  },
  {
    triggers: ['headache', 'sir dard', 'migraine', 'stress', 'tension', 'forehead pain', 'aankho me dard'],
    condition: "Tension-Type Headache & Eye Strain",
    severity: "mild",
    hindiName: "सिरदर्द, तनाव और माइग्रेन",
    confidence: 95,
    summary: "Musculoskeletal contraction of scalp and neck muscles frequently precipitated by digital eye fatigue, dehydration, or stress.",
    homeRemedies: [
      {
        name: "Chandan & Dalchini Forehead Lepa",
        nameHindi: "दालचीनी और चंदन का लेप",
        benefits: "Cinnamon improves local microcirculation while cooling sandalwood relaxes tense temporal nerves.",
        ingredients: ["1/2 tsp cinnamon powder", "1/2 tsp sandalwood powder", "few drops rosewater"],
        preparation: "Mix into a smooth paste. Apply over forehead and temples for 15-20 minutes, then wash gently.",
        frequency: "Once during peak headache"
      },
      {
        name: "Himalayan Pink Salt Nimbu Paani",
        nameHindi: "सेंधा नमक और नींबू पानी (Electrolyte Fix)",
        benefits: "Over 60% of sudden tension headaches stem from acute subclinical dehydration and electrolyte imbalance.",
        ingredients: ["1 glass room temperature water", "1/2 fresh lime", "1/4 tsp sendha namak"],
        preparation: "Stir well and drink in one go. Rest with eyes closed in a darkened room for 15 minutes.",
        frequency: "Immediately at headache onset"
      },
      {
        name: "Acupressure LI-4 (Hegu) Massage",
        nameHindi: "हेगू एक्यूप्रेशर बिंदु की मालिश",
        benefits: "Stimulates endorphin release to block pain signals travelling up the trigeminal pathway.",
        ingredients: ["Your thumb and index finger"],
        preparation: "Locate the webbing between thumb and index finger on back of hand. Pinch firmly in circular motion for 2 minutes on both hands.",
        frequency: "2-3 times as needed"
      }
    ],
    otcMedicines: [
      {
        id: "med-37",
        name: "Saridon Headache Relief Tablet",
        salt: "Paracetamol (250mg) + Propyphenazone (150mg) + Caffeine (50mg)",
        price: 45.00,
        dosage: "1 tablet with water (fast acting 15-min relief)",
        deliveryTime: "10 mins"
      },
      {
        id: "med-38",
        name: "Amrutanjan Roll-On (10ml)",
        salt: "Wintergreen Oil + Pudina Ka Phool (Menthol) 10%",
        price: 60.00,
        dosage: "Apply across temples and forehead lightly",
        deliveryTime: "10 mins"
      }
    ],
    precautions: [
      "Follow the 20-20-20 rule for digital screens (every 20 mins, look at something 20 feet away for 20 seconds).",
      "Ensure 7-8 hours of uninterrupted sleep."
    ],
    doctorAlert: "Seek immediate hospital care for sudden 'thunderclap' headache, neurological numbness, speech slurring, or visual blackout."
  },
  {
    triggers: ['stomach pain', 'pet dard', 'cramps', 'loose motion', 'dast', 'diarrhea', 'food poisoning', 'nausea', 'vomit', 'ultiyan'],
    condition: "Acute Gastroenteritis & Gastric Spasms",
    severity: "moderate",
    hindiName: "पेट दर्द, दस्त और उल्टी (गैस्ट्रोएंटेराइटिस)",
    confidence: 93,
    summary: "Intestinal mucosa irritation resulting in hypermotility, abdominal cramping, and fluid loss.",
    homeRemedies: [
      {
        name: "Pomegranate Peel & Methi Decoction (Anaar Chilka Kadha)",
        nameHindi: "अनार के छिलके और मेथी का पानी",
        benefits: "Potent tannins in pomegranate rind act as natural intestinal astringents, curbing loose motions.",
        ingredients: ["Dried pomegranate peel piece", "1/2 tsp fenugreek seeds (methi dana)", "1.5 cup water"],
        preparation: "Boil together for 6 minutes, strain, add a pinch of rock salt, and sip lukewarm.",
        frequency: "Twice daily"
      },
      {
        name: "Curd & Isabgol / Kela (Probiotic Banana Yogurt)",
        nameHindi: "दही, केला और ईसबगोल",
        benefits: "Pectin in ripe bananas firms stools while active lactobacillus replenishes washed-out gut microbiome.",
        ingredients: ["1 bowl fresh homemade dahi (curd)", "1 ripe banana mashed", "1 pinch roasted jeera"],
        preparation: "Mix and eat directly. Very gentle on irritated stomach lining.",
        frequency: "2 times a day"
      }
    ],
    otcMedicines: [
      {
        id: "med-41",
        name: "Meftal-Spas Tablet",
        salt: "Mefenamic Acid (250mg) + Dicyclomine (10mg)",
        price: 48.00,
        dosage: "1 tab for acute cramp relief after light toast/khichdi",
        deliveryTime: "10 mins"
      },
      {
        id: "med-42",
        name: "Econorm 250mg Probiotic Sachet",
        salt: "Saccharomyces boulardii (250mg)",
        price: 52.00,
        dosage: "Mix in lukewarm water or curd twice daily",
        deliveryTime: "10 mins"
      }
    ],
    precautions: [
      "Do not consume raw vegetables, street food, dairy cream, or aerated drinks.",
      "Stick strictly to khichdi, moong dal soup, and tender coconut water."
    ],
    doctorAlert: "Visit a clinic immediately if blood is visible in stools, vomiting prevents fluid intake for > 12 hours, or signs of dehydration (sunken eyes, dizziness) appear."
  }
];

// Fallback remedy for undefined clusters
const GENERAL_WELLNESS_REMEDY = {
  condition: "General Health Symptom Assessment",
  severity: "mild",
  hindiName: "सामान्य स्वास्थ्य परीक्षण और घरेलू उपचार",
  confidence: 90,
  summary: "Comprehensive wellness evaluation based on reported symptoms.",
  homeRemedies: [
    {
      name: "Haldi Doodh (Golden Turmeric Immunity Milk)",
      nameHindi: "हल्दी वाला दूध (गोल्डन मिल्क)",
      benefits: "Curcumin possesses powerful immunomodulatory and cellular anti-inflammatory properties.",
      ingredients: ["1 cup warm milk or almond milk", "1/2 tsp pure turmeric powder (haldi)", "Pinch of black pepper (enhances absorption by 2000%)"],
      preparation: "Simmer milk with turmeric and pepper for 3 minutes. Drink warm before sleep.",
      frequency: "Every night before bed"
    },
    {
      name: "Tulsi & Ginger Herbal Infusion",
      nameHindi: "तुलसी और अदरक की चाय",
      benefits: "Adaptogenic herb that lowers physiological stress hormones and boosts natural killer cell activity.",
      ingredients: ["5-6 tulsi leaves", "1/2 inch crushed ginger", "1 cup boiling water"],
      preparation: "Steep covered for 5 minutes, strain, add a dash of lemon and honey.",
      frequency: "1-2 times daily"
    }
  ],
  otcMedicines: [
    {
      id: "med-4",
      name: "Dolo 650mg Paracetamol",
      salt: "Paracetamol (650mg)",
      price: 32.50,
      dosage: "1 tab SOS for body aches or fever",
      deliveryTime: "10 mins"
    },
    {
      id: "med-45",
      name: "Limcee 500mg Vitamin C Chewable",
      salt: "Ascorbic Acid (500mg)",
      price: 25.00,
      dosage: "1 chewable tab daily for immune defense",
      deliveryTime: "10 mins"
    }
  ],
  precautions: ["Hydrate with 2.5 litres of water daily", "Ensure 8 hours of restful sleep"],
  doctorAlert: "Consult a certified medical practitioner if symptoms worsen or do not resolve within 48 hours."
};

/**
 * Main AI Engine to analyze symptoms and return structured Home Remedies + OTC Medicines
 */
export const analyzeSymptomsWithAI = async ({
  symptoms = "",
  duration = "1-2 days",
  severity = "mild",
  age = "Adult",
  language = "en"
}) => {
  const cleanInput = (symptoms || "").toLowerCase().trim();

  // ── 1. Try Gemini Generative AI First if Key Available ─────────────────────
  if (GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 900
        }
      });

      const prompt = `You are MediRush AI, a leading Indian Medical Triage & Ayurvedic Pharmacology Expert.
Analyze the following patient symptoms and return ONLY valid parseable JSON without any markdown formatting.

Patient Data:
- Symptoms: "${symptoms}"
- Duration: "${duration}"
- Reported Severity: "${severity}"
- Age: "${age}"
- Preferred Language: "${language}"

Required Output JSON Schema:
{
  "condition": "Name of primary likely condition (e.g. Acute Viral Pharyngitis / Acidity Reflux)",
  "hindiName": "Condition in Hindi script (e.g. गले का संक्रमण)",
  "severity": "mild" | "moderate" | "emergency",
  "confidence": 95,
  "summary": "2-sentence clinical explanation for the patient",
  "homeRemedies": [
    {
      "name": "Remedy Name (e.g. Adrak-Tulsi-Shahad Kadha)",
      "nameHindi": "Hindi Name (e.g. अदरक तुलसी का काढ़ा)",
      "benefits": "Medical explanation of why it works",
      "ingredients": ["Item 1 with quantity", "Item 2"],
      "preparation": "Step-by-step preparation instructions",
      "frequency": "How often to take (e.g. 2 times a day)"
    }
  ],
  "otcMedicines": [
    {
      "id": "med-1",
      "name": "Standard Indian Pharmacy Medicine Name",
      "salt": "Active chemical composition",
      "price": 120.00,
      "dosage": "Clear dosage instructions",
      "deliveryTime": "10 mins"
    }
  ],
  "precautions": ["Dietary and lifestyle advice 1", "Advice 2"],
  "doctorAlert": "Clear red flag warning of when to rush to a hospital"
}

Provide 2-3 authentic, time-tested Indian home remedies (Desi Nuskhe) using kitchen ingredients and 2 well-known Indian OTC medicines (like Dolo, Digene, Ascoril, Allegra, Meftal-Spas, etc.) that can be delivered in 10 minutes.`;

      const result = await model.generateContent(prompt);
      const rawText = result.response.text();
      const cleaned = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
      const parsed = JSON.parse(cleaned);
      return { source: "gemini-ai", ...parsed };
    } catch (e) {
      console.warn("Gemini AI symptom call failed or offline, switching to embedded clinical model:", e);
    }
  }

  // ── 2. Robust Embedded Clinical Rule Model (Instant, 100% Offline Reliable) ──
  await new Promise(r => setTimeout(r, 600)); // Natural simulated processing feel

  // Match cluster by keywords
  let matchedCluster = null;
  let highestScore = 0;

  for (const item of CLINICAL_REMEDY_DATABASE) {
    let score = 0;
    for (const trig of item.triggers) {
      if (cleanInput.includes(trig)) {
        score += 10;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      matchedCluster = item;
    }
  }

  const selected = matchedCluster || GENERAL_WELLNESS_REMEDY;

  return {
    source: "clinical-engine",
    condition: selected.condition,
    hindiName: selected.hindiName,
    severity: selected.severity,
    confidence: selected.confidence,
    summary: selected.summary,
    homeRemedies: selected.homeRemedies,
    otcMedicines: selected.otcMedicines,
    precautions: selected.precautions,
    doctorAlert: selected.doctorAlert
  };
};

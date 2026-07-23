// ─── Medicine Suggestions ─────────────────────────────────────────────────────
const MEDICINES = {
  "viral fever": ["Paracetamol 500mg (har 6 ghante)", "ORS sachets", "Vitamin C 500mg"],
  "typhoid": ["Azithromycin (doctor se)", "Cefixime", "Paracetamol"],
  "malaria": ["Artemether-Lumefantrine (doctor se)", "Paracetamol bukhar ke liye", "ORS"],
  "dengue": ["Paracetamol (Aspirin/Ibuprofen bilkul mat lo)", "ORS", "Papaya leaf extract"],
  "pneumonia": ["Amoxicillin (doctor se)", "Azithromycin", "Paracetamol"],
  "common cold": ["Cetirizine", "Paracetamol", "Vitamin C", "Steam inhalation"],
  "influenza": ["Paracetamol", "Cetirizine", "Oseltamivir (doctor se)"],
  "hypertension": ["Amlodipine (doctor se)", "Losartan (doctor se)", "BP monitor karo"],
  "diabetes": ["Metformin (doctor se)", "Blood sugar monitor", "Diet control"],
  "asthma": ["Salbutamol inhaler", "Budesonide inhaler (doctor se)", "Montelukast"],
  "migraine": ["Sumatriptan (doctor se)", "Paracetamol", "Ibuprofen"],
  "gastroenteritis": ["ORS", "Probiotics (Lactobacillus)", "Loperamide (diarrhea ke liye)"],
  "acid reflux": ["Omeprazole 20mg", "Antacids (Gelusil/Digene)", "Diet change"],
  "uti": ["Nitrofurantoin (doctor se)", "Ciprofloxacin (doctor se)", "Cranberry supplement"],
  "anemia": ["Ferrous Sulphate", "Folic Acid", "Vitamin B12"],
  "allergy": ["Cetirizine 10mg", "Fexofenadine", "Calamine lotion (skin ke liye)"],
  "chicken pox": ["Acyclovir (doctor se)", "Calamine lotion", "Antihistamine for itching"],
  "tuberculosis": ["DOTS therapy (doctor se)", "Rifampicin + Isoniazid"],
  "heart attack": ["Aspirin 325mg (turant)", "Emergency services call karo — 112"],
  "fungal infection": ["Clotrimazole cream", "Fluconazole (doctor se)", "Antifungal powder"],
  "paralysis": ["EMERGENCY — 112 call karo", "Aspirin (doctor se)", "ICU required"],
  "vertigo": ["Meclizine", "Betahistine", "Vestibular exercises"],
  "jaundice": ["Liver tonic", "Avoid oily food", "Doctor se milein"],
  "arthritis": ["Ibuprofen", "Diclofenac gel (local)", "Physiotherapy"],
  "acne": ["Benzoyl Peroxide cream", "Salicylic acid face wash", "Clindamycin gel"],
  "psoriasis": ["Calcipotriol cream (doctor se)", "Steroid cream", "Moisturizer"],
  "default": ["Paracetamol 500mg", "ORS sachets", "Vitamin C", "Doctor se salah lein"]
};

// ─── Home Remedies ────────────────────────────────────────────────────────────
const REMEDIES = {
  "viral fever": ["Nimbu paani ya naariyal paani piyo", "Cool compress mathe pe lagao", "Puri neend lo — 8+ ghante"],
  "typhoid": ["Halka khana khao — khichdi, daliya", "Saaf paani piyo", "Bahar ka khana bilkul nahi"],
  "malaria": ["Mosquito net use karo", "Coconut water piyo", "Rest karo"],
  "dengue": ["Din mein 3-4 litre fluid piyo", "Papaya leaves ka juice helpful hai", "Mosquito se door raho"],
  "common cold": ["Adrak-shahad-nimbu ki chai piyo", "Steam lo eucalyptus oil ke saath", "Gargle namak wale paani se"],
  "influenza": ["Garam soup piyo", "Rest karo", "Zyada log se door raho"],
  "migraine": ["Andheri kamra mein lete jao", "Mathe pe thanda ya garam kapda lagao", "Hydrated raho"],
  "gastroenteritis": ["ORS piyo — dehydration se bacho", "BRAT diet — banana, rice, applesauce, toast", "Oily aur masaledar khana avoid karo"],
  "acid reflux": ["Raat ko sone se 2 ghante pehle kuch mat khao", "Thoda thoda khao, zyada ek baar nahi", "Sar thoda upar rakh ke soyo"],
  "uti": ["8-10 glass paani piyo rozana", "Cranberry juice piyo", "Caffeine aur sharab avoid karo"],
  "allergy": ["Trigger se door raho", "Thanda compress lagao itching pe", "Histamine-rich khana avoid karo"],
  "chicken pox": ["Oatmeal bath lo itching ke liye", "Khujli mat karo — naakhun kaato", "Calamine lotion lagao"],
  "hypertension": ["Namak kam khao", "Exercise karo — 30 min rozana", "Stress kam karo, yoga karo"],
  "diabetes": ["Low sugar, low carb diet lo", "Exercise karo rozana", "Blood sugar daily check karo"],
  "fungal infection": ["Area sukha rakho — moisture nahi", "Dhup mein baitha karo (affected area)", "Clean aur sukhay kapde pehno"],
  "vertigo": ["Achanak mat uthho — dheere uthho", "Serc ya Brandt-Daroff exercises karo", "Caffeine kam karo"],
  "anemia": ["Paalak, chana, rajma khao", "Vitamin C ke saath iron absorb hota hai", "Chai aur coffee khane ke saath mat piyo"],
  "arthritis": ["Garam-thanda sek lagao", "Jodon ko zyada kaam mat dena", "Anti-inflammatory foods khao — haldi, adrak"],
  "default": ["Zyada paani piyo", "Puri neend lo — 7-8 ghante", "Taza sabjiyaan aur phal khao"]
};

// ─── Smart Keyword-Based Local Analyzer ──────────────────────────────────────
const LOCAL_RULES = [
  {
    keywords: ["chest pain", "seene mein dard", "left arm", "jaw pain", "heart attack"],
    result: {
      level: "Emergency", actionType: "visit_hospital",
      disease: "Possible Cardiac Event",
      title: "🚨 Emergency: Possible Heart Condition",
      description: "Aapke symptoms serious cardiac condition indicate kar rahe hain. Abhi 112 call karein ya nearest hospital jaayein. Ek minute bhi wait mat karein.",
      severity: "Critical", confidence: 95,
      colorClass: "bg-red-50 border-red-300", textColor: "text-red-900",
      buttonColor: "bg-red-600 hover:bg-red-700", iconColor: "text-red-600",
      medicines: MEDICINES["heart attack"], homeRemedies: ["ABHI 112 CALL KARO", "Aspirin 325mg agar available ho"],
      precautions: ["Bilkul akele mat raho", "Koi bhi physical effort mat karo", "Loose kapde pehno"]
    }
  },
  {
    keywords: ["difficulty breathing", "saans nahi", "breathless", "chest tight", "can't breathe"],
    result: {
      level: "Emergency", actionType: "visit_hospital",
      disease: "Breathing Emergency",
      title: "🚨 Emergency: Breathing Difficulty",
      description: "Saans lene mein takleef serious sign hai. Turant medical help lo.",
      severity: "Critical", confidence: 90,
      colorClass: "bg-red-50 border-red-300", textColor: "text-red-900",
      buttonColor: "bg-red-600 hover:bg-red-700", iconColor: "text-red-600",
      medicines: ["Salbutamol inhaler (agar asthmatic ho)", "Oxygen (hospital mein)"],
      homeRemedies: ["Seedha baitha raho — let mat jao", "Tight kapde dheelay karo"],
      precautions: ["112 call karo", "Darwaza khula rakho"]
    }
  },
  {
    keywords: ["high fever", "103", "104", "bahut tez bukhar", "very high fever", "shivering fever"],
    result: {
      level: "Emergency", actionType: "visit_hospital",
      disease: "High Fever (Possible Infection)",
      title: "High Fever — Doctor Zaroor Dikhaao",
      description: "Bahut tez bukhar (103°F+) serious infection ka sign ho sakta hai jaise typhoid, malaria, ya dengue.",
      severity: "High", confidence: 78,
      colorClass: "bg-red-50 border-red-200", textColor: "text-red-900",
      buttonColor: "bg-danger hover:bg-red-700", iconColor: "text-danger",
      medicines: MEDICINES["typhoid"], homeRemedies: REMEDIES["viral fever"],
      precautions: ["Khub paani piyo", "Doctor se blood test karwao", "Aise jagah mat jao jahan malaria/dengue risk ho"]
    }
  },
  {
    keywords: ["fever", "bukhar", "temperature", "chills", "body ache", "headache", "headache fever", "sirdard bukhar"],
    result: {
      level: "Moderate", actionType: "order_medicine",
      disease: "Viral Fever / Flu",
      title: "Viral Fever ya Flu",
      description: "Aapke symptoms viral fever ya influenza indicate karte hain. 2-3 din mein better ho jaana chahiye. Agar nahi hua toh doctor se milein.",
      severity: "Medium", confidence: 72,
      colorClass: "bg-orange-50 border-orange-200", textColor: "text-orange-900",
      buttonColor: "bg-orange-500 hover:bg-orange-600", iconColor: "text-orange-500",
      medicines: MEDICINES["viral fever"], homeRemedies: REMEDIES["viral fever"],
      precautions: ["2-3 din mein theek na ho toh blood test karwao", "Khub paani piyo", "Rest karo"]
    }
  },
  {
    keywords: ["stomach pain", "peth mein dard", "nausea", "vomiting", "ulti", "diarrhea", "loose motion", "peth dard"],
    result: {
      level: "Moderate", actionType: "order_medicine",
      disease: "Gastroenteritis / Food Poisoning",
      title: "Pet Ki Takleef — Gastro Issue",
      description: "Aapke symptoms gastroenteritis ya food poisoning indicate karte hain. Dehydration se bacho — ORS piyo.",
      severity: "Medium", confidence: 68,
      colorClass: "bg-orange-50 border-orange-200", textColor: "text-orange-900",
      buttonColor: "bg-orange-500 hover:bg-orange-600", iconColor: "text-orange-500",
      medicines: MEDICINES["gastroenteritis"], homeRemedies: REMEDIES["gastroenteritis"],
      precautions: ["Har loose motion ke baad ORS piyo", "Bahar ka khana avoid karo", "Zyada ulti ho toh doctor se milein"]
    }
  },
  {
    keywords: ["cough", "khansi", "sore throat", "gala dard", "cold", "nasal", "runny nose", "congestion"],
    result: {
      level: "Mild", actionType: "home_remedies",
      disease: "Common Cold / Upper Respiratory Infection",
      title: "Sardi-Khansi (URI)",
      description: "Aapke symptoms common cold ya upper respiratory infection indicate karte hain. Ghar par treatment se 5-7 din mein theek ho jaana chahiye.",
      severity: "Low", confidence: 75,
      colorClass: "bg-green-50 border-green-200", textColor: "text-green-900",
      buttonColor: "bg-secondary hover:bg-green-700", iconColor: "text-secondary",
      medicines: MEDICINES["common cold"], homeRemedies: REMEDIES["common cold"],
      precautions: ["Zyada log se door raho", "Haath dhote raho", "Pani piyo"]
    }
  },
  {
    keywords: ["rash", "itching", "khujli", "daane", "allergy", "hives", "skin"],
    result: {
      level: "Mild", actionType: "order_medicine",
      disease: "Allergic Reaction / Skin Condition",
      title: "Allergy ya Skin Reaction",
      description: "Aapke symptoms allergic reaction indicate karte hain. Trigger dhundhein aur antihistamine lein.",
      severity: "Low", confidence: 65,
      colorClass: "bg-green-50 border-green-200", textColor: "text-green-900",
      buttonColor: "bg-secondary hover:bg-green-700", iconColor: "text-secondary",
      medicines: MEDICINES["allergy"], homeRemedies: REMEDIES["allergy"],
      precautions: ["Naya khana, soap ya medicine check karo jo trigger ho sakti hai", "Scratch mat karo"]
    }
  },
  {
    keywords: ["headache", "sirdard", "migraine", "head pain", "throbbing", "sir dard"],
    result: {
      level: "Mild", actionType: "home_remedies",
      disease: "Tension Headache / Migraine",
      title: "Sirdard — Tension ya Migraine",
      description: "Aapke symptoms tension headache ya migraine indicate karte hain. Rest aur hydration se usually better hota hai.",
      severity: "Low", confidence: 70,
      colorClass: "bg-green-50 border-green-200", textColor: "text-green-900",
      buttonColor: "bg-secondary hover:bg-green-700", iconColor: "text-secondary",
      medicines: MEDICINES["migraine"], homeRemedies: REMEDIES["migraine"],
      precautions: ["Zyada stress mat lo", "Screen time kam karo", "Hydrated raho"]
    }
  },
  {
    keywords: ["dizzy", "chakkar", "dizziness", "vertigo", "lightheaded", "balance"],
    result: {
      level: "Moderate", actionType: "order_medicine",
      disease: "Vertigo / Dizziness",
      title: "Chakkar Aana — Vertigo",
      description: "Aapke symptoms vertigo ya inner ear issue indicate karte hain. Doctor se checkup recommend kiya jaata hai.",
      severity: "Medium", confidence: 65,
      colorClass: "bg-orange-50 border-orange-200", textColor: "text-orange-900",
      buttonColor: "bg-orange-500 hover:bg-orange-600", iconColor: "text-orange-500",
      medicines: MEDICINES["vertigo"], homeRemedies: REMEDIES["vertigo"],
      precautions: ["Achanak mat uthho", "Gaadi bilkul mat chalao", "Doctor se milein"]
    }
  },
  {
    keywords: ["burning urine", "urination", "uti", "susu mein jalan", "frequent pee", "bladder", "kidney"],
    result: {
      level: "Moderate", actionType: "order_medicine",
      disease: "Urinary Tract Infection (UTI)",
      title: "UTI — Peshab Mein Jalan",
      description: "Aapke symptoms UTI indicate karte hain. Antibiotics ki zaroorat ho sakti hai — doctor se milein.",
      severity: "Medium", confidence: 80,
      colorClass: "bg-orange-50 border-orange-200", textColor: "text-orange-900",
      buttonColor: "bg-orange-500 hover:bg-orange-600", iconColor: "text-orange-500",
      medicines: MEDICINES["uti"], homeRemedies: REMEDIES["uti"],
      precautions: ["Khub paani piyo", "Jaldi doctor se milein — infection kidney tak na pahunche"]
    }
  }
];

// ─── Main Analysis Function ───────────────────────────────────────────────────
export const analyzeSymptoms = async (userAnswers) => {
  const { rawText = "", isEmergency = false } = userAnswers;

  if (isEmergency) {
    return {
      level: "Emergency",
      title: "🚨 Medical Emergency Detected",
      description: "Aapne jo symptoms bataye hain, wo ek serious emergency indicate karte hain. ABHI 112 call karein ya nearest hospital jaayein.",
      actionType: "visit_hospital",
      colorClass: "bg-red-50 border-red-300",
      textColor: "text-red-900",
      buttonColor: "bg-red-600 hover:bg-red-700",
      iconColor: "text-red-600",
      disease: "Medical Emergency",
      medicines: ["112 call karein — abhi"],
      homeRemedies: ["Koi self-treatment nahi — hospital jaayein"],
      precautions: ["Akele mat raho", "Koi bhi khaana-paani nahi"],
      confidence: 99,
      mlPowered: false
    };
  }

  const text = rawText.toLowerCase();

  // ── Try ML API ─────────────────────────────────────────────────────────────
  try {
    const response = await fetch("http://localhost:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: rawText, input_type: "text", language: "en", mode: "text" }),
      signal: AbortSignal.timeout(5000)
    });

    if (response.ok) {
      const data = await response.json();
      const extractedSymptoms = data.symptoms || [];

      // Use debug probabilities (more reliable than threshold-filtered predictions)
      const modelProbs = data.debug?.model_probs_top3 || [];
      const scorerProbs = data.debug?.scorer_top3 || [];

      // Combine ML + scorer results
      const combined = {};
      modelProbs.forEach(p => {
        combined[p.disease] = (combined[p.disease] || 0) + p.prob * 0.5;
      });
      scorerProbs.forEach(p => {
        combined[p.disease] = (combined[p.disease] || 0) + p.prob * 0.5;
      });

      // Also include any above-threshold predictions from data.predictions
      (data.predictions || []).forEach(p => {
        if (p.prob > 0.01) {
          combined[p.disease] = (combined[p.disease] || 0) + p.prob * 0.3;
        }
      });

      const sorted = Object.entries(combined)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);

      if (sorted.length > 0 && sorted[0][1] > 0.02) {
        const topDisease = sorted[0][0];
        const topProb = sorted[0][1];
        const topProb100 = Math.min(Math.round(topProb * 100 * 4), 95); // scale for display

        // Get precautions from original predictions if available
        const origPred = (data.predictions || []).find(p => p.disease === topDisease);
        const precautions = origPred?.precautions || [];

        const allPredictions = sorted.map(([disease, prob], i) => {
          const op = (data.predictions || []).find(p => p.disease === disease);
          return {
            disease: capitalize(disease),
            probability: Math.min(Math.round(prob * 100 * 4), 95),
            severity: op?.severity || (i === 0 ? "Medium" : "Low"),
            precautions: op?.precautions || []
          };
        });

        // Determine severity using local rules + ML
        const localMatch = matchLocalRules(text);
        const severity = localMatch?.result?.severity || allPredictions[0]?.severity || "Medium";
        const diseaseName = capitalize(topDisease);

        const medicines = getMedicines(topDisease);
        const homeRemedies = getRemedies(topDisease);

        const level = severity === "Critical" || severity === "High" ? "Emergency"
          : severity === "Medium" ? "Moderate" : "Mild";

        const colorMap = {
          Emergency: { colorClass: "bg-red-50 border-red-200", textColor: "text-red-900", buttonColor: "bg-danger hover:bg-red-700", iconColor: "text-danger", actionType: "visit_hospital" },
          Moderate:  { colorClass: "bg-orange-50 border-orange-200", textColor: "text-orange-900", buttonColor: "bg-orange-500 hover:bg-orange-600", iconColor: "text-orange-500", actionType: "order_medicine" },
          Mild:      { colorClass: "bg-green-50 border-green-200", textColor: "text-green-900", buttonColor: "bg-secondary hover:bg-green-700", iconColor: "text-secondary", actionType: "home_remedies" }
        };

        return {
          level,
          title: `AI ne identify kiya: ${diseaseName}`,
          description: `Aapke symptoms analysis se ${diseaseName} ki possibility sabse zyada hai (${topProb100}% match). ${level === 'Emergency' ? 'Yeh serious hai — doctor se turant milein.' : level === 'Moderate' ? 'Doctor ya medicine recommend ki jaati hai.' : 'Ghar par treatment se theek ho sakta hai.'}`,
          disease: diseaseName,
          detectedSymptoms: extractedSymptoms,
          allPredictions,
          precautions: precautions.length ? precautions : getDefaultPrecautions(level),
          medicines,
          homeRemedies,
          confidence: topProb100,
          mlPowered: true,
          ...colorMap[level]
        };
      }
    }
  } catch (err) {
    console.warn("ML API unavailable:", err.message);
  }

  // ── Local Rule-Based Analysis ───────────────────────────────────────────────
  const localMatch = matchLocalRules(text);
  if (localMatch) {
    const r = localMatch.result;
    return {
      level: r.level,
      title: r.title,
      description: r.description,
      disease: r.disease,
      actionType: r.actionType,
      colorClass: r.colorClass,
      textColor: r.textColor,
      buttonColor: r.buttonColor,
      iconColor: r.iconColor,
      allPredictions: [{ disease: r.disease, probability: r.confidence, severity: r.severity }],
      precautions: r.precautions || [],
      medicines: r.medicines || [],
      homeRemedies: r.homeRemedies || [],
      confidence: r.confidence,
      mlPowered: false
    };
  }

  // ── Default Mild fallback ───────────────────────────────────────────────────
  return {
    level: "Mild",
    title: "Symptoms Mild Hain",
    description: "Aapke bataye symptoms mild category mein hain. Ghar par rest aur basic care se theek ho sakta hai. Agar 3 din mein better na ho toh doctor se milein.",
    disease: "General Illness",
    actionType: "home_remedies",
    colorClass: "bg-green-50 border-green-200",
    textColor: "text-green-900",
    buttonColor: "bg-secondary hover:bg-green-700",
    iconColor: "text-secondary",
    allPredictions: [],
    precautions: ["Pani piyo", "Rest karo", "Nutritious khana khao"],
    medicines: MEDICINES["default"],
    homeRemedies: REMEDIES["default"],
    confidence: 50,
    mlPowered: false
  };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function matchLocalRules(text) {
  for (const rule of LOCAL_RULES) {
    if (rule.keywords.some(kw => text.includes(kw))) return rule;
  }
  return null;
}

function getMedicines(disease) {
  const d = disease.toLowerCase();
  for (const [key, val] of Object.entries(MEDICINES)) {
    if (d.includes(key) || key.includes(d.split(' ')[0])) return val;
  }
  return MEDICINES["default"];
}

function getRemedies(disease) {
  const d = disease.toLowerCase();
  for (const [key, val] of Object.entries(REMEDIES)) {
    if (d.includes(key) || key.includes(d.split(' ')[0])) return val;
  }
  return REMEDIES["default"];
}

function getDefaultPrecautions(level) {
  if (level === "Emergency") return ["Turant 112 call karein", "Koi physical effort mat karein"];
  if (level === "Moderate") return ["Doctor se milein", "Rest karo", "Khub paani piyo"];
  return ["Rest karo", "Paani piyo", "Nutritious khana khao"];
}

function capitalize(str) {
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

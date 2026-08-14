// ─── Localized Medicine Suggestions ─────────────────────────────────────────
const MEDICINES = {
  en: {
    "viral fever": ["Paracetamol 500mg (Every 6 hours)", "ORS Sachets", "Vitamin C 500mg"],
    "typhoid": ["Azithromycin (Consult doctor)", "Cefixime", "Paracetamol"],
    "malaria": ["Artemether-Lumefantrine (Consult doctor)", "Paracetamol for fever", "ORS"],
    "dengue": ["Paracetamol (Avoid Aspirin/Ibuprofen)", "ORS", "Papaya leaf extract"],
    "pneumonia": ["Amoxicillin (Consult doctor)", "Azithromycin", "Paracetamol"],
    "common cold": ["Cetirizine 10mg", "Paracetamol", "Vitamin C", "Steam inhalation"],
    "influenza": ["Paracetamol 500mg", "Cetirizine", "Oseltamivir (Consult doctor)"],
    "hypertension": ["Amlodipine (Consult doctor)", "Losartan (Consult doctor)", "Monitor BP daily"],
    "diabetes": ["Metformin (Consult doctor)", "Blood sugar monitoring", "Dietary control"],
    "asthma": ["Salbutamol Inhaler", "Budesonide Inhaler (Consult doctor)", "Montelukast"],
    "migraine": ["Sumatriptan (Consult doctor)", "Paracetamol", "Ibuprofen"],
    "gastroenteritis": ["ORS Sachets", "Probiotics (Lactobacillus)", "Loperamide"],
    "acid reflux": ["Omeprazole 20mg", "Antacid Syrup/Chewables", "Dietary modification"],
    "uti": ["Nitrofurantoin (Consult doctor)", "Ciprofloxacin (Consult doctor)", "Cranberry extract"],
    "anemia": ["Ferrous Sulphate (Iron)", "Folic Acid", "Vitamin B12"],
    "allergy": ["Cetirizine 10mg", "Fexofenadine", "Calamine lotion"],
    "chicken pox": ["Acyclovir (Consult doctor)", "Calamine lotion", "Antihistamine for itching"],
    "tuberculosis": ["DOTS Therapy (Consult doctor)", "Rifampicin + Isoniazid"],
    "heart attack": ["Aspirin 325mg (Immediate)", "Call Emergency — 112"],
    "fungal infection": ["Clotrimazole cream", "Fluconazole (Consult doctor)", "Antifungal powder"],
    "vertigo": ["Meclizine", "Betahistine", "Vestibular exercises"],
    "default": ["Paracetamol 500mg", "ORS Sachets", "Vitamin C", "Consult a registered physician"]
  },
  hi: {
    "viral fever": ["पैरासिटामोल 500mg (हर 6 घंटे)", "ORS पैकेट", "विटामिन C 500mg"],
    "typhoid": ["एज़िथ्रोमाइसिन (डॉक्टर की सलाह से)", "सेफिक्सिम", "पैरासिटामोल"],
    "malaria": ["आर्टेमेथर-लुमेफैंट्रिन (डॉक्टर सलाह)", "बुखार के लिए पैरासिटामोल", "ORS"],
    "dengue": ["पैरासिटामोल (एस्पिरिन/आईबूप्रोफेन न लें)", "ORS घोल", "पपीते की पत्ती का रस"],
    "pneumonia": ["अमोक्सिसिलिन (डॉक्टर सलाह)", "एज़िथ्रोमाइसिन", "पैरासिटामोल"],
    "common cold": ["सिटिरिज़िन 10mg", "पैरासिटामोल", "विटामिन C", "भाप लें (Steam)"],
    "influenza": ["पैरासिटामोल 500mg", "सिटिरिज़िन", "ओसेल्टामिविर (डॉक्टर सलाह)"],
    "hypertension": ["एमलोडिपाइन (डॉक्टर सलाह)", "लोसार्टन", "रोजाना BP चेक करें"],
    "diabetes": ["मेटफॉर्मिन (डॉक्टर सलाह)", "ब्लड शुगर जांच", "परहेज व डाइट नियंत्रण"],
    "asthma": ["साल्बुटामोल इनहेलर", "ब्युडेसोनाइड इनहेलर", "मोंटेलुकास्ट"],
    "migraine": ["सुमाट्रिप्टन (डॉक्टर सलाह)", "पैरासिटामोल", "आईबूप्रोफेन"],
    "gastroenteritis": ["ORS घोल", "प्रोबायोटिक्स (लैक्टोबैसिलस)", "लोपेरामाइड"],
    "acid reflux": ["ओमेप्राजोल 20mg", "एंटासिड सिरप", "खान-पान में बदलाव"],
    "uti": ["नाइट्रोफुरेंटोइन (डॉक्टर सलाह)", "सिप्रोफ्लोक्सासिन", "कैनबेरी सिरप"],
    "anemia": ["फेरस सल्फेट (आयरन)", "फॉलिक एसिड", "विटामिन B12"],
    "allergy": ["सिटिरिज़िन 10mg", "फेक्सोफेनाडाइन", "कैलामाइन लोशन"],
    "chicken pox": ["एसाइक्लोविर (डॉक्टर सलाह)", "कैलामाइन लोशन", "खुजली के लिए एंटीहिस्टामाइन"],
    "tuberculosis": ["DOTS थेरेपी (डॉक्टर सलाह)", "रिफैम्पिसिन + इसोनियाजिड"],
    "heart attack": ["एस्पिरिन 325mg (तुरंत)", "इमरजेंसी कॉल करें — 112"],
    "fungal infection": ["क्लोट्रिमाजोल क्रीम", "फ्लूकोनाज़ोल", "एंटीफंगल पाउडर"],
    "vertigo": ["मेक्लिजिन", "बेटाहिस्टिन", "बैलेंस एक्सरसाइज"],
    "default": ["पैरासिटामोल 500mg", "ORS घोल", "विटामिन C", "डॉक्टर से सलाह लें"]
  }
};

// ─── Localized Home Remedies ──────────────────────────────────────────────────
const REMEDIES = {
  en: {
    "viral fever": ["Hydrate well with lemon water or coconut water", "Apply cool damp cloth on forehead", "Get adequate rest (8+ hours)"],
    "typhoid": ["Eat light, easily digestible food (khichdi, porridge)", "Drink boiled or purified water", "Avoid outside food entirely"],
    "malaria": ["Use mosquito bed nets", "Drink fresh coconut water", "Take complete bed rest"],
    "dengue": ["Drink 3-4 liters of fluids daily", "Fresh papaya leaf extract helps platelet count", "Stay in mosquito-free areas"],
    "common cold": ["Drink warm ginger-honey-lemon tea", "Inhale steam with eucalyptus oil", "Gargle with warm salt water"],
    "influenza": ["Sip warm soups and herbal tea", "Get plenty of rest", "Isolate to prevent spread"],
    "migraine": ["Rest in a quiet, dark room", "Apply cold or warm compress to forehead", "Stay hydrated"],
    "gastroenteritis": ["Drink ORS continuously to prevent dehydration", "Follow BRAT diet (Banana, Rice, Applesauce, Toast)", "Avoid oily and spicy foods"],
    "acid reflux": ["Do not lie down for 2 hours after meals", "Eat smaller, frequent meals", "Elevate head while sleeping"],
    "uti": ["Drink 8-10 glasses of water daily", "Drink unsweetened cranberry juice", "Avoid caffeine and alcohol"],
    "allergy": ["Identify and avoid allergen triggers", "Apply cold compress on itchy skin", "Avoid histamine-rich foods"],
    "hypertension": ["Reduce daily sodium/salt intake", "Engage in 30 mins light exercise daily", "Practice yoga or meditation"],
    "diabetes": ["Follow a low-sugar, low-carb diet", "Walk 30 minutes every day", "Track fasting sugar regularly"],
    "fungal infection": ["Keep affected skin dry and clean", "Wear loose, breathable cotton clothes", "Expose area to gentle sunlight"],
    "vertigo": ["Avoid sudden head movements", "Perform Epley or Brandt-Daroff maneuvers", "Limit caffeine intake"],
    "default": ["Drink plenty of water", "Ensure 7-8 hours of sound sleep", "Eat fresh fruits and vegetables"]
  },
  hi: {
    "viral fever": ["नींबू पानी या नारियल पानी से शरीर को हाइड्रेटेड रखें", "माथे पर ठंडे पानी की पट्टी रखें", "पूरा आराम करें (8+ घंटे)"],
    "typhoid": ["हल्का व सुपाच्य भोजन लें (खिचड़ी, दलिया)", "उबला हुआ या साफ पानी ही पिएं", "बाहर का खाना पूरी तरह बंद रखें"],
    "malaria": ["मच्छरदानी का प्रयोग करें", "ताजा नारियल पानी पिएं", "बिस्तर पर पूरा आराम करें"],
    "dengue": ["दिन में 3-4 लीटर तरल पदार्थ पिएं", "पपीते के पत्तों का रस प्लेटलेट्स बढ़ाने में मददगार है", "मच्छरों से बचाव रखें"],
    "common cold": ["अदरक, शहद और नींबू की गुनगुनी चाय पिएं", "भाप लें (Steam inhalation)", "गुनगुने नमक के पानी से गरारे करें"],
    "influenza": ["गरम सूप और हर्बल चाय पिएं", "अधिक से अधिक आराम करें", "दूसरों में संक्रमण फैलने से बचाएं"],
    "migraine": ["शांत और अंधेरे कमरे में आराम करें", "माथे पर ठंडी या गुनगुनी पट्टी रखें", "पर्याप्त पानी पिएं"],
    "gastroenteritis": ["डीहाइड्रेशन से बचने के लिए ORS घोल पिएं", "हल्का खाना (केला, चावल, टोस्ट) लें", "तले-भुने व मसालेदार खाने से बचें"],
    "acid reflux": ["खाने के 2 घंटे बाद तक न सोएं", "एक बार में ज्यादा खाने की जगह थोड़ा-थोड़ा खाएं", "सोते समय सिर थोड़ा ऊंचा रखें"],
    "uti": ["रोजाना 8-10 गिलास पानी पिएं", "क्रैनबेरी जूस पिएं", "चाय-कॉफी व कैफीन से बचें"],
    "allergy": ["एलर्जी ट्रिगर करने वाली चीजों से दूर रहें", "खुजली वाली त्वचा पर ठंडी पट्टी लगाएं", "त्वचा को साफ रखें"],
    "hypertension": ["भोजन में नमक की मात्रा कम करें", "रोजाना 30 मिनट हल्की वॉक करें", "तनाव कम करने के लिए ध्यान/योग करें"],
    "diabetes": ["कम चीनी और कम कार्ब्स वाला भोजन लें", "रोजाना 30 मिनट टहलें", "ब्लड शुगर की नियमित जांच करें"],
    "fungal infection": ["प्रभावित जगह को सूखा और साफ रखें", "सूती व ढीले कपड़े पहनें", "नमी और पसीने से बचाएं"],
    "vertigo": ["अचानक झटका देकर न उठें", "संतुलन बनाने वाले व्यायाम करें", "कैफीन का सेवन कम करें"],
    "default": ["खूब पानी पिएं", "7-8 घंटे की पूरी नींद लें", "ताजे फल और हरी सब्जियां खाएं"]
  }
};

// ─── Local Rules ──────────────────────────────────────────────────────────────
const LOCAL_RULES = [
  {
    keywords: ["chest pain", "seene mein dard", "left arm", "jaw pain", "heart attack"],
    result: {
      en: {
        level: "Emergency", actionType: "visit_hospital",
        disease: "Possible Cardiac Event",
        title: "🚨 Emergency: Cardiac Symptoms Detected",
        description: "Your symptoms indicate a possible serious cardiac condition. Call 112 or reach the nearest emergency hospital immediately.",
        severity: "Critical", confidence: 95,
        medicines: MEDICINES.en["heart attack"], homeRemedies: ["CALL 112 IMMEDIATELY", "Aspirin 325mg if available"],
        precautions: ["Do not remain alone", "Avoid any physical exertion", "Keep clothing loose"]
      },
      hi: {
        level: "Emergency", actionType: "visit_hospital",
        disease: "हृदय संबंधी आपात स्थिति",
        title: "🚨 आपातकाल: गंभीर हृदय लक्षण पाए गए",
        description: "आपके लक्षण गंभीर हृदय स्थिति की ओर इशारा करते हैं। तुरंत 112 पर कॉल करें या निकटतम अस्पताल जाएं।",
        severity: "Critical", confidence: 95,
        medicines: MEDICINES.hi["heart attack"], homeRemedies: ["तुरंत 112 पर कॉल करें", "यदि उपलब्ध हो तो एस्पिरिन 325mg लें"],
        precautions: ["अकेले बिल्कुल न रहें", "कोई शारीरिक श्रम न करें", "ढीले कपड़े पहनें"]
      }
    }
  },
  {
    keywords: ["difficulty breathing", "saans nahi", "breathless", "chest tight", "can't breathe"],
    result: {
      en: {
        level: "Emergency", actionType: "visit_hospital",
        disease: "Breathing Emergency",
        title: "🚨 Emergency: Severe Respiratory Distress",
        description: "Difficulty in breathing requires urgent medical evaluation at a hospital emergency room.",
        severity: "Critical", confidence: 90,
        medicines: ["Salbutamol Inhaler (if asthmatic)", "Medical Oxygen (at hospital)"],
        homeRemedies: ["Sit upright — do not lie flat", "Loosen tight clothing"],
        precautions: ["Call 112 immediately", "Keep room ventilated"]
      },
      hi: {
        level: "Emergency", actionType: "visit_hospital",
        disease: "सांस लेने में गंभीर समस्या",
        title: "🚨 आपातकाल: सांस फूलने की समस्या",
        description: "सांस लेने में तकलीफ एक गंभीर चिकित्सा आपात स्थिति है। तुरंत अस्पताल जाएं।",
        severity: "Critical", confidence: 90,
        medicines: ["साल्बुटामोल इनहेलर (यदि दमा हो)", "अस्पताल में ऑक्सीजन सहायता"],
        homeRemedies: ["सीधे बैठें — लेटें बिल्कुल नहीं", "कपड़े ढीले करें"],
        precautions: ["तुरंत 112 पर कॉल करें", "कमरे को हवादार रखें"]
      }
    }
  },
  {
    keywords: ["high fever", "103", "104", "bahut tez bukhar", "very high fever", "shivering fever"],
    result: {
      en: {
        level: "Emergency", actionType: "visit_hospital",
        disease: "High Grade Fever (Possible Infection)",
        title: "High Grade Fever — Urgent Medical Checkup Needed",
        description: "High temperature (103°F+) could signal a severe infection such as typhoid, dengue, or pneumonia.",
        severity: "High", confidence: 78,
        medicines: MEDICINES.en["typhoid"], homeRemedies: REMEDIES.en["viral fever"],
        precautions: ["Drink plenty of fluids", "Get diagnostic blood tests done", "Consult a registered doctor promptly"]
      },
      hi: {
        level: "Emergency", actionType: "visit_hospital",
        disease: "तेज बुखार (गंभीर संक्रमण)",
        title: "तेज बुखार — डॉक्टर की तत्काल सलाह आवश्यक",
        description: "103°F से अधिक तेज बुखार टाइफाइड, डेंगू या निमोनिया जैसे संक्रमण का संकेत हो सकता है।",
        severity: "High", confidence: 78,
        medicines: MEDICINES.hi["typhoid"], homeRemedies: REMEDIES.hi["viral fever"],
        precautions: ["प्रचुर मात्रा में पानी पिएं", "ब्लड टेस्ट कराएं", "तुरंत डॉक्टर से परामर्श लें"]
      }
    }
  },
  {
    keywords: ["fever", "bukhar", "temperature", "chills", "body ache", "headache", "sirdard bukhar"],
    result: {
      en: {
        level: "Moderate", actionType: "order_medicine",
        disease: "Viral Fever / Flu",
        title: "Viral Fever or Influenza",
        description: "Your symptoms align with a common viral fever or flu. Most symptoms subside in 2-3 days with OTC medication and rest.",
        severity: "Medium", confidence: 72,
        medicines: MEDICINES.en["viral fever"], homeRemedies: REMEDIES.en["viral fever"],
        precautions: ["If fever persists over 3 days, get a blood test done", "Drink ample fluids", "Take complete rest"]
      },
      hi: {
        level: "Moderate", actionType: "order_medicine",
        disease: "वायरल बुखार / फ्लू",
        title: "वायरल बुखार या फ्लू",
        description: "आपके लक्षण वायरल बुखार या फ्लू दर्शाते हैं। उचित आराम व दवाइयों से 2-3 दिनों में सुधार होता है।",
        severity: "Medium", confidence: 72,
        medicines: MEDICINES.hi["viral fever"], homeRemedies: REMEDIES.hi["viral fever"],
        precautions: ["यदि 3 दिन बाद भी आराम न मिले तो जांच कराएं", "खूब पानी पिएं", "पूरा आराम करें"]
      }
    }
  },
  {
    keywords: ["stomach pain", "peth mein dard", "nausea", "vomiting", "ulti", "diarrhea", "loose motion", "peth dard"],
    result: {
      en: {
        level: "Moderate", actionType: "order_medicine",
        disease: "Gastroenteritis / Food Poisoning",
        title: "Gastrointestinal Distress / Stomach Infection",
        description: "Your symptoms suggest acute gastroenteritis or food poisoning. Prevent dehydration by taking ORS solution.",
        severity: "Medium", confidence: 68,
        medicines: MEDICINES.en["gastroenteritis"], homeRemedies: REMEDIES.en["gastroenteritis"],
        precautions: ["Sip ORS after every loose stool", "Avoid outside or oily food", "Consult doctor if vomiting is persistent"]
      },
      hi: {
        level: "Moderate", actionType: "order_medicine",
        disease: "पेट में इन्फेक्शन / गैस्ट्रोएंटराइटिस",
        title: "पेट की समस्या / फूड पाइजनिंग",
        description: "आपके लक्षण पेट में इन्फेक्शन या फूड पाइजनिंग दर्शाते हैं। शरीर में पानी की कमी न होने दें और ORS लें।",
        severity: "Medium", confidence: 68,
        medicines: MEDICINES.hi["gastroenteritis"], homeRemedies: REMEDIES.hi["gastroenteritis"],
        precautions: ["दस्त के बाद ORS घोल पिएं", "बाहर का खाना न खाएं", "उल्टी न रुकने पर डॉक्टर से मिलें"]
      }
    }
  },
  {
    keywords: ["cough", "khansi", "sore throat", "gala dard", "cold", "nasal", "runny nose", "congestion"],
    result: {
      en: {
        level: "Mild", actionType: "home_remedies",
        disease: "Common Cold / Upper Respiratory Infection",
        title: "Common Cold & Sore Throat",
        description: "Your symptoms indicate a mild common cold or upper respiratory infection. Home remedies and rest usually clear this in 4-6 days.",
        severity: "Low", confidence: 75,
        medicines: MEDICINES.en["common cold"], homeRemedies: REMEDIES.en["common cold"],
        precautions: ["Avoid close contact with others", "Wash hands regularly", "Drink warm fluids"]
      },
      hi: {
        level: "Mild", actionType: "home_remedies",
        disease: "सामान्य जुकाम व सर्दी-खांसी",
        title: "सामान्य सर्दी-जुकाम और गले में खराश",
        description: "आपके लक्षण हल्के जुकाम या ऊपरी श्वसन संक्रमण के हैं। घरेलू देखभाल से 4-6 दिनों में आराम मिलता है।",
        severity: "Low", confidence: 75,
        medicines: MEDICINES.hi["common cold"], homeRemedies: REMEDIES.hi["common cold"],
        precautions: ["दूसरों से दूरी बनाकर रखें", "बार-बार हाथ धोएं", "गुनगुना पानी पिएं"]
      }
    }
  },
  {
    keywords: ["rash", "itching", "khujli", "daane", "allergy", "hives", "skin"],
    result: {
      en: {
        level: "Mild", actionType: "order_medicine",
        disease: "Allergic Reaction / Skin Allergy",
        title: "Skin Allergy or Hives",
        description: "Your symptoms point to an allergic skin reaction. Identify recent food, detergent, or cosmetic triggers.",
        severity: "Low", confidence: 65,
        medicines: MEDICINES.en["allergy"], homeRemedies: REMEDIES.en["allergy"],
        precautions: ["Avoid scratching the affected area", "Discontinue any new cosmetic or food item"]
      },
      hi: {
        level: "Mild", actionType: "order_medicine",
        disease: "त्वचा की एलर्जी / स्किन रैश",
        title: "त्वचा की एलर्जी या पित्ती",
        description: "आपके लक्षण एलर्जिक स्किन रिएक्शन की ओर इशारा करते हैं। हाल ही में इस्तेमाल की नई चीजों से बचें।",
        severity: "Low", confidence: 65,
        medicines: MEDICINES.hi["allergy"], homeRemedies: REMEDIES.hi["allergy"],
        precautions: ["प्रभावित स्थान पर खुजली न करें", "नई क्रीम या साबुन का प्रयोग रोक दें"]
      }
    }
  },
  {
    keywords: ["headache", "sirdard", "migraine", "head pain", "throbbing", "sir dard"],
    result: {
      en: {
        level: "Mild", actionType: "home_remedies",
        disease: "Tension Headache / Migraine",
        title: "Tension Headache or Migraine Episode",
        description: "Your symptoms indicate a tension headache or mild migraine. Adequate rest in a dark room provides fast relief.",
        severity: "Low", confidence: 70,
        medicines: MEDICINES.en["migraine"], homeRemedies: REMEDIES.en["migraine"],
        precautions: ["Minimize screen time and eye strain", "Maintain regular sleep cycles", "Stay well hydrated"]
      },
      hi: {
        level: "Mild", actionType: "home_remedies",
        disease: "सिरदर्द / माइग्रेन",
        title: "सिरदर्द — तनाव या माइग्रेन",
        description: "आपके लक्षण तनावपूर्ण सिरदर्द या माइग्रेन के हैं। शांत कमरे में आराम करने से राहत मिलती है।",
        severity: "Low", confidence: 70,
        medicines: MEDICINES.hi["migraine"], homeRemedies: REMEDIES.hi["migraine"],
        precautions: ["स्क्रीन टाइम कम करें", "नींद का समय निश्चित रखें", "पर्याप्त पानी पिएं"]
      }
    }
  }
];

import { ML_API_URL } from '../config/apiConfig';

// ─── Main Analysis Function ───────────────────────────────────────────────────
export const analyzeSymptoms = async (userAnswers) => {
  const { rawText = "", isEmergency = false, lang = "en" } = userAnswers;
  const lKey = lang === "hi" ? "hi" : "en";

  if (isEmergency) {
    return {
      lang: lKey,
      level: "Emergency",
      title: lKey === "hi" ? "🚨 आपातकालीन स्थिति" : "🚨 Emergency Detected",
      description: lKey === "hi"
        ? "आपके लक्षण एक गंभीर आपात स्थिति की ओर इशारा करते हैं। तुरंत 112 पर कॉल करें या निकटतम अस्पताल जाएं।"
        : "Your described symptoms indicate a critical medical emergency. Call 112 or visit the nearest hospital emergency room immediately.",
      actionType: "visit_hospital",
      colorClass: "bg-red-50 border-red-300",
      textColor: "text-red-900",
      buttonColor: "bg-red-600 hover:bg-red-700",
      iconColor: "text-red-600",
      disease: lKey === "hi" ? "चिकित्सा आपातकाल" : "Medical Emergency",
      medicines: [lKey === "hi" ? "तुरंत 112 डायल करें" : "Call 112 immediately"],
      homeRemedies: [lKey === "hi" ? "अस्पताल की ओर जाएं" : "Seek emergency room care"],
      precautions: [lKey === "hi" ? "अकेले न रहें" : "Do not remain alone"],
      confidence: 99,
      mlPowered: false
    };
  }

  const text = rawText.toLowerCase();

  // ── Local Rule-Based Analysis ───────────────────────────────────────────────
  const localMatch = matchLocalRules(text);
  let baseResult = null;
  if (localMatch) {
    baseResult = localMatch.result[lKey] || localMatch.result["en"];
  }

  // ── Try ML API ─────────────────────────────────────────────────────────────
  try {
    const response = await fetch(`${ML_API_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: rawText, input_type: "text", language: lKey, mode: "text" }),
      signal: AbortSignal.timeout(4000)
    });

    if (response.ok) {
      const data = await response.json();
      const extractedSymptoms = data.symptoms || [];

      const modelProbs = data.debug?.model_probs_top3 || [];
      const scorerProbs = data.debug?.scorer_top3 || [];

      const combined = {};
      modelProbs.forEach(p => { combined[p.disease] = (combined[p.disease] || 0) + p.prob * 0.5; });
      scorerProbs.forEach(p => { combined[p.disease] = (combined[p.disease] || 0) + p.prob * 0.5; });

      (data.predictions || []).forEach(p => {
        if (p.prob > 0.01) combined[p.disease] = (combined[p.disease] || 0) + p.prob * 0.3;
      });

      const sorted = Object.entries(combined).sort((a, b) => b[1] - a[1]).slice(0, 6);

      if (sorted.length > 0 && sorted[0][1] > 0.02) {
        const topDisease = sorted[0][0];
        const topProb = sorted[0][1];
        const topProb100 = Math.min(Math.round(topProb * 100 * 4), 95);

        const predList = (lKey === "hi" && data.predictions_translated?.length) ? data.predictions_translated : (data.predictions || []);
        const origPred = predList.find(p => p.disease === topDisease || p.disease.toLowerCase().includes(topDisease.toLowerCase()));
        const precautions = origPred?.precautions || [];

        const allPredictions = sorted.map(([disease, prob], i) => {
          const op = predList.find(p => p.disease === disease || p.disease.toLowerCase().includes(disease.toLowerCase()));
          return {
            disease: capitalize(disease),
            probability: Math.min(Math.round(prob * 100 * 4), 95),
            severity: op?.severity || (i === 0 ? "Medium" : "Low"),
            precautions: op?.precautions || []
          };
        });

        const severity = baseResult?.severity || allPredictions[0]?.severity || "Medium";
        const diseaseName = capitalize(topDisease);

        const medicines = getMedicines(topDisease, lKey);
        const homeRemedies = getRemedies(topDisease, lKey);

        const level = severity === "Critical" || severity === "High" ? "Emergency"
          : severity === "Medium" ? "Moderate" : "Mild";

        const colorMap = {
          Emergency: { colorClass: "bg-red-50 border-red-200", textColor: "text-red-900", buttonColor: "bg-danger hover:bg-red-700", iconColor: "text-danger", actionType: "visit_hospital" },
          Moderate:  { colorClass: "bg-orange-50 border-orange-200", textColor: "text-orange-900", buttonColor: "bg-orange-500 hover:bg-orange-600", iconColor: "text-orange-500", actionType: "order_medicine" },
          Mild:      { colorClass: "bg-green-50 border-green-200", textColor: "text-green-900", buttonColor: "bg-secondary hover:bg-green-700", iconColor: "text-secondary", actionType: "home_remedies" }
        };

        return {
          lang: lKey,
          level,
          title: lKey === "hi" ? `AI द्वारा पहचान: ${diseaseName}` : `AI Diagnosis: ${diseaseName}`,
          description: lKey === "hi"
            ? `आपके लक्षणों के विश्लेषण से ${diseaseName} की संभावना पाई गई है (${topProb100}% मैच)। ${level === 'Emergency' ? 'यह गंभीर है — तुरंत डॉक्टर से मिलें।' : 'सही आराम और दवाओं से सुधार हो सकता है।'}`
            : `Symptoms match ${diseaseName} with ${topProb100}% confidence. ${level === 'Emergency' ? 'Urgent doctor consultation recommended.' : 'Proper rest and OTC care recommended.'}`,
          disease: diseaseName,
          detectedSymptoms: extractedSymptoms,
          allPredictions,
          precautions: precautions.length ? precautions : getDefaultPrecautions(level, lKey),
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

  // ── Local Rule Fallback ──────────────────────────────────────────────────────
  if (baseResult) {
    return {
      lang: lKey,
      level: baseResult.level,
      title: baseResult.title,
      description: baseResult.description,
      disease: baseResult.disease,
      actionType: baseResult.actionType,
      colorClass: "bg-orange-50 border-orange-200",
      textColor: "text-orange-900",
      buttonColor: "bg-orange-500 hover:bg-orange-600",
      iconColor: "text-orange-500",
      allPredictions: [{ disease: baseResult.disease, probability: baseResult.confidence, severity: baseResult.severity }],
      precautions: baseResult.precautions || [],
      medicines: baseResult.medicines || [],
      homeRemedies: baseResult.homeRemedies || [],
      confidence: baseResult.confidence,
      mlPowered: false
    };
  }

  // ── Default Fallback ────────────────────────────────────────────────────────
  return {
    lang: lKey,
    level: "Mild",
    title: lKey === "hi" ? "लक्षण सामान्य हैं" : "Mild Condition Detected",
    description: lKey === "hi"
      ? "आपके द्वारा दर्ज लक्षण सामान्य श्रेणी में हैं। पर्याप्त आराम और तरल पदार्थों से सुधार होना चाहिए।"
      : "Your reported symptoms appear mild. Rest and hydration will help you recover in 2-3 days.",
    disease: lKey === "hi" ? "सामान्य अस्वस्थता" : "General Indisposition",
    actionType: "home_remedies",
    colorClass: "bg-green-50 border-green-200",
    textColor: "text-green-900",
    buttonColor: "bg-secondary hover:bg-green-700",
    iconColor: "text-secondary",
    allPredictions: [],
    precautions: getDefaultPrecautions("Mild", lKey),
    medicines: MEDICINES[lKey]["default"],
    homeRemedies: REMEDIES[lKey]["default"],
    confidence: 50,
    mlPowered: false
  };
};

function matchLocalRules(text) {
  for (const rule of LOCAL_RULES) {
    if (rule.keywords.some(kw => text.includes(kw))) return rule;
  }
  return null;
}

function getMedicines(disease, lang = "en") {
  const d = disease.toLowerCase();
  const dict = MEDICINES[lang] || MEDICINES.en;
  for (const [key, val] of Object.entries(dict)) {
    if (d.includes(key) || key.includes(d.split(' ')[0])) return val;
  }
  return dict["default"];
}

function getRemedies(disease, lang = "en") {
  const d = disease.toLowerCase();
  const dict = REMEDIES[lang] || REMEDIES.en;
  for (const [key, val] of Object.entries(dict)) {
    if (d.includes(key) || key.includes(d.split(' ')[0])) return val;
  }
  return dict["default"];
}

function getDefaultPrecautions(level, lang = "en") {
  if (lang === "hi") {
    if (level === "Emergency") return ["तुरंत 112 पर कॉल करें", "कोई शारीरिक श्रम न करें"];
    return ["पूरा आराम करें", "पर्याप्त पानी पिएं", "पौष्टिक आहार लें"];
  }
  if (level === "Emergency") return ["Call 112 immediately", "Avoid physical exertion"];
  return ["Take adequate rest", "Stay hydrated", "Eat nutritious food"];
}

function capitalize(str) {
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}


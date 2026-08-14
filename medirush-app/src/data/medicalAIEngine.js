/**
 * MediRush Medical AI Engine v4
 * - Greeting + casual chat handled naturally
 * - Conversation continues until user says "bas" / "that's all"
 * - Hindi & English language support with translated summaries
 */

// ─── Language Strings ─────────────────────────────────────────────────────────
export const LANG = {
  en: {
    greeting_reply: ["Hello! 😊 I'm MediRush AI. How are you feeling today? Please tell me about your symptoms.", "Hi there! 👋 I'm here to help. What symptoms are you experiencing?", "Hey! Good to see you. What health concern can I help you with today?"],
    howAreYou_reply: ["I'm here and ready to help you! 😊 Tell me — what symptoms are you experiencing?", "Thanks for asking! I'm always here for you. Now, how are *you* feeling? Any symptoms?"],
    fine_reply: ["That's great to hear! 😊 But since you're here, is there something health-related I can help with?", "Glad to hear that! Is there anything specific — a symptom, medicine query, or health concern?"],
    thanks_reply: ["You're welcome! 😊 Anything else I can help with? Any symptoms or health concerns?"],
    symptom_acknowledge: ["Okay, I understand. Let me ask a few more questions.", "Got it. A couple more things I'd like to know.", "I see. Let me understand better."],
    done_trigger: ["bas", "that's all", "nothing else", "i'm done", "no more", "done", "finish", "end", "complete"],
    done_reply: "Thank you for sharing! 🔍 Let me now analyze your full symptoms...",
    continue_prompt: "Is there anything else you'd like to mention about your symptoms or health? (If done, just say 'that's all')",
    duration_q: ["How long have you had these symptoms? (e.g., 1 day, 3 days, a week)", "Since when are you feeling this way?", "How many days has this been going on?"],
    history_q: ["What's your age? Any existing conditions like diabetes, BP, or asthma?", "Do you have any past medical history I should know about?"],
    meds_q: ["Are you taking any medicines currently? Tried anything for relief?", "Any medications you're on right now?"],
    analyzing: "Thank you for all the details! 🔍 Analyzing your symptoms with AI now...",
    emergency: "🚨 What you're describing sounds like a serious emergency. Please call 112 immediately or go to the nearest hospital right away. Do not wait.",
  },
  hi: {
    greeting_reply: ["नमस्ते! 😊 मैं MediRush AI हूँ। आज आप कैसा महसूस कर रहे हैं? अपने लक्षण बताएं।", "नमस्ते! 👋 मैं आपकी मदद के लिए यहाँ हूँ। आपको क्या लक्षण अनुभव हो रहे हैं?", "नमस्ते! आपको कोई भी स्वास्थ्य संबंधी समस्या हो तो मुझसे साझा करें।"],
    howAreYou_reply: ["मैं ठीक हूँ, धन्यवाद! 😊 आप बताएं — आप कैसा महसूस कर रहे हैं? कोई लक्षण हैं?", "पूछने के लिए धन्यवाद! मैं हमेशा आपकी सहायता के लिए तैयार हूँ। आप बताएं, क्या लक्षण हैं?"],
    fine_reply: ["यह सुनकर बहुत अच्छा लगा! 😊 यदि स्वास्थ्य से जुड़ा कोई सवाल हो तो जरूर पूछें।", "बहुत बढ़िया! क्या कोई विशेष लक्षण या स्वास्थ्य चिंता है जिसके बारे में आप पूछना चाहते हैं?"],
    thanks_reply: ["आपका स्वागत है! 😊 क्या मैं आपकी किसी अन्य स्वास्थ्य समस्या में मदद कर सकता हूँ?"],
    symptom_acknowledge: ["ठीक है, मैं समझ गया। मुझे कुछ और प्रश्न पूछने दें।", "समझ गया। कुछ और बातें जानना चाहता हूँ।", "ठीक है। स्थिति को बेहतर समझने के लिए कुछ प्रश्न पूछ रहा हूँ।"],
    done_trigger: ["बस", "यही है", "और नहीं", "हो गया", "खत्म", "ठीक है बस", "और कुछ नहीं", "इतना ही", "done", "finish", "that's all"],
    done_reply: "धन्यवाद! 🔍 अब मैं आपके सभी लक्षणों का AI विश्लेषण कर रहा हूँ...",
    continue_prompt: "क्या आप अपने लक्षणों या स्वास्थ्य के बारे में कुछ और बताना चाहते हैं? (यदि हो गया हो, तो 'बस' कहें)",
    duration_q: ["यह लक्षण कितने दिनों से हैं? (जैसे — 1 दिन, 3 दिन, या एक हफ्ता)", "आपको यह समस्या कब से हो रही है?", "कितने दिनों या घंटों से यह लक्षण महसूस हो रहे हैं?"],
    history_q: ["आपकी उम्र कितनी है? क्या आपको पहले से कोई बीमारी है जैसे डायबिटीज, बीपी, या दमा?", "क्या कोई पुरानी मेडिकल हिस्ट्री है जो मुझे जाननी चाहिए?"],
    meds_q: ["क्या अभी कोई दवा ले रहे हैं? राहत के लिए कुछ लिया है?", "क्या आप वर्तमान में कोई नियमित दवाइयां ले रहे हैं?"],
    analyzing: "धन्यवाद! 🔍 आपके दिए गए विवरण के आधार पर AI विश्लेषण जारी है...",
    emergency: "🚨 आपके द्वारा बताए गए लक्षण किसी गंभीर आपात स्थिति का संकेत दे रहे हैं। कृपया तुरंत 112 पर कॉल करें या निकटतम अस्पताल जाएं। देर न करें।",
  }
};

// ─── Symptom Keyword Detection ────────────────────────────────────────────────
const SYMPTOM_DETECT = {
  fever: { en: ["fever", "temperature", "chills", "shivering", "sweating", "hot", "101", "102", "103"], hi: ["bukhar", "garmi", "thanda lagna", "kaanpna", "pasinaa"] },
  headache: { en: ["headache", "migraine", "head pain", "head hurts", "throbbing"], hi: ["sirdard", "sar dard", "sir mein dard", "sir dukh"] },
  cough: { en: ["cough", "cold", "sore throat", "mucus", "phlegm", "runny nose", "congestion", "hoarse"], hi: ["khansi", "sardi", "gala dard", "bulagam", "naak band", "gala kharab"] },
  stomach: { en: ["stomach", "nausea", "vomit", "diarrhea", "indigestion", "gas", "bloating", "acidity"], hi: ["peth", "ulti", "loose motion", "jalan", "gas", "peth dard", "acidity"] },
  pain: { en: ["pain", "ache", "hurt", "sore", "joint pain", "body ache", "back pain"], hi: ["dard", "dukh", "jodon mein dard", "body ache", "kamar dard"] },
  breathing: { en: ["breath", "breathless", "chest tight", "wheeze", "asthma"], hi: ["saans", "saans lene mein takleef", "chest tight"] },
  skin: { en: ["rash", "itching", "allergy", "hives", "skin", "bumps"], hi: ["daane", "khujli", "allergy", "rash", "skin"] },
  weakness: { en: ["weak", "fatigue", "tired", "dizzy", "faint", "exhausted"], hi: ["kamzori", "thakaan", "chakkar", "behoshi", "thaka"] },
  urinary: { en: ["urine", "pee", "burning urination", "uti", "bladder"], hi: ["susu", "peshab", "jalan peshab", "baar baar susu"] },
};

const GREETING_WORDS = ["hi", "hello", "hey", "namaste", "namaskar", "hii", "helo", "good morning", "good evening", "good afternoon", "sup", "howdy", "yo"];
const HOW_ARE_YOU = ["how are you", "kaisa ho", "kaise ho", "aap kaise", "how r u", "how do you do", "wassup", "what's up"];
const FINE_WORDS = ["i'm fine", "main theek", "theek hun", "all good", "doing well", "i am fine", "mein theek hoon"];
const THANKS_WORDS = ["thank", "shukriya", "dhanyawad", "thanks", "thankyou", "thank you"];

const EMERGENCY_WORDS = ["chest pain", "seene mein dard", "can't breathe", "saans nahi", "heart attack", "stroke", "unconscious", "behosh", "severe bleeding", "bahut khoon", "seizure", "dauraa"];

const SPECIFIC_QUESTIONS = {
  fever: {
    en: ["How high is your fever? Above 101°F? Do you have chills or sweating along with it?", "Is the fever constant or does it come and go? Any body ache?"],
    hi: ["बुखार कितना तेज है? 101°F से अधिक? क्या साथ में ठंड या पसीना आ रहा है?", "क्या बुखार लगातार बना हुआ है या उतरता-चढ़ता है? क्या शरीर में दर्द भी है?"]
  },
  headache: {
    en: ["Where's the pain — front, back, or sides? Is it throbbing or a constant pressure?", "Does it get worse with light or sound? Any nausea along with it?"],
    hi: ["सिरदर्द कहाँ है — आगे, पीछे या सिर के किनारों पर? क्या कसक या दबाव महसूस होता है?", "क्या तेज़ रोशनी या आवाज से दर्द बढ़ता है? क्या मिचली या उल्टी जैसी अनुभूति है?"]
  },
  cough: {
    en: ["Dry cough or with mucus? If mucus, what color?", "Is it worse at night? Any nasal congestion or sore throat?"],
    hi: ["क्या सूखी खांसी है या बलगम आ रहा है? बलगम का रंग कैसा है?", "क्या रात में खांसी अधिक होती है? क्या नाक बंद या गले में खराश है?"]
  },
  stomach: {
    en: ["Is the pain constant or comes after eating? Any vomiting or loose motion?", "Any burning sensation in chest or throat? How many times?"],
    hi: ["क्या पेट दर्द लगातार है या भोजन के बाद होता है? क्या उल्टी या दस्त की समस्या है?", "क्या छाती या गले में जलन महसूस होती है?"]
  },
  pain: {
    en: ["On a scale of 1-10, how severe? Is it in one spot or spreading?", "Did it start suddenly? Any injury before this?"],
    hi: ["1 से 10 के पैमाने पर दर्द कितना तीव्र है? क्या यह एक जगह पर है या फैल रहा है?", "क्या दर्द अचानक शुरू हुआ? क्या इससे पहले कोई चोट लगी थी?"]
  },
  breathing: {
    en: ["Is it constant or only during activity? Does your chest feel tight?"],
    hi: ["क्या सांस फूलने की समस्या लगातार है या काम करने पर होती है? क्या सीने में जकड़न महसूस होती है?"]
  },
  skin: {
    en: ["Where is the rash? Is it spreading? Any fever along with it?", "Did you eat something new or use new soap/medicine recently?"],
    hi: ["त्वचा पर रैश कहाँ हैं? क्या यह फैल रहे हैं? क्या साथ में बुखार भी है?", "क्या हाल ही में कोई नया भोजन, साबुन या दवा ली है?"]
  },
  weakness: {
    en: ["Is it all over or in specific parts? Are you eating and drinking properly?", "Do you feel dizzy when standing up? Any fainting?"],
    hi: ["क्या कमजोरी पूरे शरीर में है? क्या खान-पान ठीक से हो रहा है?", "क्या खड़े होने पर चक्कर आते हैं?"]
  },
  urinary: {
    en: ["Burning when urinating? How frequently? Any unusual urine color?"],
    hi: ["क्या पेशाब करते समय जलन महसूस होती है? कितनी बार जाना पड़ता है? क्या पेशाब का रंग बदला है?"]
  },
};

const GENERAL_Q_KEYS = ["duration", "history", "medications"];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

function detectCategories(text, lang = "en") {
  const lower = text.toLowerCase();
  return Object.entries(SYMPTOM_DETECT)
    .filter(([, data]) => [...(data.en || []), ...(data.hi || [])].some(kw => lower.includes(kw)))
    .map(([cat]) => cat);
}

function isGreeting(text) { return GREETING_WORDS.some(w => text.toLowerCase().trim() === w || text.toLowerCase().startsWith(w + " ") || text.toLowerCase().endsWith(" " + w)); }
function isHowAreYou(text) { return HOW_ARE_YOU.some(w => text.toLowerCase().includes(w)); }
function isFine(text) { return FINE_WORDS.some(w => text.toLowerCase().includes(w)); }
function isThanks(text) { return THANKS_WORDS.some(w => text.toLowerCase().includes(w)); }
function isDoneSignal(text, lang) { return LANG[lang].done_trigger.some(w => text.toLowerCase().trim().includes(w)); }
function isEmergency(text) { return EMERGENCY_WORDS.some(w => text.toLowerCase().includes(w)); }
function hasSymptoms(text) { return detectCategories(text).length > 0 || text.split(" ").length >= 4; }

// ─── Core Engine ──────────────────────────────────────────────────────────────
export class MedicalConversationEngine {
  constructor(lang = "en") {
    this.lang = lang;
    this.initialLang = lang;
    this.reset();
  }

  setLang(lang) { 
    this.lang = lang; 
    this.initialLang = lang;
  }

  reset() {
    this.detectedCats = [];
    this.askedSpecific = {};   // { cat: nextIdx }
    this.askedGeneral = 0;
    this.allAnswers = [];
    this.phase = "greeting";  // greeting | symptoms | specific | general | done
    this.MAX_SPECIFIC_PER_CAT = 1;
    this.MAX_GENERAL = 3;
  }

  process(userText) {
    const lower = userText.toLowerCase().trim();
    const L = LANG[this.lang];

    // ── Emergency ──────────────────────────────────────────────────────────
    if (isEmergency(lower)) {
      return { message: L.emergency, isDone: true, isEmergency: true, summary: `EMERGENCY: ${userText}` };
    }

    // ── Done signal ────────────────────────────────────────────────────────
    if (this.allAnswers.length > 0 && isDoneSignal(userText, this.lang)) {
      return this._finalize(L);
    }

    // ── Greeting phase ─────────────────────────────────────────────────────
    if (this.phase === "greeting" && this.allAnswers.length === 0) {
      if (isGreeting(lower) && !hasSymptoms(lower)) {
        this.allAnswers.push(userText);
        return { message: rand(L.greeting_reply), isDone: false };
      }
      if (isHowAreYou(lower) && !hasSymptoms(lower)) {
        this.allAnswers.push(userText);
        return { message: rand(L.howAreYou_reply), isDone: false };
      }
      if (isFine(lower) && !hasSymptoms(lower)) {
        this.allAnswers.push(userText);
        return { message: rand(L.fine_reply), isDone: false };
      }
      if (isThanks(lower) && !hasSymptoms(lower)) {
        this.allAnswers.push(userText);
        return { message: rand(L.thanks_reply), isDone: false };
      }
    }

    // ── User gives symptoms ────────────────────────────────────────────────
    this.allAnswers.push(userText);
    const cats = detectCategories(lower, this.lang);
    cats.forEach(c => { if (!this.detectedCats.includes(c)) this.detectedCats.push(c); });

    if (this.phase === "greeting" || this.phase === "symptoms") {
      this.phase = "specific";
      cats.forEach(c => { if (!(c in this.askedSpecific)) this.askedSpecific[c] = 0; });
    }

    // ── Ask specific follow-up ─────────────────────────────────────────────
    if (this.phase === "specific") {
      const q = this._nextSpecific(L);
      if (q) {
        return {
          message: rand(L.symptom_acknowledge) + " " + q,
          isDone: false
        };
      }
      this.phase = "general";
    }

    // ── Ask general follow-up ──────────────────────────────────────────────
    if (this.phase === "general") {
      const q = this._nextGeneral(L);
      if (q) return { message: q, isDone: false };
    }

    // ── Enough info — but give user a chance to add more ──────────────────
    if (this.phase !== "done") {
      this.phase = "done";
      return {
        message: L.continue_prompt,
        isDone: false
      };
    }

    return this._finalize(L);
  }

  _nextSpecific(L) {
    for (const cat of this.detectedCats) {
      const qs = SPECIFIC_QUESTIONS[cat]?.[this.lang] || SPECIFIC_QUESTIONS[cat]?.["en"] || [];
      const idx = this.askedSpecific[cat] ?? 0;
      if (idx < qs.length && idx < this.MAX_SPECIFIC_PER_CAT) {
        this.askedSpecific[cat] = idx + 1;
        return qs[idx];
      }
    }
    return null;
  }

  _nextGeneral(L) {
    const generalQs = [
      rand(L.duration_q),
      rand(L.history_q),
      rand(L.meds_q)
    ];
    if (this.askedGeneral < this.MAX_GENERAL) {
      const q = generalQs[this.askedGeneral];
      this.askedGeneral++;
      return q;
    }
    return null;
  }

  _finalize(L) {
    this.phase = "done";
    const summary = this._buildSummary();
    return {
      message: L.analyzing,
      isDone: true,
      isEmergency: false,
      summary,
      lang: this.lang
    };
  }

  _buildSummary() {
    const symptomAnswers = this.allAnswers.filter((_, i) => i > 0 || !isGreeting(this.allAnswers[0]));
    const [main, ...rest] = symptomAnswers.length ? symptomAnswers : this.allAnswers;
    let s = `Chief complaint: ${main || "unspecified"}.`;
    if (rest.length) s += ` Details: ${rest.join(". ")}.`;
    if (this.detectedCats.length) s += ` Categories: ${this.detectedCats.join(", ")}.`;
    return s;
  }
}

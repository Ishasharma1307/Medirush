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
    greeting_reply: ["Namaste! 😊 Main MediRush AI hun. Aaj aap kaisa mehsoos kar rahe hain? Apne symptoms bataaiye.", "Hello ji! 👋 Batao — kya takleef ho rahi hai aapko?", "Namaste! Koi bhi bimari ya takleef ho toh mujhse batao."],
    howAreYou_reply: ["Main theek hun, shukriya! 😊 Aap batao — aap kaisa feel kar rahe hain? Koi symptoms hain?", "Shukriya! Lekin aap yahan hain toh zaroor kuch poochna tha — kya ho raha hai?"],
    fine_reply: ["Bahut achha! 😊 Koi bhi health se related sawaal ho toh poochh sakte ho.", "Yeh sunke achha laga! Kya koi symptoms ya sehat se judi baat hai jo poochna chahte ho?"],
    thanks_reply: ["Koi baat nahi! 😊 Kuch aur help chahiye? Koi symptoms ya sehat ki baat?"],
    symptom_acknowledge: ["Theek hai, samajh gaya. Kuch aur bhi poochhta hun.", "Achha, noted. Ek-do cheezein aur jaanana chahta hun.", "Hmm, theek hai. Thoda aur batao."],
    done_trigger: ["bas", "yahi ho raha hai", "aur nahi", "hua", "khatam", "theek hai bas", "aur kuch nahi", "itna hi", "done", "finish"],
    done_reply: "Shukriya! 🔍 Ab main aapke symptoms ka poora analysis kar raha hun...",
    continue_prompt: "Koi aur symptoms ya baat batana chahte hain? (Agar nahi toh 'bas' bolein)",
    duration_q: ["Yeh symptoms kitne din se hain? (Jaise — 1 din, 3 din, hafte bhar)", "Kab se yeh ho raha hai?", "Kitne ghante ya din se feel ho raha hai?"],
    history_q: ["Aapki umar kitni hai? Koi purani bimari — diabetes, BP, ya asthma?", "Koi medical history hai jo mujhe jaanni chahiye?"],
    meds_q: ["Koi dawai chal rahi hai? Kuch khaya-piya relief ke liye?", "Abhi koi medicine le rahe hain?"],
    analyzing: "Shukriya! 🔍 Aapki poori jaankari se AI analysis ho rahi hai...",
    emergency: "🚨 Jo aapne bataya hai woh serious emergency lag raha hai! Abhi turant 112 call karein ya nearest hospital jaayein. Ek pal bhi mat rukein.",
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
    hi: ["Bukhar kitna hai? 101°F se zyada? Saath mein thakaan ya kaanpna ho raha hai?", "Bukhar lagaataar hai ya aata-jaata hai? Saath mein body ache bhi hai?"]
  },
  headache: {
    en: ["Where's the pain — front, back, or sides? Is it throbbing or a constant pressure?", "Does it get worse with light or sound? Any nausea along with it?"],
    hi: ["Dard kahan hai — aage, peeche ya side mein? Throbbing hai ya dabao waala?", "Roshni ya awaaz se zyada hota hai? Saath mein ulti jaisi feeling?"]
  },
  cough: {
    en: ["Dry cough or with mucus? If mucus, what color?", "Is it worse at night? Any nasal congestion or sore throat?"],
    hi: ["Sukhi khansi hai ya bulagam aa raha hai? Rang kya hai bulagam ka?", "Raat ko zyada khansi hoti hai? Naak bhi band hai ya gala kharab?"]
  },
  stomach: {
    en: ["Is the pain constant or comes after eating? Any vomiting or loose motion?", "Any burning sensation in chest or throat? How many times?"],
    hi: ["Dard lagaataar hai ya khaane ke baad hota hai? Ulti ya loose motion hua?", "Seene ya gale mein jalan? Kitni baar ulti aayi?"]
  },
  pain: {
    en: ["On a scale of 1-10, how severe? Is it in one spot or spreading?", "Did it start suddenly? Any injury before this?"],
    hi: ["1-10 mein kitna dard hai? Ek jagah hai ya fail raha hai?", "Achanak shuru hua ya dhire-dhire? Koi chot lagi thi?"]
  },
  breathing: {
    en: ["Is it constant or only during activity? Does your chest feel tight?"],
    hi: ["Lagaataar hai ya sirf kuch karne pe? Chest pe dabao feel ho raha hai?"]
  },
  skin: {
    en: ["Where is the rash? Is it spreading? Any fever along with it?", "Did you eat something new or use new soap/medicine recently?"],
    hi: ["Rash kahan hai? Failta ja raha hai? Saath mein bukhar bhi hai?", "Koi naya khana ya soap/dawai use ki haal mein?"]
  },
  weakness: {
    en: ["Is it all over or in specific parts? Are you eating and drinking properly?", "Do you feel dizzy when standing up? Any fainting?"],
    hi: ["Poore body mein hai ya kisi jagah? Khana-paani sahi se ho raha hai?", "Uthte waqt chakkar aata hai? Kabhi behosh hua?"]
  },
  urinary: {
    en: ["Burning when urinating? How frequently? Any unusual urine color?"],
    hi: ["Peshab karte waqt jalan? Kitni baar? Rang alag hai peshab ka?"]
  },
};

const GENERAL_Q_KEYS = ["duration", "history", "medications"];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

function detectLanguage(text) {
  const hindiChars = /[\u0900-\u097F]/;
  const hindiWords = ["hai", "ho", "kya", "mujhe", "mera", "mere", "aur", "nahi", "hua", "raha", "rahi", "toh", "lekin", "aaj", "kal", "din", "bukhar", "dard", "peth", "sir", "khansi", "saans", "thaka", "kamzor", "ulti", "jalan", "susu", "chakkar"];
  if (hindiChars.test(text)) return "hi";
  const lower = text.toLowerCase();
  if (hindiWords.some(w => lower.includes(w))) return "hi";
  return "en";
}

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
    this.reset();
  }

  setLang(lang) { this.lang = lang; }

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

    // Detect language from user's input automatically
    const detectedLang = detectLanguage(userText);
    if (detectedLang !== this.lang && this.allAnswers.length === 0) {
      this.lang = detectedLang;
    }

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

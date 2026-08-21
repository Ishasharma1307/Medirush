import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mic, MicOff, Search, Sparkles, AlertTriangle, ShieldAlert, HeartPulse, 
  CheckCircle2, Leaf, Pill, MapPin, Activity, PhoneCall, ArrowRight, RotateCcw, Info, ShoppingBag, Check, Globe, Send, Stethoscope
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeSymptoms } from '../utils/symptomRules';
import { mockHomeRemedies } from '../data/mockHomeRemedies';
import { useCart } from '../context/CartContext';
import { cn } from '../utils/cn';

// Multilingual Quick Symptom Prompts
const QUICK_PROMPTS = {
  hi: [
    { label: '🗣️ गले में खराश / सूखी खांसी', text: 'गले में खराश और सूखी खांसी हो रही है' },
    { label: '🤒 हल्का बुखार और बदन दर्द', text: 'हल्का बुखार और शरीर में दर्द महसूस हो रहा है' },
    { label: '💆 सिरदर्द और माइग्रेन', text: 'सिर में बहुत तेज दर्द और भारीपन है' },
    { label: '🤢 पेट में गैस और जलन', text: 'पेट में बहुत एसिडिटी, गैस और जलन है' },
    { label: '😣 पेट में मरोड़ / दर्द', text: 'पेट में मरोड़ और दर्द हो रहा है' },
    { label: '🦴 जोड़ों और बदन में दर्द', text: 'जोड़ों और बदन में जकड़न और थकान है' }
  ],
  hinglish: [
    { label: '🗣️ Gale me kharash & khasi', text: 'Gale me kharash aur sukhi khasi he' },
    { label: '🤒 Bukhar & Badan dard', text: 'Halka bukhar aur badan me dard ho raha he' },
    { label: '💆 Sar me tez dard', text: 'Sir me bahut tez dard he' },
    { label: '🤢 Pet me gas & acidity', text: 'Pet me gas, acidity aur jalan he' },
    { label: '😣 Pet me dard / cramps', text: 'Pet me dard aur cramps ho rahe he' },
    { label: '🦴 Body pain & joint stiffness', text: 'Body pain aur joints me stiffness he' }
  ],
  en: [
    { label: '🗣️ Sore Throat & Dry Cough', text: 'I have a sore throat and dry cough' },
    { label: '🤒 Mild Fever & Body Ache', text: 'Feeling mild fever and full body ache' },
    { label: '💆 Headache & Migraine', text: 'Severe throbbing headache and strain' },
    { label: '🤢 Acidity & Gas Reflux', text: 'Heartburn, acidity and stomach bloating' },
    { label: '😣 Stomach Pain & Cramps', text: 'Sharp stomach cramps and gut pain' },
    { label: '🦴 Joint Pain & Fatigue', text: 'Joint stiffness and heavy fatigue' }
  ]
};

// Situation-based clinically accurate medicine mapping database
const CLINICAL_MEDICINES_MAP = {
  "Cold & Cough": [
    {
      id: "med-10",
      name: "Ascoril D Plus Syrup Sugar Free",
      brand: "Glenmark Pharmaceuticals Ltd",
      genericName: "Phenylephrine (5mg) + Chlorpheniramine (2mg) + Dextromethorphan (10mg)",
      price: 129,
      originalPrice: 154.8,
      discountPercent: 20,
      pack_size_label: "bottle of 100 ml Syrup",
      dosageNote: "10 ml twice daily after meals for dry cough & throat soothing.",
      image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&auto=format&fit=crop&q=80"
    },
    {
      id: "med-6",
      name: "Allegra-M Tablet",
      brand: "Sanofi India Ltd",
      genericName: "Montelukast (10mg) + Fexofenadine (120mg)",
      price: 241.48,
      originalPrice: 289.78,
      discountPercent: 20,
      pack_size_label: "strip of 10 tablets",
      dosageNote: "1 tablet daily at bedtime for allergic cold & sneezing.",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80"
    }
  ],
  "Acidity": [
    {
      id: "med-29",
      name: "Aciloc RD 20 Tablet",
      brand: "Cadila Pharmaceuticals Ltd",
      genericName: "Domperidone (10mg) + Omeprazole (20mg)",
      price: 77,
      originalPrice: 88.55,
      discountPercent: 15,
      pack_size_label: "strip of 15 tablets",
      dosageNote: "1 tablet 30 minutes before morning breakfast with warm water.",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80"
    },
    {
      id: "med-11",
      name: "Aciloc 150 Tablet",
      brand: "Cadila Pharmaceuticals Ltd",
      genericName: "Ranitidine (150mg)",
      price: 40.94,
      originalPrice: 51.17,
      discountPercent: 25,
      pack_size_label: "strip of 30 tablets",
      dosageNote: "1 tablet after meals if heartburn or acid reflux occurs.",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80"
    }
  ],
  "Headache": [
    {
      id: "med-37",
      name: "Aldigesic P 100mg/325mg Tablet",
      brand: "Alkem Laboratories Ltd",
      genericName: "Aceclofenac (100mg) + Paracetamol (325mg)",
      price: 110,
      originalPrice: 126.5,
      discountPercent: 15,
      pack_size_label: "strip of 15 tablets",
      dosageNote: "1 tablet after meals for severe throbbing headache or stress.",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80"
    }
  ],
  "Fever": [
    {
      id: "med-41",
      name: "Anafortan 25 mg/300 mg Tablet",
      brand: "Abbott",
      genericName: "Camylofin (25mg) + Paracetamol (300mg)",
      price: 124.56,
      originalPrice: 143.24,
      discountPercent: 15,
      pack_size_label: "strip of 15 tablets",
      dosageNote: "1 tablet every 6-8 hours as needed for body temperature relief.",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80"
    }
  ],
  "Stomach pain": [
    {
      id: "med-41",
      name: "Anafortan 25 mg/300 mg Tablet",
      brand: "Abbott",
      genericName: "Camylofin (25mg) + Paracetamol (300mg)",
      price: 124.56,
      originalPrice: 143.24,
      discountPercent: 15,
      pack_size_label: "strip of 15 tablets",
      dosageNote: "Relaxes gut muscles and relieves abdominal cramps & spasms.",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80"
    }
  ],
  "Body pain": [
    {
      id: "med-48",
      name: "Aldigesic-SP Tablet",
      brand: "Alkem Laboratories Ltd",
      genericName: "Aceclofenac (100mg) + Paracetamol (325mg) + Serratiopeptidase",
      price: 120,
      originalPrice: 132,
      discountPercent: 10,
      pack_size_label: "strip of 10 tablets",
      dosageNote: "1 tablet twice daily after food for muscle & joint soreness.",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80"
    }
  ],
  "Toothache": [
    {
      id: "med-23",
      name: "Altraday Capsule SR",
      brand: "Sun Pharmaceutical Industries Ltd",
      genericName: "Aceclofenac (200mg) + Rabeprazole (20mg)",
      price: 128,
      originalPrice: 160,
      discountPercent: 25,
      pack_size_label: "strip of 10 capsule sr",
      dosageNote: "Provides powerful analgesic relief for dental & nerve pain.",
      image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=80"
    }
  ],
  "Skin Care": [
    {
      id: "med-28",
      name: "Atarax 10mg Tablet",
      brand: "Dr Reddy's Laboratories Ltd",
      genericName: "Hydroxyzine (10mg)",
      price: 47.91,
      originalPrice: 52.7,
      discountPercent: 10,
      pack_size_label: "strip of 15 tablets",
      dosageNote: "1 tablet at bedtime for severe skin itching & allergy relief.",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80"
    }
  ],
  "Nausea": [
    {
      id: "med-17",
      name: "Avomine Tablet",
      brand: "Abbott",
      genericName: "Promethazine (25mg)",
      price: 55.98,
      originalPrice: 64.38,
      discountPercent: 15,
      pack_size_label: "strip of 10 tablets",
      dosageNote: "1 tablet before travel or meal to prevent nausea & vomiting.",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80"
    }
  ]
};

export const RemedySymptomChecker = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Language selection state: 'hi' | 'hinglish' | 'en'
  const [lang, setLang] = useState('hi');
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Cart toast notification
  const [addedMedId, setAddedMedId] = useState(null);

  // Voice Input States
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [voiceToast, setVoiceToast] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = lang === 'en' ? 'en-US' : 'hi-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceToast(
          lang === 'hi' ? 'सुन रहे हैं... अपने लक्षण बोलें' :
          lang === 'hinglish' ? 'Listening... Speak your symptoms' :
          'Listening... Describe your symptoms'
        );
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(prev => prev ? `${prev}, ${transcript}` : transcript);
          setVoiceToast(`Recognized: "${transcript}"`);
          setTimeout(() => setVoiceToast(''), 3000);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceToast('Could not hear clearly. Please try typing.');
        setTimeout(() => setVoiceToast(''), 3000);
      };

      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }
  }, [lang]);

  const handleVoiceInput = () => {
    if (!speechSupported) {
      setVoiceToast('Voice input is not supported in this browser.');
      setTimeout(() => setVoiceToast(''), 3000);
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
      } catch (e) {}
    }
  };

  // Direct 1-Click Order medicine handler
  const handleDirectOrder = (med) => {
    const itemToCart = {
      id: med.id,
      name: med.name,
      price: med.price,
      originalPrice: med.originalPrice,
      discountPercent: med.discountPercent,
      brand: med.brand,
      pack_size_label: med.pack_size_label,
      image: med.image,
      quantity: 1
    };

    addToCart(itemToCart);
    setAddedMedId(med.id);
    setTimeout(() => setAddedMedId(null), 2500);
  };

  // Run AI Symptom Analysis prioritizing Natural Home Remedies
  const handleRunAnalysis = async (customQuery) => {
    const queryToAnalyze = (customQuery || inputText).trim();
    if (!queryToAnalyze) return;

    if (customQuery) setInputText(customQuery);

    setIsAnalyzing(true);
    setAnalysisResult(null);

    // AI Analysis delay for processing feel
    await new Promise(r => setTimeout(r, 1200));

    // 1. Analyze general severity via rules engine
    const ruleAnalysis = await analyzeSymptoms({ rawText: queryToAnalyze, lang: lang });

    // 2. Find best matching home remedy from natural database
    const qLower = queryToAnalyze.toLowerCase();
    const scoredRemedies = mockHomeRemedies.map(r => {
      let score = 0;
      const prob = r.problem.toLowerCase();
      const cat = r.category.toLowerCase();
      const kw = r.keywords || [];

      if (prob.includes(qLower)) score += 60;
      if (cat.includes(qLower)) score += 40;

      kw.forEach(k => {
        if (qLower.includes(k.toLowerCase())) score += 50;
      });

      return { r, score };
    }).sort((a, b) => b.score - a.score);

    const primaryRemedy = scoredRemedies[0]?.score > 0 ? scoredRemedies[0].r : mockHomeRemedies[0];

    // Get specific clinical medicines based on remedy category
    const specificMeds = CLINICAL_MEDICINES_MAP[primaryRemedy.category] || CLINICAL_MEDICINES_MAP["Cold & Cough"];

    // Check emergency severity indicators
    const isEmergency = 
      ruleAnalysis.level === 'Emergency' || 
      qLower.includes('chest pain') || 
      qLower.includes('breathless') || 
      qLower.includes('seene me dard') || 
      qLower.includes('saans') ||
      qLower.includes('103') ||
      qLower.includes('104');

    setAnalysisResult({
      query: queryToAnalyze,
      primaryRemedy: primaryRemedy,
      suggestedMedicines: specificMeds,
      ruleAnalysis: ruleAnalysis,
      isEmergency: isEmergency,
      lang: lang
    });

    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setInputText('');
    setAnalysisResult(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {voiceToast && (
          <div className="bg-emerald-950 text-white rounded-full px-5 py-2.5 shadow-xl text-xs font-black flex items-center gap-2 max-w-md mx-auto">
            <Sparkles size={16} className="text-yellow-400 animate-pulse" />
            <span>{voiceToast}</span>
          </div>
        )}
      </AnimatePresence>

      {/* 🟢 CONVERSATIONAL SYMPTOM CHECKER CARD (Simpler, Clean Conversational UI) */}
      {!analysisResult && !isAnalyzing && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-emerald-100 space-y-6">
          
          {/* Header & Language Switcher */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-700 text-white p-3 rounded-2xl shadow-md">
                <HeartPulse size={24} />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">AI Symptom Diagnostics</h2>
                <p className="text-xs text-gray-500 font-bold">Describe your symptoms in your preferred language</p>
              </div>
            </div>

            {/* Language Selector Buttons */}
            <div className="flex items-center gap-1 bg-gray-100 p-1.5 rounded-2xl border border-gray-200 self-stretch sm:self-auto">
              {[
                { id: 'hi', label: '🇮🇳 हिंदी' },
                { id: 'hinglish', label: '🗣️ Hinglish' },
                { id: 'en', label: '🇬🇧 English' }
              ].map(l => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLang(l.id)}
                  className={cn(
                    "flex-1 sm:flex-none px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer",
                    lang === l.id 
                      ? "bg-emerald-700 text-white shadow-sm" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick One-Tap Symptom Prompts */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider">
              {lang === 'hi' ? '⚡ त्वरित लक्षण चुनें (One-Tap Start)' : lang === 'hinglish' ? '⚡ Tap any symptom to start' : '⚡ Quick select symptoms'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {QUICK_PROMPTS[lang].map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleRunAnalysis(prompt.text)}
                  className="p-3 rounded-2xl border border-emerald-100 bg-emerald-50/40 hover:bg-emerald-100/60 hover:border-emerald-300 text-emerald-950 font-bold text-xs text-left transition-all cursor-pointer flex items-center justify-between group active:scale-95"
                >
                  <span>{prompt.label}</span>
                  <ArrowRight size={14} className="text-emerald-700 group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </div>

          {/* Direct Natural Language Input Box */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider">
              {lang === 'hi' ? '✍️ या विस्तार से लिखें / बोलकर बताएं:' : lang === 'hinglish' ? '✍️ Or type / speak how you are feeling:' : '✍️ Or describe in your own words:'}
            </label>

            <div className="relative">
              <textarea
                rows={3}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  lang === 'hi' ? "उदाहरण: मुझे 2 दिन से सूखी खांसी और गले में दर्द हो रहा है..." :
                  lang === 'hinglish' ? "e.g. 2 din se gale me kharash aur sir dard he..." :
                  "e.g. Having sore throat and headache since 2 days..."
                }
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-gray-900 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none resize-none"
              />

              {/* Voice Mic Button */}
              <button
                type="button"
                onClick={handleVoiceInput}
                className={cn(
                  "absolute right-3 bottom-3 p-2.5 rounded-xl transition-all cursor-pointer shadow-sm",
                  isListening ? "bg-red-500 text-white animate-pulse" : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                )}
                title="Speak Symptoms"
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            onClick={() => handleRunAnalysis()}
            disabled={!inputText.trim()}
            className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white shadow-lg shadow-emerald-700/25 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
          >
            <Sparkles size={18} className="text-yellow-300" />
            <span>
              {lang === 'hi' ? 'घरेलू नुस्खे एवं मेडिकल चेकअप प्राप्त करें' : 
               lang === 'hinglish' ? 'Get Home Remedies & Health Care Plan' : 
               'Analyze Symptoms & Get Home Remedies'}
            </span>
          </button>

        </div>
      )}

      {/* ⏳ AI PROCESSING SCREEN */}
      {isAnalyzing && (
        <div className="bg-white rounded-3xl p-12 shadow-xl border border-emerald-100 text-center space-y-6 flex flex-col items-center justify-center min-h-[350px]">
          <div className="relative">
            <div className="w-20 h-20 bg-emerald-200/50 rounded-full animate-ping absolute opacity-75"></div>
            <div className="w-20 h-20 bg-emerald-700 text-white rounded-full flex items-center justify-center relative z-10 shadow-lg">
              <Stethoscope size={36} className="animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900">
              {lang === 'hi' ? 'AI चिकित्सा विश्लेषण चल रहा है...' : 'AI Medical Analysis Running...'}
            </h3>
            <p className="text-xs text-gray-500 font-bold mt-1.5 max-w-sm mx-auto leading-relaxed">
              {lang === 'hi' ? 'आपके लक्षणों का आयुर्वेदिक एवं मेडिकल डेटाबेस से मिलान किया जा रहा है...' : 'Matching your symptoms against natural remedies and medical databases...'}
            </p>
          </div>
        </div>
      )}

      {/* 🏆 RESULTS DASHBOARD: PRIORITIZES HOME REMEDIES FIRST! */}
      {analysisResult && !isAnalyzing && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          
          {/* Header Action Bar */}
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-emerald-700" />
              <span className="text-xs font-black text-gray-900 uppercase tracking-wider">
                Symptom Diagnostic Plan
              </span>
            </div>
            <button
              onClick={handleReset}
              className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={14} /> Check New Symptom
            </button>
          </div>

          {/* 🚨 1. EMERGENCY WARNING CARD (Only if Situation is Urgent) */}
          {analysisResult.isEmergency && (
            <div className="bg-red-50 border-2 border-red-300 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-600 text-white p-2.5 rounded-2xl animate-pulse">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-red-200 text-red-900 px-2.5 py-0.5 rounded-md">
                    ⚠️ Urgent Medical Attention Recommended
                  </span>
                  <h3 className="text-base font-black text-red-950 mt-1">
                    Severe Medical Symptoms Detected
                  </h3>
                </div>
              </div>

              <p className="text-xs text-red-900 font-bold leading-relaxed">
                Your reported symptoms indicate high severity or emergency risk. Home remedies should NOT replace emergency medical care in this situation.
              </p>

              {/* Emergency CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => navigate('/nearby')}
                  className="py-3 px-4 rounded-2xl font-black text-xs uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MapPin size={16} /> Find Nearest Hospital on Map
                </button>
                <button
                  onClick={() => navigate('/emergency')}
                  className="py-3 px-4 rounded-2xl font-black text-xs uppercase tracking-wider bg-red-900 hover:bg-black text-white shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PhoneCall size={16} /> Call Emergency (112)
                </button>
              </div>
            </div>
          )}

          {/* 🏆 2. TOP PRIORITY RESULT: NATURAL HOME REMEDIES & AYURVEDA (1ST PREFERENCE) */}
          <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 text-white shadow-2xl space-y-6 relative overflow-hidden border border-emerald-400/30">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/40 text-emerald-200 text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>1st Preference: Natural Home Remedy & Ayurveda</span>
            </div>

            {/* Remedy Title & Overview */}
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white drop-shadow-sm">
                {analysisResult.primaryRemedy.problem}
              </h2>
              <p className="text-xs text-emerald-100 font-medium mt-1">
                {analysisResult.primaryRemedy.description}
              </p>
            </div>

            {/* Preparation Steps & Natural Ingredients */}
            <div className="space-y-3 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15">
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                <Leaf size={16} /> Natural Preparation & Home Ingredients (घरेलू नुस्खे):
              </h4>
              <ul className="space-y-2.5">
                {analysisResult.primaryRemedy.remedies.map((rem, idx) => (
                  <li key={idx} className="flex items-start text-xs font-extrabold text-white leading-relaxed">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 mr-2.5 flex-shrink-0" />
                    <span>{rem}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Yoga & Breathing Exercises */}
            <div className="space-y-2 bg-purple-950/40 backdrop-blur-md p-4 rounded-2xl border border-purple-400/20">
              <h4 className="text-xs font-black uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <Activity size={16} /> Recommended Yoga & Recovery (योग एवं व्यायाम):
              </h4>
              <ul className="space-y-2">
                {analysisResult.primaryRemedy.yoga_tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start text-xs font-bold text-purple-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 mr-2.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* 💊 3. SECONDARY COMPACT BOX: SUGGESTED OTC MEDICINES WITH DIRECT 1-CLICK ORDER */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Pill size={20} className="text-[#1565C0]" />
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">
                  Recommended OTC Medicines for {analysisResult.primaryRemedy.category}
                </h4>
              </div>
              <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-md">
                Secondary Relief
              </span>
            </div>

            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              If natural home remedies do not provide fast relief within 1-2 days, these targeted medicines are recommended for your specific symptom:
            </p>

            {/* Detailed Medicine Cards with Direct 1-Click Order Button */}
            <div className="space-y-3">
              {analysisResult.suggestedMedicines.map((med) => {
                const isAdded = addedMedId === med.id;

                return (
                  <div 
                    key={med.id}
                    className="p-4 rounded-2xl border border-blue-100 bg-blue-50/40 hover:bg-blue-50/80 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={med.image} 
                        alt={med.name} 
                        className="w-14 h-14 object-cover rounded-xl border border-gray-200 flex-shrink-0 bg-white"
                      />
                      <div>
                        <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md">
                          {med.brand}
                        </span>
                        <h5 className="text-sm font-black text-gray-900 mt-0.5">
                          {med.name}
                        </h5>
                        <p className="text-[11px] text-gray-500 font-medium">
                          {med.genericName}
                        </p>
                        <p className="text-[11px] text-emerald-700 font-bold mt-1">
                          💡 Usage: {med.dosageNote}
                        </p>
                      </div>
                    </div>

                    <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-blue-100">
                      <div>
                        <span className="text-sm font-black text-gray-900">₹{med.price}</span>
                        <span className="text-xs text-gray-400 line-through ml-1.5">₹{med.originalPrice}</span>
                      </div>

                      {/* DIRECT 1-CLICK ORDER THIS MEDICINE BUTTON */}
                      <button
                        onClick={() => handleDirectOrder(med)}
                        className={cn(
                          "py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-95",
                          isAdded 
                            ? "bg-emerald-700 text-white shadow-emerald-700/25" 
                            : "bg-[#1565C0] hover:bg-blue-800 text-white shadow-blue-700/25"
                        )}
                      >
                        {isAdded ? (
                          <>
                            <Check size={15} /> Added to Cart!
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={15} /> Order This Medicine
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* View Full Pharmacy Catalog Option */}
            <div className="pt-2 flex justify-between items-center border-t border-gray-100 text-xs">
              <span className="text-gray-500 font-medium">Need more generic alternatives?</span>
              <button
                onClick={() => navigate(`/medicines?search=${encodeURIComponent(analysisResult.primaryRemedy.category)}`)}
                className="font-black text-[#1565C0] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Browse All Medicines</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </motion.div>
      )}

    </div>
  );
};

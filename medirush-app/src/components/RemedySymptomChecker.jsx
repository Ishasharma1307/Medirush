import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mic, MicOff, Search, Sparkles, AlertTriangle, ShieldAlert, HeartPulse, 
  CheckCircle2, Leaf, Pill, MapPin, Activity, PhoneCall, ArrowRight, RotateCcw, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeSymptoms } from '../utils/symptomRules';
import { mockHomeRemedies } from '../data/mockHomeRemedies';
import { cn } from '../utils/cn';

// Quick symptom selector options for tap-to-select
const QUICK_SYMPTOMS = [
  { id: 'cough', label: 'Cough & Throat (खांसी/गला खराश)', icon: '🗣️', keywords: 'khasi cough sore throat gala' },
  { id: 'fever', label: 'Fever & Chills (बुखार)', icon: '🤒', keywords: 'fever bukhar chills' },
  { id: 'headache', label: 'Headache & Stress (सिरदर्द)', icon: '💆', keywords: 'headache sardard migraine' },
  { id: 'acidity', label: 'Acidity & Gas (पेट में गैस/जलन)', icon: '🤢', keywords: 'acidity gas gerd heartburn' },
  { id: 'stomach', label: 'Stomach Cramps (पेट दर्द/मरोड़)', icon: '😣', keywords: 'stomach pain pet dard cramps' },
  { id: 'bodypain', label: 'Body Ache & Joints (बदन दर्द)', icon: '🦴', keywords: 'body pain badan dard joints' },
  { id: 'toothache', label: 'Toothache (दांत का दर्द)', icon: '🦷', keywords: 'toothache dant dard teeth' },
  { id: 'skin', label: 'Skin Rash & Itching (खुजली/दाद)', icon: '🌿', keywords: 'skin rash khujli itching allergy' },
  { id: 'weakness', label: 'Weakness (कमजोरी/चक्कर)', icon: '⚡', keywords: 'weakness kamjori fatigue dizziness' },
  { id: 'constipation', label: 'Constipation (कब्ज/पाचन)', icon: '💩', keywords: 'constipation kabz digestion' }
];

export const RemedySymptomChecker = () => {
  const navigate = useNavigate();

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [customText, setCustomText] = useState('');
  const [duration, setDuration] = useState('1-2 Days');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Voice Search States
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [voiceMsg, setVoiceMsg] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'hi-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceMsg('Listening... Describe how you are feeling (e.g. gale me kharash aur sir me dard)');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setCustomText(prev => prev ? `${prev}, ${transcript}` : transcript);
          setVoiceMsg(`Recognized: "${transcript}"`);
          setTimeout(() => setVoiceMsg(''), 4000);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceMsg('Could not hear clearly. Try again or type symptoms.');
        setTimeout(() => setVoiceMsg(''), 4000);
      };

      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }
  }, []);

  const handleVoiceInput = () => {
    if (!speechSupported) {
      setVoiceMsg('Voice search not supported in this browser.');
      setTimeout(() => setVoiceMsg(''), 3000);
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

  const toggleSymptom = (symId) => {
    if (selectedSymptoms.includes(symId)) {
      setSelectedSymptoms(selectedSymptoms.filter(id => id !== symId));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symId]);
    }
  };

  // Run AI Symptom Analysis prioritizing Natural Home Remedies
  const handleRunAnalysis = async () => {
    const combinedInputParts = [
      ...selectedSymptoms.map(id => QUICK_SYMPTOMS.find(s => s.id === id)?.keywords || id),
      customText
    ].filter(Boolean);

    const fullQuery = combinedInputParts.join(' ');
    if (!fullQuery.trim()) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Simulate AI analysis delay
    await new Promise(r => setTimeout(r, 800));

    // 1. Analyze general severity via rules engine
    const ruleAnalysis = await analyzeSymptoms({ rawText: fullQuery, lang: 'hi' });

    // 2. Find best matching home remedy from natural database
    const qLower = fullQuery.toLowerCase();
    const scoredRemedies = mockHomeRemedies.map(r => {
      let score = 0;
      const prob = r.problem.toLowerCase();
      const cat = r.category.toLowerCase();
      const kw = r.keywords || [];

      if (prob.includes(qLower)) score += 50;
      if (cat.includes(qLower)) score += 30;

      kw.forEach(k => {
        if (qLower.includes(k.toLowerCase())) score += 40;
      });

      return { r, score };
    }).sort((a, b) => b.score - a.score);

    const primaryRemedy = scoredRemedies[0]?.score > 0 ? scoredRemedies[0].r : mockHomeRemedies[0];

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
      query: fullQuery,
      primaryRemedy: primaryRemedy,
      otcMedicines: ruleAnalysis.medicines || ['Paracetamol 500mg', 'ORS Solution'],
      ruleAnalysis: ruleAnalysis,
      isEmergency: isEmergency,
      duration: duration
    });

    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setCustomText('');
    setAnalysisResult(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Voice Notification Toast */}
      <AnimatePresence>
        {voiceMsg && (
          <div className="bg-emerald-950 text-white rounded-full px-5 py-2.5 shadow-xl text-xs font-black flex items-center gap-2 max-w-md mx-auto">
            <Sparkles size={16} className="text-yellow-400 animate-pulse" />
            <span>{voiceMsg}</span>
          </div>
        )}
      </AnimatePresence>

      {/* SYMPTOM CHECKER INPUT WIZARD */}
      {!analysisResult && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-emerald-100 space-y-6">
          
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="bg-emerald-600 text-white p-3 rounded-2xl shadow-md">
              <HeartPulse size={24} />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900">AI Remedy Symptom Diagnostics</h2>
              <p className="text-xs text-gray-500 font-bold">Select or speak your symptoms for natural remedy recommendations</p>
            </div>
          </div>

          {/* Quick Symptom Chips */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider">
              1. Tap your symptoms (लक्षण चुनें)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {QUICK_SYMPTOMS.map(sym => {
                const isSelected = selectedSymptoms.includes(sym.id);
                return (
                  <button
                    key={sym.id}
                    type="button"
                    onClick={() => toggleSymptom(sym.id)}
                    className={cn(
                      "p-3 rounded-2xl border text-left font-bold text-xs transition-all cursor-pointer flex items-center gap-2.5 active:scale-95",
                      isSelected 
                        ? "bg-emerald-700 text-white border-emerald-700 shadow-md" 
                        : "bg-gray-50 text-gray-800 border-gray-200 hover:bg-emerald-50 hover:border-emerald-200"
                    )}
                  >
                    <span className="text-base">{sym.icon}</span>
                    <span className="truncate">{sym.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Text / Voice Description */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider">
              2. Describe more in your own words (और विस्तार से बताएं)
            </label>
            <div className="relative">
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="e.g. gale me kharash aur halka bukhar he..."
                className="w-full py-3.5 pl-4 pr-12 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-gray-900 text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
              />
              <button
                type="button"
                onClick={handleVoiceInput}
                className={cn(
                  "absolute right-2 top-2 p-2 rounded-xl transition-all cursor-pointer",
                  isListening ? "bg-red-500 text-white animate-pulse" : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                )}
                title="Speak Symptom"
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            </div>
          </div>

          {/* Duration Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider">
              3. Symptom Duration (कितने समय से है?)
            </label>
            <div className="flex gap-2">
              {['1-2 Days', '3-5 Days', '1 Week+'].map(dur => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setDuration(dur)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all cursor-pointer",
                    duration === dur 
                      ? "bg-emerald-800 text-white border-emerald-800 shadow-sm" 
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  )}
                >
                  {dur}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing || (selectedSymptoms.length === 0 && !customText.trim())}
            className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white shadow-lg shadow-emerald-700/25 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Sparkles size={18} className="animate-spin text-yellow-300" />
                <span>Analyzing Symptoms & Ayurvedic Remedies...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} className="text-yellow-300" />
                <span>Get Natural Home Remedies & Care Plan</span>
              </>
            )}
          </button>

        </div>
      )}

      {/* RESULTS DASHBOARD: PRIORITIZES HOME REMEDIES FIRST! */}
      {analysisResult && (
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

              {/* Direct Emergency Map CTAs */}
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

          {/* 💊 3. SECONDARY COMPACT BOX: SUGGESTED OTC MEDICINES (AT BOTTOM) */}
          <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill size={18} className="text-[#1565C0]" />
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">
                  Optional OTC Medicines (यदि तुरंत आराम चाहिए)
                </h4>
              </div>
              <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                Secondary Care
              </span>
            </div>

            <p className="text-xs text-gray-500 font-medium">
              If home remedies do not provide quick relief, these standard over-the-counter medicines are commonly advised:
            </p>

            {/* List of OTC medicines */}
            <div className="flex flex-wrap gap-2 pt-1">
              {analysisResult.otcMedicines.map((med, i) => (
                <div key={i} className="bg-blue-50/70 border border-blue-100 px-3 py-2 rounded-xl text-xs font-extrabold text-blue-900 flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-[#1565C0]" />
                  <span>{med}</span>
                </div>
              ))}
            </div>

            {/* Direct Order Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => navigate(`/medicines?search=${encodeURIComponent(analysisResult.primaryRemedy.category)}`)}
                className="py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider bg-white hover:bg-blue-50 text-[#1565C0] border border-blue-200 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Browse Medicines for {analysisResult.primaryRemedy.category}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* 🏥 4. MAP & NEARBY HEALTHCARE ACTION BOX */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#1565C0] text-white p-3 rounded-2xl shadow-sm">
                <MapPin size={22} />
              </div>
              <div>
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">
                  Need Professional Medical Audit?
                </h4>
                <p className="text-xs text-gray-500 font-bold">
                  Locate certified nearby hospitals, clinics & 24/7 pharmacies on interactive map
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/nearby')}
              className="w-full sm:w-auto py-3 px-5 rounded-2xl font-black text-xs uppercase tracking-wider bg-[#1565C0] hover:bg-blue-800 text-white shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <MapPin size={16} /> Open Healthcare Map
            </button>
          </div>

        </motion.div>
      )}

    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, ShieldAlert, AlertTriangle, ChevronDown, ArrowLeft,
  Thermometer, Wind, Brain, Activity, Flame, User, Mic, MicOff, Battery,
  HeartPulse, Info, Pill, Leaf, Moon, Sparkles, Volume2, CheckCircle2, RefreshCw, X
} from 'lucide-react';
import { mockHomeRemedies } from '../data/mockHomeRemedies';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

// Icon mapper for dynamic icons
const iconMap = {
  Thermometer, Wind, Brain, Activity, Flame, User, Mic, Battery, HeartPulse, Moon, Leaf
};

// Hindi / English filler stop-words for intelligent symptom extraction
const STOP_WORDS = new Set([
  'ki', 'ka', 'ke', 'me', 'mai', 'mein', 'dukh', 'raha', 'rahi', 'ho', 'h', 'hai', 'hain',
  'kya', 'kare', 'karen', 'dawai', 'dawaii', 'medicine', 'remedy', 'remedies', 'upay',
  'ilaj', 'treatment', 'problem', 'batao', 'chahiye', 'le', 'sakte', 'dalo', 'se', 'ko',
  'bhi', 'gharelu', 'nuskhe', 'hindi', 'dikhao', 'bataiye', 'for', 'and', 'with', 'the'
]);

export const HomeRemedies = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [remedies, setRemedies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  // Voice Search States
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [voiceToast, setVoiceToast] = useState('');
  const recognitionRef = useRef(null);

  // Extract unique categories for filter chips
  const categories = ['All', ...new Set(mockHomeRemedies.map(item => item.category))];

  useEffect(() => {
    // Simulate initial loading
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      setRemedies(mockHomeRemedies);
      setLoading(false);
    };
    loadData();

    // Initialize Web Speech API if supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'hi-IN'; // Default to Hinglish/Hindi audio context

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceToast('Listening... Speak your symptom (e.g., "gale me kharash he")');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setSearchQuery(transcript);
          setVoiceToast(`Voice recognized: "${transcript}"`);
          setTimeout(() => setVoiceToast(''), 4000);
        }
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        setVoiceToast('Could not recognize voice clearly. Please try typing or speak again.');
        setTimeout(() => setVoiceToast(''), 4000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }
  }, []);

  // Voice search toggle trigger
  const handleVoiceSearch = () => {
    if (!speechSupported) {
      setVoiceToast('Voice search is not supported in this browser. Please use Google Chrome or Edge.');
      setTimeout(() => setVoiceToast(''), 4000);
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  // Smart Symptom Analysis & Relevance Matcher
  const analyzeAndFilterRemedies = () => {
    const rawQuery = searchQuery.trim().toLowerCase();
    
    // If no query, fallback to normal category filter
    if (!rawQuery) {
      if (selectedCategory === 'All') return remedies;
      return remedies.filter(r => r.category === selectedCategory);
    }

    // Tokenize search query & remove stop words
    const queryTokens = rawQuery
      .split(/[\s,.-]+/)
      .filter(token => token.length > 1 && !STOP_WORDS.has(token));

    // Calculate score for each remedy item
    const scoredRemedies = remedies.map(remedy => {
      let score = 0;
      const probText = remedy.problem.toLowerCase();
      const catText = remedy.category.toLowerCase();
      const descText = remedy.description.toLowerCase();
      const keywordsList = remedy.keywords || [];
      const symptomsList = remedy.symptoms.map(s => s.toLowerCase());

      // Direct full query match
      if (probText.includes(rawQuery)) score += 100;
      if (catText.includes(rawQuery)) score += 80;

      // Token-based matching
      queryTokens.forEach(token => {
        // Keyword match (Highest Weight)
        keywordsList.forEach(kw => {
          if (kw.toLowerCase().includes(token)) score += 40;
          if (token.includes(kw.toLowerCase())) score += 40;
        });

        // Problem title match
        if (probText.includes(token)) score += 35;

        // Category match
        if (catText.includes(token)) score += 25;

        // Symptoms match
        symptomsList.forEach(sym => {
          if (sym.includes(token)) score += 20;
        });

        // Description match
        if (descText.includes(token)) score += 10;
      });

      return { remedy, score };
    });

    // Filter items with score > 0
    let results = scoredRemedies
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.remedy);

    // Apply category filter if active
    if (selectedCategory !== 'All') {
      results = results.filter(r => r.category === selectedCategory);
    }

    // If query was typed but no specific score matched, do fuzzy includes fallback
    if (results.length === 0 && rawQuery.length >= 2) {
      results = remedies.filter(r => {
        const matchesText = 
          r.problem.toLowerCase().includes(rawQuery) ||
          r.category.toLowerCase().includes(rawQuery) ||
          (r.keywords && r.keywords.some(k => k.toLowerCase().includes(rawQuery)));
        const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
        return matchesText && matchesCategory;
      });
    }

    return results;
  };

  const filteredRemedies = analyzeAndFilterRemedies();

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-[#F5F9FF] pb-24 font-sans relative overflow-x-hidden">
      
      {/* Voice Notification Toast */}
      <AnimatePresence>
        {voiceToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-20 left-1/2 z-[9999]"
          >
            <div className="bg-emerald-900 text-white rounded-full shadow-2xl px-6 py-3 flex items-center gap-3 border border-emerald-500/30">
              <Sparkles size={18} className="text-yellow-400 animate-pulse" />
              <span className="font-extrabold text-xs sm:text-sm">{voiceToast}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Blur Spheres */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* 1) Premium Header */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 pt-10 pb-24 px-4 sm:px-6 lg:px-8 shadow-xl relative overflow-hidden rounded-b-[2.5rem] text-white">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        
        <div className="max-w-4xl mx-auto flex items-center justify-between mb-4 relative z-10">
          <button 
            onClick={() => navigate('/home')} 
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-2.5 rounded-2xl transition-all border border-white/20 cursor-pointer active:scale-95 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-white"
          >
            <ArrowLeft size={16} /> Dashboard
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto relative z-10 text-center space-y-3"
        >
          <div className="inline-flex items-center justify-center bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-200 text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
            <HeartPulse size={14} className="mr-2 text-emerald-300" /> Ayurvedic & Natural Remedies
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight drop-shadow-md">
            Ayurvedic Home Remedies
          </h1>
          <p className="text-emerald-100 text-sm md:text-base font-medium max-w-xl mx-auto drop-shadow-sm">
            Speak or type any symptom in Hindi/English for natural relief instructions & precautions.
          </p>
        </motion.div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 space-y-6"
      >

        {/* 2) Search Bar with Voice Input & Smart Analysis */}
        <motion.div variants={itemVariants} className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xl space-y-4">
          
          <div className="relative flex items-center">
            <div className="absolute left-4 bg-emerald-50 p-2 rounded-xl border border-emerald-100">
              <Search className="text-emerald-700" size={18} />
            </div>

            <input 
              type="text" 
              placeholder="Type or speak symptoms (e.g., khasi, sardard, acidity, pet me gas)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-4 pl-14 pr-24 bg-gray-50/80 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-400 text-sm sm:text-base"
            />

            {/* Clear Query Button */}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-14 p-2 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                title="Clear Search"
              >
                <X size={16} />
              </button>
            )}

            {/* Voice Search Button */}
            <button
              onClick={handleVoiceSearch}
              className={cn(
                "absolute right-3.5 p-3 rounded-xl transition-all cursor-pointer shadow-md active:scale-95 flex items-center justify-center",
                isListening 
                  ? "bg-red-500 text-white animate-pulse shadow-red-500/30" 
                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25"
              )}
              title={isListening ? "Listening... Tap to stop" : "Speak symptom in Hindi/English"}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          </div>

          {/* Voice Listening Active Indicator Banner */}
          {isListening && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-50 border border-red-200 rounded-2xl p-3.5 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-black text-red-900 uppercase tracking-wider">
                  Listening to your voice... Speak your symptom now
                </span>
              </div>
              <button 
                onClick={handleVoiceSearch}
                className="text-xs font-bold text-red-700 underline cursor-pointer"
              >
                Stop
              </button>
            </motion.div>
          )}

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {categories.map((category, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 border cursor-pointer active:scale-95 whitespace-nowrap",
                  selectedCategory === category 
                    ? "bg-emerald-700 text-white border-emerald-700 shadow-md shadow-emerald-700/20" 
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-emerald-50 hover:text-emerald-800"
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Smart Symptom Analysis Results Header */}
          {searchQuery.trim() && (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between text-xs font-black text-emerald-950">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-emerald-700" />
                <span>
                  Analyzed Symptom: "<span className="text-emerald-800">{searchQuery}</span>" — Found {filteredRemedies.length} natural remedy match{filteredRemedies.length !== 1 ? 'es' : ''}
                </span>
              </div>
              <button 
                onClick={() => setSearchQuery('')}
                className="text-[11px] text-emerald-800 underline font-extrabold cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          )}
        </motion.div>

        {/* Important Safety Disclaimer Banner */}
        <motion.div variants={itemVariants} className="bg-amber-50 border border-amber-200 p-4 rounded-3xl shadow-sm flex items-start gap-3.5">
          <div className="bg-amber-100 p-2.5 rounded-2xl text-amber-800 flex-shrink-0">
             <ShieldAlert size={22} />
          </div>
          <div>
            <h3 className="font-black text-amber-950 text-xs uppercase tracking-wider mb-0.5">Ayurvedic & Home Care Guidelines</h3>
            <p className="text-xs text-amber-900 font-medium leading-relaxed">
              These remedies are for minor everyday health issues. In case of severe, prolonged, or worsening symptoms, consult a certified doctor immediately.
            </p>
          </div>
        </motion.div>

        {/* Loading Skeleton State */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-3xl h-24 border border-gray-150 animate-pulse" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedCategory + searchQuery} 
              initial="hidden" 
              animate="visible" 
              exit={{ opacity: 0 }} 
              variants={containerVariants} 
              className="space-y-4"
            >
              {filteredRemedies.length === 0 ? (
                <motion.div variants={itemVariants} className="bg-white rounded-3xl p-10 border border-blue-50 text-center shadow-md">
                  <div className="bg-emerald-50 p-5 rounded-full inline-block mb-4 border border-emerald-100">
                     <Pill size={40} className="text-emerald-700" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 mb-1">No specific remedy match found</h3>
                  <p className="text-xs text-gray-500 font-bold max-w-sm mx-auto leading-relaxed mb-4">
                    Try searching with common terms like "khasi", "sardard", "acidity", "pet dard", "fever", or select a category above.
                  </p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-wider py-3 px-6 rounded-2xl shadow-md transition-all cursor-pointer"
                  >
                    View All Remedies
                  </button>
                </motion.div>
              ) : (
                filteredRemedies.map((remedy) => {
                  const IconComponent = iconMap[remedy.icon] || Activity;
                  const isExpanded = expandedId === remedy.id;

                  return (
                    <motion.div 
                      variants={itemVariants} 
                      key={remedy.id} 
                      className="bg-white rounded-3xl border border-emerald-100/80 shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
                    >
                      {/* Card Header (Clickable) */}
                      <div 
                        onClick={() => toggleExpand(remedy.id)}
                        className="p-5 cursor-pointer hover:bg-emerald-50/40 flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-13 h-13 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl flex items-center justify-center shadow-inner flex-shrink-0">
                            <IconComponent size={26} />
                          </div>
                          <div>
                            <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-200">
                              {remedy.category}
                            </span>
                            <h3 className="text-base sm:text-lg font-black text-gray-900 mt-1 drop-shadow-sm">
                              {remedy.problem}
                            </h3>
                            <p className="text-xs text-gray-500 font-medium line-clamp-1 mt-0.5">
                              {remedy.description}
                            </p>
                          </div>
                        </div>

                        <div className={cn(
                          "ml-2 flex-shrink-0 p-2 rounded-xl border transition-colors cursor-pointer",
                          isExpanded ? "text-emerald-700 border-emerald-300 bg-emerald-50" : "text-gray-400 border-gray-200 hover:text-gray-700"
                        )}>
                          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                             <ChevronDown size={20} />
                          </motion.div>
                        </div>
                      </div>

                      {/* Card Body (Expandable Details) */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-6 pt-4 border-t border-emerald-100 bg-gradient-to-b from-emerald-50/30 to-white space-y-6">
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                
                                {/* Symptoms List */}
                                <div className="space-y-3">
                                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                                    <Info size={15} className="text-[#1565C0]" />
                                    <span>Common Symptoms (लक्षण)</span>
                                  </h4>
                                  <ul className="space-y-2 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                                    {remedy.symptoms.map((sym, idx) => (
                                      <li key={idx} className="flex items-start text-xs text-gray-800 font-extrabold leading-relaxed">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0] mt-1.5 mr-2.5 flex-shrink-0" />
                                        <span>{sym}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Natural Remedies List */}
                                <div className="space-y-3">
                                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                                    <Leaf size={15} className="text-emerald-700" />
                                    <span>Ayurvedic & Natural Preparation (घरेलू नुस्खे)</span>
                                  </h4>
                                  <ul className="space-y-2.5 bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 shadow-xs">
                                    {remedy.remedies.map((rem, idx) => (
                                      <li key={idx} className="flex items-start text-xs text-emerald-950 font-black leading-relaxed">
                                        <CheckCircle2 size={15} className="text-emerald-700 mt-0.5 mr-2 flex-shrink-0" />
                                        <span>{rem}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Yoga & Recovery */}
                                <div className="md:col-span-2 space-y-3">
                                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                                    <Activity size={15} className="text-purple-600" />
                                    <span>Yoga & Breathing Exercises (योग और व्यायाम)</span>
                                  </h4>
                                  <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200 shadow-xs">
                                    <ul className="space-y-2">
                                      {remedy.yoga_tips.map((tip, idx) => (
                                        <li key={idx} className="flex items-start text-xs text-purple-950 font-extrabold leading-relaxed">
                                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 mr-2.5 flex-shrink-0" />
                                          <span>{tip}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>

                              </div>

                              {/* Doctor Warning */}
                              <div className="bg-red-50 p-4 rounded-2xl border border-red-200 space-y-2">
                                <h4 className="font-black text-red-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                                  <AlertTriangle size={16} className="text-red-600" />
                                  <span>When to Consult a Registered Doctor:</span>
                                </h4>
                                <p className="text-xs text-red-800 font-extrabold leading-relaxed">
                                  {remedy.when_to_see_doctor}
                                </p>
                                <p className="text-[10px] font-black text-red-700 uppercase tracking-wider bg-white/80 inline-block px-2.5 py-1 rounded-lg border border-red-200">
                                  ⚠️ {remedy.warning}
                                </p>
                              </div>

                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          </AnimatePresence>
        )}

      </motion.div>
    </div>
  );
};

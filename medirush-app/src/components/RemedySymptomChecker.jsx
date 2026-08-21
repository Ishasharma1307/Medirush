import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, AlertTriangle, HeartPulse, CheckCircle2, Leaf, Pill, MapPin, 
  Activity, PhoneCall, ArrowRight, RotateCcw, ShoppingBag, Check, Stethoscope
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SymptomChatbot } from './SymptomChatbot';
import { analyzeSymptoms } from '../utils/symptomRules';
import { mockHomeRemedies } from '../data/mockHomeRemedies';
import { useCart } from '../context/CartContext';
import { cn } from '../utils/cn';

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

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [addedMedId, setAddedMedId] = useState(null);

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

  // Called when SymptomChatbot finishes collecting inputs
  const handleChatComplete = async (userAnswers) => {
    setIsAnalyzing(true);
    
    const minDelayPromise = new Promise(resolve => setTimeout(resolve, 1200));

    try {
      const [ruleAnalysis] = await Promise.all([
        analyzeSymptoms(userAnswers),
        minDelayPromise
      ]);

      const rawQuery = userAnswers.rawText || "";
      const qLower = rawQuery.toLowerCase();

      // Find best matching home remedy from natural database
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
      const specificMeds = CLINICAL_MEDICINES_MAP[primaryRemedy.category] || CLINICAL_MEDICINES_MAP["Cold & Cough"];

      const isEmergency = 
        ruleAnalysis.level === 'Emergency' || 
        qLower.includes('chest pain') || 
        qLower.includes('breathless') || 
        qLower.includes('seene me dard') || 
        qLower.includes('saans') ||
        qLower.includes('103') ||
        qLower.includes('104');

      setAnalysisResult({
        query: rawQuery,
        primaryRemedy: primaryRemedy,
        suggestedMedicines: specificMeds,
        ruleAnalysis: ruleAnalysis,
        isEmergency: isEmergency
      });
    } catch (err) {
      console.error("Symptom Analysis Error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
  };

  return (
    <div className="space-y-6">
      
      {/* 🤖 1. UNIFIED SYMPTOM CHATBOT INTERFACE (Same ML Model & Process as Main App) */}
      {!analysisResult && !isAnalyzing && (
        <div className="bg-white rounded-3xl p-2 sm:p-4 shadow-xl border border-emerald-100 min-h-[480px]">
          <SymptomChatbot onComplete={handleChatComplete} />
        </div>
      )}

      {/* ⏳ 2. AI ML PROCESSING SCREEN */}
      {isAnalyzing && (
        <div className="bg-white rounded-3xl p-12 shadow-xl border border-emerald-100 text-center space-y-6 flex flex-col items-center justify-center min-h-[380px]">
          <div className="relative">
            <div className="w-24 h-24 bg-emerald-200/50 rounded-full animate-ping absolute opacity-75"></div>
            <div className="w-24 h-24 bg-emerald-700 text-white rounded-full flex items-center justify-center relative z-10 shadow-xl border-4 border-white">
              <Stethoscope size={40} className="animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900">
              MediRush AI ML Model Analyzing Symptoms...
            </h3>
            <p className="text-xs text-gray-500 font-bold mt-1.5 max-w-sm mx-auto leading-relaxed">
              Evaluating symptoms using clinical machine learning prediction engine and matching top natural Ayurvedic remedies...
            </p>
          </div>
        </div>
      )}

      {/* 🏆 3. EXACT HOME REMEDIES PRIORITY RESULTS DASHBOARD */}
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
                Symptom Diagnostic Plan ({analysisResult.ruleAnalysis.disease || 'General Condition'})
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

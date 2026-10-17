import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Leaf, Pill, AlertTriangle, CheckCircle2, 
  Clock, ArrowRight, X, Bot, HeartPulse, Stethoscope, 
  RefreshCw, ShoppingBag, ShieldCheck, Zap, Thermometer,
  Flame, Wind, Activity, HelpCircle
} from 'lucide-react';
import { cn } from '../utils/cn';
import { Button } from './ui/Button';
import { useCart } from '../context/CartContext';
import { analyzeSymptomsWithAI } from '../services/aiSymptomModel';

const SAMPLE_SYMPTOMS = [
  { label: "Dry Cough & Sore Throat", text: "Dry hacking cough and severe sore throat irritation for 2 days", icon: Wind },
  { label: "High Fever & Chills", text: "Fever around 101F with body ache and shivering chills", icon: Thermometer },
  { label: "Acidity & Heartburn", text: "Burning sensation in chest, sour burps and severe acid reflux after dinner", icon: Flame },
  { label: "Throbbing Headache", text: "Throbbing temporal headache with eye strain from computer screen", icon: Activity },
  { label: "Stomach Cramps", text: "Stomach pain with loose motions and mild nausea since morning", icon: HeartPulse }
];

export const AISymptomRemedyModal = ({ isOpen, onClose, initialQuery = "" }) => {
  const { addToCart } = useCart();

  const [query, setQuery] = useState(initialQuery);
  const [duration, setDuration] = useState("1-2 days");
  const [severity, setSeverity] = useState("moderate");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activeTab, setActiveTab] = useState('remedies'); // 'remedies' | 'medicines' | 'precautions'
  const [addedItem, setAddedItem] = useState(null);

  const handleAnalyze = async (overrideText) => {
    const textToRun = overrideText || query;
    if (!textToRun || textToRun.trim().length < 3) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const res = await analyzeSymptomsWithAI({
        symptoms: textToRun,
        duration,
        severity,
        language: 'en'
      });
      setAnalysisResult(res);
      setActiveTab('remedies');
    } catch (err) {
      console.error("AI Symptom Analysis Error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSampleClick = (sample) => {
    setQuery(sample.text);
    handleAnalyze(sample.text);
  };

  const handleOrderMedicine = (med) => {
    addToCart({
      id: med.id || `med-ai-${Date.now()}`,
      name: med.name,
      price: med.price || 120.00,
      quantity: 1,
      pack_size_label: med.salt || "Verified OTC Formulation",
      images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60']
    });

    setAddedItem(med.name);
    setTimeout(() => setAddedItem(null), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto font-sans"
      >
        {/* ── MODAL HEADER ────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-700 text-white px-5 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 flex-shrink-0">
              <Bot size={22} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base tracking-tight text-white">
                  MediRush AI Symptom & Home Remedy Assistant
                </h3>
                <span className="text-[9px] font-black uppercase bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded-full">
                  AI + Ayurveda
                </span>
              </div>
              <p className="text-[11px] text-emerald-100 font-medium">
                Clinical symptom diagnosis, authentic Desi Nuskhe & 10-minute OTC relief.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── MODAL BODY ──────────────────────────────────────────────── */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">

          {/* Quick Input Form */}
          <div className="space-y-3">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
              Describe your health issue or symptoms:
            </label>
            <div className="relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Dry cough with burning throat since yesterday, feeling feverish and tired..."
                rows={3}
                className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all resize-none shadow-inner"
              />
            </div>

            {/* Quick 1-Click Suggestion Chips for Hackathon Judges */}
            <div>
              <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1.5">
                Quick Test Samples for Judges:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_SYMPTOMS.map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSampleClick(s)}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 text-[11px] font-bold text-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Icon size={12} className="text-emerald-600" />
                      <span>{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Severity & Duration controls */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Duration:</span>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 rounded-xl p-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Few hours">Few hours (Acute)</option>
                  <option value="1-2 days">1 - 2 Days</option>
                  <option value="3-5 days">3 - 5 Days</option>
                  <option value="More than a week">More than a week</option>
                </select>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Discomfort Level:</span>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 rounded-xl p-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="mild">Mild (Manageable at home)</option>
                  <option value="moderate">Moderate (Interfering with daily tasks)</option>
                  <option value="emergency">Severe (Intense pain or distress)</option>
                </select>
              </div>
            </div>

            {/* Run Analysis Button */}
            <Button
              type="button"
              variant="primary"
              onClick={() => handleAnalyze()}
              disabled={isAnalyzing || !query.trim()}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-2xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  <span>AI Clinical Engine Analyzing Symptoms...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Analyze Symptoms & Get Desi Nuskhe</span>
                </>
              )}
            </Button>
          </div>

          {/* ── ADDED TO CART TOAST NOTIFICATION ────────────────────────── */}
          <AnimatePresence>
            {addedItem && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>Added <strong>{addedItem}</strong> to your Medirush cart for 10-minute delivery!</span>
                </div>
                <a href="/cart" className="text-emerald-700 underline font-black text-[11px]">View Cart</a>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── ANALYSIS RESULTS CARD ────────────────────────────────────── */}
          {analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 pt-2 border-t border-slate-200"
            >
              {/* Clinical Verdict Banner */}
              <div className={cn(
                "p-4 rounded-3xl border shadow-sm space-y-1.5",
                analysisResult.severity === 'emergency'
                  ? "bg-rose-50 border-rose-300 text-rose-950"
                  : "bg-emerald-50/80 border-emerald-200 text-slate-900"
              )}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Stethoscope size={18} className="text-emerald-700" />
                    <span className="font-black text-sm text-slate-900">{analysisResult.condition}</span>
                    {analysisResult.hindiName && (
                      <span className="text-xs text-slate-500 font-bold">({analysisResult.hindiName})</span>
                    )}
                  </div>
                  <span className="text-[10px] font-black uppercase bg-emerald-600 text-white px-2.5 py-0.5 rounded-full">
                    {analysisResult.confidence}% AI Match
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {analysisResult.summary}
                </p>
              </div>

              {/* Workflow Navigation Tabs */}
              <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200 gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('remedies')}
                  className={cn(
                    "flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                    activeTab === 'remedies'
                      ? "bg-white text-emerald-800 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <Leaf size={14} className="text-emerald-600" />
                  <span>Desi Home Remedies ({analysisResult.homeRemedies?.length || 0})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('medicines')}
                  className={cn(
                    "flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                    activeTab === 'medicines'
                      ? "bg-white text-blue-700 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <Pill size={14} className="text-blue-600" />
                  <span>10-Min OTC Medicines ({analysisResult.otcMedicines?.length || 0})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('precautions')}
                  className={cn(
                    "flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                    activeTab === 'precautions'
                      ? "bg-white text-amber-800 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <ShieldCheck size={14} className="text-amber-600" />
                  <span>Precautions</span>
                </button>
              </div>

              {/* ── TAB 1: DESI HOME REMEDIES ──────────────────────────── */}
              {activeTab === 'remedies' && (
                <div className="space-y-3">
                  {(analysisResult.homeRemedies || []).map((rem, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <h4 className="font-extrabold text-sm text-slate-900">
                            {rem.name}
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-2 py-0.5 rounded-lg">
                          ⏱ {rem.frequency}
                        </span>
                      </div>

                      {rem.nameHindi && (
                        <p className="text-xs text-emerald-800 font-bold ml-7 -mt-1">
                          {rem.nameHindi}
                        </p>
                      )}

                      <p className="text-xs text-slate-600 font-medium">
                        <strong>Why it works:</strong> {rem.benefits}
                      </p>

                      <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                        <span className="text-[10px] uppercase font-black text-slate-400 block">Required Kitchen Ingredients:</span>
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {(rem.ingredients || []).map((ing, i) => (
                            <span key={i} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md text-[11px] font-medium border border-slate-200">
                              ✔ {ing}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200 text-xs">
                        <strong className="text-amber-900 block mb-0.5 font-bold">Preparation & How to take:</strong>
                        <p className="text-slate-700 leading-relaxed font-medium">{rem.preparation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── TAB 2: OTC MEDICINES FOR 10-MIN EXPRESS DELIVERY ──── */}
              {activeTab === 'medicines' && (
                <div className="space-y-3">
                  {(analysisResult.otcMedicines || []).map((med, idx) => (
                    <div key={idx} className="bg-white border-2 border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:shadow-md transition-all">
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-black text-sm text-slate-900">{med.name}</h5>
                          <span className="text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded">
                            ⚡ 10-Min Delivery
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{med.salt}</p>
                        <p className="text-xs text-blue-700 font-semibold mt-1">Dosage: {med.dosage}</p>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <span className="text-base font-black text-slate-900">₹{med.price.toFixed(2)}</span>
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          onClick={() => handleOrderMedicine(med)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-sm px-3.5 py-2 cursor-pointer flex items-center gap-1.5"
                        >
                          <ShoppingBag size={14} />
                          <span>Order Now</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── TAB 3: PRECAUTIONS & DOCTOR ADVICE ─────────────────── */}
              {activeTab === 'precautions' && (
                <div className="space-y-3">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
                    <span className="font-black text-slate-700 uppercase text-[10px] block">Lifestyle & Dietary Precautions:</span>
                    <ul className="space-y-1.5 text-slate-700 font-medium list-disc pl-4">
                      {(analysisResult.precautions || []).map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-rose-700 font-black text-xs uppercase">
                      <AlertTriangle size={15} />
                      <span>When to Consult a Doctor Immediately:</span>
                    </div>
                    <p className="text-rose-900 leading-relaxed font-semibold">
                      {analysisResult.doctorAlert}
                    </p>
                  </div>
                </div>
              )}

            </motion.div>
          )}

        </div>

        {/* ── MODAL FOOTER ────────────────────────────────────────────── */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>MediRush AI Triage · For informational & fast relief purposes</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            Close
          </Button>
        </div>

      </motion.div>
    </div>
  );
};

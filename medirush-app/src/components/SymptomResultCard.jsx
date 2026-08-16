import React, { useState } from 'react';
import {
  AlertTriangle, ShieldCheck, Activity, ArrowRight, Pill, MapPin, HeartPulse,
  Sparkles, Leaf, Brain, ChevronDown, ChevronUp, Thermometer, Info, CheckCircle2, Star,
  ShoppingBag, PhoneCall, UserCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { cn } from '../utils/cn';

// ─── Confidence Arc SVG ───────────────────────────────────────────────────────
const ConfidenceRing = ({ value, color }) => {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width="90" height="90" className="rotate-[-90deg]">
      <circle cx="45" cy="45" r={r} fill="none" stroke="#f0f0f0" strokeWidth="7" />
      <motion.circle
        cx="45" cy="45" r={r} fill="none"
        stroke={color} strokeWidth="7" strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
    </svg>
  );
};

// ─── Confidence bar ───────────────────────────────────────────────────────────
const Bar = ({ value, color }) => (
  <div className="flex items-center gap-2">
    <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.7, delay: 0.2 }}
      />
    </div>
    <span className="text-[11px] font-bold text-gray-500 w-9 text-right">{value}%</span>
  </div>
);

const SCOLOR = { Low: '#22c55e', Medium: '#f97316', High: '#ef4444', Critical: '#991b1b' };

const formatSeverity = (sev, isHi) => {
  if (!isHi) return `${sev} Severity`;
  if (sev === 'Low') return 'हल्की गंभीरता';
  if (sev === 'Medium') return 'मध्यम गंभीरता';
  if (sev === 'High') return 'उच्च गंभीरता';
  if (sev === 'Critical') return 'गंभीर स्थिति';
  return `${sev} गंभीरता`;
};

const formatLevel = (lvl, isHi) => {
  if (!isHi) return `${lvl} Condition`;
  if (lvl === 'Emergency') return 'आपातकालीन स्थिति';
  if (lvl === 'Moderate') return 'मध्यम स्थिति';
  return 'सामान्य स्थिति';
};

const formatSeverityOnly = (sev, isHi) => {
  if (!isHi) return sev;
  if (sev === 'Low') return 'हल्की';
  if (sev === 'Medium') return 'मध्यम';
  if (sev === 'High') return 'उच्च';
  if (sev === 'Critical') return 'गंभीर';
  return sev;
};

export const SymptomResultCard = ({ result, onRestart, isMedicineFlow = false }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [showMore, setShowMore] = useState(false);
  if (!result) return null;

  const isHi = result.lang === 'hi';
  const top = result.allPredictions?.[0];
  const rest = result.allPredictions?.slice(1, showMore ? 10 : 4) || [];
  const ringColor = result.level === 'Emergency' ? '#ef4444' : result.level === 'Moderate' ? '#f97316' : '#22c55e';
  const levelEmoji = result.level === 'Emergency' ? '🚨' : result.level === 'Moderate' ? '⚠️' : '✅';

  const handleOrderSuggestedMedicines = () => {
    addToCart({
      id: `ai-suggested-bundle-${Date.now()}`,
      name: isHi ? `AI संस्तुत दवा पैक: ${top?.disease || 'स्वास्थ्य देखभाल'}` : `AI Recommended Package: ${top?.disease || 'General Care'}`,
      brand: isHi ? 'MediRush AI सत्यापित' : 'MediRush AI Verified',
      price: 149.00,
      quantity: 1,
      images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60']
    });
    navigate('/cart');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="w-full max-w-3xl mx-auto space-y-6 pb-12"
    >

      {/* ── SEVERE SYMPTOM URGENT WARNING BANNER ───────────────────────────── */}
      {(result.level === 'Emergency' || top?.severity === 'High' || top?.severity === 'Critical') && (
        <motion.div 
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-r from-red-600 via-red-700 to-rose-800 text-white rounded-3xl p-6 shadow-xl border border-red-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative overflow-hidden"
        >
          <div className="flex items-start gap-4 relative z-10">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md flex-shrink-0 border border-white/20 shadow-inner">
              <AlertTriangle size={28} className="text-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold tracking-tight">
                {isHi ? 'गंभीर स्वास्थ्य लक्षण पाए गए' : 'HIGH RISK SYMPTOMS DETECTED'}
              </h3>
              <p className="text-xs text-red-100 font-medium leading-relaxed mt-1">
                {isHi
                  ? 'गंभीर लक्षणों के लिए स्व-उपचार असुरक्षित है। कृपया तुरंत अस्पताल जाएं या विशेषज्ञ डॉक्टर से परामर्श लें।'
                  : 'Self-medication is unsafe for severe symptoms. Please visit a hospital or consult a qualified doctor immediately.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/nearby')}
            className="w-full sm:w-auto bg-white text-red-700 hover:bg-red-50 px-5 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer active:scale-95 transition-all relative z-10 flex-shrink-0"
          >
            <MapPin size={16} /> {isHi ? 'निकटतम अस्पताल खोजें' : 'Find Nearest Hospital'}
          </button>
        </motion.div>
      )}

      {/* ── MEDICINE ORDER FLOW ────────────────────────────────────────────── */}
      {isMedicineFlow ? (
        <>
          {result.medicines?.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white rounded-3xl p-7 shadow-2xl border border-blue-500/30 space-y-5 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border border-white/20">
                  <Pill size={15} className="text-blue-100" /> {isHi ? 'AI संस्तुत दवाइयां' : 'AI Suggested Medicines'}
                </div>
                <span className="text-xs font-extrabold bg-emerald-500/20 text-emerald-200 px-3 py-1 rounded-xl border border-emerald-400/30">
                  {isHi ? 'स्टॉक में उपलब्ध' : 'In Stock'}
                </span>
              </div>

              <div>
                <p className="text-xs uppercase font-bold tracking-widest text-blue-200 mb-2">
                  {isHi ? 'सुझाई गई OTC दवाइयां' : 'Recommended OTC Remedies'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.medicines.map((m, i) => (
                    <div key={i} className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/15 p-3.5 rounded-2xl text-sm font-bold text-white shadow-sm">
                      <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                      <span className="truncate">{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Order Button */}
              <button
                onClick={handleOrderSuggestedMedicines}
                className="w-full bg-white text-[#1565C0] hover:bg-blue-50 py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider shadow-xl flex items-center justify-center gap-2.5 active:scale-98 transition-all cursor-pointer mt-2"
              >
                <ShoppingBag size={20} />
                {isHi ? 'अभी ऑर्डर करें' : 'Order Now'}
              </button>
            </motion.div>
          )}

          {/* Condition Analysis Details */}
          <div className={cn("glass-card border-2 p-7 rounded-3xl shadow-floating relative overflow-hidden", result.colorClass)}>
            <div className="absolute -right-16 -bottom-16 opacity-[0.04] pointer-events-none">
              <Brain size={260} />
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center flex-wrap gap-2.5 mb-2">
                <span className={cn("text-xs font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-xl bg-white/80 border border-white/60 shadow-sm", result.iconColor)}>
                  {levelEmoji} {formatLevel(result.level, isHi)}
                </span>
                {result.mlPowered && (
                  <span className="text-xs font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1.5">
                    <Sparkles size={11} /> {isHi ? 'AI पावर्ड' : 'AI Powered'}
                  </span>
                )}
              </div>

              {top && (
                <div className="flex items-center gap-6 py-2">
                  <div className="relative flex-shrink-0">
                    <ConfidenceRing value={top.probability} color={ringColor} />
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-lg font-black text-gray-900 leading-none">{top.probability}%</span>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wide">{isHi ? 'मैच' : 'match'}</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                      {isHi ? 'मुख्य संभावित स्थिति' : 'Most Likely Condition'}
                    </p>
                    <h2 className={cn("text-3xl font-extrabold leading-tight", result.textColor)}>{top.disease}</h2>
                    <span className={cn(
                      "inline-block mt-2 text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border",
                      top.severity === 'Low' ? 'bg-green-100 text-green-700 border-green-200' :
                      top.severity === 'Medium' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                      'bg-red-100 text-red-700 border-red-200'
                    )}>
                      {formatSeverity(top.severity, isHi)}
                    </span>
                  </div>
                </div>
              )}

              {result.description && top && (
                <p className={cn("text-base font-medium opacity-90 leading-relaxed", result.textColor)}>{result.description}</p>
              )}

              {result.detectedSymptoms?.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs font-extrabold uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-1.5">
                    <Thermometer size={12} /> {isHi ? 'पहचाने गए लक्षण' : 'Symptoms Identified'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.detectedSymptoms.map((s, i) => (
                      <span key={i} className="text-xs font-bold bg-white/80 border border-white/60 rounded-xl px-3 py-1.5 text-gray-700 shadow-sm capitalize">
                        {s.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Compact Home Remedies */}
          {result.homeRemedies?.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="glass-card border border-white/60 p-6 rounded-3xl shadow-floating space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                  <Leaf size={15} className="text-green-600" />
                </div>
                <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                  {isHi ? 'उपयोगी घरेलू उपाय व देखभाल' : 'Helpful Home Care & Remedies'}
                </h3>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.homeRemedies.map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 font-medium bg-white/60 p-3 rounded-2xl border border-white/50 shadow-sm">
                    <CheckCircle2 size={15} className="text-green-500 flex-shrink-0 mt-0.5" />{r}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </>
      ) : (
        /* ── NORMAL MAIN PAGE FLOW (Standard Health Assessment View) ─────────────────── */
        <>
          {/* Top Hero Prediction Card */}
          <div className={cn("glass-card border-2 p-7 rounded-3xl shadow-floating relative overflow-hidden", result.colorClass)}>
            <div className="absolute -right-16 -bottom-16 opacity-[0.04] pointer-events-none">
              <Brain size={260} />
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center flex-wrap gap-2.5 mb-2">
                <span className={cn("text-xs font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-xl bg-white/80 border border-white/60 shadow-sm", result.iconColor)}>
                  {levelEmoji} {formatLevel(result.level, isHi)}
                </span>
                {result.mlPowered && (
                  <span className="text-xs font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1.5">
                    <Sparkles size={11} /> {isHi ? 'AI पावर्ड' : 'AI Powered'}
                  </span>
                )}
              </div>

              {top ? (
                <div className="flex items-center gap-6 py-2">
                  <div className="relative flex-shrink-0">
                    <ConfidenceRing value={top.probability} color={ringColor} />
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-lg font-black text-gray-900 leading-none">{top.probability}%</span>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wide">{isHi ? 'मैच' : 'match'}</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                      {isHi ? 'मुख्य संभावित स्थिति' : 'Most Likely Condition'}
                    </p>
                    <h2 className={cn("text-3xl font-extrabold leading-tight", result.textColor)}>{top.disease}</h2>
                    <span className={cn(
                      "inline-block mt-2 text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border",
                      top.severity === 'Low' ? 'bg-green-100 text-green-700 border-green-200' :
                      top.severity === 'Medium' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                      'bg-red-100 text-red-700 border-red-200'
                    )}>
                      {formatSeverity(top.severity, isHi)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-4">
                  <div className={cn("p-3.5 bg-white/80 rounded-2xl shadow-sm flex-shrink-0 border border-white/50", result.iconColor)}>
                    {result.level === 'Emergency' ? <AlertTriangle size={32} className="animate-pulse" /> :
                     result.level === 'Moderate' ? <Activity size={32} /> : <ShieldCheck size={32} />}
                  </div>
                  <div>
                    <h2 className={cn("text-2xl font-extrabold", result.textColor)}>{result.title}</h2>
                    <p className={cn("text-base mt-1 opacity-80 leading-relaxed font-medium", result.textColor)}>{result.description}</p>
                  </div>
                </div>
              )}

              {result.description && top && (
                <p className={cn("text-base font-medium opacity-90 leading-relaxed", result.textColor)}>{result.description}</p>
              )}

              {result.detectedSymptoms?.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs font-extrabold uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-1.5">
                    <Thermometer size={12} /> {isHi ? 'पहचाने गए लक्षण' : 'Symptoms Identified'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.detectedSymptoms.map((s, i) => (
                      <span key={i} className="text-xs font-bold bg-white/80 border border-white/60 rounded-xl px-3 py-1.5 text-gray-700 shadow-sm capitalize">
                        {s.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="h-px bg-black/10 my-4" />

              {/* Standard Primary Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                {result.actionType === 'visit_hospital' && (
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/nearby')}
                    className={cn("flex-1 text-white py-4 px-6 rounded-2xl font-black text-sm flex items-center justify-between shadow-xl cursor-pointer", result.buttonColor)}>
                    <div className="flex items-center"><MapPin size={19} className="mr-2" /> {isHi ? 'निकटतम अस्पताल खोजें' : 'Find Nearest Hospital'}</div>
                    <ArrowRight size={19} />
                  </motion.button>
                )}
                {result.actionType === 'order_medicine' && (
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/medicines')}
                    className={cn("flex-1 text-white py-4 px-6 rounded-2xl font-black text-sm flex items-center justify-between shadow-xl cursor-pointer", result.buttonColor)}>
                    <div className="flex items-center"><Pill size={19} className="mr-2" /> {isHi ? 'दवाइयां ऑर्डर करें' : 'Order Medicine Now'}</div>
                    <ArrowRight size={19} />
                  </motion.button>
                )}
                {result.actionType === 'home_remedies' && (
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/home-remedies')}
                    className={cn("flex-1 text-white py-4 px-6 rounded-2xl font-black text-sm flex items-center justify-between shadow-xl cursor-pointer", result.buttonColor)}>
                    <div className="flex items-center"><HeartPulse size={19} className="mr-2" /> {isHi ? 'सुरक्षित घरेलू उपाय देखें' : 'View Safe Remedies'}</div>
                    <ArrowRight size={19} />
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* Medicines + Home Remedies 2-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {result.medicines?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="glass-card border border-white/60 p-6 rounded-3xl shadow-floating space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Pill size={16} className="text-blue-600" />
                      </div>
                      <h3 className="text-base font-extrabold text-gray-900">
                        {isHi ? 'सुझाई गई दवाइयां' : 'Suggested Medicines'}
                      </h3>
                    </div>
                  </div>
                  <ul className="space-y-2.5 mb-4">
                    {result.medicines.map((m, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-800 font-bold bg-white/50 p-2.5 rounded-xl border border-white/40">
                        <CheckCircle2 size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />{m}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* DIRECT ORDER SUGGESTED MEDICINES BUTTON */}
                <div className="space-y-2 pt-2 border-t border-gray-100/60">
                  <button
                    onClick={handleOrderSuggestedMedicines}
                    className="w-full bg-primary hover:bg-primary-dark text-white py-2.5 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                  >
                    <ShoppingBag size={15} />
                    {isHi ? 'यह दवाइयां ऑर्डर करें' : 'Order These Medicines'}
                  </button>
                  <p className="text-[10px] text-gray-400 font-semibold text-center flex items-center justify-center gap-1">
                    <Info size={10} /> {isHi ? 'डॉक्टर की सलाह से ही दवाइयां लें।' : 'Consult a physician before medication.'}
                  </p>
                </div>
              </motion.div>
            )}

            {result.homeRemedies?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}
                className="glass-card border border-white/60 p-6 rounded-3xl shadow-floating space-y-4">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Leaf size={16} className="text-emerald-600" />
                  </div>
                  <h3 className="text-base font-extrabold text-gray-900">
                    {isHi ? 'घरेलू उपाय व देखभाल' : 'Home Care & Remedies'}
                  </h3>
                </div>
                <ul className="space-y-2.5">
                  {result.homeRemedies.map((r, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-800 font-medium bg-white/50 p-2.5 rounded-xl border border-white/40">
                      <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />{r}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        </>
      )}

      {/* ── OTHER POSSIBLE CONDITIONS ────────────────────────────────────── */}
      {result.allPredictions?.length > 1 && (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
          className="glass-card border border-white/60 p-6 rounded-3xl shadow-floating space-y-4">
          <div className="flex items-center gap-2.5">
            <Brain size={18} className="text-primary" />
            <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-widest">
              {isHi ? 'अन्य संभावित स्थितियां' : 'Other Possible Conditions'}
            </h3>
          </div>
          <div className="space-y-3.5">
            {rest.map((p, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-gray-800">{p.disease}</span>
                  <span className={cn("text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border",
                    p.severity === 'Low' ? 'bg-green-50 text-green-600 border-green-200' :
                    p.severity === 'Medium' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                    'bg-red-50 text-red-600 border-red-200'
                  )}>{formatSeverityOnly(p.severity, isHi)}</span>
                </div>
                <Bar value={p.probability} color={SCOLOR[p.severity] || '#64748b'} />
              </div>
            ))}
          </div>
          {result.allPredictions.length > 4 && (
            <button onClick={() => setShowMore(!showMore)}
              className="mt-2 flex items-center gap-1.5 text-xs font-extrabold text-primary hover:opacity-70 transition-opacity cursor-pointer">
              {showMore ? <><ChevronUp size={14} />{isHi ? 'कम दिखाएं' : 'Show Less'}</> : <><ChevronDown size={14} />{result.allPredictions.length - 4} {isHi ? 'और देखें' : 'more'}</>}
            </button>
          )}
        </motion.div>
      )}

      {/* ── PRECAUTIONS ──────────────────────────────────────────────────── */}
      {result.precautions?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}
          className="glass-card border border-white/60 p-6 rounded-3xl shadow-floating space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-amber-100 rounded-xl flex items-center justify-center">
              <ShieldCheck size={15} className="text-amber-600" />
            </div>
            <h3 className="text-xs sm:text-sm font-extrabold text-gray-900 uppercase tracking-wider">
              {isHi ? 'महत्वपूर्ण सावधानियां' : 'Key Safety Precautions'}
            </h3>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.precautions.map((p, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 font-medium bg-white/60 p-3 rounded-2xl border border-white/50">
                <CheckCircle2 size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />{p}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* ── DISCLAIMER ───────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="glass-card border border-white/60 p-5 rounded-2xl flex items-start gap-3.5 bg-white/40">
        <AlertTriangle className="text-gray-400 flex-shrink-0 mt-0.5" size={17} />
        <p className="text-xs text-gray-600 leading-relaxed font-medium">
          <span className="font-extrabold text-gray-800 text-[10px] uppercase tracking-widest mr-1">
            {isHi ? 'अस्वीकरण:' : 'Disclaimer:'}
          </span>
          {isHi
            ? 'यह AI-आधारित लक्षण जांचकर्ता केवल जानकारी के लिए है। किसी भी दवा लेने या निदान के लिए पंजीकृत डॉक्टर से परामर्श लें।'
            : 'This AI-based symptom checker is for informational purposes only. Consult a registered healthcare professional for medical diagnosis and treatment.'}
        </p>
      </motion.div>

      {/* Restart */}
      <div className="text-center pb-2">
        <button onClick={onRestart}
          className="text-xs font-black text-gray-400 hover:text-primary uppercase tracking-widest transition-colors cursor-pointer">
          {isHi ? '↩ नई जांच शुरू करें' : '↩ Start New Symptom Check'}
        </button>
      </div>
    </motion.div>
  );
};

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

export const SymptomResultCard = ({ result, onRestart, isMedicineFlow = false }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [showMore, setShowMore] = useState(false);
  if (!result) return null;

  const top = result.allPredictions?.[0];
  const rest = result.allPredictions?.slice(1, showMore ? 10 : 4) || [];
  const ringColor = result.level === 'Emergency' ? '#ef4444' : result.level === 'Moderate' ? '#f97316' : '#22c55e';
  const levelEmoji = result.level === 'Emergency' ? '🚨' : result.level === 'Moderate' ? '⚠️' : '✅';

  const handleOrderSuggestedMedicines = () => {
    addToCart({
      id: `ai-suggested-bundle-${Date.now()}`,
      name: `AI Recommended Package: ${top?.disease || 'General Care'}`,
      brand: 'Pharmacist Audit Verified',
      price: 12.00,
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
      className="w-full max-w-2xl mx-auto space-y-4 pb-8"
    >

      {/* ── SEVERE SYMPTOM URGENT WARNING BANNER ───────────────────────────── */}
      {(result.level === 'Emergency' || top?.severity === 'High' || top?.severity === 'Critical') && (
        <motion.div 
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-r from-red-600 via-red-700 to-rose-800 text-white rounded-2xl p-5 shadow-lg border border-red-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden"
        >
          <div className="flex items-start gap-3 relative z-10">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md flex-shrink-0 border border-white/20 shadow-inner">
              <AlertTriangle size={24} className="text-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight">HIGH RISK SYMPTOMS DETECTED</h3>
              <p className="text-xs text-red-100 font-medium leading-relaxed mt-0.5">
                Self-medication is unsafe for severe symptoms. Please visit a hospital or consult a qualified doctor immediately.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/nearby')}
            className="w-full sm:w-auto bg-white text-red-700 hover:bg-red-50 px-4 py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer active:scale-95 transition-all relative z-10 flex-shrink-0"
          >
            <MapPin size={15} /> Find Nearest Hospital
          </button>
        </motion.div>
      )}

      {/* ── MEDICINE ORDER FLOW (Top Highlighted Medicines & Pharmacist Safeguard) ──────── */}
      {isMedicineFlow ? (
        <>
          {result.medicines?.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white rounded-3xl p-6 shadow-xl border border-blue-500/30 space-y-4 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-white/20">
                  <Pill size={13} className="text-blue-100" /> AI Suggested Medicines
                </div>
                <span className="text-[11px] font-extrabold bg-green-500/20 text-green-200 px-2.5 py-0.5 rounded-lg border border-green-400/30">
                  In Stock
                </span>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-blue-200 mb-1">Recommended OTC Remedies</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {result.medicines.map((m, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 p-2.5 rounded-xl text-xs font-bold text-white">
                      <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                      <span className="truncate">{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pharmacist Safeguard Notification */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 space-y-1.5 text-xs text-blue-100">
                <div className="flex items-center gap-1.5 text-yellow-300 font-extrabold text-[11px] uppercase tracking-wider">
                  <ShieldCheck size={14} /> Pharmacist Verification Safeguard
                </div>
                <p className="text-[11px] leading-relaxed opacity-95">
                  These medicines were matched by AI based on your symptoms. When ordered, a summary slip is sent to a partner pharmacy. A licensed pharmacist will audit the request and call you directly if any adjustment is needed.
                </p>
              </div>

              {/* Direct Order Button */}
              <button
                onClick={handleOrderSuggestedMedicines}
                className="w-full bg-white text-[#1565C0] hover:bg-blue-50 py-3.5 px-5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
              >
                <ShoppingBag size={18} />
                Order AI Suggested Medicines ($12.00)
              </button>
            </motion.div>
          )}

          {/* Condition Analysis Details */}
          <div className={cn("glass-card border-2 p-6 shadow-floating relative overflow-hidden", result.colorClass)}>
            <div className="absolute -right-16 -bottom-16 opacity-[0.04] pointer-events-none">
              <Brain size={260} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center flex-wrap gap-2 mb-5">
                <span className={cn("text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-lg bg-white/70 border border-white/50 shadow-sm", result.iconColor)}>
                  {levelEmoji} {result.level} Condition
                </span>
                {result.mlPowered && (
                  <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-lg bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1">
                    <Sparkles size={9} /> AI Powered
                  </span>
                )}
              </div>

              {top && (
                <div className="flex items-center gap-5 mb-5">
                  <div className="relative flex-shrink-0">
                    <ConfidenceRing value={top.probability} color={ringColor} />
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-[15px] font-extrabold text-gray-900 leading-none">{top.probability}%</span>
                      <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wide">match</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Most Likely Condition</p>
                    <h2 className={cn("text-2xl font-extrabold leading-tight", result.textColor)}>{top.disease}</h2>
                    <span className={cn(
                      "inline-block mt-1.5 text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full border",
                      top.severity === 'Low' ? 'bg-green-100 text-green-700 border-green-200' :
                      top.severity === 'Medium' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                      'bg-red-100 text-red-700 border-red-200'
                    )}>
                      {top.severity} Severity
                    </span>
                  </div>
                </div>
              )}

              {result.description && top && (
                <p className={cn("text-sm font-medium opacity-80 mb-5 leading-relaxed", result.textColor)}>{result.description}</p>
              )}

              {result.detectedSymptoms?.length > 0 && (
                <div>
                  <p className="text-[9px] font-extrabold uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-1.5">
                    <Thermometer size={10} /> Symptoms Identified
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.detectedSymptoms.map((s, i) => (
                      <span key={i} className="text-xs font-semibold bg-white/70 border border-white/50 rounded-lg px-2.5 py-1 text-gray-700 shadow-sm capitalize">
                        {s.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Compact Home Remedies for Mild/Low Severity */}
          {result.homeRemedies?.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="glass-card border border-white/60 p-4 shadow-floating">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                  <Leaf size={12} className="text-green-600" />
                </div>
                <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">Helpful Home Care & Remedies</h3>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.homeRemedies.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-700 font-medium bg-white/50 p-2 rounded-xl border border-white/40">
                    <CheckCircle2 size={12} className="text-green-500 flex-shrink-0 mt-0.5" />{r}
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
          <div className={cn("glass-card border-2 p-6 shadow-floating relative overflow-hidden", result.colorClass)}>
            <div className="absolute -right-16 -bottom-16 opacity-[0.04] pointer-events-none">
              <Brain size={260} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center flex-wrap gap-2 mb-5">
                <span className={cn("text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-lg bg-white/70 border border-white/50 shadow-sm", result.iconColor)}>
                  {levelEmoji} {result.level} Condition
                </span>
                {result.mlPowered && (
                  <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-lg bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1">
                    <Sparkles size={9} /> AI Powered
                  </span>
                )}
              </div>

              {top ? (
                <div className="flex items-center gap-5 mb-5">
                  <div className="relative flex-shrink-0">
                    <ConfidenceRing value={top.probability} color={ringColor} />
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-[15px] font-extrabold text-gray-900 leading-none">{top.probability}%</span>
                      <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wide">match</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Most Likely Condition</p>
                    <h2 className={cn("text-2xl font-extrabold leading-tight", result.textColor)}>{top.disease}</h2>
                    <span className={cn(
                      "inline-block mt-1.5 text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full border",
                      top.severity === 'Low' ? 'bg-green-100 text-green-700 border-green-200' :
                      top.severity === 'Medium' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                      'bg-red-100 text-red-700 border-red-200'
                    )}>
                      {top.severity} Severity
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-start mb-5 gap-4">
                  <div className={cn("p-3 bg-white/80 rounded-2xl shadow-sm flex-shrink-0 border border-white/50", result.iconColor)}>
                    {result.level === 'Emergency' ? <AlertTriangle size={30} className="animate-pulse" /> :
                     result.level === 'Moderate' ? <Activity size={30} /> : <ShieldCheck size={30} />}
                  </div>
                  <div>
                    <h2 className={cn("text-xl font-extrabold", result.textColor)}>{result.title}</h2>
                    <p className={cn("text-sm mt-1 opacity-80 leading-relaxed", result.textColor)}>{result.description}</p>
                  </div>
                </div>
              )}

              {result.description && top && (
                <p className={cn("text-sm font-medium opacity-80 mb-5 leading-relaxed", result.textColor)}>{result.description}</p>
              )}

              {result.detectedSymptoms?.length > 0 && (
                <div className="mb-5">
                  <p className="text-[9px] font-extrabold uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-1.5">
                    <Thermometer size={10} /> Symptoms Identified
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.detectedSymptoms.map((s, i) => (
                      <span key={i} className="text-xs font-semibold bg-white/70 border border-white/50 rounded-lg px-2.5 py-1 text-gray-700 shadow-sm capitalize">
                        {s.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="h-px bg-black/10 mb-4" />

              {/* Standard Primary CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                {result.actionType === 'visit_hospital' && (
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/nearby')}
                    className={cn("flex-1 text-white py-3.5 px-5 rounded-2xl font-extrabold flex items-center justify-between shadow-lg", result.buttonColor)}>
                    <div className="flex items-center"><MapPin size={17} className="mr-2" /> Find Nearest Hospital</div>
                    <ArrowRight size={17} />
                  </motion.button>
                )}
                {result.actionType === 'order_medicine' && (
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/medicines')}
                    className={cn("flex-1 text-white py-3.5 px-5 rounded-2xl font-extrabold flex items-center justify-between shadow-lg", result.buttonColor)}>
                    <div className="flex items-center"><Pill size={17} className="mr-2" /> Order Medicine Now</div>
                    <ArrowRight size={17} />
                  </motion.button>
                )}
                {result.actionType === 'home_remedies' && (
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/home-remedies')}
                    className={cn("flex-1 text-white py-3.5 px-5 rounded-2xl font-extrabold flex items-center justify-between shadow-lg", result.buttonColor)}>
                    <div className="flex items-center"><HeartPulse size={17} className="mr-2" /> View Safe Remedies</div>
                    <ArrowRight size={17} />
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* Medicines + Home Remedies 2-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {result.medicines?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="glass-card border border-white/60 p-5 shadow-floating">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Pill size={13} className="text-blue-600" />
                  </div>
                  <h3 className="text-sm font-extrabold text-gray-900">Suggested Medicines</h3>
                </div>
                <ul className="space-y-2">
                  {result.medicines.map((m, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700 font-medium">
                      <CheckCircle2 size={13} className="text-blue-400 flex-shrink-0 mt-0.5" />{m}
                    </li>
                  ))}
                </ul>
                <p className="text-[9px] text-gray-400 mt-3 font-semibold flex items-center gap-1">
                  <Info size={9} />Doctor se pooch ke hi dawai lein.
                </p>
              </motion.div>
            )}

            {result.homeRemedies?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}
                className="glass-card border border-white/60 p-5 shadow-floating">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center">
                    <Leaf size={13} className="text-green-600" />
                  </div>
                  <h3 className="text-sm font-extrabold text-gray-900">Home Remedies</h3>
                </div>
                <ul className="space-y-2">
                  {result.homeRemedies.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700 font-medium">
                      <CheckCircle2 size={13} className="text-green-400 flex-shrink-0 mt-0.5" />{r}
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
          className="glass-card border border-white/60 p-5 shadow-floating">
          <div className="flex items-center gap-2 mb-4">
            <Brain size={15} className="text-primary" />
            <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-widest">Other Possible Conditions</h3>
          </div>
          <div className="space-y-3">
            {rest.map((p, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-700">{p.disease}</span>
                  <span className={cn("text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border",
                    p.severity === 'Low' ? 'bg-green-50 text-green-600 border-green-200' :
                    p.severity === 'Medium' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                    'bg-red-50 text-red-600 border-red-200'
                  )}>{p.severity}</span>
                </div>
                <Bar value={p.probability} color={SCOLOR[p.severity] || '#64748b'} />
              </div>
            ))}
          </div>
          {result.allPredictions.length > 4 && (
            <button onClick={() => setShowMore(!showMore)}
              className="mt-3 flex items-center gap-1 text-xs font-bold text-primary hover:opacity-70 transition-opacity">
              {showMore ? <><ChevronUp size={13} />Less</> : <><ChevronDown size={13} />{result.allPredictions.length - 4} more</>}
            </button>
          )}
        </motion.div>
      )}

      {/* ── PRECAUTIONS ──────────────────────────────────────────────────── */}
      {result.precautions?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}
          className="glass-card border border-white/60 p-4 shadow-floating">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center">
              <ShieldCheck size={12} className="text-amber-600" />
            </div>
            <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">Precautions / Sawdhaniyaan</h3>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {result.precautions.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-700 font-medium bg-white/50 p-2 rounded-xl border border-white/40">
                <CheckCircle2 size={12} className="text-amber-500 flex-shrink-0 mt-0.5" />{p}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* ── DISCLAIMER ───────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="glass-card border border-white/50 p-4 flex items-start gap-3">
        <AlertTriangle className="text-gray-400 flex-shrink-0 mt-0.5" size={15} />
        <p className="text-xs text-gray-500 leading-relaxed font-medium">
          <span className="font-extrabold text-gray-700 text-[9px] uppercase tracking-widest mr-1">Disclaimer:</span>
          Yeh AI-based symptom checker sirf jaankari ke liye hai. Kisi bhi dawai lene ya diagnosis ke liye qualified doctor se milein.
        </p>
      </motion.div>

      {/* Restart */}
      <div className="text-center pb-2">
        <button onClick={onRestart}
          className="text-[11px] font-extrabold text-gray-400 hover:text-primary uppercase tracking-widest transition-colors cursor-pointer">
          ↩ Nayi Jaanch Shuru Karein
        </button>
      </div>
    </motion.div>
  );
};

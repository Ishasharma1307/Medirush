import React from 'react';
import { 
  AlertTriangle, Info, BookOpen, MessageSquare, AlertOctagon, MapPin, 
  CheckCircle2, XCircle, Stethoscope, Utensils, ShieldCheck, Activity,
  Sparkles, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

export const ReportResultCard = ({ result }) => {
  const navigate = useNavigate();

  if (!result) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      
      {/* 🚨 1. IMMEDIATE CRITICAL EMERGENCY ALERT BANNER */}
      {result.is_emergency && (
        <motion.div 
          variants={itemVariants}
          className="bg-gradient-to-r from-red-600 via-red-700 to-rose-900 text-white rounded-3xl p-6 shadow-2xl border-2 border-red-500 space-y-4 relative overflow-hidden"
        >
          <div className="flex items-start gap-4">
            <div className="bg-white/20 p-3 rounded-2xl flex-shrink-0 backdrop-blur-md border border-white/20">
              <AlertOctagon size={28} className="text-white animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2.5 py-0.5 rounded-md border border-white/20">
                🚨 CRITICAL EMERGENCY FINDING
              </span>
              <h3 className="text-lg font-black mt-1">
                Immediate Doctor / Emergency Care Required
              </h3>
              <p className="text-xs text-red-100 font-medium leading-relaxed mt-1">
                This report indicates high-risk cardiac or critical medical values. Do not delay—consult a doctor immediately or visit the nearest hospital ER.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              onClick={() => navigate('/nearby')}
              className="py-3 px-5 rounded-2xl font-black text-xs uppercase tracking-wider bg-white text-red-700 hover:bg-red-50 shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <MapPin size={16} /> Find Emergency Hospital Nearby
            </button>
            <button
              onClick={() => navigate('/emergency')}
              className="py-3 px-5 rounded-2xl font-black text-xs uppercase tracking-wider bg-red-950 hover:bg-black text-white shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Stethoscope size={16} /> Call Emergency Services (112)
            </button>
          </div>
        </motion.div>
      )}

      {/* 📋 2. MAIN REPORT OVERVIEW & CATEGORY HEADER */}
      <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 sm:p-7 border border-indigo-100 shadow-xl space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center">
              <Activity size={20} />
            </div>
            <div>
              <span className="text-[10px] font-black text-indigo-800 uppercase tracking-widest bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                {result.categoryName || "Medical Report"}
              </span>
              <h2 className="text-base sm:text-lg font-black text-gray-900 mt-0.5">
                MediRush AI Report Summary
              </h2>
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-gray-700 font-bold leading-relaxed">
          {result.summary}
        </p>

        {/* Quick Stat Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-red-50 border border-red-100 p-3 rounded-2xl">
            <span className="text-lg font-black text-red-700">{result.abnormalParameters?.length || 0}</span>
            <p className="text-[10px] font-black text-red-900 uppercase tracking-wider mt-0.5">Abnormal / High Flags</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl">
            <span className="text-lg font-black text-emerald-700">{result.normalParameters?.length || 0}</span>
            <p className="text-[10px] font-black text-emerald-900 uppercase tracking-wider mt-0.5">Normal Values</p>
          </div>
          <div className="bg-purple-50 border border-purple-100 p-3 rounded-2xl col-span-2 sm:col-span-1">
            <span className="text-xs font-black text-purple-900 truncate block">{result.specialist?.split('(')[0]}</span>
            <p className="text-[10px] font-black text-purple-700 uppercase tracking-wider mt-0.5">Recommended Specialist</p>
          </div>
        </div>
      </motion.div>

      {/* 🔬 3. DETAILED PARAMETER BREAKDOWN TABLE & STATUS */}
      {result.parsedParameters?.length > 0 && (
        <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-md space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Sparkles size={18} className="text-indigo-600" />
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">
              Parameter Breakdown & Findings (रिपोर्ट की मुख्य वैल्यूज)
            </h3>
          </div>

          <div className="space-y-3">
            {result.parsedParameters.map((param, idx) => {
              const isHigh = param.status === 'HIGH';
              const isLow = param.status === 'LOW';
              const isCritical = param.status === 'CRITICAL';

              return (
                <div 
                  key={idx}
                  className={cn(
                    "p-4 rounded-2xl border transition-all space-y-2",
                    isCritical ? "bg-red-50 border-red-200" :
                    isHigh ? "bg-amber-50/60 border-amber-200" :
                    isLow ? "bg-blue-50/60 border-blue-200" :
                    "bg-gray-50/60 border-gray-200"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs sm:text-sm text-gray-900">
                        {param.name}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <span className={cn(
                      "text-[10px] font-black uppercase px-2.5 py-1 rounded-lg tracking-wider border",
                      isCritical ? "bg-red-600 text-white border-red-700 animate-pulse" :
                      isHigh ? "bg-amber-500 text-white border-amber-600" :
                      isLow ? "bg-blue-600 text-white border-blue-700" :
                      "bg-emerald-600 text-white border-emerald-700"
                    )}>
                      {param.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-600 font-bold border-t border-black/5 pt-1.5">
                    <span>Observed Level: <strong className="text-gray-900">{param.val}</strong></span>
                    <span className="text-[11px] text-gray-500">{param.category} Panel</span>
                  </div>

                  <p className="text-[11px] text-gray-600 font-medium leading-relaxed pt-1">
                    💡 <strong>What it means:</strong> {param.meaning}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* 👨‍⚕️ 4. RECOMMENDED SPECIALIST DOCTOR CARD */}
      {result.specialist && (
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-indigo-900 to-purple-950 text-white rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20">
              <Stethoscope size={24} className="text-purple-300" />
            </div>
            <div>
              <span className="text-[10px] font-black text-purple-200 uppercase tracking-widest">
                Recommended Specialist Doctor
              </span>
              <h3 className="text-base font-black text-white mt-0.5">
                {result.specialist}
              </h3>
            </div>
          </div>

          <p className="text-xs text-purple-100 font-medium leading-relaxed">
            For accurate prescription and clinical diagnosis based on these report findings, consult a qualified {result.specialist?.split('(')[0]}.
          </p>

          <button
            onClick={() => navigate('/nearby')}
            className="w-full bg-white text-indigo-900 hover:bg-indigo-50 py-3 px-5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <MapPin size={16} /> Find {result.specialist?.split('(')[0]} Hospitals Nearby
          </button>
        </motion.div>
      )}

      {/* 🥗 5. DIETARY & LIFESTYLE ACTION PLAN */}
      {result.dietPlan && (
        <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-md space-y-4">
          <div className="flex items-center gap-2 border-b border-emerald-50 pb-3">
            <Utensils size={18} className="text-emerald-700" />
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">
              Dietary & Recovery Recommendations (आहार एवं परहेज)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Foods to Eat (Do's) */}
            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-2">
              <h4 className="text-xs font-black uppercase text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-emerald-600" /> Recommended Foods (क्या खाएं):
              </h4>
              <ul className="space-y-2">
                {result.dietPlan.dos.map((item, idx) => (
                  <li key={idx} className="flex items-start text-xs font-bold text-emerald-950 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Foods to Avoid (Don'ts) */}
            <div className="bg-red-50/70 p-4 rounded-2xl border border-red-200 space-y-2">
              <h4 className="text-xs font-black uppercase text-red-900 flex items-center gap-1.5">
                <XCircle size={16} className="text-red-600" /> Foods to Avoid (क्या न खाएं):
              </h4>
              <ul className="space-y-2">
                {result.dietPlan.donts.map((item, idx) => (
                  <li key={idx} className="flex items-start text-xs font-bold text-red-950 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </motion.div>
      )}

      {/* 💬 6. QUESTIONS TO ASK YOUR DOCTOR */}
      {result.questions_for_doctor?.length > 0 && (
        <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 border border-purple-100 shadow-md space-y-3">
          <div className="flex items-center gap-2 border-b border-purple-50 pb-3">
            <MessageSquare size={18} className="text-purple-700" />
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">
              Smart Questions to Ask Your Doctor (डॉक्टर से क्या पूछें)
            </h3>
          </div>

          <ul className="space-y-2.5">
            {result.questions_for_doctor.map((q, idx) => (
              <li key={idx} className="flex items-start gap-2.5 bg-purple-50/60 p-3 rounded-2xl border border-purple-100 text-xs font-bold text-purple-950">
                <span className="text-purple-600 font-extrabold">•</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* ⚠️ 7. MEDICAL DISCLAIMER */}
      <motion.div variants={itemVariants} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
          <strong className="text-gray-700 uppercase tracking-wider text-[10px]">Disclaimer:</strong> This AI explanation is for educational awareness only and does not constitute formal medical diagnosis. Please present your lab report to a certified doctor for treatment.
        </p>
      </motion.div>

    </motion.div>
  );
};

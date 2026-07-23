import React from 'react';
import { AlertTriangle, Info, BookOpen, MessageSquare, AlertOctagon } from 'lucide-react';
import { motion } from 'framer-motion';

export const ReportResultCard = ({ result }) => {
  if (!result) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      
      {/* Emergency Warning */}
      {result.is_emergency && (
        <motion.div variants={itemVariants} className="glass-card bg-danger/10 border-danger/20 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-white/80 p-3 rounded-full flex-shrink-0 border border-danger/10">
              <AlertOctagon size={24} className="text-danger animate-pulseSoft" />
            </div>
            <div>
              <h3 className="text-danger font-extrabold text-lg drop-shadow-sm">Immediate Attention Required</h3>
              <p className="text-danger/80 text-sm mt-1 font-medium leading-relaxed">
                This report contains critical medical terms. Please consult a doctor immediately or visit an emergency room. Do not rely solely on this simplified explanation.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Summary Section */}
      <motion.div variants={itemVariants} className="glass-card p-6 border-white/60">
        <div className="flex items-center gap-3 mb-4 border-b border-gray-200/50 pb-3">
          <div className="bg-primary/10 p-2.5 rounded-xl text-primary border border-primary/20 shadow-inner">
            <Info size={20} />
          </div>
          <h3 className="font-extrabold text-gray-900 text-lg">Simple Summary</h3>
        </div>
        <p className="text-gray-700 leading-relaxed font-medium">
          {result.summary}
        </p>
      </motion.div>

      {/* Important Terms Explained */}
      {result.important_terms && result.important_terms.length > 0 && (
        <motion.div variants={itemVariants} className="glass-card p-6 border-white/60">
          <div className="flex items-center gap-3 mb-4 border-b border-gray-200/50 pb-3">
            <div className="bg-secondary/10 p-2.5 rounded-xl text-secondary border border-secondary/20 shadow-inner">
              <BookOpen size={20} />
            </div>
            <h3 className="font-extrabold text-gray-900 text-lg">Terms Explained</h3>
          </div>
          <div className="space-y-4">
            {result.important_terms.map((item, idx) => (
              <div key={idx} className="bg-white/40 backdrop-blur-sm p-4 rounded-2xl border-l-4 border-l-secondary border-y border-r border-white/50 shadow-sm">
                <p className="font-bold text-gray-900">{item.term}</p>
                <p className="text-gray-600 text-sm mt-1.5 font-medium">{item.meaning}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Questions for Doctor */}
      {result.questions_for_doctor && result.questions_for_doctor.length > 0 && (
        <motion.div variants={itemVariants} className="glass-card p-6 border-white/60">
          <div className="flex items-center gap-3 mb-4 border-b border-gray-200/50 pb-3">
            <div className="bg-purple-500/10 p-2.5 rounded-xl text-purple-600 border border-purple-500/20 shadow-inner">
              <MessageSquare size={20} />
            </div>
            <h3 className="font-extrabold text-gray-900 text-lg">Ask Your Doctor</h3>
          </div>
          <ul className="space-y-3">
            {result.questions_for_doctor.map((q, idx) => (
              <li key={idx} className="flex items-start gap-3 bg-white/40 backdrop-blur-sm p-3 rounded-xl border border-white/50 shadow-sm">
                <span className="text-purple-500 font-bold mt-0.5">•</span>
                <span className="text-gray-700 text-sm font-medium">{q}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Permanent Safety Disclaimer */}
      <motion.div variants={itemVariants} className="bg-white/40 backdrop-blur-md border border-white/50 rounded-3xl p-5 text-center shadow-sm">
        <AlertTriangle size={24} className="text-gray-400 mx-auto mb-2" />
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1.5">Safety Disclaimer</p>
        <p className="text-[11px] text-gray-400 leading-relaxed max-w-sm mx-auto uppercase tracking-wider">
          This explanation is for understanding only and is not medical advice. Please consult a qualified doctor for diagnosis and treatment.
        </p>
      </motion.div>

    </motion.div>
  );
};

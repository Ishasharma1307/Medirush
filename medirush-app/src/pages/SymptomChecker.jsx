import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SymptomChatbot } from '../components/SymptomChatbot';
import { SymptomResultCard } from '../components/SymptomResultCard';
import { analyzeSymptoms } from '../utils/symptomRules';
import { ArrowLeft, Stethoscope } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SymptomChecker = () => {
  const navigate = useNavigate();
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleChatComplete = async (answers) => {
    setIsAnalyzing(true);
    
    // Ensure the analyzing UI is shown for at least 1.5s for the "AI processing" feel
    // even if the API responds instantly or fails fast
    const minDelayPromise = new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      const [result] = await Promise.all([
        analyzeSymptoms(answers),
        minDelayPromise
      ]);
      setAnalysisResult(result);
    } catch (err) {
      console.error("Analysis Error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRestart = () => {
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col relative overflow-hidden">
      
      {/* Decorative Background */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/70 backdrop-blur-md border-b border-white/50 px-4 py-4 flex items-center shadow-sm relative z-20"
      >
        <button 
          onClick={() => navigate('/home')} 
          className="p-2 mr-3 bg-white/60 text-gray-600 hover:text-primary hover:bg-white rounded-xl transition-all shadow-sm border border-white/40 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <div className="flex items-center">
          <div className="bg-primary/10 p-2.5 rounded-xl mr-3 shadow-inner border border-primary/20">
            <Stethoscope className="text-primary" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-gray-900 leading-tight drop-shadow-sm">Symptom Checker</h1>
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest text-primary/70">MediRush AI Triage</p>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 lg:p-8 overflow-hidden flex flex-col h-[calc(100vh-80px)] relative z-10">
        <AnimatePresence mode="wait">
          {!analysisResult && !isAnalyzing && (
            <motion.div 
              key="chatbot"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex-1 h-full min-h-[500px]"
            >
               <SymptomChatbot onComplete={handleChatComplete} />
            </motion.div>
          )}

          {isAnalyzing && (
            <motion.div 
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center"
            >
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-primary/20 rounded-full animate-ping absolute opacity-75"></div>
                <div className="w-24 h-24 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center relative z-10 shadow-glass border border-white/50">
                  <Stethoscope size={36} className="text-primary animate-pulseSoft" />
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-3 drop-shadow-sm">AI Analysis Running...</h3>
              <p className="text-gray-600 font-medium text-center max-w-xs leading-relaxed">
                Matching your symptoms against our medical database to find the most likely conditions...
              </p>
            </motion.div>
          )}

          {analysisResult && !isAnalyzing && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-4 h-full overflow-y-auto scrollbar-hide"
            >
              <SymptomResultCard result={analysisResult} onRestart={handleRestart} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

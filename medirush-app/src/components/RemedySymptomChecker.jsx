import React, { useState } from 'react';
import { Stethoscope } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SymptomChatbot } from './SymptomChatbot';
import { SymptomResultCard } from './SymptomResultCard';
import { analyzeSymptoms } from '../utils/symptomRules';

export const RemedySymptomChecker = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Called when SymptomChatbot finishes collecting inputs
  const handleChatComplete = async (userAnswers) => {
    setIsAnalyzing(true);
    
    const minDelayPromise = new Promise(resolve => setTimeout(resolve, 1400));

    try {
      const [ruleAnalysis] = await Promise.all([
        analyzeSymptoms(userAnswers),
        minDelayPromise
      ]);

      setAnalysisResult(ruleAnalysis);
    } catch (err) {
      console.error("Symptom Analysis Error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRestart = () => {
    setAnalysisResult(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* 🤖 1. UNIFIED SYMPTOM CHATBOT INTERFACE (Same ML Model & Process as Main App) */}
      {!analysisResult && !isAnalyzing && (
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-2 sm:p-4 shadow-xl border border-emerald-100 min-h-[500px]">
          <SymptomChatbot onComplete={handleChatComplete} />
        </div>
      )}

      {/* ⏳ 2. AI ML PROCESSING SCREEN */}
      {isAnalyzing && (
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-12 shadow-xl border border-emerald-100 text-center space-y-6 flex flex-col items-center justify-center min-h-[380px]">
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
              Evaluating symptoms using clinical machine learning prediction engine...
            </p>
          </div>
        </div>
      )}

      {/* 🏆 3. UNIFIED SYMPTOM RESULT CARD (Exact same output view as all other checkers in the app) */}
      {analysisResult && !isAnalyzing && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <SymptomResultCard result={analysisResult} onRestart={handleRestart} />
        </motion.div>
      )}

    </div>
  );
};

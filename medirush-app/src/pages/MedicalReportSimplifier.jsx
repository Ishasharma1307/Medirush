import React, { useState } from 'react';
import { ArrowLeft, Activity, FileText, Loader2, Wand2, Sparkles, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ReportUploader } from '../components/ReportUploader';
import { ReportResultCard } from '../components/ReportResultCard';
import { mockReportExamples } from '../data/mockReportExamples';
import { simplifyReport } from '../utils/reportSimplifierRules';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { Button } from '../components/ui/Button';

export const MedicalReportSimplifier = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleSimplify = () => {
    if (!file && !text.trim()) return;
    
    setIsAnalyzing(true);
    setResult(null);

    // Simulate AI processing delay
    setTimeout(() => {
      const textToAnalyze = text.trim() || mockReportExamples.fullMasterDemo;
      const analysisResult = simplifyReport(textToAnalyze);
      setResult(analysisResult);
      setIsAnalyzing(false);
    }, 1400);
  };

  const fillMockAndAnalyze = (type) => {
    const sampleText = mockReportExamples[type] || mockReportExamples.fullMasterDemo;
    setText(sampleText);
    setFile(null);
    setIsAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      const analysisResult = simplifyReport(sampleText);
      setResult(analysisResult);
      setIsAnalyzing(false);
    }, 1200);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-background font-sans pb-24 relative overflow-hidden">
      
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-900 to-purple-950 px-5 pt-10 pb-20 shadow-xl rounded-b-[2.5rem]">
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-72 h-72 rounded-full bg-black/10 blur-2xl pointer-events-none" />
        
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-5 left-4 bg-white/20 hover:bg-white/30 backdrop-blur-md p-2.5 rounded-2xl transition-all shadow-sm border border-white/20 cursor-pointer"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center relative z-10 max-w-md mx-auto mt-4"
        >
          <div className="inline-flex items-center justify-center mb-3">
            <div className="relative">
               <div className="absolute inset-0 bg-white/30 rounded-full animate-ping" />
               <div className="relative bg-white/20 backdrop-blur-sm border border-white/30 p-4 rounded-full shadow-glass text-white">
                 <FileText size={34} />
               </div>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
            AI Medical Report Simplifier
          </h1>
          <p className="text-indigo-100 mt-1.5 text-xs sm:text-sm font-medium max-w-sm mx-auto leading-relaxed drop-shadow-sm">
            Paste or upload any medical report (CBC, LFT, KFT, Lipid, Diabetes, Thyroid) for instant simplified analysis in plain language.
          </p>
        </motion.div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto px-4 -mt-10 space-y-6 relative z-10"
      >
        
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="input" variants={containerVariants} initial="hidden" animate="visible" exit={{ opacity: 0, y: -20 }} className="space-y-6">
              
              {/* ⚡ 1-CLICK MASTER DEMO REPORT CALLOUT BANNER */}
              <motion.div 
                variants={itemVariants}
                className="bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-700 text-white p-5 sm:p-6 rounded-3xl shadow-xl border border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/20 flex-shrink-0">
                    <Sparkles size={24} className="text-amber-200 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-md border border-white/20">
                      ⚡ 1-Click Master Test Demo
                    </span>
                    <h3 className="text-base font-black mt-0.5">
                      Try Full Master Demo Report (सब कुछ शामिल रिपोर्ट देखें)
                    </h3>
                    <p className="text-xs text-amber-100 font-medium">
                      Contains CBC, Liver, Kidney, Cholesterol, Diabetes, and Thyroid test values.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => fillMockAndAnalyze('fullMasterDemo')}
                  className="w-full sm:w-auto bg-white text-emerald-900 hover:bg-emerald-50 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 whitespace-nowrap flex-shrink-0"
                >
                  <Play size={15} fill="currentColor" /> Load & Analyze Demo Report
                </button>
              </motion.div>

              {/* 1. Uploader */}
              <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-indigo-100 shadow-lg space-y-3">
                <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center">
                  <FileText size={15} className="mr-1.5 text-indigo-600" /> Upload Report Image / PDF
                </p>
                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-1">
                   <ReportUploader file={file} onChange={setFile} />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center gap-4">
                <div className="h-px bg-gray-200 flex-1"></div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">OR PASTE TEXT</span>
                <div className="h-px bg-gray-200 flex-1"></div>
              </motion.div>

              {/* 2. Text Area */}
              <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-indigo-100 shadow-lg space-y-4">
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center">
                  <Activity size={15} className="mr-1.5 text-indigo-600" /> Paste Report Values / Medical Text Here
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="e.g. Hemoglobin: 9.2 g/dL (LOW), SGPT: 145 U/L (HIGH), Serum Creatinine: 2.4 mg/dL..."
                  rows={6}
                  className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 p-4 text-xs font-bold text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-600 transition-all leading-relaxed placeholder:text-gray-400"
                />
              </motion.div>

              {/* 3. Action Button */}
              <motion.div variants={itemVariants}>
                <Button
                  onClick={handleSimplify}
                  disabled={(!file && !text.trim()) || isAnalyzing}
                  className={cn(
                    "w-full py-5 rounded-2xl font-black text-sm uppercase tracking-wider shadow-xl transition-all cursor-pointer",
                    (!file && !text.trim()) || isAnalyzing
                      ? ""
                      : "bg-indigo-700 hover:bg-indigo-800 text-white shadow-indigo-700/25"
                  )}
                  size="lg"
                >
                  {isAnalyzing ? (
                    <><Loader2 size={20} className="animate-spin mr-2" /> MediRush AI Analyzing Report...</>
                  ) : (
                    <><Wand2 size={20} className="mr-2" /> Simplify Medical Report Now</>
                  )}
                </Button>
              </motion.div>
              
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <ReportResultCard result={result} />
              <Button
                onClick={() => { setResult(null); setText(''); setFile(null); }}
                variant="glass"
                className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-wider text-indigo-900 bg-white hover:bg-indigo-50 border border-indigo-200 shadow-md cursor-pointer"
              >
                ← Simplify Another Medical Report
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

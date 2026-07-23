import React, { useState } from 'react';
import { ArrowLeft, Activity, FileText, Loader2, Wand2 } from 'lucide-react';
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
      const textToAnalyze = text.trim() || mockReportExamples.bloodTest;
      const analysisResult = simplifyReport(textToAnalyze);
      setResult(analysisResult);
      setIsAnalyzing(false);
    }, 2000);
  };

  const fillMock = (type) => {
    setText(mockReportExamples[type]);
    setFile(null);
    setResult(null);
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
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-primary to-blue-800 px-5 pt-10 pb-20 shadow-floating rounded-b-[2.5rem]">
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-72 h-72 rounded-full bg-black/10 blur-2xl pointer-events-none" />
        
        <button onClick={() => navigate(-1)} className="absolute top-5 left-4 bg-white/20 hover:bg-white/30 backdrop-blur-md p-2.5 rounded-2xl transition-all shadow-sm border border-white/20">
          <ArrowLeft size={20} className="text-white" />
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center relative z-10 max-w-md mx-auto mt-4"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <div className="relative">
               <div className="absolute inset-0 bg-white/30 rounded-full animate-ping" />
               <div className="relative bg-white/20 backdrop-blur-sm border border-white/30 p-4 rounded-full shadow-glass">
                 <FileText size={32} className="text-white" />
               </div>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">Medical Report Simplifier</h1>
          <p className="text-indigo-100 mt-2 text-sm font-medium max-w-xs mx-auto leading-relaxed drop-shadow-sm">
            Understand your medical reports in simple language.
          </p>
        </motion.div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto px-4 -mt-10 space-y-6 relative z-10"
      >
        
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="input" variants={containerVariants} initial="hidden" animate="visible" exit={{ opacity: 0, y: -20 }} className="space-y-6">
              
              {/* 1. Uploader */}
              <motion.div variants={itemVariants} className="glass-card p-5 border-white/60">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center">
                  <FileText size={14} className="mr-1.5 text-primary" /> Upload Report Image/PDF
                </p>
                <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-white/50 p-1">
                   <ReportUploader file={file} onChange={setFile} />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center gap-4">
                <div className="h-px bg-gray-200/50 flex-1"></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">OR</span>
                <div className="h-px bg-gray-200/50 flex-1"></div>
              </motion.div>

              {/* 2. Text Area */}
              <motion.div variants={itemVariants} className="glass-card p-5 border-white/60">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center">
                  <Activity size={14} className="mr-1.5 text-primary" /> Paste Report Text Here
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="e.g. TSH: 5.6 mIU/L, HbA1c: 7.2%..."
                  rows={5}
                  className="w-full resize-none rounded-2xl border border-white/50 bg-white/60 backdrop-blur-md px-4 py-3 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all leading-relaxed shadow-inner placeholder:text-gray-400"
                />
                
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mr-1">Try mock data:</span>
                  <button onClick={() => fillMock('bloodTest')} className="text-xs font-bold text-indigo-600 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg hover:bg-indigo-500/20 transition-colors">Blood Test</button>
                  <button onClick={() => fillMock('diabetes')} className="text-xs font-bold text-indigo-600 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg hover:bg-indigo-500/20 transition-colors">Diabetes</button>
                  <button onClick={() => fillMock('emergency')} className="text-xs font-bold text-danger bg-danger/10 border border-danger/20 px-3 py-1.5 rounded-lg hover:bg-danger/20 transition-colors">Emergency ECG</button>
                </div>
              </motion.div>

              {/* 3. Action Button */}
              <motion.div variants={itemVariants}>
                <Button
                  onClick={handleSimplify}
                  disabled={(!file && !text.trim()) || isAnalyzing}
                  className={cn(
                    "w-full py-5 rounded-2xl font-extrabold text-base shadow-lg transition-all",
                    (!file && !text.trim()) || isAnalyzing
                      ? ""
                      : "shadow-primary/30"
                  )}
                  size="lg"
                  variant={(!file && !text.trim()) || isAnalyzing ? "outline" : "primary"}
                >
                  {isAnalyzing ? (
                    <><Loader2 size={20} className="animate-spin mr-2" /> Analyzing Report...</>
                  ) : (
                    <><Wand2 size={20} className="mr-2" /> Simplify Report</>
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
                className="w-full py-5 rounded-2xl font-extrabold text-indigo-700 bg-white/60 hover:bg-white/80 border-indigo-100/50"
              >
                Analyze Another Report
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

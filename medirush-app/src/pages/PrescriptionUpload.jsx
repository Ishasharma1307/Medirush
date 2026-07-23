import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, FileText, Zap, CheckCircle2,
  ShieldCheck, Loader2, AlertTriangle, Send
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { PrescriptionUploader } from '../components/PrescriptionUploader';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { Button } from '../components/ui/Button';

// ─── Upload status enum ──────────────────────────────────────────────────────
const STATUS = { IDLE: 'idle', UPLOADING: 'uploading', SUCCESS: 'success', ERROR: 'error' };

export const PrescriptionUpload = () => {
  const navigate = useNavigate();
  const { user }  = useAuth();

  const [file,     setFile]     = useState(null);    // File | null
  const [note,     setNote]     = useState('');       // optional note
  const [isUrgent, setIsUrgent] = useState(false);   // urgent flag
  const [status,   setStatus]   = useState(STATUS.IDLE);
  const [errMsg,   setErrMsg]   = useState('');

  // ── Submit handler ─────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setErrMsg('Please select a prescription file first.'); return; }
    if (!user)  { setErrMsg('You must be logged in to upload a prescription.'); return; }

    setStatus(STATUS.UPLOADING);
    setErrMsg('');

    try {
      // 1. Build unique storage path  →  prescriptions/{userId}/{timestamp}-{filename}
      const ext      = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${ext}`;

      // 2. Upload file to Supabase Storage bucket: "prescriptions"
      const { error: uploadErr } = await supabase.storage
        .from('prescriptions')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (uploadErr) throw uploadErr;

      // 3. Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('prescriptions')
        .getPublicUrl(fileName);

      const prescriptionUrl = urlData?.publicUrl;

      // 4. Insert a row into the "prescriptions" table
      const { error: dbErr } = await supabase
        .from('prescriptions')
        .insert([{
          user_id:          user.id,
          prescription_url: prescriptionUrl,
          note:             note.trim() || null,
          is_urgent:        isUrgent,
          status:           'pending_verification',
          created_at:       new Date().toISOString(),
        }]);

      if (dbErr) throw dbErr;

      setStatus(STATUS.SUCCESS);
    } catch (err) {
      console.error('Prescription upload error:', err);
      setErrMsg(err?.message || 'Upload failed. Please try again.');
      setStatus(STATUS.ERROR);
    }
  };

  // ── Reset for new upload ───────────────────────────────────────────────────
  const handleReset = () => {
    setFile(null); setNote(''); setIsUrgent(false);
    setStatus(STATUS.IDLE); setErrMsg('');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background font-sans pb-16 relative overflow-hidden">

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-800 px-5 pt-10 pb-20 shadow-floating rounded-b-[2.5rem]">
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-72 h-72 rounded-full bg-black/10 blur-2xl pointer-events-none" />

        <button
          id="btn-back"
          onClick={() => navigate(-1)}
          className="absolute top-5 left-4 bg-white/20 hover:bg-white/30 backdrop-blur-md p-2.5 rounded-2xl transition-all shadow-sm border border-white/20"
        >
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

          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
            Upload Prescription
          </h1>
          <p className="text-blue-100 mt-2 text-sm font-medium max-w-xs mx-auto leading-relaxed drop-shadow-sm">
            Upload your prescription for faster medicine support.
          </p>
        </motion.div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-xl mx-auto px-4 -mt-10 space-y-6 relative z-10"
      >

        {/* ── SUCCESS STATE ───────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
        {status === STATUS.SUCCESS ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 text-center border-white/60"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 rounded-full scale-150 animate-ping opacity-50" />
                <div className="bg-green-500/10 border border-green-500/20 p-5 rounded-full relative shadow-inner">
                  <CheckCircle2 size={48} className="text-green-600" />
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2 drop-shadow-sm">Prescription Submitted!</h2>
            <p className="text-gray-600 font-medium text-sm leading-relaxed mb-8">
              Your prescription has been sent to nearby pharmacies for verification.
              You'll be notified once it's reviewed.
            </p>

            {isUrgent && (
              <div className="inline-flex items-center gap-2 bg-danger/10 border border-danger/20 text-danger text-[11px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-xl mb-8 shadow-sm">
                <Zap size={14} className="animate-pulseSoft" /> Priority Queue Active
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleReset}
                variant="glass"
                className="flex-1 py-4 text-sm"
              >
                Upload Another
              </Button>
              <Button
                onClick={() => navigate('/home')}
                variant="primary"
                className="flex-1 py-4 text-sm shadow-lg shadow-primary/30"
              >
                Back to Home
              </Button>
            </div>
          </motion.div>
        ) : (

          // ── UPLOAD FORM ───────────────────────────────────────────────
          <motion.form key="form" variants={containerVariants} initial="hidden" animate="visible" onSubmit={handleSubmit} className="space-y-6">

            {/* Urgent badge (shown when checked) */}
            <AnimatePresence>
            {isUrgent && (
              <motion.div 
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="flex items-center gap-2.5 bg-danger/10 border border-danger/20 text-danger text-sm font-bold px-4 py-3 rounded-2xl shadow-sm mb-4"
              >
                <div className="bg-white/80 p-1.5 rounded-lg shadow-inner">
                  <Zap size={16} className="animate-pulse" />
                </div>
                Emergency mode — your request will be prioritized
              </motion.div>
            )}
            </AnimatePresence>

            {/* ── 1. UPLOAD AREA ─────────────────────────────────────── */}
            <motion.div variants={itemVariants} className="glass-card p-5 border-white/60">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center">
                 <FileText size={14} className="mr-1.5 text-primary" /> Prescription File
              </p>
              <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-white/50 p-1 shadow-inner">
                <PrescriptionUploader file={file} onChange={setFile} />
              </div>
            </motion.div>

            {/* ── 2. OPTIONAL NOTE ───────────────────────────────────── */}
            <motion.div variants={itemVariants} className="glass-card p-5 border-white/60">
              <label
                htmlFor="note"
                className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3"
              >
                Additional Notes <span className="normal-case font-medium text-gray-400 ml-1">(optional)</span>
              </label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Need Paracetamol 500mg, Cough syrup · Doctor: Dr. Sharma"
                rows={3}
                maxLength={300}
                className="w-full resize-none rounded-2xl border border-white/50 bg-white/60 backdrop-blur-md px-4 py-3 text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all leading-relaxed shadow-inner"
              />
              <p className="text-right text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">{note.length}/300</p>
            </motion.div>

            {/* ── 3. URGENT CHECKBOX ─────────────────────────────────── */}
            <motion.div variants={itemVariants} className="glass-card p-5 border-white/60">
              <label
                htmlFor="urgent"
                className="flex items-center gap-4 cursor-pointer select-none"
              >
                {/* Custom checkbox */}
                <div className="relative flex-shrink-0">
                  <input
                    id="urgent"
                    type="checkbox"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    onClick={() => setIsUrgent(v => !v)}
                    className={cn(
                      "w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all shadow-sm",
                      isUrgent ? "bg-danger border-danger shadow-danger/20" : "border-gray-300 bg-white/80"
                    )}
                  >
                    {isUrgent && (
                      <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>

                <div>
                  <p className="font-extrabold text-gray-800 text-sm flex items-center gap-2">
                    This is urgent
                    {isUrgent && (
                      <span className="bg-danger/10 border border-danger/20 text-danger text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-widest shadow-sm flex items-center">
                        <Zap size={10} className="mr-1" /> Urgent
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                    Nearby pharmacies will prioritize your request
                  </p>
                </div>
              </label>
            </motion.div>

            {/* ── ERROR MESSAGE ──────────────────────────────────────── */}
            <AnimatePresence>
            {errMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-3 bg-danger/10 border border-danger/20 text-danger text-sm font-bold px-4 py-3.5 rounded-2xl shadow-sm"
              >
                <div className="bg-white/80 p-1 rounded-lg shadow-inner mt-0.5">
                  <AlertTriangle size={14} className="flex-shrink-0" />
                </div>
                {errMsg}
              </motion.div>
            )}
            </AnimatePresence>

            {/* ── SUBMIT BUTTON ──────────────────────────────────────── */}
            <motion.div variants={itemVariants}>
              <Button
                id="btn-submit-prescription"
                type="submit"
                disabled={!file || status === STATUS.UPLOADING}
                className={cn(
                  "w-full py-5 rounded-2xl font-extrabold text-base shadow-lg transition-all duration-300",
                  !file || status === STATUS.UPLOADING
                    ? ""
                    : "shadow-primary/30 hover:shadow-xl hover:shadow-primary/40"
                )}
                size="lg"
                variant={(!file || status === STATUS.UPLOADING) ? "outline" : "primary"}
              >
                {status === STATUS.UPLOADING ? (
                  <>
                    <Loader2 size={20} className="animate-spin mr-2" />
                    Uploading…
                  </>
                ) : (
                  <>
                    <Send size={20} className="mr-2" />
                    Submit Prescription
                  </>
                )}
              </Button>
            </motion.div>

          </motion.form>
        )}
        </AnimatePresence>

        {/* ── SAFETY NOTE ────────────────────────────────────────────── */}
        <motion.div variants={itemVariants} className="flex items-start gap-4 bg-green-500/10 border border-green-500/20 rounded-3xl p-5 shadow-sm">
          <div className="bg-white/80 p-2.5 rounded-xl shadow-inner flex-shrink-0 border border-white/60">
            <ShieldCheck size={20} className="text-green-600" />
          </div>
          <p className="text-xs text-green-800 font-medium leading-relaxed">
            <span className="font-extrabold block mb-1 text-[11px] uppercase tracking-widest text-green-700">Licensed Pharmacy Verification</span>
            Prescription medicines will be verified by a licensed pharmacy before delivery.
          </p>
        </motion.div>

      </motion.div>
    </div>
  );
};

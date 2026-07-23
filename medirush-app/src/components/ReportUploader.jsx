import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, X, FileText, ImageIcon, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const ACCEPTED_EXTS  = '.jpg,.jpeg,.png,.pdf';
const MAX_SIZE_MB    = 10;

const fmtSize = (bytes) => {
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return Math.round(bytes / 1024) + ' KB';
};

export const ReportUploader = ({ file, onChange }) => {
  const [dragging, setDragging] = useState(false);
  const [error,    setError]    = useState('');
  const inputRef = useRef(null);

  const commit = useCallback((f) => {
    setError('');
    if (!f) return;
    if (!ACCEPTED_TYPES.includes(f.type)) {
      setError('Only JPG, PNG, or PDF files are supported.');
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${MAX_SIZE_MB} MB.`);
      return;
    }
    onChange(f);
  }, [onChange]);

  const onDragOver  = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = ()  => setDragging(false);
  const onDrop      = (e) => {
    e.preventDefault();
    setDragging(false);
    commit(e.dataTransfer.files?.[0] ?? null);
  };

  if (file) {
    const isImage   = file.type.startsWith('image/');
    const previewUrl = isImage ? URL.createObjectURL(file) : null;

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full rounded-2xl border border-white/50 bg-white/40 backdrop-blur-md overflow-hidden shadow-glass relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
        {isImage && (
          <div className="w-full h-48 overflow-hidden bg-white/20 flex items-center justify-center relative z-10 shadow-inner">
            <img src={previewUrl} alt="Report preview" className="w-full h-full object-contain" />
          </div>
        )}
        {!isImage && (
          <div className="w-full h-36 flex flex-col items-center justify-center bg-white/20 relative z-10 shadow-inner">
            <div className="bg-white/80 p-4 rounded-2xl shadow-sm mb-2 border border-white/60">
              <FileText size={36} className="text-primary" />
            </div>
            <span className="text-sm font-bold text-primary">PDF Document</span>
          </div>
        )}
        <div className="flex items-center justify-between px-4 py-3 bg-white/60 backdrop-blur-md border-t border-white/50 relative z-10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-primary/10 p-2 rounded-xl flex-shrink-0 border border-primary/20 shadow-inner">
              {isImage ? <ImageIcon size={16} className="text-primary" /> : <FileText size={16} className="text-primary" />}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-800 truncate">{file.name}</p>
              <p className="text-xs text-primary/70 font-bold uppercase tracking-widest">{fmtSize(file.size)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-3">
            <button type="button" onClick={() => inputRef.current?.click()} className="flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 px-3 py-1.5 rounded-xl transition-all shadow-sm">
              <RefreshCw size={13} /> Change
            </button>
            <button type="button" onClick={() => { setError(''); onChange(null); }} className="flex items-center gap-1 text-[11px] font-bold text-danger bg-danger/10 hover:bg-danger/20 border border-danger/20 px-3 py-1.5 rounded-xl transition-all shadow-sm">
              <X size={13} /> Remove
            </button>
          </div>
        </div>
        <input ref={inputRef} type="file" accept={ACCEPTED_EXTS} className="hidden" onChange={(e) => commit(e.target.files?.[0] ?? null)} />
      </motion.div>
    );
  }

  return (
    <div>
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "w-full rounded-2xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center py-12 px-6 transition-all duration-300 relative overflow-hidden",
          dragging ? "border-primary bg-primary/5 scale-[1.02] shadow-inner" : error ? "border-danger/50 bg-danger/5" : "border-white/60 bg-white/40 backdrop-blur-sm hover:border-primary/50 hover:bg-white/60 shadow-glass"
        )}
      >
        <div className={cn(
          "p-5 rounded-2xl mb-4 shadow-sm transition-colors border relative z-10",
          dragging ? "bg-primary/20 border-primary/30" : "bg-white/80 border-white"
        )}>
          <UploadCloud size={36} className={cn(dragging ? "text-primary" : error ? "text-danger" : "text-primary/70")} />
        </div>
        <p className="font-extrabold text-gray-800 text-base mb-1.5 relative z-10">{dragging ? 'Drop your report here' : 'Tap to upload or drag & drop'}</p>
        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest relative z-10">JPG · PNG · PDF &nbsp;·&nbsp; Max {MAX_SIZE_MB} MB</p>
        <input ref={inputRef} type="file" accept={ACCEPTED_EXTS} className="hidden" onChange={(e) => commit(e.target.files?.[0] ?? null)} />
      </div>
      {error && (
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-3 flex items-center gap-2 text-[11px] font-bold text-danger uppercase tracking-widest bg-danger/10 px-3 py-2 rounded-xl border border-danger/20 w-fit">
          <AlertCircle size={14} /> {error}
        </motion.div>
      )}
    </div>
  );
};

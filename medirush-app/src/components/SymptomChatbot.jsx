import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Bot, Send, AlertCircle, Brain, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { MedicalConversationEngine } from '../data/medicalAIEngine';

const WELCOME = {
  en: {
    id: 'welcome', type: 'bot',
    text: "👋 Hello! I'm MediRush AI — your advanced medical assistant.\n\nYou can talk to me naturally. Tell me how you're feeling, describe your symptoms, or just say 'Hi' to start!"
  },
  hi: {
    id: 'welcome', type: 'bot',
    text: "👋 Namaste! Main MediRush AI hun — aapka advanced medical assistant.\n\nAap mujhse bilkul seedha baat kar sakte hain. Apni takleef bataaiye, ya bas 'Namaste' bol ke shuru karein!"
  }
};

export const SymptomChatbot = ({ onComplete }) => {
  const [lang, setLang] = useState(null); // null = not selected yet
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const engineRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize engine when language is selected
  const selectLang = (l) => {
    setLang(l);
    engineRef.current = new MedicalConversationEngine(l);
    setMessages([{ ...WELCOME[l] }]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (lang && !isTyping && !isDone) inputRef.current?.focus();
  }, [lang, isTyping, isDone]);

  const addBotMessage = (text, delay = 900) =>
    new Promise(resolve => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { id: `bot-${Date.now()}`, type: 'bot', text }]);
        setTimeout(resolve, 80);
      }, delay);
    });

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isTyping || isDone || !lang) return;
    setInputValue('');
    setMessages(prev => [...prev, { id: `user-${Date.now()}`, type: 'user', text }]);

    const engine = engineRef.current;
    const result = engine.process(text);
    const delay = text.length > 50 ? 1100 : 850;

    if (result.isEmergency) {
      await addBotMessage(result.message, 400);
      setIsDone(true);
      setTimeout(() => onComplete({ rawText: result.summary, isEmergency: true, lang }), 1200);
      return;
    }

    await addBotMessage(result.message, delay);

    if (result.isDone) {
      setIsDone(true);
      setTimeout(() => onComplete({ rawText: result.summary, lang }), 900);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const fmt = (text) => text.split('\n').map((l, i, a) => (
    <span key={i}>{l}{i < a.length - 1 && <br />}</span>
  ));

  // ── Language selector screen ─────────────────────────────────────────────
  if (!lang) {
    return (
      <div className="flex flex-col h-full glass-card overflow-hidden shadow-floating border-white/60">
        <div className="bg-white/40 backdrop-blur-md px-4 py-3 flex items-center gap-3 border-b border-white/50 shadow-sm">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 relative">
            <Bot className="text-primary" size={22} />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-gray-900 text-base">MediRush AI</h3>
            <p className="text-[10px] text-primary/80 font-bold uppercase tracking-widest">Advanced Medical AI</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <Globe size={32} className="text-primary" />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-2">Choose Your Language</h2>
            <p className="text-sm text-gray-500 font-medium">Apni bhasha chunein / Select your preferred language</p>
          </div>

          <div className="w-full max-w-xs space-y-3">
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => selectLang('en')}
              className="w-full py-4 px-6 bg-primary text-white rounded-2xl font-extrabold text-lg shadow-lg shadow-primary/30 flex items-center justify-between"
            >
              <span>🇬🇧 English</span>
              <span className="text-sm font-medium opacity-80">Continue in English →</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => selectLang('hi')}
              className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-extrabold text-lg shadow-lg shadow-orange-400/30 flex items-center justify-between"
            >
              <span>🇮🇳 हिंदी</span>
              <span className="text-sm font-medium opacity-80">हिंदी में जारी रखें →</span>
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // ── Chat Interface ───────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full glass-card overflow-hidden shadow-floating border-white/60">

      {/* Header */}
      <div className="bg-white/40 backdrop-blur-md px-4 py-3 flex items-center gap-3 border-b border-white/50 shadow-sm">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 relative flex-shrink-0">
          <Bot className="text-primary" size={22} />
          <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full animate-pulse" />
        </div>
        <div className="flex-1">
          <h3 className="font-extrabold text-gray-900 text-base leading-tight">MediRush AI</h3>
          <p className="text-[10px] text-primary/80 font-bold uppercase tracking-widest">
            {lang === 'hi' ? 'उन्नत चिकित्सा AI • ऑनलाइन' : 'Advanced Medical AI • Online'}
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 flex-shrink-0">
          <Brain size={11} className="text-primary" />
          <span className="text-[9px] font-bold text-primary uppercase tracking-wider">AI</span>
        </div>
        <button onClick={() => { setLang(null); setMessages([]); setIsDone(false); }}
          className="text-[9px] text-gray-400 hover:text-primary font-bold uppercase tracking-wider ml-1">
          {lang === 'hi' ? 'भाषा' : 'Lang'}
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-gray-100">
        <motion.div className="h-full bg-gradient-to-r from-primary/60 to-primary"
          animate={{ width: isDone ? '100%' : `${Math.min(15 + messages.length * 8, 88)}%` }}
          transition={{ duration: 0.5 }} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-white/20 backdrop-blur-sm scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className={cn('flex items-end gap-2', msg.type === 'user' ? 'justify-end' : 'justify-start')}
            >
              {msg.type === 'bot' && (
                <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mb-0.5 border border-primary/20">
                  <Bot className="text-primary" size={14} />
                </div>
              )}
              <div className={cn(
                'max-w-[78%] px-4 py-2.5 text-sm font-medium leading-relaxed shadow-sm',
                msg.type === 'user'
                  ? 'bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl rounded-br-sm'
                  : 'bg-white/90 text-gray-800 border border-white/70 rounded-2xl rounded-bl-sm shadow-glass'
              )}>
                {fmt(msg.text)}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div key="typing"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-end gap-2 justify-start"
            >
              <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
                <Bot className="text-primary" size={14} />
              </div>
              <div className="bg-white/90 border border-white/70 rounded-2xl rounded-bl-sm px-4 py-3 shadow-glass flex items-center gap-1.5">
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <AnimatePresence>
        {!isDone && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            className="px-4 pt-3 pb-4 bg-white/60 backdrop-blur-md border-t border-white/50"
          >
            <div className="flex items-center gap-1.5 rounded-xl bg-blue-50/70 border border-blue-200/60 px-3 py-1.5 mb-3">
              <AlertCircle size={11} className="text-blue-500 flex-shrink-0" />
              <p className="text-[9px] text-blue-700 font-semibold">
                {lang === 'hi'
                  ? "Emergency mein 112 call karein. Yeh AI doctor ki jagah nahi hai."
                  : "For emergencies, call 112. This AI is not a substitute for professional medical care."}
              </p>
            </div>
            <div className="flex items-end gap-2">
              <textarea ref={inputRef}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping}
                placeholder={lang === 'hi' ? (isTyping ? 'AI soch raha hai...' : 'Kuch bhi likhein...') : (isTyping ? 'AI is thinking...' : 'Type anything...')}
                rows={1}
                className="flex-1 bg-white/80 border border-gray-200 text-gray-800 rounded-2xl px-4 py-2.5 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent resize-none max-h-28 scrollbar-hide disabled:opacity-50"
              />
              <motion.button onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                whileHover={!isTyping && inputValue.trim() ? { scale: 1.1 } : {}}
                whileTap={!isTyping && inputValue.trim() ? { scale: 0.9 } : {}}
                className={cn('p-3 rounded-2xl transition-all flex-shrink-0 shadow-md',
                  !isTyping && inputValue.trim() ? 'bg-primary text-white shadow-primary/30' : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'
                )}>
                <Send size={17} />
              </motion.button>
            </div>
            <p className="text-center text-[9px] text-gray-400 mt-1.5 font-medium">
              {lang === 'hi'
                ? "Enter = bhejein · Jab ho jaye, 'bas' bolein"
                : "Enter to send · Say 'that's all' when done"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {isDone && (
        <div className="px-4 py-3 bg-primary/5 border-t border-primary/10 text-center">
          <p className="text-xs font-bold text-primary flex items-center justify-center gap-2">
            <Brain size={13} />
            {lang === 'hi' ? 'AI analysis chal rahi hai...' : 'AI analysis running...'}
          </p>
        </div>
      )}
    </div>
  );
};

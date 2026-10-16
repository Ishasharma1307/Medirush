import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { 
  Search, Clock, Truck, ShieldPlus, FileText, HeartPulse, Activity, 
  ChevronRight, Zap, Pill, Stethoscope, MapPin, Map, Navigation, 
  PhoneCall, ShieldCheck, Menu, X, ArrowRight, AlertTriangle,
  Building2, Bike, Radio, CheckCircle2, ChevronDown, HelpCircle, 
  Sparkles, Check, Layers, Network, RefreshCw, ThermometerSnowflake, 
  QrCode, Users, ShieldAlert, Award, ArrowUpRight
} from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

// Floating Navbar Component
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleLaunchApp = (path = '/home') => {
    if (!user && loginAsDemo) {
      loginAsDemo();
    }
    navigate(path);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'The Problem', href: '#problem' },
    { name: '10-Min Pipeline', href: '#pipeline' },
    { name: '3-Way Ecosystem', href: '#ecosystem' },
    { name: 'Core Tools', href: '#tools' },
    { name: 'Safety & CDSCO', href: '#safety' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-0 w-full z-[100] transition-all duration-500 ease-in-out",
          scrolled ? "py-2.5 sm:py-3" : "py-4 sm:py-6"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={cn(
            "flex items-center justify-between transition-all duration-500 rounded-3xl",
            scrolled ? "bg-white/85 backdrop-blur-xl shadow-glass border border-white/50 px-5 py-2.5" : "bg-transparent px-2"
          )}>
            
            {/* Logo */}
            <Link to="/" className="flex items-center group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300 mr-2.5">
                <Activity className="text-white h-5 w-5" />
              </div>
              <span className={cn(
                "text-2xl font-extrabold tracking-tight transition-colors duration-300",
                scrolled ? "text-gray-900" : "text-white drop-shadow-md"
              )}>
                MediRush
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden xl:flex items-center space-x-6">
              {navLinks.map((item) => (
                <a 
                  key={item.name} 
                  href={item.href} 
                  className={cn(
                    "font-bold text-xs uppercase tracking-wider transition-colors duration-300 hover:text-primary",
                    scrolled ? "text-gray-600" : "text-white/90 drop-shadow-sm hover:text-white"
                  )}
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Standalone Partner Portals & Auth */}
            <div className="hidden md:flex items-center space-x-2.5">
              <Link
                to="/pharmacy-partner"
                className={cn(
                  "font-bold text-xs px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 border shadow-xs",
                  scrolled
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                    : "bg-white/15 text-white border-white/25 hover:bg-white/25"
                )}
                title="Open Pharmacy Terminal"
              >
                <Building2 size={13} className="text-emerald-300" />
                <span>Pharmacy Terminal</span>
              </Link>

              <Link
                to="/delivery-partner"
                className={cn(
                  "font-bold text-xs px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 border shadow-xs",
                  scrolled
                    ? "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                    : "bg-amber-400/20 text-amber-300 border-amber-400/30 hover:bg-amber-400/30"
                )}
                title="Open Delivery Fleet Console"
              >
                <Bike size={13} className="text-amber-400" />
                <span>Rider Fleet</span>
              </Link>

              <button
                type="button"
                onClick={() => handleLaunchApp('/home')}
                className="px-3.5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105 ml-2"
                title="Instant 1-Click App Demo"
              >
                <Zap size={13} className="text-amber-300" />
                <span>Explore App</span>
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="xl:hidden p-2 text-gray-500 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Toggle navigation menu"
            >
              <Menu size={24} className={scrolled ? "text-gray-900" : "text-white"} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[200] bg-white/95 backdrop-blur-2xl p-6 flex flex-col overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mr-3 shadow-md">
                  <Activity className="text-white h-5 w-5" />
                </div>
                <span className="text-2xl font-extrabold tracking-tight text-gray-900">MediRush</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex flex-col space-y-4 text-base font-extrabold text-gray-800">
              {navLinks.map((item) => (
                <a 
                  key={item.name} 
                  href={item.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 hover:text-primary transition-colors"
                >
                  {item.name}
                </a>
              ))}

              <div className="pt-4 border-t border-gray-150 flex flex-col gap-2.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Partner Portals</span>
                <Link 
                  to="/pharmacy-partner" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-bold text-emerald-800 bg-emerald-50 p-3.5 rounded-2xl flex items-center gap-2.5 border border-emerald-200"
                >
                  <Building2 size={18} className="text-emerald-600" />
                  <span>Pharmacy Merchant Terminal ↗</span>
                </Link>
                <Link 
                  to="/delivery-partner" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-bold text-amber-800 bg-amber-50 p-3.5 rounded-2xl flex items-center gap-2.5 border border-amber-200"
                >
                  <Bike size={18} className="text-amber-600" />
                  <span>Delivery Fleet Rider App ↗</span>
                </Link>
              </div>
            </div>
            
            <div className="mt-auto pt-6 space-y-3">
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLaunchApp('/home');
                }}
                className="w-full py-4 text-sm font-black rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg flex items-center justify-center gap-2"
              >
                <Zap size={16} className="text-amber-300" />
                <span>Explore Demo Web App</span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/prescription-upload" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full py-3.5 text-xs rounded-2xl">Upload Rx</Button>
                </Link>
                <Link to="/emergency-request" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="danger" className="w-full py-3.5 text-xs rounded-2xl">Emergency SOS</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Hero Mockup Component (Interactive)
const HeroMockup = () => {
  const navigate = useNavigate();
  const { user, loginAsDemo } = useAuth();

  const handleLaunch = (path) => {
    if (!user && loginAsDemo) loginAsDemo();
    navigate(path);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto md:max-w-none h-[500px] md:h-[600px] flex items-center justify-center perspective-[2000px]">
      
      {/* Central Phone/Dashboard Container */}
      <motion.div 
        initial={{ opacity: 0, rotateY: 20, rotateX: 10, scale: 0.9 }}
        animate={{ opacity: 1, rotateY: -4, rotateX: 4, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-[320px] h-[600px] bg-white rounded-[3rem] p-3 shadow-2xl relative z-20 border-[6px] border-white/50 backdrop-blur-xl"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden relative flex flex-col">
          {/* Mockup Header */}
          <div className="pt-10 pb-4 px-6 bg-gradient-to-br from-primary to-blue-800">
             <div className="flex justify-between items-center text-white mb-6">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest font-bold opacity-80">Location</span>
                  <span className="text-sm font-extrabold flex items-center"><MapPin size={12} className="mr-1"/> Indiranagar, Bengaluru</span>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                   <Activity size={18} />
                </div>
             </div>
             
             {/* Interactive Search Bar in Mockup */}
             <div 
               onClick={() => handleLaunch('/medicines')}
               className="relative cursor-pointer group"
             >
                <div className="w-full bg-white/20 group-hover:bg-white/30 backdrop-blur-md rounded-xl py-3 pl-10 pr-3 text-xs border border-white/30 text-white font-medium flex items-center justify-between transition-all">
                  <span>Search medicines...</span>
                  <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded font-bold">10m Delivery</span>
                </div>
                <Search size={14} className="absolute left-4 top-3.5 text-white/80" />
             </div>
          </div>
          
          {/* Mockup Body */}
          <div className="p-4 space-y-4 flex-1 bg-gradient-to-b from-gray-50 to-white">
             {/* Urgent Alert */}
             <div 
               onClick={() => handleLaunch('/emergency-request')}
               className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center gap-3 shadow-sm cursor-pointer hover:bg-red-100/70 transition-all"
             >
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 text-danger animate-pulseSoft">
                   <Zap size={18} />
                </div>
                <div>
                   <h4 className="text-sm font-extrabold text-red-900">Emergency Support</h4>
                   <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mt-0.5">Response in &lt; 5 mins</p>
                </div>
             </div>

             {/* Order Card */}
             <div 
               onClick={() => handleLaunch('/orders')}
               className="bg-white p-4 rounded-2xl border border-gray-100 shadow-soft cursor-pointer hover:border-blue-200 transition-all"
             >
                <div className="flex justify-between items-center mb-3">
                   <h4 className="text-sm font-extrabold text-gray-900">Live Order Track</h4>
                   <span className="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded font-bold uppercase">On the way</span>
                </div>
                <div className="flex gap-3 items-center">
                   <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-primary">
                      <Truck size={20} />
                   </div>
                   <div className="flex-1">
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: "0%" }} 
                           animate={{ width: "70%" }} 
                           transition={{ duration: 2, delay: 1 }}
                           className="h-full bg-primary"
                         />
                      </div>
                      <p className="text-[10px] text-gray-500 font-bold mt-1.5 uppercase">Arriving in 10 mins</p>
                   </div>
                </div>
             </div>

             {/* Categories */}
             <div className="grid grid-cols-2 gap-3">
                <div 
                  onClick={() => handleLaunch('/medicines')}
                  className="bg-white p-4 rounded-2xl border border-gray-100 shadow-soft text-center flex flex-col items-center cursor-pointer hover:border-purple-300 hover:shadow-md transition-all"
                >
                   <Pill size={24} className="text-purple-500 mb-2" />
                   <span className="text-xs font-bold text-gray-800">Medicines</span>
                </div>
                <div 
                  onClick={() => handleLaunch('/symptom-checker')}
                  className="bg-white p-4 rounded-2xl border border-gray-100 shadow-soft text-center flex flex-col items-center cursor-pointer hover:border-teal-300 hover:shadow-md transition-all"
                >
                   <Stethoscope size={24} className="text-teal-500 mb-2" />
                   <span className="text-xs font-bold text-gray-800">Symptoms</span>
                </div>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Widget 1: Prescription */}
      <motion.div 
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        onClick={() => handleLaunch('/prescription-upload')}
        className="absolute top-[15%] right-[-5%] md:right-[5%] z-30 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-floating border border-white/60 flex items-center gap-4 cursor-pointer hover:scale-105 transition-transform"
      >
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
          <FileText size={24} />
        </div>
        <div>
          <p className="text-sm font-extrabold text-gray-900">Rx Verified (AI)</p>
          <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-0.5">Click to Upload Rx</p>
        </div>
      </motion.div>

      {/* Floating Widget 2: Heart Rate */}
      <motion.div 
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        onClick={() => handleLaunch('/symptom-checker')}
        className="absolute bottom-[20%] left-[-10%] md:left-[0%] z-30 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-floating border border-white/60 flex items-center gap-4 cursor-pointer hover:scale-105 transition-transform"
      >
        <div className="w-12 h-12 bg-red-50 text-danger rounded-xl flex items-center justify-center">
          <HeartPulse size={24} />
        </div>
        <div>
          <p className="text-sm font-extrabold text-gray-900">Symptom Check</p>
          <p className="text-[10px] font-bold text-danger uppercase tracking-widest mt-0.5">AI Analysis Ready</p>
        </div>
      </motion.div>
    </div>
  );
};

// Counter Component
const AnimatedCounter = ({ value, label, suffix = "" }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center"
    >
      <div className="text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-md">
        {value}{suffix}
      </div>
      <div className="text-blue-200 text-xs font-bold uppercase tracking-widest text-center">{label}</div>
    </motion.div>
  );
};

// Interactive FAQ Item
const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-xs transition-all">
      <button
        onClick={onClick}
        className="w-full p-6 text-left flex justify-between items-center gap-4 hover:bg-gray-50/80 transition-colors"
      >
        <span className="font-extrabold text-gray-900 text-base md:text-lg flex items-center gap-3">
          <HelpCircle size={20} className="text-primary flex-shrink-0" />
          {question}
        </span>
        <ChevronDown 
          size={20} 
          className={cn("text-gray-400 transition-transform duration-300 flex-shrink-0", isOpen && "rotate-180 text-primary")}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 text-sm text-gray-600 leading-relaxed font-medium border-t border-gray-100 bg-gray-50/40">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main Landing Page
export const Landing = () => {
  const navigate = useNavigate();
  const { user, loginAsDemo } = useAuth();
  const [openFAQIndex, setOpenFAQIndex] = useState(0);

  const handleLaunchApp = (path = '/home') => {
    if (!user && loginAsDemo) {
      loginAsDemo();
    }
    navigate(path);
  };

  const faqData = [
    {
      q: "How does MediRush deliver medicines within 10 to 15 minutes?",
      a: "Traditional e-pharmacy platforms ship orders from massive, distant warehouses taking 24 to 48 hours. MediRush works completely differently: we utilize a real-time hyperlocal mesh network. When you place an order or upload a prescription, our system broadcasts the request simultaneously to all verified neighbourhood chemist shops within a 5 km radius. The nearest store confirms stock in seconds, and an on-demand rapid rider is dispatched immediately — resulting in average delivery times of 10 to 14 minutes."
    },
    {
      q: "What happens if one pharmacy doesn't have all medicines in my prescription?",
      a: "This is MediRush's biggest breakthrough! When a doctor prescribes 4 medicines, it is very common that Store A only has 2 of them. Rather than cancelling your order or forcing you to visit multiple stores, our Intelligent Split-Fulfillment Engine locks Medicine 1 & 2 at Pharmacy A, and Medicine 3 & 4 at Pharmacy B. A SINGLE rider is assigned to pick up from Store A, then Store B, and combine them into one package for you. You never pay double delivery fees, and everything arrives together."
    },
    {
      q: "Can the AI really read messy, handwritten doctor prescriptions?",
      a: "Yes. MediRush is equipped with advanced multimodal AI trained specifically on Indian medical handwriting and doctor abbreviations (OD, BD, SOS, TDS, QID). It automatically extracts the doctor's name, patient name, date, exact medication salts, and dosages. If an expensive branded medicine is detected, the system automatically suggests CDSCO-approved generic alternatives with the identical chemical formulation, saving patients up to 70%."
    },
    {
      q: "How does the Emergency SOS Protocol work at 2 AM?",
      a: "During night-time medical crises, every second counts. The MediRush Emergency Protocol allows you to instantly trigger a priority response: locate open 24/7 hospital emergency rooms and ICU beds within your current GPS radius, access certified ambulance helplines (108/112), find 24-hour open night pharmacies, and request emergency oxygen or critical medications with priority routing."
    },
    {
      q: "How can retail pharmacies and local chemists join the Merchant Network?",
      a: "Pharmacy owners can register in under 3 minutes via our standalone Merchant Portal (/pharmacy-partner). You upload your Drug License (Form 20/21) and GST certificate. Once approved, you receive an audio-enabled real-time terminal that rings when patients in your neighborhood need medicine. You can accept full or partial prescriptions with a single click, pack them, and hand them off to MediRush riders."
    },
    {
      q: "Are the medicines genuine and compliant with Indian drug laws?",
      a: "100% yes. MediRush partners only with licensed retail pharmacies verified under CDSCO and State Drug Control department standards. Prescription drugs (Schedule H and H1) strictly require a valid doctor's prescription before dispatch. All sensitive medicines such as insulins and biologicals are transported in insulated cold-chain bags."
    }
  ];

  return (
    <div className="bg-background font-sans overflow-x-hidden selection:bg-primary-light selection:text-white">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section id="home" className="relative min-h-[100vh] flex items-center pt-32 pb-20 bg-gradient-to-br from-primary via-primary-dark to-indigo-900 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-primary-light/30 rounded-full blur-[100px] opacity-50 animate-pulseSoft"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[100px] opacity-40 animate-pulseSoft" style={{animationDelay: '2s'}}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold px-4 py-2 rounded-full mb-8 uppercase tracking-widest shadow-glass">
                <Zap size={14} className="mr-2 text-yellow-400" /> Introducing MediRush 2.0 • 10-Min Emergency Network
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 drop-shadow-lg tracking-tight">
                Emergency medicine delivery in <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-400">10 minutes.</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed drop-shadow-sm">
                AI doctor prescription digitizer, multi-pharmacy split radar, single-rider routing, and 24/7 verified emergency hospitals. Healthcare support when every minute matters.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 flex-wrap">
                <Button 
                  onClick={() => handleLaunchApp('/home')}
                  size="lg" 
                  className="w-full sm:w-auto py-4 px-8 text-lg bg-white text-primary hover:bg-gray-50 border-none shadow-xl shadow-white/10 rounded-2xl font-extrabold group cursor-pointer"
                >
                  Explore Web App <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20}/>
                </Button>
                
                <Link to="/prescription-upload" className="w-full sm:w-auto">
                  <Button 
                    variant="glass" 
                    size="lg" 
                    className="w-full sm:w-auto py-4 px-8 text-lg text-white border-white/30 hover:bg-white/10 rounded-2xl font-extrabold flex items-center justify-center cursor-pointer"
                  >
                    <FileText className="mr-2" size={20}/> Upload Rx
                  </Button>
                </Link>

                <Link to="/emergency-request" className="w-full sm:w-auto">
                  <Button variant="danger" size="lg" className="w-full sm:w-auto py-4 px-8 text-lg rounded-2xl shadow-xl shadow-danger/30 font-extrabold flex items-center justify-center animate-pulseSoft border border-danger-light cursor-pointer">
                    <PhoneCall className="mr-2" size={20}/> Emergency Help
                  </Button>
                </Link>
              </div>

              {/* Quick Partner Switcher Banner in Hero */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs text-blue-200">
                <span className="font-bold uppercase tracking-wider text-white/70">Partner Portals:</span>
                <Link to="/pharmacy-partner" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all">
                  <Building2 size={13} className="text-emerald-400" /> Pharmacy Terminal
                </Link>
                <Link to="/delivery-partner" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all">
                  <Bike size={13} className="text-amber-400" /> Delivery Fleet
                </Link>
              </div>
            </motion.div>

            {/* Right Content (Mockup) */}
            <div className="relative">
              <HeroMockup />
            </div>
            
          </div>
        </div>
        
        {/* Custom Curve Separator */}
        <div className="absolute bottom-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-full h-[100px] md:h-[150px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,119.93,193.36,104.7,243.68,92.51,289.47,73.5,321.39,56.44Z" className="fill-background"></path>
          </svg>
        </div>
      </section>

      {/* 2. TRUST SECTION (Metrics) */}
      <section className="py-16 bg-background relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card bg-primary text-white rounded-[2.5rem] p-10 md:p-14 shadow-floating border border-primary-light/30 relative overflow-hidden -mt-32 backdrop-blur-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
              <AnimatedCounter value="10" suffix=" Mins" label="Average Delivery Goal" />
              <AnimatedCounter value="500" suffix="+" label="Verified Local Chemists" />
              <AnimatedCounter value="99.4" suffix="%" label="AI Rx Read Accuracy" />
              <AnimatedCounter value="24" suffix="/7" label="Emergency Support Ready" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE PROBLEM IN INDIA VS THE MEDIRUSH BREAKTHROUGH */}
      <section id="problem" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-danger font-bold text-xs uppercase tracking-wider mb-3 border border-red-200">
              <AlertTriangle size={14} /> The Problem in Emergency Healthcare
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Why Existing Healthcare Delivery Fails in Crises
            </h2>
            <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed">
              When a family member suffers an acute asthma attack, sudden high fever, or severe infection at midnight, the current system leaves people stranded.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* The Old Way */}
            <div className="bg-red-50/50 rounded-3xl p-8 border border-red-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-red-100 text-danger flex items-center justify-center font-bold text-xl">
                    ✕
                  </div>
                  <div>
                    <span className="text-xs font-bold text-danger uppercase tracking-wider">Traditional Experience</span>
                    <h3 className="text-2xl font-extrabold text-gray-900">Current Broken Reality</h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-2xl border border-red-100 shadow-xs">
                    <h4 className="font-extrabold text-gray-900 text-sm mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span> 24 to 48 Hour E-Pharmacy Delays
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed font-medium">
                      Major pharmacy apps ship from central mega-warehouses. Waiting 2 days for urgent antibiotics or painkillers is completely useless in an emergency.
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-red-100 shadow-xs">
                    <h4 className="font-extrabold text-gray-900 text-sm mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span> The "Out of Stock" Running Around
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed font-medium">
                      A doctor writes 4 medicines. Store A has 2, Store B has none. Families are forced to panic and physically run from shop to shop at night.
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-red-100 shadow-xs">
                    <h4 className="font-extrabold text-gray-900 text-sm mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span> Illegible Doctor Handwriting
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed font-medium">
                      Confusing medical shorthand causes wrong dosage selection, dangerous drug interactions, and hours wasted waiting for chemist callbacks.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-red-100 text-xs font-bold text-red-700 flex items-center gap-2">
                <span>Result: Dangerous treatment delays and massive family anxiety.</span>
              </div>
            </div>

            {/* The MediRush Breakthrough */}
            <div className="bg-gradient-to-br from-emerald-50/70 via-blue-50/50 to-white rounded-3xl p-8 border border-emerald-200 shadow-lg flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-200/20 rounded-full blur-3xl"></div>

              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-emerald-500/20">
                    ✓
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">The MediRush Architecture</span>
                    <h3 className="text-2xl font-extrabold text-gray-900">How We Solved It</h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-xs">
                    <h4 className="font-extrabold text-gray-900 text-sm mb-1 flex items-center gap-2 text-emerald-700">
                      <Zap size={16} className="text-amber-500" /> 10-Minute Hyperlocal Radar Dispatch
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed font-medium">
                      We simultaneously broadcast your prescription to 15+ verified neighbourhood pharmacies within 5 km. The closest one confirms and packs within 60 seconds.
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-xs">
                    <h4 className="font-extrabold text-gray-900 text-sm mb-1 flex items-center gap-2 text-emerald-700">
                      <Network size={16} className="text-primary" /> Intelligent Split-Fulfillment Engine
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed font-medium">
                      If Store A only has 2 medicines and Store B has the rest, our system pairs them seamlessly. A SINGLE rider picks up from both stores and delivers in one consolidated package!
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-xs">
                    <h4 className="font-extrabold text-gray-900 text-sm mb-1 flex items-center gap-2 text-emerald-700">
                      <Sparkles size={16} className="text-purple-600" /> Multimodal AI Doctor Prescription OCR
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed font-medium">
                      Upload any messy prescription. Our AI extracts drug salts, dosages, and automatically suggests identical CDSCO-approved generic alternatives to save up to 70%.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-emerald-100 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800">10-15 Min Delivery • No Double Charges</span>
                <Button 
                  onClick={() => handleLaunchApp('/prescription-upload')}
                  size="sm" 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                >
                  Test Prescription Scanner &rarr;
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. THE 10-MINUTE PIPELINE EXPLAINED */}
      <section id="pipeline" className="py-24 bg-gray-50 border-y border-gray-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-primary font-bold text-xs uppercase tracking-wider mb-3 border border-blue-200">
              <Layers size={14} /> Technology Architecture
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              The 10-Minute Pipeline: Exactly How It Works
            </h2>
            <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed">
              From the instant you snap a prescription photo to the medicine arriving in your hand, here is the automated 4-stage engine executing in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            
            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft relative flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg mb-4">
                  01
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-2">AI Prescription Digitization</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-medium mb-4">
                  Patient uploads a photo or selects medicines. The Gemini AI vision model deciphers handwriting, validates doctor signatures, extracts salt names, and checks contraindications.
                </p>
              </div>
              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-[11px] font-bold text-indigo-700">
                ⏱ Execution: &lt; 3 Seconds
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft relative flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center font-black text-lg mb-4">
                  02
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-2">Hyperlocal Radar Broadcast</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-medium mb-4">
                  Order is pushed via high-speed WebSockets to all registered partner pharmacies within a 5 km radius. Chemist terminals ring audibly to alert staff instantly.
                </p>
              </div>
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-[11px] font-bold text-primary">
                📡 Broadcast: 15+ Pharmacies
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft relative flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-lg mb-4">
                  03
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-2">Split-Order Inventory Match</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-medium mb-4">
                  Pharmacies confirm which items they have. If Store A accepts item 1 & 2, and Store B accepts item 3, our algorithm locks both orders simultaneously with zero delay.
                </p>
              </div>
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-[11px] font-bold text-emerald-700">
                🧩 Smart Stock Merger
              </div>
            </motion.div>

            {/* Step 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft relative flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-lg mb-4">
                  04
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-2">Single Rider Rapid Pickup</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-medium mb-4">
                  A single fleet rider receives an optimized multi-pickup route (Store A &rarr; Store B &rarr; Patient). Customer tracks the rider in real time with live GPS and OTP handoff.
                </p>
              </div>
              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-[11px] font-bold text-amber-800">
                🛵 Delivery: 10-14 Minutes Total
              </div>
            </motion.div>

          </div>

          {/* Architecture Banner */}
          <div className="mt-12 bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                <Radio size={24} className="animate-pulse" />
              </div>
              <div>
                <h4 className="font-extrabold text-gray-900 text-sm">Need to test this pipeline right now?</h4>
                <p className="text-xs text-gray-500 font-medium">Upload any sample prescription slip or choose from 3 instant pre-loaded medical presets.</p>
              </div>
            </div>
            <Link to="/prescription-upload">
              <Button size="md" className="bg-primary hover:bg-primary-dark text-white font-bold rounded-xl whitespace-nowrap">
                Try Live Prescription Scanner &rarr;
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* 5. THE COMPLETE TRIPARTITE ECOSYSTEM */}
      <section id="ecosystem" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-3 border border-emerald-200">
              <Users size={14} /> Tripartite Platform
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Three Dedicated Apps. One Unified Network.
            </h2>
            <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed">
              Just like modern super-apps operate separate interfaces for customers, merchants, and riders, MediRush connects three high-velocity portals.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* 1. Patient App */}
            <div className="bg-gradient-to-b from-blue-50/50 to-white rounded-3xl p-8 border border-blue-100 shadow-soft hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-blue-100/70 text-primary flex items-center justify-center shadow-inner">
                    <Activity size={28} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">Patient Portal</span>
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-3">Customer Web App</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-medium mb-6">
                  For patients and families needing urgent medical relief. Order 10,000+ medicines, upload prescriptions, check symptoms, set pill alarms, and summon emergency SOS.
                </p>
                <ul className="space-y-2.5 text-xs font-semibold text-gray-700 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
                    AI Doctor handwriting prescription scanner
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
                    Live order tracking with GPS map
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
                    Emergency hospital & ICU bed locator
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
                    Lab pathology report simplifier
                  </li>
                </ul>
              </div>

              <Button 
                onClick={() => handleLaunchApp('/home')}
                className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                Launch Patient App <ArrowRight size={16} />
              </Button>
            </div>

            {/* 2. Pharmacy Terminal */}
            <div className="bg-gradient-to-b from-emerald-50/50 to-white rounded-3xl p-8 border border-emerald-100 shadow-soft hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100/70 text-emerald-600 flex items-center justify-center shadow-inner">
                    <Building2 size={28} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">Merchant Terminal</span>
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-3">Pharmacy Partner POS</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-medium mb-6">
                  Dedicated interface for retail chemists and pharmacists. Real-time audio alarms when a neighbour broadcasts a prescription. Accept full or partial stock in 1 click.
                </p>
                <ul className="space-y-2.5 text-xs font-semibold text-gray-700 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                    Instant audio radar ping on new prescription
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                    Split-order item checkboxes (pack what you have)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                    Instant rider verification QR code
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                    Automated ledger and direct bank settlement
                  </li>
                </ul>
              </div>

              <Link to="/pharmacy-partner" className="block">
                <Button className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2">
                  Open Pharmacy Terminal <ArrowRight size={16} />
                </Button>
              </Link>
            </div>

            {/* 3. Delivery Fleet App */}
            <div className="bg-gradient-to-b from-amber-50/50 to-white rounded-3xl p-8 border border-amber-100 shadow-soft hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100/70 text-amber-600 flex items-center justify-center shadow-inner">
                    <Bike size={28} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">Fleet Console</span>
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-3">Delivery Partner Fleet</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-medium mb-6">
                  Rapid emergency rider console. Features turn-by-turn routing for multi-pharmacy split pickups, priority hospital emergency delivery tags, and daily earnings dashboard.
                </p>
                <ul className="space-y-2.5 text-xs font-semibold text-gray-700 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-amber-600 flex-shrink-0" />
                    Single-rider multi-store pickup optimization
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-amber-600 flex-shrink-0" />
                    Priority turn-by-turn navigation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-amber-600 flex-shrink-0" />
                    Secure OTP delivery confirmation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-amber-600 flex-shrink-0" />
                    Instant digital earnings and incentives
                  </li>
                </ul>
              </div>

              <Link to="/delivery-partner" className="block">
                <Button className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2">
                  Open Delivery Fleet App <ArrowRight size={16} />
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 6. ALL 6 PATIENT HEALTH TOOLS EXPLAINED */}
      <section id="tools" className="py-24 bg-gray-50 border-y border-gray-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs uppercase tracking-wider mb-3 border border-indigo-200">
              <Sparkles size={14} /> Full Medical Suite
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Comprehensive Healthcare at Your Fingertips
            </h2>
            <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed">
              Every tool is engineered for urgent real-world moments. Click any tool below to launch and test immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Tool 1 */}
            <div 
              onClick={() => handleLaunchApp('/prescription-upload')}
              className="bg-white rounded-3xl p-8 border border-gray-200 shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FileText size={28} />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2 flex items-center justify-between">
                  AI Prescription Scanner
                  <ArrowRight size={18} className="text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-gray-600 font-medium leading-relaxed mb-4">
                  Upload handwritten doctor slips. The AI extracts medicines, dosage, and finds identical CDSCO generic salt substitutes to save up to 70%.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                <span>Upload Doctor Slip</span>
                <span>Try Demo &rarr;</span>
              </div>
            </div>

            {/* Tool 2 */}
            <div 
              onClick={() => handleLaunchApp('/emergency-request')}
              className="bg-white rounded-3xl p-8 border border-gray-200 shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-red-50 text-danger flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap size={28} />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2 flex items-center justify-between">
                  Emergency Protocol SOS
                  <ArrowRight size={18} className="text-gray-300 group-hover:text-danger group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-gray-600 font-medium leading-relaxed mb-4">
                  1-Tap crisis activation. Live directions to 24/7 verified open hospitals, ICU bed contacts, oxygen suppliers, and 108/112 ambulance linkage.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-danger">
                <span>Critical SOS Mode</span>
                <span>Open Protocol &rarr;</span>
              </div>
            </div>

            {/* Tool 3 */}
            <div 
              onClick={() => handleLaunchApp('/symptom-checker')}
              className="bg-white rounded-3xl p-8 border border-gray-200 shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Stethoscope size={28} />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2 flex items-center justify-between">
                  AI Symptom Triage
                  <ArrowRight size={18} className="text-gray-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-gray-600 font-medium leading-relaxed mb-4">
                  Input symptoms in plain language. Evaluates urgency levels, red flags, home care remedies, and recommends the exact medical specialist.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-teal-600">
                <span>Instant Clinical Triage</span>
                <span>Start Check &rarr;</span>
              </div>
            </div>

            {/* Tool 4 */}
            <div 
              onClick={() => handleLaunchApp('/nearby')}
              className="bg-white rounded-3xl p-8 border border-gray-200 shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <MapPin size={28} />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2 flex items-center justify-between">
                  24/7 Verified Healthcare Map
                  <ArrowRight size={18} className="text-gray-300 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-gray-600 font-medium leading-relaxed mb-4">
                  Live verified map of pharmacies, clinics, and tertiary care hospitals with operational hours, direct phone numbers, and turn-by-turn navigation.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-green-600">
                <span>Live Radius Map</span>
                <span>Explore Nearby &rarr;</span>
              </div>
            </div>

            {/* Tool 5 */}
            <div 
              onClick={() => handleLaunchApp('/medicine-reminder')}
              className="bg-white rounded-3xl p-8 border border-gray-200 shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Clock size={28} />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2 flex items-center justify-between">
                  Smart Medicine Reminders
                  <ArrowRight size={18} className="text-gray-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-gray-600 font-medium leading-relaxed mb-4">
                  Ensure strict dose adherence. Set customized dosage schedules (before/after food), refill alerts, and family notification sync.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-purple-600">
                <span>Never Miss a Dose</span>
                <span>Set Reminder &rarr;</span>
              </div>
            </div>

            {/* Tool 6 */}
            <div 
              onClick={() => handleLaunchApp('/report-simplifier')}
              className="bg-white rounded-3xl p-8 border border-gray-200 shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Activity size={28} />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2 flex items-center justify-between">
                  Lab Report Simplifier
                  <ArrowRight size={18} className="text-gray-300 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-gray-600 font-medium leading-relaxed mb-4">
                  Turn complicated pathology blood test results and lipid profiles into plain, simple English with normal range indicators and follow-up guidance.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-orange-600">
                <span>Decode Pathology</span>
                <span>Simplify Report &rarr;</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. SAFETY, TRUST & CDSCO REGULATORY STANDARDS */}
      <section id="safety" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-gradient-to-br from-gray-900 via-primary-dark to-gray-900 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-light/20 rounded-full blur-3xl"></div>

            <div className="max-w-3xl mb-12 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cyan-300 font-bold text-xs uppercase tracking-wider mb-4 border border-white/20">
                <ShieldCheck size={14} /> Rigorous Medical Compliance
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
                Safety & Quality Standards You Can Bet Your Life On
              </h2>
              <p className="text-sm sm:text-base text-blue-100 font-medium leading-relaxed">
                MediRush operates under strict CDSCO drug guidelines. We do not cut corners when it comes to medicine authenticity, proper cold-chain temperature, or prescription validity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4 text-emerald-400">
                  <ShieldCheck size={22} />
                </div>
                <h4 className="font-extrabold text-white text-base mb-2">Form 20/21 Verification</h4>
                <p className="text-xs text-blue-100 leading-relaxed font-medium">
                  Only licensed retail pharmacies with active State Drug Control registrations can join our merchant radar network.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4 text-cyan-400">
                  <ThermometerSnowflake size={22} />
                </div>
                <h4 className="font-extrabold text-white text-base mb-2">Cold-Chain Temperature</h4>
                <p className="text-xs text-blue-100 leading-relaxed font-medium">
                  Insulin, eye drops, and temperature-sensitive vaccines are carried in insulated temperature-monitored pouches.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4 text-purple-400">
                  <ShieldAlert size={22} />
                </div>
                <h4 className="font-extrabold text-white text-base mb-2">Schedule H Validation</h4>
                <p className="text-xs text-blue-100 leading-relaxed font-medium">
                  Prescription-restricted medicines are dispensed only against valid registered medical practitioner (RMP) slips.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4 text-amber-400">
                  <QrCode size={22} />
                </div>
                <h4 className="font-extrabold text-white text-base mb-2">256-Bit Data Privacy</h4>
                <p className="text-xs text-blue-100 leading-relaxed font-medium">
                  Medical reports and prescriptions are encrypted in transit and at rest, following HIPAA & NDHM privacy standards.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 8. INTERACTIVE FAQ ACCORDION */}
      <section id="faq" className="py-24 bg-gray-50 border-t border-gray-100 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-primary font-bold text-xs uppercase tracking-wider mb-3 border border-blue-200">
              <HelpCircle size={14} /> Transparent Answers
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-base text-gray-600 font-medium">
              Everything you need to know about our 10-minute medicine delivery, split-fulfillment engine, and emergency protocol.
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((item, index) => (
              <FAQItem 
                key={index}
                question={item.q}
                answer={item.a}
                isOpen={openFAQIndex === index}
                onClick={() => setOpenFAQIndex(openFAQIndex === index ? -1 : index)}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 9. HIGH-IMPACT CLOSING LAUNCHPAD CTA */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-indigo-900 text-white text-center">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-8 border border-white/20 animate-pulseSoft">
            <Activity size={32} className="text-yellow-400" />
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-md">
            Ready to experience the future of emergency healthcare?
          </h2>
          <p className="text-base sm:text-xl text-blue-100 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            Test the live patient web app, explore the standalone pharmacy terminal, or view the rapid delivery rider fleet console right now with zero friction.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
            <Button 
              onClick={() => handleLaunchApp('/home')}
              size="lg" 
              className="w-full sm:w-auto py-5 px-10 text-lg bg-white text-primary hover:bg-gray-100 font-extrabold rounded-2xl shadow-xl cursor-pointer"
            >
              Launch Patient App (1-Click)
            </Button>

            <Link to="/pharmacy-partner" className="w-full sm:w-auto">
              <Button 
                variant="glass" 
                size="lg" 
                className="w-full sm:w-auto py-5 px-8 text-lg text-white border-white/30 hover:bg-white/10 font-extrabold rounded-2xl cursor-pointer"
              >
                <Building2 size={20} className="mr-2 text-emerald-400" /> Pharmacy Terminal
              </Button>
            </Link>

            <Link to="/delivery-partner" className="w-full sm:w-auto">
              <Button 
                variant="glass" 
                size="lg" 
                className="w-full sm:w-auto py-5 px-8 text-lg text-white border-white/30 hover:bg-white/10 font-extrabold rounded-2xl cursor-pointer"
              >
                <Bike size={20} className="mr-2 text-amber-400" /> Delivery Fleet
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* 10. COMPREHENSIVE FOOTER */}
      <footer className="bg-gray-900 pt-20 pb-12 border-t border-gray-800 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
            
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center mb-6">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <Activity className="text-white h-5 w-5" />
                </div>
                <span className="text-2xl font-extrabold tracking-tight text-white">MediRush</span>
              </Link>
              <p className="text-sm font-medium leading-relaxed max-w-sm mb-6 text-gray-400">
                10-Minute emergency medicine delivery, multi-pharmacy split broadcast radar, and AI doctor prescription digitization across India.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-800 border border-gray-700 text-xs font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Emergency Network Active (India)
              </div>
            </div>

            {/* Patient Portals */}
            <div>
              <h4 className="text-white font-extrabold mb-5 uppercase tracking-widest text-[11px]">Patient App</h4>
              <ul className="space-y-3.5 text-xs font-semibold">
                <li><Link to="/medicines" className="hover:text-primary-light transition-colors">Order Medicines</Link></li>
                <li><Link to="/prescription-upload" className="hover:text-primary-light transition-colors">Upload Doctor Rx</Link></li>
                <li><Link to="/symptom-checker" className="hover:text-primary-light transition-colors">AI Symptom Triage</Link></li>
                <li><Link to="/medicine-reminder" className="hover:text-primary-light transition-colors">Pill Dose Reminders</Link></li>
                <li><Link to="/report-simplifier" className="hover:text-primary-light transition-colors">Lab Report Simplifier</Link></li>
                <li><Link to="/orders" className="hover:text-primary-light transition-colors">Live Order Tracker</Link></li>
              </ul>
            </div>

            {/* Partner Portals */}
            <div>
              <h4 className="text-white font-extrabold mb-5 uppercase tracking-widest text-[11px]">Partner Portals</h4>
              <ul className="space-y-3.5 text-xs font-semibold">
                <li>
                  <Link to="/pharmacy-partner" className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 transition-colors">
                    <Building2 size={14} /> Pharmacy Terminal
                  </Link>
                </li>
                <li>
                  <Link to="/delivery-partner" className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1.5 transition-colors">
                    <Bike size={14} /> Delivery Fleet Console
                  </Link>
                </li>
                <li><Link to="/nearby" className="hover:text-primary-light transition-colors">Partner Chemist Directory</Link></li>
                <li><a href="#pipeline" className="hover:text-primary-light transition-colors">Split-Order Architecture</a></li>
                <li><a href="#safety" className="hover:text-primary-light transition-colors">CDSCO Compliance Guide</a></li>
              </ul>
            </div>

            {/* Emergency & Helplines */}
            <div>
              <h4 className="text-white font-extrabold mb-5 uppercase tracking-widest text-[11px]">Emergency Care</h4>
              <ul className="space-y-3.5 text-xs font-semibold">
                <li>
                  <Link to="/emergency-request" className="text-red-400 hover:text-red-300 font-bold transition-colors flex items-center gap-1.5">
                    <PhoneCall size={14} /> Emergency SOS
                  </Link>
                </li>
                <li><Link to="/nearby" className="hover:text-primary-light transition-colors">24/7 Verified Hospitals</Link></li>
                <li><a href="tel:108" className="hover:text-primary-light transition-colors">National Ambulance (108)</a></li>
                <li><a href="tel:112" className="hover:text-primary-light transition-colors">National Emergency (112)</a></li>
                <li><a href="tel:1075" className="hover:text-primary-light transition-colors">National Health Helpline (1075)</a></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-gray-500">
            <p className="uppercase tracking-widest text-[10px]">
              &copy; {new Date().getFullYear()} MediRush India. CDSCO Compliant Healthcare Mesh.
            </p>
            <div className="flex flex-wrap gap-6">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Protocol</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-white cursor-pointer transition-colors">Drug Schedule H Compliance</span>
              <span className="hover:text-white cursor-pointer transition-colors">HIPAA Standards</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

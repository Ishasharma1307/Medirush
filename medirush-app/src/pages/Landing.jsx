import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { 
  Search, Clock, Truck, ShieldPlus, FileText, HeartPulse, Activity, 
  ChevronRight, Zap, Pill, Stethoscope, MapPin, Map, Navigation, 
  PhoneCall, ShieldCheck, Menu, X, ArrowRight, AlertTriangle,
  Building2, Bike, Radio, CheckCircle2
} from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

// Floating Navbar Component
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleLaunchApp = () => {
    if (!user) {
      loginAsDemo();
    }
    navigate('/home');
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            scrolled ? "bg-white/80 backdrop-blur-xl shadow-glass border border-white/50 px-5 py-2.5" : "bg-transparent px-2"
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

            {/* Desktop Links & Partner Portals */}
            <div className="hidden lg:flex items-center space-x-6">
              {['Home', 'Features', 'How It Works', 'Tools'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase().replace(/ /g, '-')}`} 
                  className={cn(
                    "font-bold text-sm transition-colors duration-300 hover:text-primary",
                    scrolled ? "text-gray-600" : "text-white/90 drop-shadow-sm hover:text-white"
                  )}
                >
                  {item}
                </a>
              ))}

              {/* Standalone Partner Portals Links */}
              <Link
                to="/pharmacy-partner"
                className={cn(
                  "font-black text-xs px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 border shadow-xs",
                  scrolled
                    ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                    : "bg-white/15 text-white border-white/25 hover:bg-white/25"
                )}
                title="Open Standalone Merchant Pharmacy Terminal"
              >
                <Building2 size={13} className="text-cyan-300" />
                <span>Pharmacy Terminal</span>
              </Link>

              <Link
                to="/delivery-partner"
                className={cn(
                  "font-black text-xs px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 border shadow-xs",
                  scrolled
                    ? "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                    : "bg-amber-400/20 text-amber-300 border-amber-400/30 hover:bg-amber-400/30"
                )}
                title="Open Standalone Delivery Fleet Rider App"
              >
                <Bike size={13} className="text-amber-400" />
                <span>Rider Fleet</span>
              </Link>
            </div>

            {/* Desktop Auth & 1-Click Launch */}
            <div className="hidden md:flex items-center space-x-3">
              <button
                type="button"
                onClick={handleLaunchApp}
                className="px-3.5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
                title="1-Click Instant Demo Access"
              >
                <Zap size={13} className="text-amber-300" />
                <span>Explore App (Demo)</span>
              </button>

              <Link to="/login" className={cn(
                "font-bold text-sm transition-colors duration-300",
                scrolled ? "text-gray-600 hover:text-primary" : "text-white hover:text-white/80 drop-shadow-sm"
              )}>
                Log In
              </Link>
              <Link to="/register">
                <Button 
                  variant={scrolled ? "primary" : "glass"} 
                  className={cn(
                    "rounded-xl shadow-lg text-xs font-black",
                    !scrolled && "border-none bg-white text-primary hover:bg-white/90"
                  )}
                >
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-gray-500 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(true)}
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
            
            <div className="flex flex-col space-y-4 text-xl font-extrabold text-gray-800">
              {['Home', 'Features', 'How It Works', 'Tools'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} onClick={() => setMobileMenuOpen(false)}>{item}</a>
              ))}

              <div className="pt-3 border-t border-gray-150 flex flex-col gap-2.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Partner Portals</span>
                <Link 
                  to="/pharmacy-partner" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-bold text-blue-700 bg-blue-50 p-3.5 rounded-2xl flex items-center gap-2.5 border border-blue-200"
                >
                  <Building2 size={18} />
                  <span>Pharmacy Merchant Terminal ↗</span>
                </Link>
                <Link 
                  to="/delivery-partner" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-bold text-amber-800 bg-amber-50 p-3.5 rounded-2xl flex items-center gap-2.5 border border-amber-200"
                >
                  <Bike size={18} />
                  <span>Delivery Fleet Rider App ↗</span>
                </Link>
              </div>
            </div>
            
            <div className="mt-auto pt-6 space-y-3">
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLaunchApp();
                }}
                className="w-full py-4 text-sm font-black rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg flex items-center justify-center gap-2"
              >
                <Zap size={16} className="text-amber-300" />
                <span>Explore Demo Web App</span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full py-3.5 text-sm rounded-2xl">Log In</Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full py-3.5 text-sm rounded-2xl shadow-lg shadow-primary/30">Get Started</Button>
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
    if (!user) loginAsDemo();
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
      <div className="text-blue-200 text-sm font-bold uppercase tracking-widest">{label}</div>
    </motion.div>
  );
};

// Main Landing Page
export const Landing = () => {
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const navigate = useNavigate();
  const { user, loginAsDemo } = useAuth();

  const handleLaunchApp = (path = '/home') => {
    if (!user && loginAsDemo) {
      loginAsDemo();
    }
    navigate(path);
  };

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
                Emergency healthcare support when <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-400">every minute matters.</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed drop-shadow-sm">
                Instant AI prescription digitizer, multi-pharmacy split broadcast, verified 24/7 hospitals, symptom checker, and dedicated rider fleet — all unified.
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
          <div className="glass-card bg-primary text-white rounded-[2.5rem] p-10 md:p-16 shadow-floating border border-primary-light/30 relative overflow-hidden -mt-32 backdrop-blur-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-center relative z-10">
              <AnimatedCounter value="24" suffix="/7" label="Support Available" />
              <AnimatedCounter value="10" suffix="m" label="Response Goal" />
              <AnimatedCounter value="500" suffix="+" label="Verified Pharmacies" />
              <AnimatedCounter value="99" suffix="%" label="Success Rate" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section id="features" className="py-24 relative overflow-hidden bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-primary font-bold tracking-widest text-sm uppercase mb-3">Premium Features</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">Designed for speed, built for trust.</h3>
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Every tool you need to manage your health, from AI-driven symptom checkers to lightning-fast emergency medicine delivery.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Truck, title: "Medicine Delivery", desc: "Order from local pharmacies and get your meds delivered in minutes, not days.", color: "text-blue-500", bg: "bg-blue-50", path: "/medicines" },
              { icon: FileText, title: "Prescription Upload", desc: "Securely snap and upload your Rx. Our team verifies it instantly for quick ordering.", color: "text-indigo-500", bg: "bg-indigo-50", path: "/prescription-upload" },
              { icon: Stethoscope, title: "Symptom Checker", desc: "Use our AI triage tool to understand your symptoms and know when to seek help.", color: "text-teal-500", bg: "bg-teal-50", path: "/symptom-checker" },
              { icon: Clock, title: "Medicine Reminders", desc: "Never miss a dose. Set up elegant, reliable alerts that notify you on time.", color: "text-purple-500", bg: "bg-purple-50", path: "/medicine-reminder" },
              { icon: Map, title: "Nearby Healthcare", desc: "Instantly locate the nearest open pharmacies, clinics, and hospitals on a live map.", color: "text-green-500", bg: "bg-green-50", path: "/nearby" },
              { icon: Activity, title: "Report Simplifier", desc: "Upload complex medical reports and get them summarized in plain, understandable English.", color: "text-orange-500", bg: "bg-orange-50", path: "/report-simplifier" }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleLaunchApp(feature.path)}
                className="glass-card bg-white p-8 hover:shadow-floating transition-all duration-500 hover:-translate-y-2 group border border-gray-100 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110", feature.bg, feature.color)}>
                    <feature.icon size={28} />
                  </div>
                  <h4 className="text-xl font-extrabold text-gray-900 mb-3 drop-shadow-sm flex items-center justify-between">
                    {feature.title}
                    <ArrowRight size={18} className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </h4>
                  <p className="text-gray-600 font-medium leading-relaxed text-sm">
                    {feature.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-xs font-bold text-primary group-hover:underline">
                  Launch {feature.title} &rarr;
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DUAL PARTNER ECOSYSTEM: PHARMACY TERMINAL & DELIVERY FLEET */}
      <section className="py-20 bg-gradient-to-b from-background to-gray-50 border-t border-gray-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-3 border border-emerald-200">
              <Radio size={14} className="text-emerald-500 animate-pulse" /> Live Partner Network
            </div>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              Built for Pharmacists & Delivery Fleets
            </h3>
            <p className="text-gray-600 font-medium text-base">
              MediRush powers a complete tripartite ecosystem. Dedicated high-velocity interfaces for local chemists and rapid riders operate seamlessly alongside the patient app.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pharmacy Terminal Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-soft hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                  <Building2 size={28} />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Merchant Portal</div>
                  <h4 className="text-2xl font-extrabold text-gray-900">Pharmacy Terminal</h4>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 font-medium">
                Live radar for incoming prescription broadcasts. Chemists can review digitized medicines, accept full or partial fulfillment in 1-click, and prepare packets for immediate pickup.
              </p>
              <ul className="space-y-2.5 mb-8 text-xs font-semibold text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Real-time audio alert & socket broadcast for new prescriptions
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Split-fulfillment support: accept available items only
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Instant packet QR verification for riders
                </li>
              </ul>
              <Link to="/pharmacy-partner" className="block">
                <Button className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer">
                  Open Pharmacy Terminal <ArrowRight size={16} />
                </Button>
              </Link>
            </motion.div>

            {/* Delivery Fleet Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 border border-amber-100 shadow-soft hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner">
                  <Bike size={28} />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-600 uppercase tracking-widest">Fleet Partner</div>
                  <h4 className="text-2xl font-extrabold text-gray-900">Delivery Fleet App</h4>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 font-medium">
                High-priority emergency delivery driver console. Features single-rider multi-pharmacy pickup route optimization for split orders, live customer delivery navigation, and instant earnings.
              </p>
              <ul className="space-y-2.5 mb-8 text-xs font-semibold text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Single-rider multi-pharmacy split pickup route algorithm
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Turn-by-turn priority route navigation to patient
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Live OTP handoff and instant digital tipping & payouts
                </li>
              </ul>
              <Link to="/delivery-partner" className="block">
                <Button className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md shadow-amber-600/20 flex items-center justify-center gap-2 cursor-pointer">
                  Open Delivery Partner App <ArrowRight size={16} />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (Timeline) */}
      <section id="how-it-works" className="py-24 bg-gray-50 relative border-y border-gray-100 overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 right-[-20%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-primary font-bold tracking-widest text-sm uppercase mb-3">Simple Flow</h2>
              <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">How MediRush works.</h3>
              <p className="text-lg text-gray-600 font-medium leading-relaxed mb-10">
                We've streamlined the process of getting medical help into three simple, frictionless steps. No more waiting in lines or making endless phone calls.
              </p>
              
              <div className="space-y-10 relative">
                {/* Connecting Line */}
                <div className="absolute left-7 top-10 bottom-10 w-0.5 bg-gradient-to-b from-primary via-green-400 to-danger hidden sm:block"></div>

                {[
                  { step: "01", title: "Describe your need", desc: "Search for a medicine or input your symptoms into our smart AI checker.", icon: Search },
                  { step: "02", title: "Find support nearby", desc: "We instantly match you with the closest verified pharmacy or hospital.", icon: MapPin },
                  { step: "03", title: "Get help quickly", desc: "Receive your delivery or follow live directions to the medical center.", icon: Zap }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                    className="flex relative z-10"
                  >
                    <div className="flex-shrink-0 mr-6">
                      <div className="w-14 h-14 bg-white shadow-soft rounded-2xl border border-gray-100 flex items-center justify-center text-primary font-extrabold text-xl relative">
                        <item.icon size={24} className="text-primary opacity-20 absolute" />
                        {item.step}
                      </div>
                    </div>
                    <div className="pt-2">
                      <h4 className="text-xl font-extrabold text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-gray-600 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Illustration/Graphic */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative hidden lg:block"
            >
               <div className="w-full aspect-square bg-gradient-to-tr from-blue-100 to-white rounded-[3rem] p-8 shadow-inner border border-white relative flex items-center justify-center">
                  <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1576091160550-2173ff9e5ee5?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center rounded-[2rem] shadow-2xl opacity-90 mix-blend-multiply filter contrast-125 saturate-50"></div>
                  
                  {/* Floating Elements on Image */}
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -left-10 top-20 bg-white p-4 rounded-2xl shadow-floating border border-gray-100 flex items-center gap-3">
                     <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600"><ShieldCheck size={20}/></div>
                     <div><p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Status</p><p className="font-extrabold text-gray-900">Verified Partner</p></div>
                  </motion.div>

                  <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -right-5 bottom-32 bg-white p-4 rounded-2xl shadow-floating border border-gray-100 flex items-center gap-3">
                     <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-primary"><Truck size={20}/></div>
                     <div><p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Delivery</p><p className="font-extrabold text-gray-900">3 mins away</p></div>
                  </motion.div>
               </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 5. EMERGENCY SUPPORT SECTION */}
      <section className="py-24 bg-background relative overflow-hidden">
         <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="bg-gradient-to-br from-danger to-red-900 rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-danger/30 relative overflow-hidden border border-red-500/50"
            >
               <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>
               <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-black/20 rounded-full blur-3xl mix-blend-overlay"></div>
               
               <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner border border-white/30 animate-pulseSoft">
                 <AlertTriangle size={40} className="text-white drop-shadow-md" />
               </div>

               <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 drop-shadow-lg tracking-tight">Need immediate help?</h2>
               <p className="text-lg md:text-xl text-red-100 font-medium max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-sm">
                 Access our emergency network instantly. Get direct routing to the nearest hospitals, summon an ambulance, or contact an emergency hotline with one tap.
               </p>

               <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link to="/emergency-request">
                    <Button size="lg" className="w-full sm:w-auto py-5 px-10 text-lg bg-white text-danger hover:bg-red-50 shadow-xl font-extrabold rounded-2xl group border-none cursor-pointer">
                       <Zap size={20} className="mr-2 text-danger group-hover:scale-110 transition-transform" /> Activate Emergency Protocol
                    </Button>
                  </Link>
                  <Link to="/nearby">
                    <Button variant="glass" size="lg" className="w-full sm:w-auto py-5 px-8 text-lg border-white/30 text-white hover:bg-white/10 font-bold rounded-2xl cursor-pointer">
                       View Nearby Hospitals
                    </Button>
                  </Link>
               </div>
            </motion.div>
         </div>
      </section>

      {/* 6. HEALTHCARE TOOLS SHOWCASE */}
      <section id="tools" className="py-24 bg-white relative">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <h2 className="text-primary font-bold tracking-widest text-sm uppercase mb-3">Smart Tools</h2>
               <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight">Powerful UI built for health.</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* UI Card 1 */}
               <motion.div 
                 initial={{ opacity: 0, y: 20 }} 
                 whileInView={{ opacity: 1, y: 0 }} 
                 viewport={{ once: true }} 
                 onClick={() => handleLaunchApp('/symptom-checker')}
                 className="bg-gray-50 hover:bg-white rounded-[2rem] p-8 border border-gray-100 hover:border-teal-200 shadow-soft hover:shadow-xl transition-all duration-300 cursor-pointer group"
               >
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-extrabold text-gray-900 flex items-center"><Stethoscope size={20} className="mr-2 text-teal-500"/> Symptom Triage</h4>
                    <span className="text-xs font-bold text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">Open &rarr;</span>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
                     <div className="flex gap-3 items-center">
                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center"><Activity size={14} className="text-teal-600"/></div>
                        <div className="text-xs font-semibold text-gray-700">AI Medical Triage Ready</div>
                     </div>
                     <p className="text-xs text-gray-500">Analyze symptoms, emergency risks, and suggested specialties in real time.</p>
                  </div>
               </motion.div>

               {/* UI Card 2 */}
               <motion.div 
                 initial={{ opacity: 0, y: 20 }} 
                 whileInView={{ opacity: 1, y: 0 }} 
                 viewport={{ once: true }} 
                 transition={{ delay: 0.1 }} 
                 onClick={() => handleLaunchApp('/medicine-reminder')}
                 className="bg-gray-50 hover:bg-white rounded-[2rem] p-8 border border-gray-100 hover:border-purple-200 shadow-soft hover:shadow-xl transition-all duration-300 cursor-pointer group"
               >
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-extrabold text-gray-900 flex items-center"><Clock size={20} className="mr-2 text-purple-500"/> Med Reminder</h4>
                    <span className="text-xs font-bold text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">Open &rarr;</span>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex justify-between items-center">
                     <div>
                        <p className="font-extrabold text-gray-900 text-sm">Amoxicillin 500mg</p>
                        <p className="text-[10px] uppercase font-bold text-gray-400 mt-1">Take 1 pill after food</p>
                     </div>
                     <div className="bg-purple-50 text-purple-600 font-extrabold text-xs px-3 py-1.5 rounded-lg">
                        08:00 AM
                     </div>
                  </div>
               </motion.div>

               {/* UI Card 3 */}
               <motion.div 
                 initial={{ opacity: 0, y: 20 }} 
                 whileInView={{ opacity: 1, y: 0 }} 
                 viewport={{ once: true }} 
                 transition={{ delay: 0.2 }} 
                 onClick={() => handleLaunchApp('/report-simplifier')}
                 className="bg-gray-50 hover:bg-white rounded-[2rem] p-8 border border-gray-100 hover:border-blue-200 shadow-soft hover:shadow-xl transition-all duration-300 cursor-pointer group"
               >
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-extrabold text-gray-900 flex items-center"><FileText size={20} className="mr-2 text-primary"/> Report Simplifier</h4>
                    <span className="text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">Open &rarr;</span>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-2">
                     <p className="text-xs font-bold text-gray-800">CBC & Lipid Profile</p>
                     <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-[10px] uppercase font-bold text-primary mb-1">Plain English Summary</p>
                        <p className="text-[11px] text-blue-900 font-medium">All vital markers within normal range. Mild vitamin D deficiency indicated.</p>
                     </div>
                  </div>
               </motion.div>
            </div>
         </div>
      </section>

      {/* 7. PREMIUM CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-50 to-primary/10 -z-10"></div>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-8 tracking-tight drop-shadow-sm">
              Healthcare support designed for urgent moments.
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                onClick={() => handleLaunchApp('/home')}
                size="lg" 
                variant="primary" 
                className="w-full sm:w-auto py-5 px-10 text-lg rounded-2xl shadow-xl shadow-primary/30 font-extrabold cursor-pointer"
              >
                Launch Demo App (1-Click)
              </Button>
              <Link to="/prescription-upload">
                <Button variant="outline" size="lg" className="w-full sm:w-auto py-5 px-10 text-lg rounded-2xl font-extrabold border-gray-300 hover:bg-white shadow-sm cursor-pointer">
                  Upload Prescription
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-gray-900 pt-20 pb-10 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            
            {/* Brand */}
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center mb-6">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <Activity className="text-white h-5 w-5" />
                </div>
                <span className="text-2xl font-extrabold tracking-tight text-white">MediRush</span>
              </Link>
              <p className="text-gray-400 text-sm font-medium leading-relaxed mb-4">
                10-Minute emergency medicine delivery, verified hospital routing, and AI triage.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Emergency Network Active (India)
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-extrabold mb-6 uppercase tracking-widest text-[11px]">Patient App</h4>
              <ul className="space-y-4 text-sm font-medium text-gray-400">
                <li><Link to="/medicines" className="hover:text-primary-light transition-colors">Order Medicines</Link></li>
                <li><Link to="/prescription-upload" className="hover:text-primary-light transition-colors">Upload Prescription</Link></li>
                <li><Link to="/symptom-checker" className="hover:text-primary-light transition-colors">AI Symptom Checker</Link></li>
                <li><Link to="/medicine-reminder" className="hover:text-primary-light transition-colors">Pill Reminders</Link></li>
                <li><Link to="/report-simplifier" className="hover:text-primary-light transition-colors">Lab Report Simplifier</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-extrabold mb-6 uppercase tracking-widest text-[11px]">Partner Portals</h4>
              <ul className="space-y-4 text-sm font-medium text-gray-400">
                <li>
                  <Link to="/pharmacy-partner" className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5 transition-colors">
                    <Building2 size={14} /> Pharmacy Terminal
                  </Link>
                </li>
                <li>
                  <Link to="/delivery-partner" className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 transition-colors">
                    <Bike size={14} /> Delivery Fleet Console
                  </Link>
                </li>
                <li><Link to="/orders" className="hover:text-primary-light transition-colors">Live Order Tracking</Link></li>
                <li><Link to="/nearby" className="hover:text-primary-light transition-colors">Verified Pharmacy Directory</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-extrabold mb-6 uppercase tracking-widest text-[11px]">Emergency Care</h4>
              <ul className="space-y-4 text-sm font-medium text-gray-400">
                <li><Link to="/emergency-request" className="text-red-400 hover:text-red-300 font-bold transition-colors">SOS Immediate Protocol</Link></li>
                <li><Link to="/nearby" className="hover:text-primary-light transition-colors">24/7 Verified Hospitals</Link></li>
                <li><a href="tel:108" className="hover:text-primary-light transition-colors">Call National Ambulance (108)</a></li>
                <li><a href="tel:112" className="hover:text-primary-light transition-colors">National Emergency Hotline (112)</a></li>
              </ul>
            </div>

          </div>
          
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-[11px] font-bold uppercase tracking-widest">
              &copy; {new Date().getFullYear()} MediRush India. All rights reserved.
            </p>
            <div className="flex space-x-6 text-xs font-semibold text-gray-500">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Protocol</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms & CDSCO Guidelines</span>
              <span className="hover:text-white cursor-pointer transition-colors">HIPAA & Digital Health Standards</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

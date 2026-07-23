import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { 
  Search, Clock, Truck, ShieldPlus, FileText, HeartPulse, Activity, 
  ChevronRight, Zap, Pill, Stethoscope, MapPin, Map, Navigation, 
  PhoneCall, ShieldCheck, Menu, X, ArrowRight, AlertTriangle
} from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

// Floating Navbar Component
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          scrolled ? "py-3" : "py-6"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={cn(
            "flex items-center justify-between transition-all duration-500 rounded-3xl",
            scrolled ? "bg-white/70 backdrop-blur-xl shadow-glass border border-white/50 px-6 py-3" : "bg-transparent px-2"
          )}>
            
            {/* Logo */}
            <Link to="/" className="flex items-center group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300 mr-3">
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
            <div className="hidden md:flex items-center space-x-8">
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
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center space-x-4">
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
                    "rounded-xl shadow-lg",
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
            className="fixed inset-0 z-[200] bg-white/90 backdrop-blur-2xl p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mr-3">
                  <Activity className="text-white h-5 w-5" />
                </div>
                <span className="text-2xl font-extrabold tracking-tight text-gray-900">MediRush</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex flex-col space-y-6 text-2xl font-extrabold text-gray-800">
              {['Home', 'Features', 'How It Works', 'Tools'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} onClick={() => setMobileMenuOpen(false)}>{item}</a>
              ))}
            </div>
            
            <div className="mt-auto space-y-4">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full py-4 text-lg rounded-2xl">Log In</Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full py-4 text-lg rounded-2xl shadow-lg shadow-primary/30">Get Started</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Hero Mockup Component
const HeroMockup = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto md:max-w-none h-[500px] md:h-[600px] flex items-center justify-center perspective-[2000px]">
      
      {/* Central Phone/Dashboard Container */}
      <motion.div 
        initial={{ opacity: 0, rotateY: 20, rotateX: 10, scale: 0.9 }}
        animate={{ opacity: 1, rotateY: -5, rotateX: 5, scale: 1 }}
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
                  <span className="text-sm font-extrabold flex items-center"><MapPin size={12} className="mr-1"/> Downtown Medical</span>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                   <Activity size={18} />
                </div>
             </div>
             <div className="relative">
                <input disabled className="w-full bg-white/20 backdrop-blur-md rounded-xl py-3 pl-10 text-xs border border-white/30" placeholder="Search medicines..." />
                <Search size={14} className="absolute left-4 top-3.5 text-white/70" />
             </div>
          </div>
          
          {/* Mockup Body */}
          <div className="p-4 space-y-4 flex-1 bg-gradient-to-b from-gray-50 to-white">
             {/* Urgent Alert */}
             <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 text-danger animate-pulseSoft">
                   <Zap size={18} />
                </div>
                <div>
                   <h4 className="text-sm font-extrabold text-red-900">Emergency Support</h4>
                   <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mt-0.5">Response in &lt; 5 mins</p>
                </div>
             </div>

             {/* Order Card */}
             <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-soft">
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
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-soft text-center flex flex-col items-center">
                   <Pill size={24} className="text-purple-500 mb-2" />
                   <span className="text-xs font-bold text-gray-800">Medicines</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-soft text-center flex flex-col items-center">
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
        className="absolute top-[15%] right-[-5%] md:right-[5%] z-30 bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-floating border border-white/60 flex items-center gap-4"
      >
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
          <FileText size={24} />
        </div>
        <div>
          <p className="text-sm font-extrabold text-gray-900">Rx Verified</p>
          <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-0.5">Ready to order</p>
        </div>
      </motion.div>

      {/* Floating Widget 2: Heart Rate */}
      <motion.div 
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[20%] left-[-10%] md:left-[0%] z-30 bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-floating border border-white/60 flex items-center gap-4"
      >
        <div className="w-12 h-12 bg-red-50 text-danger rounded-xl flex items-center justify-center">
          <HeartPulse size={24} />
        </div>
        <div>
          <p className="text-sm font-extrabold text-gray-900">Symptom Check</p>
          <p className="text-[10px] font-bold text-danger uppercase tracking-widest mt-0.5">AI Analysis Complete</p>
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
                <Zap size={14} className="mr-2 text-yellow-400" /> Introducing MediRush 2.0
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 drop-shadow-lg tracking-tight">
                Emergency healthcare support when <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-400">every minute matters.</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed drop-shadow-sm">
                Find nearby pharmacies, hospitals, emergency support, medicine reminders, symptom guidance, and prescription assistance all in one place.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto py-4 px-8 text-lg bg-white text-primary hover:bg-gray-50 border-none shadow-xl shadow-white/10 rounded-2xl font-extrabold group">
                    Get Started <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20}/>
                  </Button>
                </Link>
                <Link to="/emergency" className="w-full sm:w-auto">
                  <Button variant="danger" size="lg" className="w-full sm:w-auto py-4 px-8 text-lg rounded-2xl shadow-xl shadow-danger/30 font-extrabold flex items-center justify-center animate-pulseSoft border border-danger-light">
                    <PhoneCall className="mr-2" size={20}/> Emergency Help
                  </Button>
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
              { icon: Truck, title: "Medicine Delivery", desc: "Order from local pharmacies and get your meds delivered in minutes, not days.", color: "text-blue-500", bg: "bg-blue-50" },
              { icon: FileText, title: "Prescription Upload", desc: "Securely snap and upload your Rx. Our team verifies it instantly for quick ordering.", color: "text-indigo-500", bg: "bg-indigo-50" },
              { icon: Stethoscope, title: "Symptom Checker", desc: "Use our AI triage tool to understand your symptoms and know when to seek help.", color: "text-teal-500", bg: "bg-teal-50" },
              { icon: Clock, title: "Medicine Reminders", desc: "Never miss a dose. Set up elegant, reliable alerts that notify you on time.", color: "text-purple-500", bg: "bg-purple-50" },
              { icon: Map, title: "Nearby Healthcare", desc: "Instantly locate the nearest open pharmacies, clinics, and hospitals on a live map.", color: "text-green-500", bg: "bg-green-50" },
              { icon: Activity, title: "Report Simplifier", desc: "Upload complex medical reports and get them summarized in plain, understandable English.", color: "text-orange-500", bg: "bg-orange-50" }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card bg-white p-8 hover:shadow-floating transition-all duration-500 hover:-translate-y-2 group border border-gray-100"
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110", feature.bg, feature.color)}>
                  <feature.icon size={28} />
                </div>
                <h4 className="text-xl font-extrabold text-gray-900 mb-3 drop-shadow-sm">{feature.title}</h4>
                <p className="text-gray-600 font-medium leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
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
                  <Link to="/emergency">
                    <Button size="lg" className="w-full sm:w-auto py-5 px-10 text-lg bg-white text-danger hover:bg-red-50 shadow-xl font-extrabold rounded-2xl group border-none">
                       <Zap size={20} className="mr-2 text-danger group-hover:scale-110 transition-transform" /> Activate Emergency Protocol
                    </Button>
                  </Link>
                  <Button variant="glass" size="lg" className="w-full sm:w-auto py-5 px-8 text-lg border-white/30 text-white hover:bg-white/10 font-bold rounded-2xl">
                     View Nearby Hospitals
                  </Button>
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
               <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100 shadow-soft">
                  <h4 className="text-lg font-extrabold text-gray-900 mb-6 flex items-center"><Stethoscope size={20} className="mr-2 text-teal-500"/> Symptom Triage</h4>
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
                     <div className="flex gap-3 items-center">
                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center"><Activity size={14} className="text-teal-600"/></div>
                        <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                     </div>
                     <div className="pl-11"><div className="h-2 bg-gray-100 rounded w-full mb-2"></div><div className="h-2 bg-gray-100 rounded w-5/6"></div></div>
                  </div>
               </motion.div>

               {/* UI Card 2 */}
               <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100 shadow-soft">
                  <h4 className="text-lg font-extrabold text-gray-900 mb-6 flex items-center"><Clock size={20} className="mr-2 text-purple-500"/> Med Reminder</h4>
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex justify-between items-center">
                     <div>
                        <p className="font-extrabold text-gray-900 text-sm">Amoxicillin</p>
                        <p className="text-[10px] uppercase font-bold text-gray-400 mt-1">Take 1 pill after food</p>
                     </div>
                     <div className="bg-purple-50 text-purple-600 font-extrabold text-xs px-3 py-1.5 rounded-lg">
                        08:00 AM
                     </div>
                  </div>
               </motion.div>

               {/* UI Card 3 */}
               <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100 shadow-soft">
                  <h4 className="text-lg font-extrabold text-gray-900 mb-6 flex items-center"><FileText size={20} className="mr-2 text-primary"/> Report Simplifier</h4>
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-2">
                     <div className="h-3 bg-gray-100 rounded w-1/3 mb-4"></div>
                     <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-[10px] uppercase font-bold text-primary mb-1">Simple Meaning</p>
                        <div className="h-2 bg-blue-200/50 rounded w-full mb-1.5"></div>
                        <div className="h-2 bg-blue-200/50 rounded w-4/5"></div>
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
              <Link to="/register">
                <Button size="lg" variant="primary" className="w-full sm:w-auto py-5 px-10 text-lg rounded-2xl shadow-xl shadow-primary/30 font-extrabold">
                  Start Using MediRush
                </Button>
              </Link>
              <Link to="/home">
                <Button variant="outline" size="lg" className="w-full sm:w-auto py-5 px-10 text-lg rounded-2xl font-extrabold border-gray-200 hover:bg-white shadow-sm">
                  Explore Dashboard
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
              <p className="text-gray-400 text-sm font-medium leading-relaxed">
                Emergency healthcare support platform. Fast, reliable, and accessible when you need it most.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-extrabold mb-6 uppercase tracking-widest text-[11px]">Product</h4>
              <ul className="space-y-4 text-sm font-medium text-gray-400">
                <li><a href="#" className="hover:text-primary-light transition-colors">Medicine Delivery</a></li>
                <li><a href="#" className="hover:text-primary-light transition-colors">Symptom Checker</a></li>
                <li><a href="#" className="hover:text-primary-light transition-colors">Pharmacy Network</a></li>
                <li><a href="#" className="hover:text-primary-light transition-colors">Report Simplifier</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-extrabold mb-6 uppercase tracking-widest text-[11px]">Resources</h4>
              <ul className="space-y-4 text-sm font-medium text-gray-400">
                <li><a href="#" className="hover:text-primary-light transition-colors">Home Remedies</a></li>
                <li><a href="#" className="hover:text-primary-light transition-colors">Medical Blog</a></li>
                <li><a href="#" className="hover:text-primary-light transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary-light transition-colors">Contact Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-extrabold mb-6 uppercase tracking-widest text-[11px]">Emergency</h4>
              <ul className="space-y-4 text-sm font-medium text-gray-400">
                <li><Link to="/emergency" className="text-red-400 hover:text-red-300 font-bold transition-colors">SOS Hotlines</Link></li>
                <li><a href="#" className="hover:text-primary-light transition-colors">Ambulance Directory</a></li>
                <li><a href="#" className="hover:text-primary-light transition-colors">24/7 Hospitals</a></li>
              </ul>
            </div>

          </div>
          
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-[11px] font-bold uppercase tracking-widest">
              &copy; {new Date().getFullYear()} MediRush Inc. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm font-medium text-gray-500">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

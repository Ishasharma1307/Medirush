import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, ShieldAlert, AlertTriangle, ChevronDown, ChevronUp, ArrowLeft,
  Thermometer, Wind, Brain, Activity, Flame, User, Mic, Battery,
  HeartPulse, Info, Pill, Leaf
} from 'lucide-react';
import { mockHomeRemedies } from '../data/mockHomeRemedies';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

// Icon mapper for dynamic icons
const iconMap = {
  Thermometer, Wind, Brain, Activity, Flame, User, Mic, Battery
};

export const HomeRemedies = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [remedies, setRemedies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  // Extract unique categories for the filter chips
  const categories = ['All', ...new Set(mockHomeRemedies.map(item => item.category))];

  useEffect(() => {
    // Simulate fake network delay for loading skeleton
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRemedies(mockHomeRemedies);
      setLoading(false);
    };
    loadData();
  }, []);

  // Filter logic
  const filteredRemedies = remedies.filter(remedy => {
    const matchesSearch = remedy.problem.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          remedy.symptoms.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || remedy.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
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
    <div className="min-h-screen bg-background pb-20 font-sans relative overflow-hidden">
      
      {/* Decorative Background */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* 1) Premium Header */}
      <div className="bg-gradient-to-br from-secondary via-green-800 to-teal-900 pt-12 pb-24 px-4 sm:px-6 lg:px-8 shadow-floating relative overflow-hidden rounded-b-[2.5rem]">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto relative z-10 text-center"
        >
          <div className="inline-flex items-center justify-center bg-white/20 backdrop-blur-md border border-white/30 shadow-sm text-white text-[11px] font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            <HeartPulse size={14} className="mr-2" /> Safe & Natural
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md">Home Remedies</h1>
          <p className="text-green-100 text-lg md:text-xl font-medium max-w-2xl mx-auto drop-shadow-sm">
            Discover safe, natural ways to manage minor health issues at home.
          </p>
        </motion.div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20"
      >
        
        {/* Back Button */}
        <motion.button 
          variants={itemVariants}
          onClick={() => navigate('/home')} 
          className="inline-flex items-center text-gray-700 hover:text-primary font-bold mb-8 transition-colors group"
        >
          <span className="p-2 bg-white/60 backdrop-blur-md rounded-xl shadow-sm border border-white/60 mr-3 group-hover:bg-white group-hover:shadow-md transition-all flex items-center justify-center">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform text-primary" />
          </span>
          <span className="leading-none mt-0.5 uppercase tracking-widest text-[11px]">Back to Dashboard</span>
        </motion.button>

        {/* Strict Disclaimer Banner */}
        <motion.div variants={itemVariants} className="glass-card bg-yellow-500/10 border-yellow-500/30 p-5 shadow-sm mb-8 flex items-start">
          <div className="bg-white/80 p-2 rounded-xl shadow-inner mr-4 flex-shrink-0 border border-yellow-500/20">
             <ShieldAlert className="text-yellow-600" size={24} />
          </div>
          <div>
            <h3 className="font-extrabold text-yellow-900 mb-1 drop-shadow-sm">Important Disclaimer</h3>
            <p className="text-sm text-yellow-800 font-medium leading-relaxed">
              These remedies are for minor issues only and are not a replacement for professional medical advice. Do not use these as a substitute for prescribed medication.
            </p>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div variants={itemVariants} className="glass-card p-6 border-white/60 mb-8">
          <div className="relative mb-6">
            <input 
              type="text" 
              placeholder="Search problems or symptoms... (e.g. Cough)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-4 pl-14 bg-white/60 backdrop-blur-sm border border-white/60 shadow-inner rounded-2xl focus:bg-white focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all font-bold text-gray-900 placeholder:text-gray-400 placeholder:font-medium"
            />
            <div className="absolute left-4 top-4 bg-white p-1 rounded-lg shadow-sm">
               <Search className="text-secondary/70" size={18} />
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {categories.map((category, idx) => (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                key={idx}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-5 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all duration-300 border shadow-sm",
                  selectedCategory === category 
                    ? "bg-gradient-to-r from-secondary to-green-600 text-white border-transparent shadow-secondary/30" 
                    : "bg-white/80 text-gray-600 border-white/60 hover:bg-white hover:border-secondary/30"
                )}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Emergency Red Banner */}
        <motion.div variants={itemVariants} className="glass-card bg-danger/10 border-danger/20 p-6 shadow-sm mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white/80 p-3 rounded-xl shadow-inner border border-danger/20 mr-4">
              <AlertTriangle className="text-danger animate-pulseSoft" size={24} />
            </div>
            <div>
              <h3 className="font-extrabold text-danger text-lg mb-0.5 drop-shadow-sm">Severe Symptoms?</h3>
              <p className="text-[11px] text-danger font-bold uppercase tracking-widest">Visit the nearest hospital or call emergency services immediately.</p>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-card h-24 border-white/60 animate-pulseSoft"></div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={selectedCategory + searchQuery} initial="hidden" animate="visible" exit={{ opacity: 0 }} variants={containerVariants} className="space-y-5">
              {filteredRemedies.length === 0 ? (
                <motion.div variants={itemVariants} className="glass-card p-12 border-white/60 text-center">
                  <div className="bg-white/50 backdrop-blur-sm p-6 rounded-full inline-block mb-6 shadow-inner border border-white/50">
                     <Pill size={48} className="text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-2 drop-shadow-sm">No remedies found</h3>
                  <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">Try adjusting your search or category filter.</p>
                </motion.div>
              ) : (
                filteredRemedies.map((remedy) => {
                  const IconComponent = iconMap[remedy.icon] || Activity;
                  const isExpanded = expandedId === remedy.id;

                  return (
                    <motion.div variants={itemVariants} key={remedy.id} className="glass-card border-white/60 overflow-hidden transition-all duration-300">
                      
                      {/* Card Header (Clickable) */}
                      <div 
                        onClick={() => toggleExpand(remedy.id)}
                        className="p-6 cursor-pointer hover:bg-white/40 flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="w-14 h-14 bg-secondary/10 border border-secondary/20 text-secondary rounded-2xl flex items-center justify-center mr-5 shadow-inner flex-shrink-0">
                            <IconComponent size={28} />
                          </div>
                          <div>
                            <h3 className="text-xl font-extrabold text-gray-900 drop-shadow-sm">{remedy.problem}</h3>
                            <p className="text-[11px] text-gray-500 font-bold mt-1 uppercase tracking-widest">{remedy.description}</p>
                          </div>
                        </div>
                        <div className={cn(
                          "ml-4 flex-shrink-0 bg-white/60 p-2.5 rounded-xl border shadow-sm transition-colors",
                          isExpanded ? "text-secondary border-secondary/30 bg-secondary/5" : "text-gray-500 border-white/50"
                        )}>
                          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                             <ChevronDown size={20} />
                          </motion.div>
                        </div>
                      </div>

                      {/* Card Body (Expandable) */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 pt-6 border-t border-white/50 bg-white/20 backdrop-blur-sm">
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                
                                {/* Symptoms */}
                                <div>
                                  <h4 className="font-bold text-gray-500 mb-4 flex items-center text-[10px] uppercase tracking-widest bg-white/60 px-3 py-1.5 rounded-lg border border-white/50 w-fit shadow-sm">
                                    <div className="bg-primary/10 p-1 rounded-md mr-2 shadow-inner"><Info size={14} className="text-primary" /></div> Common Symptoms
                                  </h4>
                                  <ul className="space-y-3 bg-white/40 backdrop-blur-sm p-4 rounded-xl border border-white/50 shadow-inner">
                                    {remedy.symptoms.map((sym, idx) => (
                                      <li key={idx} className="flex items-start text-sm text-gray-800 font-bold">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-3 flex-shrink-0 shadow-sm"></span>
                                        {sym}
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Remedies */}
                                <div>
                                  <h4 className="font-bold text-gray-500 mb-4 flex items-center text-[10px] uppercase tracking-widest bg-white/60 px-3 py-1.5 rounded-lg border border-white/50 w-fit shadow-sm">
                                    <div className="bg-secondary/10 p-1 rounded-md mr-2 shadow-inner"><Leaf size={14} className="text-secondary" /></div> Home Remedies
                                  </h4>
                                  <ul className="space-y-3 bg-white/40 backdrop-blur-sm p-4 rounded-xl border border-white/50 shadow-inner">
                                    {remedy.remedies.map((rem, idx) => (
                                      <li key={idx} className="flex items-start text-sm text-gray-800 font-bold">
                                        <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 mr-3 flex-shrink-0 shadow-sm"></span>
                                        {rem}
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Yoga & Recovery */}
                                <div className="md:col-span-2">
                                  <h4 className="font-bold text-gray-500 mb-4 flex items-center text-[10px] uppercase tracking-widest bg-white/60 px-3 py-1.5 rounded-lg border border-white/50 w-fit shadow-sm">
                                    <div className="bg-purple-500/10 p-1 rounded-md mr-2 shadow-inner"><Activity size={14} className="text-purple-500" /></div> Yoga & Recovery Tips
                                  </h4>
                                  <div className="bg-purple-500/10 backdrop-blur-sm rounded-xl p-5 border border-purple-500/20 shadow-sm">
                                    <ul className="space-y-3">
                                      {remedy.yoga_tips.map((tip, idx) => (
                                        <li key={idx} className="flex items-start text-sm text-purple-900 font-bold">
                                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 mr-3 flex-shrink-0 shadow-sm"></span>
                                          {tip}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>

                              </div>

                              {/* Critical Doctor Warning */}
                              <div className="mt-8 bg-danger/10 backdrop-blur-sm rounded-xl p-5 border border-danger/20 shadow-sm">
                                <h4 className="font-extrabold text-danger mb-2 flex items-center text-sm drop-shadow-sm">
                                  <div className="bg-white/80 p-1 rounded-md mr-2 shadow-inner"><AlertTriangle size={14} className="text-danger animate-pulseSoft" /></div> When to See a Doctor
                                </h4>
                                <p className="text-sm text-danger font-bold mb-4 ml-1">{remedy.when_to_see_doctor}</p>
                                <p className="text-[10px] text-danger font-extrabold uppercase tracking-widest bg-white/80 inline-block px-3 py-1.5 rounded-lg shadow-sm border border-danger/10">
                                  ⚠️ {remedy.warning}
                                </p>
                              </div>

                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          </AnimatePresence>
        )}

      </motion.div>
    </div>
  );
};

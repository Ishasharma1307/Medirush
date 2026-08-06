import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { mockMedicines } from '../mockData/mockMedicines';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Camera, Mic, MapPin, Bell, ShoppingBag, 
  ChevronRight, Plus, Minus, Star, Clock, ArrowLeft, 
  Pill, Check, CheckCircle, TrendingUp, Sparkles, X, ShoppingCart,
  FileText, UploadCloud, ArrowRight
} from 'lucide-react';
import { Button } from '../components/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { cn } from '../utils/cn';

// Categories matching Blinkit scroll behavior
const CATEGORIES = [
  'All',
  'First Aid',
  'Pain Relief',
  'Cold & Cough',
  'Vitamins',
  'Digestive Health',
  'Antibiotics',
  'Skin Care',
  'Personal Care'
];

export const Medicines = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, addToCart, updateQuantity, removeItem, cartCount, cartSubtotal } = useCart();

  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [address, setAddress] = useState('Flat 402, Block B, Green Glen Layout, Bangalore');
  const [showVoiceSimulation, setShowVoiceSimulation] = useState(false);
  const [voiceText, setVoiceText] = useState('Listening for symptoms or medicines...');
  
  // Camera Visual Search state
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [isScanningImage, setIsScanningImage] = useState(false);
  const [scanResultText, setScanResultText] = useState('');

  // Load and enrich mock data
  useEffect(() => {
    const fetchAndEnrichMedicines = async () => {
      try {
        setLoading(true);
        // Simulate networking delay for skeleton screens
        await new Promise(resolve => setTimeout(resolve, 600));

        // Attempt to fetch from Supabase, fallback to enriched mock data
        let baseMeds = [];
        try {
          const { data, error } = await supabase
            .from('medicines')
            .select('*');
          if (data && data.length > 0) {
            baseMeds = data;
          } else {
            baseMeds = mockMedicines;
          }
        } catch (dbErr) {
          baseMeds = mockMedicines;
        }

        // Enrich medicine objects with realistic retail styling attributes
        const enriched = baseMeds.map(med => {
          const seed = med.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          const brands = ['Cipla', 'Abbott', 'Dettol', 'Himalaya', 'Sun Pharma', 'Dr. Reddy\'s', 'GSK', 'Apollo Life'];
          const brand = brands[seed % brands.length];
          
          const strengths = ['10 Tablets', '150ml Liquid', '50g Gel', 'Pack of 1', '100g Spray', '15 Capsules'];
          const strength = strengths[seed % strengths.length];
          
          const discountPercent = (seed % 4) * 5 + 10; // 10%, 15%, 20%, 25%
          const originalPrice = parseFloat((med.price * (1 + discountPercent / 100)).toFixed(2));
          const rating = (4.1 + (seed % 9) * 0.1).toFixed(1);
          const deliveryTime = `${(seed % 3) * 5 + 10} mins`;
          
          return {
            ...med,
            brand,
            strength,
            discountPercent,
            originalPrice,
            rating,
            deliveryTime
          };
        });

        setMedicines(enriched);
      } catch (err) {
        console.error('Error fetching medicines:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndEnrichMedicines();
  }, []);

  // Fetch real user metadata address if exists
  useEffect(() => {
    const fetchUserAddress = async () => {
      if (user) {
        try {
          const { data } = await supabase
            .from('users')
            .select('address')
            .eq('id', user.id)
            .maybeSingle();
          if (data && data.address) {
            setAddress(data.address);
          }
        } catch (e) {
          // Keep default
        }
      }
    };
    fetchUserAddress();
  }, [user]);

  // Handle Voice Search Simulation
  const handleVoiceSearchClick = () => {
    setShowVoiceSimulation(true);
    setVoiceText('Listening for symptoms or medicines...');
    setTimeout(() => {
      setVoiceText('Recognized: "Paracetamol 500mg"');
      setTimeout(() => {
        setSearchQuery('Paracetamol');
        setShowVoiceSimulation(false);
      }, 1200);
    }, 1500);
  };

  // Handle Camera Image Visual Search Simulation
  const handleImageUpload = (file) => {
    if (!file) return;
    setIsScanningImage(true);
    setScanResultText('Scanning medicine strip image & extracting text...');
    setTimeout(() => {
      setScanResultText('AI OCR Recognized: "Cetirizine 10mg"');
      setTimeout(() => {
        setSearchQuery('Cetirizine');
        setIsScanningImage(false);
        setShowCameraModal(false);
        setScanResultText('');
      }, 1200);
    }, 1500);
  };

  // Filter medicines by Category & Search query
  const getFilteredMedicines = () => {
    return medicines.filter(med => {
      const matchesCategory = selectedCategory === 'All' || med.category === selectedCategory;
      const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            med.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            med.brand?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  // Add/Update quantities safely linked to Context
  const handleQuantityIncrement = (med) => {
    const cartItem = cartItems.find(item => item.id === med.id);
    if (cartItem) {
      updateQuantity(med.id, cartItem.quantity + 1);
    } else {
      addToCart({ ...med, quantity: 1 });
    }
  };

  const handleQuantityDecrement = (med) => {
    const cartItem = cartItems.find(item => item.id === med.id);
    if (cartItem) {
      if (cartItem.quantity === 1) {
        removeItem(med.id);
      } else {
        updateQuantity(med.id, cartItem.quantity - 1);
      }
    }
  };

  const filteredMeds = getFilteredMedicines();

  // Curated subsets based on id-modulo or ratings for rows
  const recentlyOrderedMeds = medicines.slice(0, 5);
  const recommendedMeds = medicines.slice(6, 12);
  const popularNearbyMeds = medicines.slice(13, 19);

  return (
    <div className="min-h-screen bg-[#F5F9FF] pb-32 font-sans relative overflow-x-hidden">
      
      {/* 1. Header Area */}
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-2 flex items-center justify-between gap-4">
        {/* Delivery Address */}
        <div className="flex items-center gap-2.5 max-w-[70%]">
          <div className="w-10 h-10 rounded-full bg-[#1565C0]/10 flex items-center justify-center flex-shrink-0">
            <MapPin className="text-[#1565C0]" size={20} />
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">Deliver To</p>
            <div className="flex items-center gap-1 cursor-pointer">
              <span className="text-sm font-extrabold text-gray-900 truncate">
                {address}
              </span>
              <ChevronRight size={14} className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* Action Badges */}
        <div className="flex items-center gap-3">
          {/* Notification Button */}
          <button className="w-10 h-10 rounded-xl bg-white border border-blue-50/80 flex items-center justify-center relative shadow-sm hover:bg-gray-50 active:scale-95 transition-all">
            <Bell size={18} className="text-gray-600" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E53935]"></span>
          </button>
        </div>
      </div>

      {/* 2. Sticky Search Bar (Wide & Prominent) */}
      <div className="sticky top-[73px] md:top-[88px] z-30 bg-[#F5F9FF]/95 backdrop-blur-md py-3 px-4 border-b border-blue-50/60 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center bg-white border border-blue-150 shadow-md px-4 py-3 rounded-2xl w-full focus-within:ring-2 focus-within:ring-[#1565C0]/20 transition-all">
          <Search className="text-[#1565C0] mr-3 flex-shrink-0" size={22} />
          <input 
            type="text" 
            placeholder="Search medicines, salts, or health products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none font-extrabold text-gray-900 placeholder:text-gray-400 placeholder:font-medium text-sm md:text-base"
          />
          <div className="flex items-center gap-2 border-l border-gray-150 pl-3 ml-2 flex-shrink-0">
            <button 
              onClick={() => setShowCameraModal(true)}
              className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-[#1565C0] px-3 py-1.5 rounded-xl font-black text-xs transition-all active:scale-95 cursor-pointer border border-blue-200"
              title="Camera Visual Search"
            >
              <Camera size={16} />
              <span className="hidden sm:inline">Photo Search</span>
            </button>
            <button 
              onClick={handleVoiceSearchClick}
              className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#2E7D32] px-3 py-1.5 rounded-xl font-black text-xs transition-all active:scale-95 cursor-pointer border border-emerald-200"
              title="Voice Search"
            >
              <Mic size={16} />
              <span className="hidden sm:inline">Voice</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 mt-4 space-y-8">

        {/* 3. Sleek Balanced Action Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card A: Prescription Uploader Banner */}
          <div className="bg-gradient-to-r from-[#1565C0] to-blue-800 text-white rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-md border border-blue-500/20 flex items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-[70%] relative z-10">
              <div className="inline-flex items-center gap-1 bg-white/20 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                <FileText size={10} className="text-blue-100" /> Have Doctor's Slip?
              </div>
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight">Upload Prescription</h2>
              <p className="text-blue-100 text-xs font-medium line-clamp-2">
                Upload slip for instant pharmacy stock quote & doorstep delivery.
              </p>
            </div>
            <Button 
              onClick={() => navigate('/prescription-upload')}
              className="bg-white text-[#1565C0] font-black rounded-xl text-xs uppercase tracking-wider py-2.5 px-3.5 shadow-sm border border-white hover:bg-blue-50 active:scale-95 transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0"
            >
              Upload <ArrowRight size={13} />
            </Button>
          </div>

          {/* Card B: AI Symptom Checker Banner */}
          <div className="bg-gradient-to-r from-[#2E7D32] to-emerald-800 text-white rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-md border border-emerald-500/20 flex items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-[70%] relative z-10">
              <div className="inline-flex items-center gap-1 bg-white/20 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                <Sparkles size={10} className="text-yellow-300" /> Don't Know Medicine Name?
              </div>
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight">AI Symptom Assistant</h2>
              <p className="text-emerald-100 text-xs font-medium line-clamp-2">
                Describe symptoms to get suggested medicines with pharmacist review.
              </p>
            </div>
            <Button 
              onClick={() => navigate('/symptom-checker?source=medicines')}
              className="bg-white text-[#2E7D32] font-black rounded-xl text-xs uppercase tracking-wider py-2.5 px-3.5 shadow-sm border border-white hover:bg-emerald-50 active:scale-95 transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0"
            >
              Check <ArrowRight size={13} />
            </Button>
          </div>

        </div>

        {/* 4. Medicine Categories Chips */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-wider">Browse Categories</h2>
          </div>
          <div className="flex overflow-x-auto gap-2.5 pb-2 no-scrollbar scroll-smooth">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-wider border transition-all duration-200 whitespace-nowrap cursor-pointer active:scale-95",
                    active 
                      ? "bg-[#1565C0] text-white border-[#1565C0] shadow-sm shadow-blue-500/20" 
                      : "bg-white text-gray-600 border-gray-150 hover:bg-gray-50"
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Main Filtered Products Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-wider">
              {selectedCategory === 'All' ? 'Featured Medicines' : `${selectedCategory} Store`}
            </h2>
            <span className="text-xs font-bold text-gray-400">
              {filteredMeds.length} Products
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-3">
                  <Skeleton className="w-full h-32 rounded-xl" />
                  <Skeleton className="w-16 h-3" />
                  <Skeleton className="w-3/4 h-5" />
                  <Skeleton className="w-full h-8 mt-auto" />
                </div>
              ))}
            </div>
          ) : filteredMeds.length === 0 ? (
            <div className="bg-white/80 border border-white/60 p-12 rounded-[2rem] text-center flex flex-col items-center justify-center max-w-md mx-auto shadow-sm">
              <Pill className="h-12 w-12 text-gray-300 mb-4 animate-bounce" />
              <p className="font-extrabold text-gray-800 text-lg">No products found</p>
              <p className="text-gray-500 text-sm mt-1 font-medium">Try clearing your filters or adjustment of search keywords.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="mt-5 text-[#1565C0] font-black text-xs uppercase tracking-wider hover:underline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filteredMeds.map((med) => {
                const cartItem = cartItems.find(item => item.id === med.id);
                const quantityInCart = cartItem ? cartItem.quantity : 0;

                return (
                  <div 
                    key={med.id} 
                    className="bg-white border border-blue-50/70 rounded-2xl p-3 flex flex-col relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
                  >
                    {/* Discount Badge */}
                    {med.discountPercent && (
                      <div className="absolute top-2.5 left-0 bg-[#E53935] text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-r-md shadow-sm z-10">
                        {med.discountPercent}% OFF
                      </div>
                    )}

                    {/* Delivery Time Badge */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-md px-1.5 py-0.5 shadow-sm text-[9px] font-bold text-gray-500">
                      <Clock size={10} className="text-[#2E7D32]" />
                      <span>{med.deliveryTime || '10 mins'}</span>
                    </div>

                    {/* Image Box */}
                    <div className="w-full h-32 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden mb-3 relative group-hover:bg-gray-100/50 transition-colors">
                      {med.images && med.images.length > 0 ? (
                        <img 
                          src={med.images[0]} 
                          alt={med.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/400x400/3b82f6/ffffff?text=Medicine';
                          }}
                        />
                      ) : (
                        <Pill size={32} className="text-gray-300" />
                      )}
                      
                      {/* Rx Badge */}
                      {med.requires_prescription && (
                        <div className="absolute bottom-1 right-1 bg-blue-50 text-[#1565C0] border border-blue-100 text-[8px] font-black px-1.5 py-0.5 rounded-md">
                          Rx Required
                        </div>
                      )}
                    </div>

                    {/* Brand */}
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider mb-0.5">
                      {med.brand || 'MediRush'}
                    </span>

                    {/* Title */}
                    <h3 className="text-sm font-extrabold text-gray-900 line-clamp-1 mb-1">
                      {med.name}
                    </h3>

                    {/* Strength */}
                    <span className="text-[11px] text-gray-500 font-bold mb-2">
                      {med.strength || '10 Tablets'}
                    </span>

                    {/* Rating */}
                    <div className="flex items-center gap-0.5 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded-md text-[9px] font-black text-gray-600 w-fit mb-3">
                      <Star size={10} className="fill-amber-400 text-amber-400" />
                      <span>{med.rating || '4.5'}</span>
                    </div>

                    {/* Pricing & Add Trigger */}
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
                      <div>
                        <span className="text-sm font-black text-gray-950">${med.price}</span>
                        {med.originalPrice && (
                          <span className="text-[10px] font-bold text-gray-400 line-through ml-1.5">${med.originalPrice}</span>
                        )}
                      </div>

                      {/* Add Button Incrementors (Blinkit style) */}
                      <div className="w-20 h-9 relative flex items-center justify-center">
                        {quantityInCart === 0 ? (
                          <button
                            onClick={() => handleQuantityIncrement(med)}
                            className="bg-white text-[#2E7D32] border border-[#2E7D32]/30 shadow-sm rounded-lg hover:bg-green-50/50 transition-all font-black text-xs w-full h-full flex items-center justify-center active:scale-95 cursor-pointer uppercase"
                          >
                            ADD
                            <Plus size={11} className="ml-1 text-[#2E7D32]" />
                          </button>
                        ) : (
                          <div className="bg-[#2E7D32] text-white rounded-lg shadow-sm w-full h-full flex items-center justify-between px-2 font-black text-xs select-none">
                            <button 
                              onClick={() => handleQuantityDecrement(med)} 
                              className="hover:scale-110 active:scale-90 font-bold p-1 cursor-pointer"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="font-extrabold text-sm">{quantityInCart}</span>
                            <button 
                              onClick={() => handleQuantityIncrement(med)} 
                              className="hover:scale-110 active:scale-90 font-bold p-1 cursor-pointer"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 6. Recently Ordered medicines */}
        {recentlyOrderedMeds.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <TrendingUp className="text-[#1565C0]" size={20} />
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-wider">Recently Ordered</h2>
            </div>
            <div className="flex overflow-x-auto gap-4 pb-2 no-scrollbar scroll-smooth">
              {recentlyOrderedMeds.map((med) => (
                <div 
                  key={`recent-${med.id}`}
                  className="bg-white border border-blue-50/50 rounded-2xl p-3 flex-shrink-0 w-36 flex flex-col relative"
                >
                  <div className="w-full h-24 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden mb-2">
                    <img 
                      src={med.images[0]} 
                      alt={med.name} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-xs font-extrabold text-gray-900 truncate mb-1">{med.name}</h3>
                  <span className="text-[10px] text-gray-400 font-bold mb-2">{med.brand}</span>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs font-black text-gray-950">${med.price}</span>
                    <button 
                      onClick={() => handleQuantityIncrement(med)}
                      className="bg-white border border-[#2E7D32]/30 text-[#2E7D32] hover:bg-green-50 p-1 px-2 rounded-md text-[9px] font-black uppercase tracking-wider cursor-pointer active:scale-95"
                    >
                      Reorder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. Recommended For You */}
        {recommendedMeds.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-[#2E7D32]" size={20} />
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-wider">Recommended For You</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {recommendedMeds.map((med) => {
                const cartItem = cartItems.find(item => item.id === med.id);
                const quantityInCart = cartItem ? cartItem.quantity : 0;
                return (
                  <div 
                    key={`rec-${med.id}`}
                    className="bg-white border border-blue-50/50 rounded-2xl p-3 flex flex-col relative"
                  >
                    <div className="w-full h-24 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden mb-2">
                      <img 
                        src={med.images[0]} 
                        alt={med.name} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="text-xs font-extrabold text-gray-900 line-clamp-1 mb-1">{med.name}</h3>
                    <span className="text-[10px] text-gray-400 font-bold mb-2">{med.strength}</span>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs font-black text-gray-950">${med.price}</span>
                      <button 
                        onClick={() => handleQuantityIncrement(med)}
                        className="bg-white border border-[#1565C0]/20 text-[#1565C0] hover:bg-blue-50/50 p-1 px-2 rounded-md text-[9px] font-black uppercase tracking-wider cursor-pointer active:scale-95"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 8. Popular Nearby */}
        {popularNearbyMeds.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="text-[#E53935]" size={20} />
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-wider">Popular Nearby</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {popularNearbyMeds.map((med) => {
                return (
                  <div 
                    key={`pop-${med.id}`}
                    className="bg-white border border-blue-50/50 rounded-2xl p-3 flex flex-col relative"
                  >
                    <div className="absolute top-1 right-1 bg-amber-50 text-amber-700 text-[8px] font-black px-1 rounded shadow-sm">
                      TRENDING
                    </div>
                    <div className="w-full h-24 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden mb-2">
                      <img 
                        src={med.images[0]} 
                        alt={med.name} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="text-xs font-extrabold text-gray-900 line-clamp-1 mb-1">{med.name}</h3>
                    <span className="text-[10px] text-gray-400 font-bold mb-2">{med.brand}</span>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs font-black text-gray-950">${med.price}</span>
                      <button 
                        onClick={() => handleQuantityIncrement(med)}
                        className="bg-white border border-[#1565C0]/20 text-[#1565C0] hover:bg-blue-50/50 p-1 px-2 rounded-md text-[9px] font-black uppercase tracking-wider cursor-pointer active:scale-95"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* 9. Floating Cart drawer (Blinkit Style) */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-lg z-50 bg-[#2E7D32] text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between border border-green-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-inner">
                <ShoppingCart size={20} className="text-white" />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-green-150">{cartCount} Item{cartCount > 1 ? 's' : ''} Added</p>
                <p className="text-base font-black">${cartSubtotal.toFixed(2)}</p>
              </div>
            </div>

            <button 
              onClick={() => navigate('/cart')}
              className="bg-white text-[#2E7D32] hover:bg-green-50 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-md flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
            >
              View Cart
              <ChevronRight size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Simulation Popup Modal */}
      <AnimatePresence>
        {showVoiceSimulation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 max-w-xs w-full text-center space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-gray-150">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Voice Assistant</h3>
                <button onClick={() => setShowVoiceSimulation(false)} className="text-gray-400 hover:text-gray-650 p-1 cursor-pointer"><X size={16} /></button>
              </div>
              <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center mx-auto animate-pulse">
                <Mic size={28} />
              </div>
              <p className="text-sm font-extrabold text-gray-800">{voiceText}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Try saying "Paracetamol" or "Cough syrup"</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Camera Visual Medicine Search Popup Modal */}
      <AnimatePresence>
        {showCameraModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 max-w-sm w-full space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-gray-150">
                <div className="flex items-center gap-2">
                  <Camera size={18} className="text-[#1565C0]" />
                  <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Visual Medicine Search</h3>
                </div>
                <button onClick={() => setShowCameraModal(false)} className="text-gray-400 hover:text-gray-650 p-1 cursor-pointer"><X size={16} /></button>
              </div>

              {!isScanningImage ? (
                <div className="space-y-4 text-center">
                  <label htmlFor="medicine-photo-upload" className="block cursor-pointer">
                    <div className="border-2 border-dashed border-blue-200 rounded-2xl p-6 bg-blue-50/50 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-[#1565C0]/10 text-[#1565C0] flex items-center justify-center">
                        <UploadCloud size={24} />
                      </div>
                      <p className="text-xs font-black text-gray-800">Snap or Upload Medicine Box/Strip</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">JPG, PNG · Auto Medicine Recognition</p>
                    </div>
                    <input 
                      id="medicine-photo-upload"
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleImageUpload(e.target.files?.[0])}
                    />
                  </label>

                  <div className="pt-2">
                    <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Or Try Quick Sample Image:</p>
                    <div className="flex justify-center gap-2">
                      {['Cetirizine 10mg', 'Paracetamol 500mg', 'Amoxicillin'].map((medName) => (
                        <button
                          key={medName}
                          onClick={() => {
                            setIsScanningImage(true);
                            setScanResultText(`Scanning sample image for ${medName}...`);
                            setTimeout(() => {
                              setScanResultText(`Recognized: "${medName}"`);
                              setTimeout(() => {
                                setSearchQuery(medName);
                                setIsScanningImage(false);
                                setShowCameraModal(false);
                                setScanResultText('');
                              }, 1000);
                            }, 1200);
                          }}
                          className="text-[10px] font-black bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-[#1565C0] px-2.5 py-1.5 rounded-lg border border-gray-200 transition-all cursor-pointer"
                        >
                          {medName}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center mx-auto animate-spin">
                    <Camera size={28} />
                  </div>
                  <p className="text-sm font-extrabold text-gray-800">{scanResultText}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Matching text with catalog...</p>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

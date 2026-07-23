import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/Button';
import { FileUpload } from '../components/FileUpload';
import { Skeleton } from '../components/ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { 
  ArrowLeft, Star, Clock, ShieldCheck, MapPin, AlertTriangle, 
  Minus, Plus, ShieldAlert, ShoppingBag, Store, FileText, ImageOff, ShoppingCart, CheckCircle
} from 'lucide-react';

// 1. IMPORT MOCK DATA
import { mockMedicines } from '../mockData/mockMedicines';
import { mockPharmacies } from '../mockData/mockPharmacies';
import { mockUsers } from '../mockData/mockUsers';

// 2. TOGGLE FLAG: Set to false when your backend is ready
const USE_MOCK_DATA = true;

export const MedicineDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const [medicine, setMedicine] = useState(null);
  const [pharmacy, setPharmacy] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [prescriptionFiles, setPrescriptionFiles] = useState([]);
  const [addedToCart, setAddedToCart] = useState(false);
  
  // Fallback image state
  const [imageError, setImageError] = useState(false);
  
  useEffect(() => {
    fetchData();
  }, [id, user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (USE_MOCK_DATA) {
        // --- FAKE DATA LOGIC ---
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const medData = mockMedicines.find(m => m.id === id);
        const userData = mockUsers.find(u => u.id === (user?.id || 'user-123')); 
        
        if (medData) {
          setMedicine(medData);
          const pharmData = mockPharmacies.find(p => p.id === medData.pharmacy_id);
          setPharmacy(pharmData);
          if (medData.images && medData.images.length > 0) {
            setMainImage(medData.images[0]);
          }
        }
        setUserProfile(userData);
      } else {
        // --- REAL SUPABASE DATA LOGIC ---
        if (!user) return; 

        const [medResponse, userResponse] = await Promise.all([
          supabase.from('medicines').select('*').eq('id', id).single(),
          supabase.from('users').select('*').eq('id', user.id).single()
        ]);

        if (medResponse.error) throw medResponse.error;
        
        const medData = medResponse.data;
        setMedicine(medData);
        setUserProfile(userResponse.data);
        
        if (medData.images && medData.images.length > 0) {
          setMainImage(medData.images[0]);
        }

        if (medData.pharmacy_id) {
          const { data: pharmData, error: pharmError } = await supabase
            .from('pharmacies')
            .select('*')
            .eq('id', medData.pharmacy_id)
            .single();
            
          if (!pharmError && pharmData) {
            setPharmacy(pharmData);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!canOrder) return;
    setAddedToCart(true);
    
    addToCart({
      id: medicine.id,
      name: medicine.name,
      price: medicine.price,
      image: mainImage || '',
      pharmacy_id: pharmacy?.id || '',
      pharmacy_name: pharmacy?.pharmacy_name || 'Pharmacy',
      quantity: quantity
    });
    
    setTimeout(() => setAddedToCart(false), 2000); // Reset after 2s
  };

  const handleOrderNow = () => {
    if (!canOrder) return;
    
    addToCart({
      id: medicine.id,
      name: medicine.name,
      price: medicine.price,
      image: mainImage || '',
      pharmacy_id: pharmacy?.id || '',
      pharmacy_name: pharmacy?.pharmacy_name || 'Pharmacy',
      quantity: quantity
    });
    
    navigate('/checkout');
  };

  const isPharmacyOwner = userProfile?.role === 'pharmacy';
  const isAvailable = medicine?.is_available;
  const isPharmacyOpen = pharmacy?.is_open;
  const canOrder = isAvailable && isPharmacyOpen && !isPharmacyOwner;
  const totalPrice = (medicine?.price * quantity).toFixed(2);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // --- LOADING SKELETON UI ---
  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20 font-sans pt-24 overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="w-40 h-10 rounded-xl mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Skeleton */}
            <div className="space-y-8">
              <div className="glass-card h-96 p-6">
                <Skeleton className="w-full h-full rounded-2xl" />
              </div>
              <div className="glass-card h-32 p-6">
                <Skeleton className="w-full h-full rounded-xl" />
              </div>
            </div>
            {/* Right Skeleton */}
            <div className="space-y-6">
              <div className="glass-card h-96 p-8 space-y-4">
                <Skeleton className="w-1/4 h-8 rounded-lg" />
                <Skeleton className="w-3/4 h-12 rounded-xl" />
                <Skeleton className="w-full h-[1px] my-6" />
                <Skeleton className="w-1/2 h-16 rounded-xl" />
                <Skeleton className="w-full h-16 rounded-xl mt-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- EMPTY STATE ---
  if (!medicine) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background pb-20 pt-20 overflow-x-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 flex flex-col items-center max-w-md text-center relative overflow-hidden"
        >
          <div className="absolute top-[-50%] right-[-50%] w-full h-full bg-orange-500/10 rounded-full blur-3xl"></div>
          
          <div className="bg-white/50 backdrop-blur-md p-6 rounded-full mb-6 shadow-inner border border-white/60">
            <AlertTriangle size={64} className="text-orange-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2 drop-shadow-sm">Medicine Not Found</h2>
          <p className="text-gray-600 font-medium mb-8">We couldn't find the medicine you're looking for. It may have been removed or the link is invalid.</p>
          <Button onClick={() => navigate('/medicines')} size="lg" className="w-full shadow-md">Browse Medicines</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 font-sans pt-24 overflow-x-hidden relative">
      
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        
        <motion.button 
          variants={itemVariants}
          onClick={() => navigate(-1)} 
          className="inline-flex items-center text-gray-700 hover:text-primary font-bold mb-8 transition-colors group bg-white/60 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-sm border border-white/40"
        >
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Medicines</span>
        </motion.button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* LEFT COLUMN: Gallery & Pharmacy */}
          <motion.div variants={itemVariants} className="space-y-8">
            
            <div className="glass-card p-6 border-white/60">
              <div className="aspect-square bg-white/40 backdrop-blur-sm rounded-2xl mb-4 overflow-hidden relative flex items-center justify-center shadow-inner">
                {mainImage && !imageError ? (
                  <motion.img 
                    key={mainImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    src={mainImage} 
                    alt={medicine.name} 
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)} 
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <ImageOff size={64} className="mb-2 opacity-50" />
                    <span className="font-medium text-sm">Image unavailable</span>
                  </div>
                )}
                
                {/* Floating Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className={cn(
                    "inline-flex items-center text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-sm border backdrop-blur-md",
                    isAvailable ? "bg-white/90 text-secondary border-white" : "bg-danger/10 text-danger border-danger/20"
                  )}>
                    {isAvailable ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
              
              {medicine.images && medicine.images.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                  {medicine.images.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => {
                        setMainImage(img);
                        setImageError(false); 
                      }}
                      className={cn(
                        "w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all shadow-sm",
                        mainImage === img ? "border-primary scale-105" : "border-white/50 opacity-70 hover:opacity-100"
                      )}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" onError={(e) => {e.target.style.display='none'}} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {pharmacy && (
              <div className="glass-card p-6 border-white/60 group">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Store size={20} className="mr-2 text-primary" /> Sold By
                </h3>
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-white/60 backdrop-blur-sm text-primary rounded-2xl flex items-center justify-center mr-4 shadow-inner border border-white/50 group-hover:bg-primary/10 transition-colors">
                    <Store size={28} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-gray-900 text-lg">{pharmacy.pharmacy_name}</h4>
                      <span className={cn(
                        "text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider border",
                        pharmacy.is_open ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"
                      )}>
                        {pharmacy.is_open ? 'Open Now' : 'Closed'}
                      </span>
                    </div>
                    <div className="flex items-center mt-1 space-x-3 text-sm font-medium text-gray-600">
                      <span className="flex items-center text-yellow-500 drop-shadow-sm">
                        <Star size={16} className="mr-1 fill-current" /> {pharmacy.rating || '4.8'}
                      </span>
                      {pharmacy.is_verified && (
                        <span className="flex items-center text-secondary">
                          <ShieldCheck size={16} className="mr-1" /> Verified Partner
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-2 flex items-center">
                      <MapPin size={14} className="mr-1 text-primary/70" /> 1.2 km away
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="glass-card bg-orange-50/80 border-orange-200/60 p-6 relative overflow-hidden">
               <AlertTriangle size={80} className="absolute -right-4 -bottom-4 text-orange-600 opacity-5 rotate-12" />
               <div className="flex items-start relative z-10">
                 <div className="bg-white/80 p-3 rounded-xl shadow-sm border border-orange-100 mr-4 flex-shrink-0">
                   <AlertTriangle className="text-orange-500" size={24} />
                 </div>
                 <div>
                   <h3 className="font-extrabold text-orange-900 text-lg mb-1 tracking-tight">Emergency Notice</h3>
                   <p className="text-sm text-orange-800 leading-relaxed font-medium opacity-90">
                     For serious symptoms, visit the nearest hospital or call emergency services immediately.
                   </p>
                 </div>
               </div>
            </div>

          </motion.div>

          {/* RIGHT COLUMN: Details & Action */}
          <motion.div variants={itemVariants} className="space-y-6">
            
            <div className="glass-card p-8 border-white/60">
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-primary/10 text-primary border border-primary/20 text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                  {medicine.category || 'Medicine'}
                </span>
                {medicine.requires_prescription && (
                  <span className="bg-purple-500/10 text-purple-600 border border-purple-500/20 text-xs font-bold px-3 py-1 rounded-lg flex items-center uppercase tracking-wider shadow-sm">
                    <FileText size={12} className="mr-1" /> Rx Required
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 drop-shadow-sm">{medicine.name}</h1>
              
              <div className="flex items-center space-x-2 mb-6">
                <span className={cn(
                  "w-3 h-3 rounded-full shadow-sm",
                  isAvailable ? "bg-secondary shadow-secondary/50 animate-pulseSoft" : "bg-danger shadow-danger/50"
                )}></span>
                <span className={cn(
                  "font-bold",
                  isAvailable ? "text-secondary" : "text-danger"
                )}>
                  {isAvailable ? 'In Stock Ready to Dispatch' : 'Currently Out of Stock'}
                </span>
              </div>

              <div className="h-px bg-gray-200/50 w-full my-6"></div>

              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-gray-500 font-bold mb-1 uppercase tracking-widest text-[10px]">Total Price</p>
                  <div className="flex items-baseline text-primary drop-shadow-sm">
                    <span className="text-2xl font-bold mr-1">$</span>
                    <span className="text-5xl font-extrabold tracking-tight">{totalPrice}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-700 flex items-center justify-end">
                    <Clock size={16} className="mr-1 text-primary" /> Delivery in ~10 mins
                  </p>
                  <p className="text-[11px] text-gray-500 font-medium mt-1 uppercase tracking-wider">+$2.99 Delivery Charge</p>
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">Quantity</label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center bg-white/60 backdrop-blur-md rounded-xl border border-white/50 p-1 shadow-sm">
                    <button 
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all active:scale-95"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="w-12 text-center font-extrabold text-xl text-gray-900">{quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= 10}
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all active:scale-95"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">Max 10 per order</span>
                </div>
              </div>

              <AnimatePresence>
                {medicine.requires_prescription && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-8 p-5 bg-purple-500/10 backdrop-blur-sm rounded-2xl border border-purple-500/20"
                  >
                    <div className="flex items-center mb-4 text-purple-700">
                      <ShieldAlert size={20} className="mr-2" />
                      <h4 className="font-bold">Prescription Required</h4>
                    </div>
                    <FileUpload 
                      maxFiles={1} 
                      onChange={(files) => setPrescriptionFiles(files)}
                      className="bg-white/60 border-white/50"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant={addedToCart ? "glass" : "outline"}
                  size="lg" 
                  className={cn(
                    "flex-1 py-5 text-lg rounded-2xl flex items-center justify-center transition-all",
                    addedToCart ? "border-green-500 text-green-600 bg-green-50/50 hover:bg-green-50/80" : "bg-white/60 backdrop-blur-md"
                  )}
                  disabled={!canOrder || (medicine.requires_prescription && prescriptionFiles.length === 0)}
                  onClick={handleAddToCart}
                >
                  {addedToCart ? (
                    <><CheckCircle size={20} className="mr-2" /> Added</>
                  ) : (
                    <><ShoppingCart size={20} className="mr-2" /> Add to Cart</>
                  )}
                </Button>
                
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={handleOrderNow}
                  className="flex-1 py-5 text-lg rounded-2xl shadow-lg shadow-primary/30"
                  disabled={!canOrder || (medicine.requires_prescription && prescriptionFiles.length === 0)}
                >
                  {isPharmacyOwner ? 'Pharmacies cannot order' 
                   : !isPharmacyOpen ? 'Pharmacy Closed'
                   : !isAvailable ? 'Out of Stock' 
                   : medicine.requires_prescription && prescriptionFiles.length === 0 ? 'Upload Rx to Order'
                   : `Order Now - $${totalPrice}`}
                </Button>
              </div>
            </div>

            <div className="glass-card p-8 border-white/60">
              <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200/50 pb-4">Product Details</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">Description</h4>
                  <p className="text-gray-600 font-medium leading-relaxed opacity-90">
                    {medicine.description || 'No description provided by the pharmacy.'}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-inner">
                    <h4 className="font-bold text-gray-800 mb-1 text-[10px] uppercase tracking-widest text-primary">Usage</h4>
                    <p className="text-gray-700 font-medium text-sm">Take as directed by your healthcare provider.</p>
                  </div>
                  <div className="bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-inner">
                    <h4 className="font-bold text-gray-800 mb-1 text-[10px] uppercase tracking-widest text-primary">Storage</h4>
                    <p className="text-gray-700 font-medium text-sm">Store in a cool, dry place away from sunlight.</p>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

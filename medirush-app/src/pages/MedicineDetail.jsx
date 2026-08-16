import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  Minus, Plus, ShieldAlert, ShoppingBag, Store, FileText, ImageOff, 
  ShoppingCart, CheckCircle, Share2, Heart, Info, Pill, Truck, Check, Sparkles, ChevronRight
} from 'lucide-react';

// Import Mock Data & Full Dataset Resolver
import { mockMedicines } from '../mockData/mockMedicines';
import { mockPharmacies } from '../mockData/mockPharmacies';
import { mockUsers } from '../mockData/mockUsers';
import { findMedicineById, loadAll250kMedicines } from '../utils/medicineData';

const USE_MOCK_DATA = true;

// Category & Salt-Specific Medical Details Generator
function getMedicineMedicalDetails(med) {
  const name = (med.name || '').toLowerCase();
  const cat = (med.category || '').toLowerCase();
  const salt = (med.genericName || med.salt_composition || '').toLowerCase();
  const desc = (med.description || '').toLowerCase();
  const combinedText = `${name} ${cat} ${salt} ${desc}`;

  // 1. Pain Relief, Fever, Spasms & Antispasmodics (Anafortan, Paracetamol, Camylofin, Dolo, Crocin, Meftal, Diclofenac, Aceclofenac, Ibuprofen, etc.)
  if (
    combinedText.includes('fever') || combinedText.includes('bukhar') || combinedText.includes('paracetamol') ||
    combinedText.includes('camylofin') || combinedText.includes('anafortan') || combinedText.includes('dolo') ||
    combinedText.includes('crocin') || combinedText.includes('combiflam') || combinedText.includes('aceclofenac') ||
    combinedText.includes('diclofenac') || combinedText.includes('ibuprofen') || combinedText.includes('nimesulide') ||
    combinedText.includes('dicyclomine') || combinedText.includes('meftal') || combinedText.includes('disprin') ||
    combinedText.includes('saridon') || combinedText.includes('headache') || combinedText.includes('sardard') ||
    combinedText.includes('body pain') || combinedText.includes('spasm') || combinedText.includes('antispasmodic') ||
    combinedText.includes('cramps') || cat === 'pain relief'
  ) {
    const isAntispasmodic = combinedText.includes('camylofin') || combinedText.includes('dicyclomine') || combinedText.includes('anafortan') || combinedText.includes('spasm') || combinedText.includes('cramps');
    return {
      uses: isAntispasmodic ? [
        'Abdominal Cramps & Spasmodic Muscle Pain Relief',
        'Fever & Mild-to-Moderate Body Pain Reduction',
        'Stomach & Intestinal Smooth Muscle Relaxation',
        'General Pain & Inflammatory Discomfort Management'
      ] : [
        'Fever & High Body Temperature Reduction',
        'Headache, Joint & Body Ache Relief',
        'Mild-to-Moderate Inflammatory Soreness',
        'General Pain & Temperature Management'
      ],
      dosageInstructions: med.dosageInstructions || 'Take 1 tablet with water after meals every 6 to 8 hours as needed. Do not exceed recommended dosage.',
      sideEffects: [
        'Dryness in Mouth (for antispasmodics)',
        'Mild Gastric Fullness or Nausea',
        'Light Drowsiness or Dizziness',
        'Transient Constipation'
      ],
      precautions: [
        'Do not exceed 4000mg of Paracetamol daily from all sources.',
        'Avoid consuming alcohol while on pain & fever therapy.',
        'Inform doctor if you have severe kidney or liver impairment.',
        'Store in a cool, dry place below 30°C.'
      ]
    };
  }

  // 2. Cold & Cough / Syrup / Throat
  if (combinedText.includes('cough') || combinedText.includes('khasi') || combinedText.includes('syrup') || combinedText.includes('cold') || combinedText.includes('throat') || combinedText.includes('ascoril') || combinedText.includes('benadryl') || combinedText.includes('alex') || combinedText.includes('cheston') || combinedText.includes('sinarest') || combinedText.includes('ambroxol') || combinedText.includes('cetirizine') || combinedText.includes('montelukast')) {
    return {
      uses: [
        'Dry & Wet Cough Relief',
        'Sore Throat & Vocal Cord Irritation',
        'Chest & Nasal Airway Congestion',
        'Allergic Sneezing & Watery Eyes'
      ],
      dosageInstructions: med.dosageInstructions || 'Take 10ml (2 teaspoons) 2 to 3 times a day after meals, or 1 tablet daily at bedtime. Shake bottle well before use.',
      sideEffects: [
        'Mild Drowsiness or Sleepiness',
        'Dryness in Mouth & Throat',
        'Light Dizziness or Nausea (rare)',
        'Mild Gastric Discomfort'
      ],
      precautions: [
        'Avoid driving or operating heavy machinery if drowsy.',
        'Avoid alcohol intake during cough therapy.',
        'Store below 25°C away from direct sunlight.'
      ]
    };
  }

  // 3. Acidity, Heartburn & GERD (Strict Antacids - require specific antacid keywords)
  if (combinedText.includes('acid') || combinedText.includes('heartburn') || combinedText.includes('gerd') || combinedText.includes('pantoprazole') || combinedText.includes('omeprazole') || combinedText.includes('rabeprazole') || combinedText.includes('digene') || combinedText.includes('gelusil') || combinedText.includes('eno') || combinedText.includes('pan 40') || combinedText.includes('pudin') || combinedText.includes('aciloc') || combinedText.includes('antacid') || combinedText.includes('ulcer')) {
    return {
      uses: [
        'Acidity, Heartburn & GERD Relief',
        'Stomach Gas & Abdominal Bloating',
        'Gastric & Duodenal Ulcer Healing',
        'Indigestion & Sour Stomach Fullness'
      ],
      dosageInstructions: med.dosageInstructions || 'Take 1 capsule 30 minutes before morning breakfast with plain water. For antacid liquids, take 2 teaspoons after meals.',
      sideEffects: [
        'Mild Headache',
        'Flatulence or Mild Diarrhea (rare)',
        'Abdominal Fullness',
        'Dry Mouth'
      ],
      precautions: [
        'Swallow capsule whole without chewing or crushing.',
        'Avoid oily, heavily spiced, and late-night meals.',
        'Consult doctor if acid symptoms persist beyond 14 days.'
      ]
    };
  }

  // 3. Skin Care / Cream / Ointment / Gel / Antiseptic
  if (combinedText.includes('cream') || combinedText.includes('gel') || combinedText.includes('skin') || combinedText.includes('ointment') || combinedText.includes('betadine') || combinedText.includes('candid') || combinedText.includes('ketoconazole') || combinedText.includes('clotrimazole') || combinedText.includes('acne') || combinedText.includes('pimple') || combinedText.includes('fungal')) {
    return {
      uses: [
        'Fungal & Bacterial Skin Infections',
        'Acne, Pimples & Facial Blemishes',
        'Skin Rash, Redness & Intense Itching',
        'Minor Cuts, Wounds & Burn Healing'
      ],
      dosageInstructions: med.dosageInstructions || 'Clean and dry the affected area gently. Apply a thin layer 2 times daily. Wash hands before and after application.',
      sideEffects: [
        'Mild Local Burning or Tingling Sensation',
        'Temporary Skin Dryness or Peeling',
        'Redness at Application Site (rare)'
      ],
      precautions: [
        'For external topical application only.',
        'Keep away from eyes, nostrils, and deep open wounds.',
        'Discontinue use if severe skin allergic reaction occurs.'
      ]
    };
  }

  // 4. Diabetes Care
  if (combinedText.includes('diabet') || combinedText.includes('sugar') || combinedText.includes('metformin') || combinedText.includes('glimepiride') || combinedText.includes('vildagliptin') || combinedText.includes('insulin') || combinedText.includes('teneligliptin')) {
    return {
      uses: [
        'Type-2 Diabetes Blood Sugar Control',
        'Post-Meal Glucose Spike Prevention',
        'Insulin Sensitivity Optimization',
        'Long-term Diabetic Complication Prevention'
      ],
      dosageInstructions: med.dosageInstructions || 'Take 1 tablet daily during or immediately after morning breakfast as advised by your physician.',
      sideEffects: [
        'Mild Hypoglycemia (Low Sugar if meal skipped)',
        'Nausea or Metallic Taste (initial days)',
        'Mild Abdominal Gas'
      ],
      precautions: [
        'Monitor blood glucose levels regularly.',
        'Keep candy/glucose powder handy for low sugar episodes.',
        'Do not skip meals while on diabetic therapy.'
      ]
    };
  }

  // 5. Cardiac Care & BP
  if (combinedText.includes('bp') || combinedText.includes('cardiac') || combinedText.includes('heart') || combinedText.includes('telmisartan') || combinedText.includes('atorvastatin') || combinedText.includes('amlodipine') || combinedText.includes('rosuvastatin')) {
    return {
      uses: [
        'High Blood Pressure (Hypertension) Management',
        'Bad Cholesterol (LDL) & Triglyceride Control',
        'Heart Attack & Stroke Risk Reduction',
        'Arterial Health & Blood Flow Protection'
      ],
      dosageInstructions: med.dosageInstructions || 'Take 1 tablet once daily at the same fixed time every morning with water as prescribed.',
      sideEffects: [
        'Mild Ankle Swelling',
        'Dizziness upon standing quickly',
        'Mild Fatigue in initial weeks'
      ],
      precautions: [
        'Do not stop medication abruptly.',
        'Maintain low-sodium (low salt) diet.',
        'Check blood pressure weekly.'
      ]
    };
  }

  // 6. Antibiotics
  if (combinedText.includes('antibiotic') || combinedText.includes('amoxicillin') || combinedText.includes('azithromycin') || combinedText.includes('cefixime') || combinedText.includes('augmentin') || combinedText.includes('ciprofloxacin') || combinedText.includes('zifi') || combinedText.includes('taxim')) {
    return {
      uses: [
        'Bacterial Respiratory & ENT Infections',
        'Urinary Tract (UTI) Bacterial Control',
        'Skin & Soft Tissue Bacterial Infections',
        'Post-Surgical Bacterial Contamination Prevention'
      ],
      dosageInstructions: med.dosageInstructions || 'Take 1 tablet twice daily after meals every 12 hours for the complete course prescribed by your doctor.',
      sideEffects: [
        'Mild Diarrhea or Soft Stools',
        'Stomach Discomfort or Nausea',
        'Temporary Alteration of Taste'
      ],
      precautions: [
        'Complete full course; do not stop early even if feeling better.',
        'Take strictly under medical prescription.',
        'Inform doctor of any penicillin allergies.'
      ]
    };
  }

  // 7. Vitamins & Supplements
  if (combinedText.includes('vitamin') || combinedText.includes('calcium') || combinedText.includes('zinc') || combinedText.includes('becosules') || combinedText.includes('shelcal') || combinedText.includes('zincovit') || combinedText.includes('revital') || combinedText.includes('evion') || combinedText.includes('neurobion')) {
    return {
      uses: [
        'Nutritional Vitamin & Mineral Deficiency',
        'Daily Immunity & Stamina Enhancement',
        'Bone Strength & Calcium Absorption',
        'Nerve Health & Hemoglobin Support'
      ],
      dosageInstructions: med.dosageInstructions || 'Take 1 capsule/tablet daily after lunch or dinner with a glass of water.',
      sideEffects: [
        'Bright Yellow Urine (Harmless B-vitamin excretion)',
        'Mild Gastric Fullness'
      ],
      precautions: [
        'Do not exceed daily recommended dietary allowance.',
        'Store in a cool dry place away from heat.',
        'Keep out of reach of children.'
      ]
    };
  }

  // 8. Eye / Ear / Nasal Drops
  if (combinedText.includes('drop') || combinedText.includes('nasal') || combinedText.includes('spray') || combinedText.includes('eye') || combinedText.includes('ear')) {
    return {
      uses: [
        'Eye Dryness, Redness & Strain Relief',
        'Nasal Congestion & Blocked Nose Clearing',
        'Allergic Itching & Irritation Relief',
        'Ophthalmic / ENT Hygiene & Moisturization'
      ],
      dosageInstructions: med.dosageInstructions || 'Instill 1 to 2 drops into affected eye/ear or 1 spray per nostril 2 to 3 times daily as prescribed.',
      sideEffects: [
        'Mild Temporary Stinging or Burning',
        'Temporary Blurry Vision (Eye Drops)'
      ],
      precautions: [
        'Do not touch dropper/nozzle tip to skin or eye surface.',
        'Discard bottle 30 days after opening container.',
        'Remove contact lenses before eye drop application.'
      ]
    };
  }

  // 9. First Aid
  if (combinedText.includes('dettol') || combinedText.includes('bandage') || combinedText.includes('first aid') || combinedText.includes('savlon') || combinedText.includes('cotton')) {
    return {
      uses: [
        'Antiseptic Disinfection of Cuts & Scraps',
        'Wound Protection & Bandaging',
        'Medical Dressing & Microbial Barrier',
        'First Aid Hygiene Cleansing'
      ],
      dosageInstructions: med.dosageInstructions || 'Apply diluted liquid to wound using sterile cotton, or wrap bandage firmly over injured area.',
      sideEffects: [
        'Mild Local Stinging on Broken Skin'
      ],
      precautions: [
        'For external hygiene & first aid use only.',
        'Avoid contact with eyes.',
        'Consult doctor if wound is deep or bleeding heavily.'
      ]
    };
  }

  // 10. Default Pain Relief & Fever
  return {
    uses: [
      'Fever & High Body Temperature Reduction',
      'Headache & Body Pain Relief',
      'Mild Inflammatory & Muscle Soreness',
      'General Pain Management'
    ],
    dosageInstructions: med.dosageInstructions || 'Take 1 tablet with water after meals every 6 to 8 hours as needed. Do not exceed recommended dosage.',
    sideEffects: [
      'Mild Stomach Upset or Heartburn',
      'Drowsiness or Dizziness (rare)',
      'Skin Rash (discontinue if allergic)'
    ],
    precautions: [
      'Avoid consuming alcohol while taking medication.',
      'Consult doctor if pre-existing liver/kidney conditions exist.',
      'Pregnancy & Lactation: Take under medical advice.'
    ]
  };
}

export const MedicineDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, addToCart, updateQuantity } = useCart();
  
  const [medicine, setMedicine] = useState(null);
  const [pharmacy, setPharmacy] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [prescriptionFiles, setPrescriptionFiles] = useState([]);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // overview, dosage, sideEffects, manufacturer
  const [copiedLink, setCopiedLink] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  useEffect(() => {
    fetchData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. Attempt to find medicine from mockMedicines or full 253k dataset
      let medData = findMedicineById(id);
      
      // 2. If not found in memory, load full 253,973 dataset asynchronously and search
      if (!medData) {
        const fullList = await loadAll250kMedicines();
        medData = findMedicineById(id) || fullList.find(m => m.id === id || m.id === `med-${id}`);
      }

      if (!medData && mockMedicines.length > 0) {
        medData = mockMedicines[0];
      }

      // 3. Fallback: Real Supabase lookup if configured
      if (!medData && !USE_MOCK_DATA) {
        try {
          const { data } = await supabase.from('medicines').select('*').eq('id', id).single();
          if (data) medData = data;
        } catch (e) {
          console.warn("Supabase medicine detail fetch error:", e);
        }
      }

      // Enrich Medicine Object with Realistic Retail & Medical Specs
      if (medData) {
        const medicalDetails = getMedicineMedicalDetails(medData);
        const medIdNum = parseInt(String(medData.id || '1').replace('med-', ''), 10) || 1;
        const expMonth = ((medIdNum % 12) + 1).toString().padStart(2, '0');
        const expYear = 2027 + (medIdNum % 3);

        const enrichedMed = {
          ...medData,
          brand: medData.brand || medData.manufacturer_name || 'Indian Healthcare Ltd',
          strength: medData.strength || medData.pack_size_label || 'strip of 10 tablets',
          genericName: medData.genericName || medData.salt_composition || 'Active Pharmaceutical Ingredient',
          rating: medData.rating || (4.2 + (medIdNum % 8) * 0.1).toFixed(1),
          reviewCount: medData.reviewCount || (50 + (medIdNum * 7) % 400),
          deliveryTime: medData.deliveryTime || `${(medIdNum % 3) * 5 + 10} mins`,
          discountPercent: medData.discountPercent || ((medIdNum % 4) * 5 + 10),
          originalPrice: medData.originalPrice || parseFloat((medData.price * 1.25).toFixed(2)),
          manufacturer: medData.manufacturer_name || medData.brand || 'Indian Healthcare Ltd.',
          expiryDate: medData.expiryDate || `${expMonth}/${expYear}`,
          batchNumber: medData.batchNumber || `BN-${(800000 + (medIdNum * 37) % 199999)}`,
          uses: medData.uses || medicalDetails.uses,
          dosageInstructions: medData.dosageInstructions || medicalDetails.dosageInstructions,
          sideEffects: Array.isArray(medData.sideEffects) ? medData.sideEffects : medicalDetails.sideEffects,
          precautions: medData.precautions || medicalDetails.precautions,
          images: medData.images && medData.images.length > 0 ? medData.images : [
            'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80'
          ]
        };

        setMedicine(enrichedMed);
        setMainImage(enrichedMed.images[0]);

        // Find associated Pharmacy
        const pharmData = mockPharmacies.find(p => p.id === enrichedMed.pharmacy_id) || mockPharmacies[0];
        setPharmacy(pharmData);

        // Sync initial quantity selector with Cart if item already in cart
        const existingInCart = cartItems.find(i => i.id === enrichedMed.id);
        if (existingInCart && existingInCart.quantity) {
          setQuantity(existingInCart.quantity);
        }
      }

      const userData = mockUsers.find(u => u.id === (user?.id || 'user-123')); 
      setUserProfile(userData);

    } catch (error) {
      console.error('Error fetching details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sync quantity if cartItems change externally
  useEffect(() => {
    if (medicine && cartItems) {
      const existingInCart = cartItems.find(i => i.id === medicine.id);
      if (existingInCart && existingInCart.quantity) {
        setQuantity(existingInCart.quantity);
      }
    }
  }, [cartItems, medicine?.id]);

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
      
      // If item is already in cart, update cart quantity live!
      const existingInCart = cartItems.find(i => i.id === medicine?.id);
      if (existingInCart) {
        updateQuantity(medicine.id, newQuantity);
      }
    }
  };

  const handleAddToCart = () => {
    if (!medicine || !canOrder) return;
    setAddedToCart(true);
    
    const existingInCart = cartItems.find(i => i.id === medicine.id);
    if (existingInCart) {
      updateQuantity(medicine.id, quantity);
    } else {
      addToCart({
        id: medicine.id,
        name: medicine.name,
        price: medicine.price,
        image: mainImage || medicine.images?.[0] || '',
        pharmacy_id: pharmacy?.id || '',
        pharmacy_name: pharmacy?.pharmacy_name || 'Verified Pharmacy',
        quantity: quantity
      });
    }
    
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleOrderNow = () => {
    if (!medicine || !canOrder) return;
    
    const existingInCart = cartItems.find(i => i.id === medicine.id);
    if (existingInCart) {
      updateQuantity(medicine.id, quantity);
    } else {
      addToCart({
        id: medicine.id,
        name: medicine.name,
        price: medicine.price,
        image: mainImage || medicine.images?.[0] || '',
        pharmacy_id: pharmacy?.id || '',
        pharmacy_name: pharmacy?.pharmacy_name || 'Verified Pharmacy',
        quantity: quantity
      });
    }
    
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: medicine?.name,
        text: `Buy ${medicine?.name} on MediRush with 10-minute delivery!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const isPharmacyOwner = userProfile?.role === 'pharmacy';
  const isAvailable = medicine?.is_available !== false;
  const isPharmacyOpen = pharmacy?.is_open !== false;
  const canOrder = isAvailable && isPharmacyOpen && !isPharmacyOwner;
  const totalPrice = (medicine?.price * quantity).toFixed(2);

  // Substitute/Similar medicines
  const substituteMedicines = mockMedicines
    .filter(m => m.id !== id)
    .slice(0, 4);

  // Loading Skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F9FF] pb-20 font-sans pt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Skeleton className="w-48 h-8 rounded-xl mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="w-full h-96 rounded-3xl" />
            <div className="space-y-4">
              <Skeleton className="w-3/4 h-10 rounded-xl" />
              <Skeleton className="w-1/2 h-6 rounded-lg" />
              <Skeleton className="w-full h-32 rounded-2xl" />
              <Skeleton className="w-full h-14 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="min-h-screen bg-[#F5F9FF] flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md text-center shadow-xl border border-blue-50 space-y-4">
          <AlertTriangle size={48} className="text-amber-500 mx-auto" />
          <h2 className="text-2xl font-black text-gray-900">Medicine Not Found</h2>
          <p className="text-sm text-gray-500 font-medium">The requested medicine catalog item does not exist or may have been updated.</p>
          <Button onClick={() => navigate('/medicines')} className="bg-[#1565C0] text-white font-black w-full rounded-xl py-3">
            Browse All Medicines
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F9FF] pb-32 pt-20 md:pt-24 font-sans relative overflow-x-hidden">
      
      {/* Top Breadcrumb & Actions Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
          
          {/* Back Button */}
          <button 
            onClick={() => navigate('/medicines')} 
            className="inline-flex items-center text-gray-700 hover:text-[#1565C0] font-black text-xs uppercase tracking-wider transition-all bg-white hover:bg-blue-50 px-3.5 py-2 rounded-xl shadow-sm border border-blue-100 cursor-pointer active:scale-95"
          >
            <ArrowLeft size={16} className="mr-1.5" />
            <span>Back to Medicines</span>
          </button>

          {/* Breadcrumb Links */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-gray-400">
            <Link to="/home" className="hover:text-[#1565C0]">Home</Link>
            <ChevronRight size={12} />
            <Link to="/medicines" className="hover:text-[#1565C0]">Medicines</Link>
            <ChevronRight size={12} />
            <span className="text-gray-800 font-extrabold truncate max-w-[150px]">{medicine.name}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={cn(
                "p-2.5 rounded-xl border transition-all cursor-pointer shadow-sm active:scale-95",
                isWishlisted ? "bg-red-50 border-red-200 text-red-500" : "bg-white border-gray-200 text-gray-500 hover:text-gray-800"
              )}
              title="Save to Wishlist"
            >
              <Heart size={18} className={isWishlisted ? "fill-current" : ""} />
            </button>
            <button
              onClick={handleShare}
              className="p-2.5 bg-white border border-gray-200 text-gray-500 hover:text-gray-800 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 relative"
              title="Share Medicine"
            >
              <Share2 size={18} />
              {copiedLink && (
                <span className="absolute -bottom-8 right-0 bg-black text-white text-[9px] font-black px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
                  Link Copied!
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Product Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT 5 COLS: Gallery & Pharmacy Seller Info */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Main Product Card Gallery */}
            <div className="bg-white rounded-3xl p-5 shadow-lg border border-blue-50/80 space-y-4">
              
              {/* Main Image Box */}
              <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden relative flex items-center justify-center border border-gray-100 group">
                
                {/* Discount Badge */}
                {medicine.discountPercent && (
                  <div className="absolute top-3 left-0 bg-[#E53935] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-r-lg shadow-md z-10">
                    {medicine.discountPercent}% OFF
                  </div>
                )}

                {/* Rx Badge */}
                {medicine.requires_prescription && (
                  <div className="absolute top-3 right-3 bg-purple-100 text-purple-700 border border-purple-200 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg z-10 flex items-center gap-1 shadow-sm">
                    <FileText size={12} /> Rx Required
                  </div>
                )}

                {mainImage && !imageError ? (
                  <img 
                    src={mainImage} 
                    alt={medicine.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={() => setImageError(true)} 
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-300">
                    <Pill size={64} className="mb-2" />
                    <span className="text-xs font-bold">Image Preview</span>
                  </div>
                )}
              </div>

              {/* Thumbnails Strip */}
              {medicine.images && medicine.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {medicine.images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setMainImage(imgUrl);
                        setImageError(false);
                      }}
                      className={cn(
                        "w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer",
                        mainImage === imgUrl ? "border-[#1565C0] shadow-md scale-105" : "border-gray-200 opacity-60 hover:opacity-100"
                      )}
                    >
                      <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-center">
                <div className="p-2 bg-blue-50/50 rounded-xl">
                  <ShieldCheck size={18} className="text-[#1565C0] mx-auto mb-1" />
                  <p className="text-[9px] font-black uppercase tracking-wider text-gray-700">100% Genuine</p>
                </div>
                <div className="p-2 bg-emerald-50/50 rounded-xl">
                  <Truck size={18} className="text-[#2E7D32] mx-auto mb-1" />
                  <p className="text-[9px] font-black uppercase tracking-wider text-gray-700">10 Min Delivery</p>
                </div>
                <div className="p-2 bg-amber-50/50 rounded-xl">
                  <CheckCircle size={18} className="text-amber-600 mx-auto mb-1" />
                  <p className="text-[9px] font-black uppercase tracking-wider text-gray-700">Verified Pharmacy</p>
                </div>
              </div>

            </div>

            {/* Partner Pharmacy Seller Card */}
            {pharmacy && (
              <div className="bg-white rounded-3xl p-5 shadow-lg border border-blue-50/80 space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Store size={18} className="text-[#1565C0]" />
                    <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider">Fulfilled By Partner Pharmacy</h3>
                  </div>
                  <span className={cn(
                    "text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border",
                    pharmacy.is_open ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"
                  )}>
                    {pharmacy.is_open ? 'Open Now' : 'Closed'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-extrabold text-gray-900">{pharmacy.pharmacy_name}</h4>
                    <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-0.5">
                      <MapPin size={12} className="text-[#E53935]" /> 1.2 km away · Green Glen Layout
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl text-xs font-black text-amber-700">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <span>{pharmacy.rating || '4.8'}</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT 7 COLS: Details, Pricing, Cart & Medical Specs */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-blue-50/80 space-y-6">
              
              {/* Brand & Category Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-[#1565C0] bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                    {medicine.brand}
                  </span>
                  <span className="text-xs font-extrabold text-gray-500 flex items-center gap-1">
                    <Clock size={14} className="text-[#2E7D32]" /> Delivery in {medicine.deliveryTime}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight leading-snug">
                  {medicine.name}
                </h1>

                <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                  Active Salt: <span className="text-gray-700">{medicine.genericName}</span> · {medicine.strength}
                </p>

                {/* Rating & Reviews Bar */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black px-2.5 py-1 rounded-lg">
                    <Star size={13} className="fill-emerald-600 text-emerald-600" />
                    <span>{medicine.rating}</span>
                  </div>
                  <span className="text-xs font-extrabold text-gray-500">
                    ({medicine.reviewCount} Ratings & Verified Reviews)
                  </span>
                </div>
              </div>

              <div className="h-px bg-gray-150 w-full" />

              {/* Pricing & Stock Status */}
              <div className="flex flex-wrap items-baseline justify-between gap-4 bg-blue-50/40 p-4 rounded-2xl border border-blue-100">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Price</p>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-black text-gray-950">₹{totalPrice}</span>
                    {medicine.originalPrice && (
                      <span className="text-sm font-bold text-gray-400 line-through">₹{(medicine.originalPrice * quantity).toFixed(2)}</span>
                    )}
                    {medicine.discountPercent && (
                      <span className="text-xs font-black text-[#E53935] bg-red-100 px-2 py-0.5 rounded-md">
                        Save {medicine.discountPercent}%
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold mt-1">Inclusive of all government pharmaceutical taxes</p>
                </div>

                <div className="text-right">
                  <span className={cn(
                    "text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border inline-block",
                    isAvailable ? "bg-emerald-100 text-emerald-800 border-emerald-300" : "bg-red-100 text-red-800 border-red-300"
                  )}>
                    {isAvailable ? '✓ In Stock Ready' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-500 block">
                  Select Order Quantity
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-gray-100 border border-gray-200 rounded-2xl p-1 shadow-inner">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-xl bg-white text-gray-700 shadow-sm flex items-center justify-center font-bold disabled:opacity-40 hover:bg-gray-50 transition-all cursor-pointer active:scale-95"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-black text-lg text-gray-900">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= 10}
                      className="w-10 h-10 rounded-xl bg-white text-gray-700 shadow-sm flex items-center justify-center font-bold disabled:opacity-40 hover:bg-gray-50 transition-all cursor-pointer active:scale-95"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="text-xs font-bold text-gray-400">
                    Max 10 units allowed per customer
                  </span>
                </div>
              </div>

              {/* Rx File Uploader if prescription required */}
              <AnimatePresence>
                {medicine.requires_prescription && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-3"
                  >
                    <div className="flex items-center gap-2 text-purple-800">
                      <ShieldAlert size={18} />
                      <h4 className="text-xs font-black uppercase tracking-wider">Doctor Prescription Required</h4>
                    </div>
                    <FileUpload 
                      maxFiles={1} 
                      onChange={(files) => setPrescriptionFiles(files)}
                      className="bg-white border-purple-200"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main Action Buttons: Add to Cart & Buy/Order Now */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!canOrder || (medicine.requires_prescription && prescriptionFiles.length === 0)}
                  className={cn(
                    "flex-1 py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 border",
                    addedToCart 
                      ? "bg-emerald-50 text-emerald-700 border-emerald-300" 
                      : "bg-white hover:bg-blue-50 text-[#1565C0] border-blue-200"
                  )}
                >
                  {addedToCart ? (
                    <><Check size={18} className="text-emerald-600" /> Added to Cart</>
                  ) : (
                    <><ShoppingCart size={18} /> Add to Cart</>
                  )}
                </button>

                <button
                  onClick={handleOrderNow}
                  disabled={!canOrder || (medicine.requires_prescription && prescriptionFiles.length === 0)}
                  className="flex-1 bg-[#1565C0] hover:bg-blue-800 text-white py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/25 active:scale-95"
                >
                  <ShoppingBag size={18} />
                  {isPharmacyOwner ? 'Pharmacy Owner' 
                   : !isPharmacyOpen ? 'Pharmacy Closed'
                   : !isAvailable ? 'Out of Stock' 
                   : medicine.requires_prescription && prescriptionFiles.length === 0 ? 'Upload Rx to Order'
                   : `Order Now · ₹${totalPrice}`}
                </button>
              </div>

            </div>

            {/* Medical Info Tabs Section */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-50/80 space-y-4">
              
              {/* Tab Selector */}
              <div className="flex border-b border-gray-150 gap-2 overflow-x-auto no-scrollbar">
                {[
                  { id: 'overview', label: '📖 Overview & Uses' },
                  { id: 'dosage', label: '💡 Dosage & Usage' },
                  { id: 'sideEffects', label: '⚠️ Side Effects' },
                  { id: 'manufacturer', label: '🏢 Expiry & Mfg' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "py-2.5 px-4 font-black text-xs uppercase tracking-wider cursor-pointer transition-all border-b-2 whitespace-nowrap",
                      activeTab === tab.id 
                        ? "border-[#1565C0] text-[#1565C0]" 
                        : "border-transparent text-gray-400 hover:text-gray-700"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="pt-2">
                {activeTab === 'overview' && (
                  <div className="space-y-4 text-sm text-gray-700 font-medium">
                    <p className="leading-relaxed">
                      {medicine.description || `${medicine.name} is prescribed for effective relief from fever, general body aches, headache, and mild pain symptoms under certified pharmacy auditing.`}
                    </p>

                    <div>
                      <h4 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider mb-2">Key Indications & Uses:</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {medicine.uses.map((useItem, i) => (
                          <li key={i} className="flex items-center gap-2 bg-blue-50/60 p-2 rounded-xl text-xs font-extrabold text-blue-900 border border-blue-100">
                            <Check size={14} className="text-[#1565C0] flex-shrink-0" />
                            <span>{useItem}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'dosage' && (
                  <div className="space-y-3 text-sm text-gray-700 font-medium">
                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-2">
                      <h4 className="font-black text-emerald-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <Info size={14} className="text-emerald-700" /> Recommended Directions for Use
                      </h4>
                      <p className="text-xs text-emerald-900 leading-relaxed font-bold">
                        {medicine.dosageInstructions}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs text-gray-600">
                      <strong>Storage Note:</strong> Store in a cool, dry place below 30°C away from direct sunlight and humidity. Keep out of reach of children.
                    </div>
                  </div>
                )}

                {activeTab === 'sideEffects' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-black text-gray-900 text-xs uppercase tracking-wider mb-2">Possible Side Effects:</h4>
                      <ul className="space-y-1.5">
                        {medicine.sideEffects.map((effect, i) => (
                          <li key={i} className="text-xs font-bold text-gray-600 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span>{effect}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl space-y-1.5">
                      <h4 className="font-black text-amber-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle size={14} className="text-amber-600" /> Safety Warnings & Precautions
                      </h4>
                      <ul className="space-y-1 text-xs text-amber-900 font-bold">
                        {medicine.precautions.map((p, i) => (
                          <li key={i}>• {p}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'manufacturer' && (
                  <div className="grid grid-cols-2 gap-4 text-xs font-bold text-gray-700">
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-1">
                      <span className="text-[9px] uppercase tracking-widest text-gray-400 block font-black">Manufacturer</span>
                      <p className="text-gray-900">{medicine.manufacturer}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-1">
                      <span className="text-[9px] uppercase tracking-widest text-gray-400 block font-black">Expiry Date</span>
                      <p className="text-emerald-700 font-black">{medicine.expiryDate}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-1">
                      <span className="text-[9px] uppercase tracking-widest text-gray-400 block font-black">Batch Number</span>
                      <p className="text-gray-900">{medicine.batchNumber}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-1">
                      <span className="text-[9px] uppercase tracking-widest text-gray-400 block font-black">FSSAI / Drug License</span>
                      <p className="text-gray-900">DL-2026/DL-9821</p>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Substitute / Similar Medicines Carousel */}
        {substituteMedicines.length > 0 && (
          <div className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-[#1565C0]" />
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-wider">Similar & Substitute Medicines</h3>
              </div>
              <Link to="/medicines" className="text-xs font-black text-[#1565C0] hover:underline">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {substituteMedicines.map(subMed => (
                <div
                  key={subMed.id}
                  onClick={() => navigate(`/medicines/${subMed.id}`)}
                  className="bg-white border border-blue-50/70 rounded-2xl p-3 flex flex-col relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
                >
                  <div className="w-full h-28 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden mb-2">
                    <img src={subMed.images?.[0]} alt={subMed.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <h4 className="text-xs font-extrabold text-gray-900 line-clamp-1 group-hover:text-[#1565C0]">{subMed.name}</h4>
                  <span className="text-[10px] text-gray-400 font-bold mb-2">{subMed.category}</span>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs font-black text-gray-950">₹{subMed.price}</span>
                    <span className="text-[9px] font-black bg-blue-50 text-[#1565C0] px-2 py-1 rounded-md border border-blue-100">
                      View Details
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Floating Sticky Bottom Bar for Mobile Screen Quick Checkout */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-3 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[9px] font-black uppercase text-gray-400 block">Total ({quantity} item)</span>
          <span className="text-lg font-black text-gray-950">₹{totalPrice}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={!canOrder}
            className="bg-blue-50 hover:bg-blue-100 text-[#1565C0] font-black text-xs px-4 py-2.5 rounded-xl border border-blue-200 cursor-pointer"
          >
            Add
          </button>
          <button
            onClick={handleOrderNow}
            disabled={!canOrder}
            className="bg-[#1565C0] hover:bg-blue-800 text-white font-black text-xs px-5 py-2.5 rounded-xl cursor-pointer shadow-md"
          >
            Order Now
          </button>
        </div>
      </div>

    </div>
  );
};

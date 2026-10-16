import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, FileText, Zap, CheckCircle2,
  ShieldCheck, Loader2, AlertTriangle, Send,
  Building2, ShoppingBag, Star, ArrowRight,
  Sparkles, Scan, Pill, BadgePercent, Clock,
  RefreshCw, Check, Info, HeartPulse, Key,
  ChevronDown, ChevronUp, Plus, Search, X,
  MapPin, CheckCircle, Cpu, FileCheck,
  Radio, CheckCheck, Phone, UserCheck,
  Locate, Navigation, Play, Compass
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { PrescriptionUploader } from '../components/PrescriptionUploader';
import {
  runPrescriptionPipeline,
  PARTNER_PHARMACIES,
  calculateDynamicNearestPharmacies,
  DEMO_PRESCRIPTIONS,
  generateSyntheticPrescriptionFile
} from '../services/prescriptionPipelineService';

import { mockMedicines } from '../mockData/mockMedicines';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { Button } from '../components/ui/Button';

// ─── Popular Metro Hubs for Instant Live Testing ─────────────────────────────
const POPULAR_HUBS = [
  { name: "Indiranagar, Bengaluru", city: "Bengaluru", lat: 12.9784, lng: 77.6408 },
  { name: "Connaught Place, New Delhi", city: "New Delhi", lat: 28.6315, lng: 77.2167 },
  { name: "Bandra West, Mumbai", city: "Mumbai", lat: 19.0596, lng: 72.8295 },
  { name: "Hitec City, Hyderabad", city: "Hyderabad", lat: 17.4474, lng: 78.3762 },
  { name: "Kothrud, Pune", city: "Pune", lat: 18.5074, lng: 73.8077 }
];

// ─── Status enum ─────────────────────────────────────────────────────────────
const STATUS = {
  IDLE: 'idle',
  PIPELINE_RUNNING: 'pipeline_running',
  ANALYSIS_COMPLETE: 'analysis_complete',
  UPLOADING: 'uploading',
  SUCCESS: 'success',
  ERROR: 'error'
};

const PIPELINE_STAGES = [
  { id: 1, name: "Upload Slip", label: "Upload Prescription", icon: FileText },
  { id: 2, name: "Scan Slip", label: "Prescription Scan", icon: Scan },
  { id: 3, name: "Verification", label: "Pharmacist Verification", icon: ShieldCheck },
  { id: 4, name: "Medicine Check", label: "Medicine Identification", icon: Pill },
  { id: 5, name: "Nearest Stores", label: "Pharmacy Matching", icon: Building2 },
  { id: 6, name: "Ready", label: "Doorstep Delivery", icon: CheckCircle2 },
];

export const PrescriptionUpload = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [file, setFile] = useState(null);
  const [note, setNote] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [errMsg, setErrMsg] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedGenerics, setSelectedGenerics] = useState({});
  const [selectedMedicines, setSelectedMedicines] = useState({});
  const [approvalsTab, setApprovalsTab] = useState('split');
  const [addedMeds, setAddedMeds] = useState({});
  const [allAddedToCart, setAllAddedToCart] = useState(false);
  
  // Pipeline live tracking
  const [pipelineState, setPipelineState] = useState({
    stage: 1,
    stageName: "Prescription Upload",
    status: "Waiting for prescription...",
    completedStages: []
  });



  // Live GPS Location State
  const [userLocation, setUserLocation] = useState({
    lat: 12.9716,
    lng: 77.5946,
    locality: "Indiranagar, Bengaluru",
    city: "Bengaluru",
    detected: false,
    loading: false
  });
  const [nearbyPharmacies, setNearbyPharmacies] = useState(PARTNER_PHARMACIES);
  const [selectedPharmacy, setSelectedPharmacy] = useState(PARTNER_PHARMACIES[0]);

  // Multi-Pharmacy Broadcast & Live Customer Approval State
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [broadcastStep, setBroadcastStep] = useState('pinging'); // 'pinging' | 'approvals_ready' | 'order_confirmed'
  const [pharmacyResponses, setPharmacyResponses] = useState({});
  const [selectedApprovedPharm, setSelectedApprovedPharm] = useState(PARTNER_PHARMACIES[0]);
  const [confirmedOrderData, setConfirmedOrderData] = useState(null);

  // ── Apply Location & Recalculate Live Nearest Pharmacies ────────────────
  const applyLocationUpdate = useCallback((lat, lng, localityStr, cityStr, isGps = true) => {
    const dynamicStores = calculateDynamicNearestPharmacies(lat, lng, localityStr);
    setUserLocation({
      lat,
      lng,
      locality: localityStr,
      city: cityStr,
      detected: isGps,
      loading: false
    });
    setNearbyPharmacies(dynamicStores);
    setSelectedPharmacy(dynamicStores[0]);
    setSelectedApprovedPharm(dynamicStores[0]);
  }, []);

  // ── Live GPS Location Detector with IP & Metro Hub Fallback ─────────────
  const detectLiveLocation = useCallback(() => {
    setUserLocation(prev => ({ ...prev, loading: true }));

    const tryIpFallback = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          if (data && data.latitude && data.longitude) {
            const locStr = `${data.city || 'Local Metro'}, ${data.region || 'India'}`;
            applyLocationUpdate(data.latitude, data.longitude, locStr, data.city || 'Local Metro', false);
            return;
          }
        }
      } catch (e) {
        console.warn("IP geolocation fallback failed:", e);
      }
      // Default to Indiranagar, Bengaluru
      applyLocationUpdate(12.9784, 77.6408, "Indiranagar, Bengaluru", "Bengaluru", false);
    };

    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser. Falling back to IP.");
      tryIpFallback();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        let detectedLocality = "Your Area";
        let detectedCity = "Near You";

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16`);
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            detectedLocality = addr.suburb || addr.neighbourhood || addr.residential || addr.subdistrict || addr.city_district || addr.road || "Your Area";
            detectedCity = addr.city || addr.town || addr.state_district || "Local Metro";
          }
        } catch (e) {
          console.warn("Reverse geocode fallback", e);
        }

        const fullLocalityStr = `${detectedLocality}, ${detectedCity}`;
        applyLocationUpdate(lat, lng, fullLocalityStr, detectedCity, true);
      },
      (err) => {
        console.warn("GPS lookup denied or timeout, attempting IP fallback:", err);
        tryIpFallback();
      },
      { timeout: 7000, enableHighAccuracy: true }
    );
  }, [applyLocationUpdate]);

  // Quick Switch to Popular Metro Hub
  const selectHub = (hub) => {
    applyLocationUpdate(hub.lat, hub.lng, hub.name, hub.city, false);
  };

  // Detect GPS location on initial load
  useEffect(() => {
    detectLiveLocation();
  }, [detectLiveLocation]);



  // Manual medicine search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // ── Run Complete Pipeline ──────────────────────────────────────────────────
  const handleStartPipeline = async (customFile = null) => {
    const targetFile = customFile || file;
    if (!targetFile) {
      setErrMsg('Please select or upload a prescription slip first.');
      return;
    }

    setStatus(STATUS.PIPELINE_RUNNING);
    setErrMsg('');

    try {
      const data = await runPrescriptionPipeline(targetFile, (progress) => {
        setPipelineState(progress);
      }, userLocation);

      setAnalysisResult(data);
      if (data.matchedPharmacies?.length) {
        setNearbyPharmacies(data.matchedPharmacies);
        setSelectedPharmacy(data.matchedPharmacies[0]);
      } else if (data.selectedPharmacy) {
        setSelectedPharmacy(data.selectedPharmacy);
      }
      setStatus(STATUS.ANALYSIS_COMPLETE);

      // Default to generic alternative enabled for patient savings
      const defaultGenerics = {};
      const defaultSelected = {};
      data.medicines?.forEach(m => {
        defaultSelected[m.id] = true;
        if (m.genericAlternative) {
          defaultGenerics[m.id] = true;
        }
      });
      setSelectedGenerics(defaultGenerics);
      setSelectedMedicines(defaultSelected);
    } catch (err) {
      console.error('Prescription pipeline error:', err);
      setErrMsg(err?.message || 'Pipeline failed to process prescription.');
      setStatus(STATUS.IDLE);
    }
  };

  // ── Instant 1-Click Fast Track Demo ───────────────────────────────────────
  const handleRunInstantDemo = async (demo) => {
    setStatus(STATUS.PIPELINE_RUNNING);
    setErrMsg('');

    try {
      const syntheticFile = await generateSyntheticPrescriptionFile(demo);
      setFile(syntheticFile);

      setPipelineState({
        stage: 4,
        stageName: "Medicine Verification",
        status: `Identified ${demo.medicines.length} prescribed medicines from ${demo.doctorName}...`,
        completedStages: [1, 2, 3]
      });

      await new Promise(r => setTimeout(r, 400));

      const dynamicStores = calculateDynamicNearestPharmacies(
        userLocation.lat,
        userLocation.lng,
        userLocation.locality
      );

      const demoAnalysis = {
        pipeline: "Verified Prescription Order",
        executionTimeMs: 420,
        ocrEngine: "MediRush Smart Vision",
        rawOcrText: demo.ocrTextSnippet,
        confidenceScore: 0.98,
        doctorName: demo.doctorName,
        clinicHospital: demo.clinicHospital,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        diagnosisOrSymptoms: demo.diagnosis,
        generalPrecautions: demo.precautions,
        medicines: demo.medicines,
        matchedPharmacies: dynamicStores,
        selectedPharmacy: dynamicStores[0]
      };

      setAnalysisResult(demoAnalysis);
      setNearbyPharmacies(dynamicStores);
      setSelectedPharmacy(dynamicStores[0]);

      const defaultGenerics = {};
      const defaultSelected = {};
      demo.medicines.forEach(m => {
        defaultSelected[m.id] = true;
        if (m.genericAlternative) {
          defaultGenerics[m.id] = true;
        }
      });
      setSelectedGenerics(defaultGenerics);
      setSelectedMedicines(defaultSelected);
      setStatus(STATUS.ANALYSIS_COMPLETE);
    } catch (err) {
      console.error("Instant demo failed", err);
      setErrMsg("Failed to load demo prescription");
      setStatus(STATUS.IDLE);
    }
  };

  // ── Full 6-Stage Pipeline Demo ───────────────────────────────────────────
  const handleRunPipelineDemo = async (demo) => {
    try {
      const syntheticFile = await generateSyntheticPrescriptionFile(demo);
      setFile(syntheticFile);
      handleStartPipeline(syntheticFile);
    } catch (err) {
      console.error("Pipeline demo failed", err);
      setErrMsg("Failed to start pipeline demo");
    }
  };

  // Toggle between brand and generic for a specific medicine
  const toggleGeneric = (medId) => {
    setSelectedGenerics(prev => ({
      ...prev,
      [medId]: !prev[medId]
    }));
  };

  // Toggle selection for partial fulfillment
  const toggleMedicineSelection = (medId) => {
    setSelectedMedicines(prev => ({
      ...prev,
      [medId]: prev[medId] === false ? true : false
    }));
  };

  const selectAllMedicines = () => {
    const updated = {};
    (analysisResult?.medicines || []).forEach(m => {
      updated[m.id] = true;
    });
    setSelectedMedicines(updated);
  };

  const deselectAllMedicines = () => {
    const updated = {};
    (analysisResult?.medicines || []).forEach(m => {
      updated[m.id] = false;
    });
    setSelectedMedicines(updated);
  };

  // Add individual medicine to cart
  const handleAddSingleToCart = (med) => {
    const isGeneric = selectedGenerics[med.id] && med.genericAlternative;
    const finalName = isGeneric ? med.genericAlternative.name : med.name;
    const finalBrand = isGeneric ? med.genericAlternative.brand : (selectedPharmacy.name || 'Apollo Partnered');
    const finalPrice = isGeneric ? med.genericAlternative.price : med.estimatedPrice;

    addToCart({
      id: `rx-${med.id}-${isGeneric ? 'gen' : 'brand'}`,
      name: finalName,
      brand: finalBrand,
      price: Number(finalPrice) || 120.00,
      quantity: 1,
      requires_prescription: true,
      images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60']
    });

    setAddedMeds(prev => ({ ...prev, [med.id]: true }));
  };

  // Add all extracted medicines to cart at once (only selected ones)
  const handleAddAllToCart = () => {
    if (!analysisResult?.medicines?.length) return;

    analysisResult.medicines
      .filter(med => selectedMedicines[med.id] !== false)
      .forEach(med => {
        const isGeneric = selectedGenerics[med.id] && med.genericAlternative;
        const finalName = isGeneric ? med.genericAlternative.name : med.name;
        const finalBrand = isGeneric ? med.genericAlternative.brand : (selectedPharmacy.name || 'Apollo Partnered');
        const finalPrice = isGeneric ? med.genericAlternative.price : med.estimatedPrice;

        addToCart({
          id: `rx-${med.id}-${isGeneric ? 'gen' : 'brand'}`,
          name: finalName,
          brand: finalBrand,
          price: Number(finalPrice) || 120.00,
          quantity: 1,
          requires_prescription: true,
          images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60']
        });
      });

    setAllAddedToCart(true);
    setTimeout(() => {
      navigate('/cart');
    }, 900);
  };

  // Search medicine manually to add if doctor handwriting is faint
  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (!q || q.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const clean = q.toLowerCase();
    const matches = mockMedicines
      .filter(m => m.name.toLowerCase().includes(clean) || (m.genericName && m.genericName.toLowerCase().includes(clean)))
      .slice(0, 5);
    setSearchResults(matches);
  };

  const handleAddCustomMedicine = (item) => {
    const newMed = {
      id: `manual-${item.id}-${Date.now()}`,
      name: item.name,
      form: item.pack_size_label?.includes('syrup') ? 'Syrup' : 'Tablet',
      activeIngredient: item.genericName || item.salt_composition || 'Active Compound',
      dosage: "1 Unit Twice daily (BD)",
      timing: "After meals with water",
      duration: "5 Days",
      indication: item.description?.slice(0, 80) || "Prescribed by doctor",
      pregnancySafety: "Category B",
      pregnancyWarning: "Consult doctor for details.",
      sideEffects: item.side_effects || "Mild discomfort if taken on empty stomach",
      estimatedPrice: item.price || 95.00,
      genericAlternative: {
        name: `${(item.genericName || item.name).split('+')[0].trim()} Generic`,
        brand: "Jan Aushadhi Kendra",
        price: Math.round((item.price || 95.00) * 0.55),
        savingsPercent: 45
      }
    };

    setAnalysisResult(prev => ({
      ...prev,
      medicines: [...(prev?.medicines || []), newMed]
    }));
    setSelectedMedicines(prev => ({
      ...prev,
      [newMed.id]: true
    }));
    setSearchQuery('');
    setSearchResults([]);
  };

  // Remove a medicine from list
  const handleRemoveMedicine = (medId) => {
    setAnalysisResult(prev => ({
      ...prev,
      medicines: prev.medicines.filter(m => m.id !== medId)
    }));
  };

  // Save Gemini Key
  const handleSaveGeminiKey = () => {
    setStoredGeminiKey(tempKeyInput);
    setGeminiKey(tempKeyInput);
    setShowKeyModal(false);
  };

  // Calculate totals and savings based on partial medicine selection
  const totals = React.useMemo(() => {
    if (!analysisResult?.medicines) return { total: 0, savings: 0, brandTotal: 0, selectedCount: 0, totalCount: 0 };
    let total = 0;
    let brandTotal = 0;
    let selectedCount = 0;

    analysisResult.medicines.forEach(med => {
      const isSelected = selectedMedicines[med.id] !== false;
      if (!isSelected) return;
      selectedCount += 1;

      const isGeneric = selectedGenerics[med.id] && med.genericAlternative;
      const brandPrice = Number(med.estimatedPrice) || 0;
      const actualPrice = isGeneric ? (Number(med.genericAlternative.price) || 0) : brandPrice;

      total += actualPrice;
      brandTotal += brandPrice;
    });

    return {
      total,
      brandTotal,
      savings: Math.max(0, brandTotal - total),
      selectedCount,
      totalCount: analysisResult.medicines.length
    };
  }, [analysisResult, selectedGenerics, selectedMedicines]);

  // Calculate smart split across 2 nearest partner pharmacies
  const splitPlan = React.useMemo(() => {
    const activeMeds = (analysisResult?.medicines || []).filter(m => selectedMedicines[m.id] !== false);
    if (activeMeds.length <= 1) return null;

    const stores = (nearbyPharmacies && nearbyPharmacies.length >= 2) ? nearbyPharmacies : PARTNER_PHARMACIES;
    const store1 = stores[0];
    const store2 = stores[1] || stores[0];

    // Split roughly half and half
    const splitIndex = Math.ceil(activeMeds.length / 2);
    const store1Meds = activeMeds.slice(0, splitIndex);
    const store2Meds = activeMeds.slice(splitIndex);

    const calcTotal = (meds) => meds.reduce((acc, m) => {
      const isGen = selectedGenerics[m.id] && m.genericAlternative;
      return acc + (isGen ? Number(m.genericAlternative.price) : (Number(m.estimatedPrice) || 120));
    }, 0);

    const store1Total = calcTotal(store1Meds);
    const store2Total = calcTotal(store2Meds);

    const dedicatedRider = {
      name: 'Vikram Rathore',
      vehicle: 'Ather 450X EV • DL-08-EV-4912',
      phone: '+91 98450 19283',
      rating: '4.9 ★ (1,420+ trips)',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
      badge: 'Dedicated Multi-Stop Partner'
    };

    return {
      canSplit: true,
      total: store1Total + store2Total,
      activeCount: activeMeds.length,
      rider: dedicatedRider,
      totalEta: '10-12 mins (Combined Route)',
      store1: {
        pharmacy: store1,
        items: store1Meds.map(m => {
          const isGen = selectedGenerics[m.id] && m.genericAlternative;
          return {
            name: isGen ? m.genericAlternative.name : m.name,
            quantity: 1,
            price: isGen ? m.genericAlternative.price : (Number(m.estimatedPrice) || 120)
          };
        }),
        total: store1Total,
        eta: 'Stop 1 (Apollo)',
        rider: dedicatedRider
      },
      store2: {
        pharmacy: store2,
        items: store2Meds.map(m => {
          const isGen = selectedGenerics[m.id] && m.genericAlternative;
          return {
            name: isGen ? m.genericAlternative.name : m.name,
            quantity: 1,
            price: isGen ? m.genericAlternative.price : (Number(m.estimatedPrice) || 120)
          };
        }),
        total: store2Total,
        eta: 'Stop 2 (MedPlus)',
        rider: dedicatedRider
      }
    };
  }, [analysisResult, selectedMedicines, selectedGenerics, nearbyPharmacies]);

  // ── Multi-Pharmacy Broadcast & Live Approval Radar ────────────────────────
  const startBroadcastFlow = () => {
    setBroadcastModalOpen(true);
    setBroadcastStep('pinging');

    const storesToBroadcast = (nearbyPharmacies && nearbyPharmacies.length > 0) ? nearbyPharmacies : PARTNER_PHARMACIES;
    const initialResponses = {};
    storesToBroadcast.forEach(p => {
      let price = totals.total;
      if (p.discountPercent > 0) {
        price = Math.max(40, Math.round(totals.total * (1 - p.discountPercent / 100)));
      }
      initialResponses[p.id] = {
        ...p,
        status: 'pinging',
        statusText: `Transmitting prescription slip to partner terminal in ${userLocation.locality}...`,
        quotePrice: price,
        verified: false
      };
    });
    setPharmacyResponses(initialResponses);

    // Stage 1: Apollo review (T = 800ms)
    setTimeout(() => {
      setPharmacyResponses(prev => ({
        ...prev,
        'pharm-apollo': {
          ...prev['pharm-apollo'],
          status: 'reviewing',
          statusText: 'Dr. Ramesh Sharma (Reg. Ph. #84920) reviewing prescription & checking physical shelf stock...'
        }
      }));
    }, 800);

    // Stage 2: MedPlus review (T = 1500ms)
    setTimeout(() => {
      setPharmacyResponses(prev => ({
        ...prev,
        'pharm-medplus': {
          ...prev['pharm-medplus'],
          status: 'reviewing',
          statusText: 'Dr. Neha Verma (Reg. Ph. #61204) verifying dosages and stock...'
        }
      }));
    }, 1500);

    // Stage 3: Jan Aushadhi review (T = 2200ms)
    setTimeout(() => {
      setPharmacyResponses(prev => ({
        ...prev,
        'pharm-janaushadhi': {
          ...prev['pharm-janaushadhi'],
          status: 'reviewing',
          statusText: 'Pharmacist Suresh Patel calculating Pradhan Mantri generic discounts...'
        }
      }));
    }, 2200);

    // Stage 4: Apollo APPROVED! (T = 2900ms)
    setTimeout(() => {
      setPharmacyResponses(prev => ({
        ...prev,
        'pharm-apollo': {
          ...prev['pharm-apollo'],
          status: 'approved',
          statusText: `✅ Approved! 100% Stock In-Store · ${prev['pharm-apollo']?.deliveryEta || '9-12 mins'} Express Delivery`,
          verified: true
        }
      }));
    }, 2900);

    // Stage 5: MedPlus APPROVED! (T = 3800ms)
    setTimeout(() => {
      setPharmacyResponses(prev => ({
        ...prev,
        'pharm-medplus': {
          ...prev['pharm-medplus'],
          status: 'approved',
          statusText: `✅ Approved! Genuine medicines confirmed & packed for delivery (${prev['pharm-medplus']?.deliveryEta || '12-15 mins'})`,
          verified: true
        }
      }));
    }, 3800);

    // Stage 6: Jan Aushadhi APPROVED! (T = 4600ms)
    setTimeout(() => {
      setPharmacyResponses(prev => ({
        ...prev,
        'pharm-janaushadhi': {
          ...prev['pharm-janaushadhi'],
          status: 'approved',
          statusText: '✅ Approved! Quality generic batch verified at max government subsidy',
          verified: true
        }
      }));
    }, 4600);

    // Stage 7: Transition to Customer Selection / Approvals (T = 5000ms)
    setTimeout(() => {
      setBroadcastStep('approvals_ready');
      setSelectedApprovedPharm(storesToBroadcast[0]);
    }, 5000);
  };

  const handleConfirmSplitOrder = () => {
    if (!splitPlan) return;
    const orderId = `ORD-SPLIT-${Math.floor(10000 + Math.random() * 90000)}`;
    const deliveryOtp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const assignedRider = splitPlan.rider || splitPlan.store1.rider;

    const pkg1 = {
      packageId: `${orderId}-PKG1`,
      packageNumber: 1,
      totalPackages: 2,
      pharmacy_name: splitPlan.store1.pharmacy.name,
      pharmacy_address: splitPlan.store1.pharmacy.address || `Partner Store 1, ${userLocation.locality}`,
      deliveryEta: splitPlan.store1.eta,
      otp: deliveryOtp,
      rider: assignedRider,
      items: splitPlan.store1.items,
      total: splitPlan.store1.total,
      stopTitle: "Stop 1: Apollo Store",
      status: 'Out for Delivery'
    };

    const pkg2 = {
      packageId: `${orderId}-PKG2`,
      packageNumber: 2,
      totalPackages: 2,
      pharmacy_name: splitPlan.store2.pharmacy.name,
      pharmacy_address: splitPlan.store2.pharmacy.address || `Partner Store 2, ${userLocation.locality}`,
      deliveryEta: splitPlan.store2.eta,
      otp: deliveryOtp,
      rider: assignedRider,
      items: splitPlan.store2.items,
      total: splitPlan.store2.total,
      stopTitle: "Stop 2: MedPlus Store",
      status: 'Out for Delivery'
    };

    const newOrder = {
      id: orderId,
      isSplitOrder: true,
      singleRiderMultiStop: true,
      isPartialOrder: totals.selectedCount < totals.totalCount,
      partialCount: totals.selectedCount,
      totalPrescriptionCount: totals.totalCount,
      rider: assignedRider,
      status: 'Out for Delivery',
      date: new Date().toISOString(),
      total: splitPlan.total,
      pharmacy_name: `${splitPlan.store1.pharmacy.name} + ${splitPlan.store2.pharmacy.name}`,
      pharmacy_address: `Multi-store Route: ${splitPlan.store1.pharmacy.name} & ${splitPlan.store2.pharmacy.name}`,
      pharmacist_name: 'Dr. Arvind S. & Dr. Neha V. (Registered Pharmacists)',
      delivery_address: `${userLocation.locality} (Single Rider Multi-Stop Fast Track)`,
      deliveryEta: splitPlan.totalEta || '10-12 mins',
      otp: deliveryOtp,
      packages: [pkg1, pkg2],
      items: [...splitPlan.store1.items, ...splitPlan.store2.items],
      timeline: [
        { status: 'Order Placed', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true },
        { status: `Rider Assigned: ${assignedRider.name}`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true },
        { status: `Stop 1 Picked Up (${splitPlan.store1.pharmacy.name})`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true },
        { status: `Stop 2 Picked Up (${splitPlan.store2.pharmacy.name})`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true },
        { status: 'Out for Delivery (Consolidated Doorstep Drop)', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true },
        { status: 'Delivered', time: null, completed: false }
      ]
    };

    try {
      const existing = JSON.parse(localStorage.getItem('medirush_orders') || '[]');
      existing.unshift(newOrder);
      localStorage.setItem('medirush_orders', JSON.stringify(existing));

      const localPres = JSON.parse(localStorage.getItem('medirush_local_prescriptions') || '[]');
      localPres.unshift({
        id: `pres-${orderId}`,
        user_id: user?.id || 'guest',
        prescription_url: file ? URL.createObjectURL(file) : null,
        status: 'approved_and_dispatched',
        accepted_pharmacy: newOrder.pharmacy_name,
        created_at: new Date().toISOString()
      });
      localStorage.setItem('medirush_local_prescriptions', JSON.stringify(localPres));
    } catch (e) {
      console.warn('Could not save order locally', e);
    }

    setConfirmedOrderData(newOrder);
    setBroadcastStep('order_confirmed');
  };

  const handleConfirmOrder = (targetPharm) => {
    const storesToBroadcast = (nearbyPharmacies && nearbyPharmacies.length > 0) ? nearbyPharmacies : PARTNER_PHARMACIES;
    const pharm = targetPharm || selectedApprovedPharm || storesToBroadcast[0];
    const isPartial = totals.selectedCount < totals.totalCount;
    const orderId = isPartial 
      ? `ORD-PARTIAL-${Math.floor(10000 + Math.random() * 90000)}` 
      : `ORD-RX-${Math.floor(10000 + Math.random() * 90000)}`;
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    let finalTotal = totals.total;
    if (pharm.discountPercent > 0) {
      finalTotal = Math.max(40, Math.round(totals.total * (1 - pharm.discountPercent / 100)));
    }

    const itemsToOrder = (analysisResult?.medicines || [])
      .filter(m => selectedMedicines[m.id] !== false)
      .map(m => {
        const isGen = selectedGenerics[m.id] && m.genericAlternative;
        return {
          name: isGen ? m.genericAlternative.name : m.name,
          quantity: 1,
          price: isGen ? m.genericAlternative.price : (Number(m.estimatedPrice) || 120)
        };
      });

    const newOrder = {
      id: orderId,
      status: 'Accepted',
      date: new Date().toISOString(),
      total: finalTotal,
      isSplitOrder: false,
      isPartialOrder: isPartial,
      partialCount: totals.selectedCount,
      totalPrescriptionCount: totals.totalCount,
      pharmacy_name: pharm.name,
      pharmacy_address: pharm.address || `Partner Store, ${userLocation.locality}`,
      pharmacist_name: pharm.pharmacistName || 'Licensed Pharmacist',
      delivery_address: `${userLocation.locality} (${isPartial ? 'Partial Fulfillment' : 'Live GPS Fast Track'} · Within ${pharm.distance})`,
      deliveryEta: pharm.deliveryEta || '9-12 mins',
      otp: otp,
      items: itemsToOrder.length > 0 ? itemsToOrder : [
        { name: 'Prescribed Medicine Package', quantity: 1, price: finalTotal }
      ],
      timeline: [
        { status: 'Pending', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true },
        { status: isPartial ? 'Partial Items Accepted' : 'Accepted', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true },
        { status: 'Packed', time: null, completed: false },
        { status: 'Out for Delivery', time: null, completed: false },
        { status: 'Delivered', time: null, completed: false }
      ]
    };

    // Save to local storage orders
    try {
      const existing = JSON.parse(localStorage.getItem('medirush_orders') || '[]');
      existing.unshift(newOrder);
      localStorage.setItem('medirush_orders', JSON.stringify(existing));

      // Also register into local prescriptions
      const localPres = JSON.parse(localStorage.getItem('medirush_local_prescriptions') || '[]');
      localPres.unshift({
        id: `pres-${orderId}`,
        user_id: user?.id || 'guest',
        prescription_url: file ? URL.createObjectURL(file) : null,
        status: 'approved_and_dispatched',
        accepted_pharmacy: pharm.name,
        created_at: new Date().toISOString()
      });
      localStorage.setItem('medirush_local_prescriptions', JSON.stringify(localPres));
    } catch (e) {
      console.warn('Could not save order locally', e);
    }

    setConfirmedOrderData(newOrder);
    setBroadcastStep('order_confirmed');
  };

  // Standard Submit Handler (Uploads file & creates record)
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!file) { setErrMsg('Please select a prescription file first.'); return; }
    if (!user) { setErrMsg('You must be logged in to upload a prescription.'); return; }

    setStatus(STATUS.UPLOADING);
    setErrMsg('');

    try {
      const ext = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from('prescriptions')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage
        .from('prescriptions')
        .getPublicUrl(fileName);

      const prescriptionUrl = urlData?.publicUrl;

      const { error: dbErr } = await supabase
        .from('prescriptions')
        .insert([{
          user_id: user.id,
          prescription_url: prescriptionUrl,
          note: note.trim() || null,
          is_urgent: isUrgent,
          status: 'pending_verification',
          created_at: new Date().toISOString(),
        }]);

      if (dbErr) throw dbErr;
      setStatus(STATUS.SUCCESS);
    } catch (err) {
      console.warn('Falling back to local storage simulation for prescription upload', err);
      try {
        const localPrescriptions = JSON.parse(localStorage.getItem('medirush_local_prescriptions') || '[]');
        const newPrescription = {
          id: `local-pres-${Date.now()}`,
          user_id: user?.id || 'guest',
          prescription_url: file.type.startsWith('image/') ? URL.createObjectURL(file) : 'https://placehold.co/600x800/3b82f6/ffffff?text=Prescription+PDF',
          note: note.trim() || null,
          is_urgent: isUrgent,
          status: 'pending_verification',
          created_at: new Date().toISOString(),
        };
        localPrescriptions.push(newPrescription);
        localStorage.setItem('medirush_local_prescriptions', JSON.stringify(localPrescriptions));
        setStatus(STATUS.SUCCESS);
      } catch (localErr) {
        setErrMsg(err?.message || 'Upload failed. Please try again.');
        setStatus(STATUS.ERROR);
      }
    }
  };

  const handleReset = () => {
    setFile(null);
    setNote('');
    setIsUrgent(false);
    setStatus(STATUS.IDLE);
    setErrMsg('');
    setAnalysisResult(null);
    setSelectedGenerics({});
    setAddedMeds({});
    setAllAddedToCart(false);
    setShowRawText(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-28 relative overflow-hidden">

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-800 px-5 pt-8 pb-16 shadow-2xl rounded-b-[2.5rem]">
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-72 h-72 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

        <button
          id="btn-back"
          onClick={() => navigate(-1)}
          className="absolute top-5 left-4 bg-white/15 hover:bg-white/25 backdrop-blur-md p-2.5 rounded-2xl transition-all shadow-sm border border-white/20 text-white"
        >
          <ArrowLeft size={20} />
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center relative z-10 max-w-lg mx-auto mt-2"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-cyan-200 text-[11px] font-black tracking-wide uppercase mb-3 shadow-sm">
            <ShieldCheck size={14} className="text-cyan-300" />
            <span>100% Genuine Medicines · 10-Min Doorstep Delivery</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
            Upload Doctor's Prescription
          </h1>
          <p className="text-blue-100 mt-2 text-xs sm:text-sm font-medium max-w-md mx-auto leading-relaxed">
            Upload your prescription slip to get verified medicines delivered to your doorstep from licensed pharmacies.
          </p>
        </motion.div>
      </div>

      {/* ── VISUAL PIPELINE FLOW BAR ────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 -mt-7 relative z-20">
        <div className="bg-white rounded-2xl p-3 shadow-lg border border-gray-150 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between min-w-[540px] gap-2">
            {PIPELINE_STAGES.map((st, idx) => {
              const isCompleted = pipelineState.completedStages.includes(st.id);
              const isCurrent = pipelineState.stage === st.id;
              const Icon = st.icon;

              return (
                <React.Fragment key={st.id}>
                  <div className="flex flex-col items-center flex-1">
                    <div className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 text-xs font-bold shadow-sm",
                      isCompleted 
                        ? "bg-emerald-600 text-white shadow-emerald-500/20"
                        : isCurrent
                        ? "bg-blue-600 text-white animate-pulse shadow-blue-500/30 scale-105"
                        : "bg-gray-100 text-gray-400"
                    )}>
                      {isCompleted ? <Check size={14} /> : <Icon size={14} />}
                    </div>
                    <span className={cn(
                      "text-[10px] mt-1.5 font-bold tracking-tight text-center whitespace-nowrap",
                      isCompleted ? "text-emerald-700" : isCurrent ? "text-blue-700" : "text-gray-400"
                    )}>
                      {st.name}
                    </span>
                  </div>

                  {idx < PIPELINE_STAGES.length - 1 && (
                    <div className={cn(
                      "h-0.5 w-6 rounded-full -mt-4 transition-all duration-300",
                      pipelineState.completedStages.includes(st.id) ? "bg-emerald-500" : "bg-gray-200"
                    )} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>



      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto px-4 mt-6 space-y-6 relative z-10"
      >

        {/* ── LIVE GPS DELIVERY LOCATION BAR ───────────────────────────── */}
        <motion.div variants={itemVariants} className="bg-white/95 backdrop-blur-md border border-blue-200/90 rounded-3xl p-4 shadow-md space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/25">
                <Locate size={19} className={userLocation.loading ? "animate-spin" : ""} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Live Delivery Address
                  </span>
                  {userLocation.detected ? (
                    <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      GPS Live (±15m)
                    </span>
                  ) : (
                    <span className="text-[10px] text-indigo-700 font-extrabold bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                      Auto-Detected Metro Hub
                    </span>
                  )}
                </div>
                <p className="text-xs font-black text-gray-900 mt-1 flex items-center gap-1.5">
                  <MapPin size={13} className="text-rose-500 flex-shrink-0" />
                  <span className="truncate max-w-sm sm:max-w-md">{userLocation.locality}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={detectLiveLocation}
              disabled={userLocation.loading}
              className="px-3.5 py-2 rounded-2xl text-xs font-black text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all flex items-center justify-center gap-1.5 shadow-sm flex-shrink-0"
            >
              <RefreshCw size={12} className={userLocation.loading ? "animate-spin" : ""} />
              {userLocation.loading ? "Detecting GPS..." : "Refresh Live GPS"}
            </button>
          </div>

          {/* Quick Hub Switcher for Live Demo */}
          <div className="pt-2 border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto pb-0.5 text-[11px] no-scrollbar">
            <span className="text-[10px] font-extrabold text-gray-400 whitespace-nowrap uppercase tracking-wider flex items-center gap-1 mr-1">
              <Compass size={11} className="text-blue-500" /> Switch Metro:
            </span>
            {POPULAR_HUBS.map(hub => {
              const isSelected = userLocation.locality.toLowerCase().includes(hub.city.toLowerCase());
              return (
                <button
                  key={hub.name}
                  type="button"
                  onClick={() => selectHub(hub)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 text-gray-600 hover:bg-blue-50 hover:text-blue-700 border-gray-200'
                  }`}
                >
                  {hub.city}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ── PIPELINE RUNNING OVERLAY ─────────────────────────────────── */}
        <AnimatePresence>
          {status === STATUS.PIPELINE_RUNNING && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white/95 backdrop-blur-xl border border-blue-200 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 animate-pulse" />
              
              {/* Laser scanner animation */}
              <div className="relative w-36 h-36 mx-auto mb-5 rounded-2xl bg-gradient-to-b from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center overflow-hidden shadow-inner">
                <FileText size={56} className="text-blue-400 opacity-60" />
                <motion.div 
                  animate={{ y: [-60, 60, -60] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#06b6d4]"
                />
                <div className="absolute inset-0 bg-cyan-400/5 pointer-events-none" />
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold mb-2">
                <Loader2 size={14} className="animate-spin text-blue-600" />
                <span>{pipelineState.stageName}</span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-1">Verifying Your Prescription</h3>
              <p className="text-xs text-gray-600 font-medium max-w-md mx-auto h-6 transition-all duration-300">
                {pipelineState.status}
              </p>

              <div className="w-56 h-2 bg-gray-100 rounded-full mx-auto mt-4 overflow-hidden border border-gray-200">
                <motion.div 
                  initial={{ width: '15%' }}
                  animate={{ width: `${Math.round((pipelineState.stage / 6) * 100)}%` }}
                  className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 rounded-full transition-all duration-300"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-wider">
                Step {pipelineState.stage} of 6 · Quick Pharmacist Verification
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── PIPELINE RESULTS (When execution finishes) ────────────────── */}
        <AnimatePresence>
          {status === STATUS.ANALYSIS_COMPLETE && analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Doctor, Clinic & Pipeline Verification Card */}
              <div className="bg-white rounded-3xl p-6 border border-blue-100 shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-100 shadow-sm">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-gray-900 leading-tight">
                        {analysisResult.doctorName || 'Doctor Prescription'}
                      </h3>
                      <p className="text-xs font-semibold text-gray-500 flex items-center gap-1.5 mt-0.5">
                        <span>{analysisResult.clinicHospital || 'Partner Healthcare Clinic'}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-blue-600 font-bold">{analysisResult.date}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-xl text-xs font-bold">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span>Prescription Verified ({analysisResult.confidenceScore}%)</span>
                  </div>
                </div>

                {/* Detected Diagnosis */}
                {analysisResult.diagnosisOrSymptoms && (
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 flex items-start gap-2.5">
                    <HeartPulse size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Identified Diagnosis</span>
                      <p className="text-xs font-bold text-gray-800">{analysisResult.diagnosisOrSymptoms}</p>
                    </div>
                  </div>
                )}

                {/* Connected Partner Pharmacies Network */}
                <div className="pt-2 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                        <Radio size={14} className="text-blue-600 animate-pulse" />
                        Connected Partner Pharmacies ({PARTNER_PHARMACIES.length} Active in Your Radius)
                      </span>
                      <p className="text-[10px] text-gray-500 font-medium">
                        Ordering broadcasts prescription to all 3 stores for instant pharmacist approval & fastest delivery
                      </p>
                    </div>
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      3 Online
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {(nearbyPharmacies || PARTNER_PHARMACIES).map(pharm => (
                      <div
                        key={pharm.id}
                        onClick={() => setSelectedPharmacy(pharm)}
                        className={cn(
                          "p-3 rounded-2xl border cursor-pointer transition-all relative overflow-hidden",
                          selectedPharmacy.id === pharm.id
                            ? "border-blue-600 bg-gradient-to-br from-blue-50/90 to-indigo-50/90 shadow-md ring-2 ring-blue-600/20"
                            : "border-gray-200 hover:border-blue-300 bg-white"
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-extrabold text-xs text-gray-900">{pharm.name}</span>
                          <span className="flex items-center text-[10px] text-amber-600 font-bold">
                            <Star size={10} className="fill-amber-400 text-amber-400 mr-0.5" /> {pharm.rating}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium">
                          <span>{pharm.distance} away</span>
                          <span className="font-bold text-gray-700">{pharm.deliveryEta}</span>
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-150 flex items-center justify-between text-[10px]">
                          <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                            <CheckCircle2 size={11} /> Stock Active
                          </span>
                          <span className="font-extrabold text-[9px] text-blue-700 bg-blue-100/70 px-1.5 py-0.5 rounded">
                            {pharm.badge}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Savings Banner */}
                {totals.savings > 0 && (
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-3.5 text-white flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-2.5">
                      <div className="bg-white/20 p-2 rounded-xl">
                        <BadgePercent size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-emerald-100">Generic Substitute Savings</p>
                        <p className="text-sm font-extrabold">You are saving ₹{totals.savings.toFixed(2)} on this prescription!</p>
                      </div>
                    </div>
                    <span className="text-xs bg-white text-emerald-800 font-black px-2.5 py-1 rounded-lg shadow-sm">
                      Save {Math.round((totals.savings / totals.brandTotal) * 100)}%
                    </span>
                  </div>
                )}
              </div>

              {/* Extracted Medicines List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-sm font-extrabold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                    <Pill size={16} className="text-blue-600" />
                    Identified Medicines ({analysisResult.medicines?.length || 0})
                  </h4>
                  <span className="text-[11px] font-bold text-gray-500">
                    Verified with Pharmacy Catalog
                  </span>
                </div>

                {(!analysisResult.medicines || analysisResult.medicines.length === 0) && (
                  <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 text-center space-y-2">
                    <AlertTriangle size={28} className="text-amber-600 mx-auto" />
                    <h5 className="text-sm font-bold text-amber-900">No clear medicines matched in OCR</h5>
                    <p className="text-xs text-amber-700 max-w-md mx-auto">
                      Search & add the prescribed medicines using the bar below.
                    </p>
                  </div>
                )}

                {/* ── PARTIAL PRESCRIPTION SELECTION CONTROLS ── */}
                <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-slate-50 rounded-2xl p-3.5 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/25 flex-shrink-0">
                      <CheckCheck size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-black uppercase tracking-wider text-gray-900">
                          Prescription Items: {totals.selectedCount} of {totals.totalCount} Selected
                        </h4>
                        {totals.selectedCount < totals.totalCount && (
                          <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md border border-amber-300">
                            Partial Prescription Mode
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-600 font-medium mt-0.5">
                        {totals.selectedCount < totals.totalCount 
                          ? `Ordering only ${totals.selectedCount} selected medicines. Unchecked medicines excluded.`
                          : "Uncheck any medicine you already have or wish to purchase separately."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={selectAllMedicines}
                      className="text-xs font-bold text-blue-700 hover:text-blue-800 px-3 py-1.5 rounded-xl bg-white border border-blue-200 shadow-xs hover:bg-blue-50 transition-all cursor-pointer"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={deselectAllMedicines}
                      className="text-xs font-bold text-gray-600 hover:text-gray-800 px-3 py-1.5 rounded-xl bg-white border border-gray-200 shadow-xs hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>

                {analysisResult.medicines?.map((med, index) => {
                  const isSelected = selectedMedicines[med.id] !== false;
                  const isGeneric = selectedGenerics[med.id] && med.genericAlternative;
                  const currentPrice = isGeneric ? med.genericAlternative.price : med.estimatedPrice;
                  const isAdded = addedMeds[med.id] || allAddedToCart;

                  return (
                    <motion.div
                      key={med.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "rounded-3xl p-5 border transition-all space-y-3.5 relative",
                        isSelected
                          ? "bg-white border-gray-200/90 shadow-sm hover:shadow-md"
                          : "bg-slate-50/70 border-dashed border-gray-300 opacity-65 hover:opacity-95"
                      )}
                    >
                      {/* Medicine Selection Checkbox Toggle */}
                      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                        <div 
                          onClick={() => toggleMedicineSelection(med.id)}
                          className="flex items-center gap-2.5 cursor-pointer select-none group"
                        >
                          <div className={cn(
                            "w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all",
                            isSelected 
                              ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/30" 
                              : "border-gray-300 bg-white group-hover:border-blue-400"
                          )}>
                            {isSelected && <Check size={13} strokeWidth={3} />}
                          </div>
                          <span className={cn(
                            "text-xs font-bold transition-colors",
                            isSelected ? "text-gray-900" : "text-gray-500 line-through"
                          )}>
                            {isSelected ? "Selected for Delivery" : "Excluded from Order (Click to Include)"}
                          </span>
                        </div>

                        <button
                          onClick={() => handleRemoveMedicine(med.id)}
                          className="text-gray-300 hover:text-rose-500 p-1 rounded-lg transition-colors cursor-pointer"
                          title="Remove medicine"
                        >
                          <X size={15} />
                        </button>
                      </div>

                      <div className="flex items-start justify-between gap-3 pr-6">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="text-base font-extrabold text-gray-900">
                              {isGeneric ? med.genericAlternative.name : med.name}
                            </h5>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                              {med.form || 'Tablet'}
                            </span>
                            {isGeneric && (
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Quality Generic
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-gray-500 mt-0.5">
                            Active Salt: <span className="text-gray-700 font-bold">{med.activeIngredient}</span>
                          </p>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className="text-base font-black text-gray-900">₹{Number(currentPrice).toFixed(2)}</span>
                          {isGeneric && (
                            <p className="text-[10px] text-gray-400 line-through">₹{Number(med.estimatedPrice).toFixed(2)}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">Dosage & Frequency</span>
                          <p className="font-bold text-gray-800">{med.dosage} · {med.timing}</p>
                          <p className="text-[11px] text-gray-500 font-medium">Duration: {med.duration || 'As advised'}</p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">Medical Indication</span>
                          <p className="font-bold text-gray-800">{med.indication}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {med.pregnancySafety && (
                          <div className={cn(
                            "inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold border",
                            med.pregnancySafety.toLowerCase().includes('safe') 
                              ? "bg-green-50 text-green-700 border-green-200"
                              : med.pregnancySafety.toLowerCase().includes('avoid')
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          )}>
                            <span>🤰 Pregnancy: {med.pregnancySafety}</span>
                          </div>
                        )}

                        {med.sideEffects && (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-gray-100 text-gray-700">
                            <Info size={11} className="text-gray-500" />
                            <span className="truncate max-w-xs">{med.sideEffects}</span>
                          </div>
                        )}
                      </div>

                      {med.genericAlternative && (
                        <div className="flex items-center justify-between p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-xs">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
                              Generic Substitute Available
                            </span>
                            <p className="font-bold text-gray-800">
                              {med.genericAlternative.name} ({med.genericAlternative.brand})
                            </p>
                            <p className="text-[11px] text-emerald-700 font-bold">
                              Save {med.genericAlternative.savingsPercent}% (₹{med.genericAlternative.price})
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleGeneric(med.id)}
                            className={cn(
                              "px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5",
                              isGeneric
                                ? "bg-emerald-600 text-white shadow-sm"
                                : "bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50"
                            )}
                          >
                            {isGeneric ? (
                              <>
                                <Check size={13} /> Using Generic
                              </>
                            ) : (
                              "Switch & Save"
                            )}
                          </button>
                        </div>
                      )}

                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => handleAddSingleToCart(med)}
                          disabled={isAdded}
                          className={cn(
                            "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                            isAdded
                              ? "bg-green-100 text-green-700 cursor-default"
                              : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                          )}
                        >
                          {isAdded ? (
                            <>
                              <CheckCircle2 size={14} /> Added to Cart
                            </>
                          ) : (
                            <>
                              <ShoppingBag size={14} /> Add Medicine
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}

                {/* ── Add Medicine Manually Bar ────────────────────────────── */}
                <div className="bg-white rounded-3xl p-4 border border-dashed border-gray-300 space-y-3">
                  <div className="flex items-center gap-2">
                    <Search size={15} className="text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Add medicine manually (e.g. Paracetamol, Azithromycin, Dolo 650)..."
                      className="w-full text-xs font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none"
                    />
                    {searchQuery && (
                      <button onClick={() => { setSearchQuery(''); setSearchResults([]); }} className="text-gray-400 hover:text-gray-600">
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {searchResults.length > 0 && (
                    <div className="border-t border-gray-100 pt-2 space-y-1.5">
                      {searchResults.map(item => (
                        <div
                          key={item.id}
                          onClick={() => handleAddCustomMedicine(item)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-blue-50 cursor-pointer text-xs transition-colors"
                        >
                          <div>
                            <span className="font-extrabold text-gray-800 block">{item.name}</span>
                            <span className="text-[10px] text-gray-500">{item.genericName || item.brand}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-gray-900">₹{item.price}</span>
                            <span className="p-1 rounded-lg bg-blue-600 text-white"><Plus size={12} /></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Checkout / Order & Broadcast Bar */}
              <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xl space-y-4 sticky bottom-4 z-20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Sparkles size={13} className="text-blue-600" />
                      <span className="text-[10px] uppercase tracking-wider text-gray-500 font-extrabold block">
                        Prescription Package Total
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-gray-900">₹{totals.total.toFixed(2)}</span>
                      {totals.savings > 0 && (
                        <span className="text-xs text-emerald-600 font-bold">(Saved ₹{totals.savings.toFixed(2)} with Generics)</span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium mt-0.5">
                      Pings 3 nearest connected pharmacies simultaneously for immediate approval & sub-10m dispatch
                    </p>
                  </div>

                  <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center">
                    <div className="flex items-center gap-1 text-[11px] text-green-700 font-extrabold bg-green-50 px-2.5 py-1 rounded-xl border border-green-200">
                      <Clock size={12} />
                      <span>Sub-10m Express Dispatch</span>
                    </div>
                    <span className="text-[10px] text-blue-600 font-extrabold mt-1">
                      Selected: {selectedPharmacy.name}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    onClick={startBroadcastFlow}
                    variant="primary"
                    disabled={!analysisResult.medicines || totals.selectedCount === 0}
                    className="w-full py-4 text-sm font-extrabold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white cursor-pointer"
                  >
                    <Radio size={18} className="animate-pulse text-amber-300" />
                    {totals.selectedCount < totals.totalCount
                      ? `Broadcast Partial Order (${totals.selectedCount} of ${totals.totalCount} Meds)`
                      : `Broadcast Order (${totals.selectedCount} Meds) to Pharmacies`}
                  </Button>

                  <Button
                    onClick={handleAddAllToCart}
                    variant="outline"
                    disabled={!analysisResult.medicines || totals.selectedCount === 0}
                    className="w-full py-4 text-sm font-extrabold flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50 text-gray-800 cursor-pointer"
                  >
                    {allAddedToCart ? (
                      <>
                        <CheckCircle2 size={18} className="text-green-600" />
                        Redirecting to Cart...
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={18} className="text-blue-600" />
                        {totals.selectedCount < totals.totalCount 
                          ? `Order Selected (${totals.selectedCount}) from ${selectedPharmacy.name.split(' ')[0]}`
                          : `Order Directly from ${selectedPharmacy.name}`}
                      </>
                    )}
                  </Button>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full py-1 text-center text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Scan a different prescription
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── SUCCESS STATE (After Pharmacist Verification submission) ── */}
        <AnimatePresence>
          {status === STATUS.SUCCESS && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-6 border border-gray-200 space-y-6 shadow-xl"
            >
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500/20 rounded-full scale-150 animate-ping opacity-40" />
                    <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-full relative shadow-inner">
                      <CheckCircle2 size={40} className="text-green-600" />
                    </div>
                  </div>
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Prescription Broadcasted!</h2>
                <p className="text-gray-600 font-medium text-xs">
                  Sent to {selectedPharmacy.name} & nearby partner pharmacies for instant packing & delivery.
                </p>
              </div>

              {/* Pharmacy Quote Card */}
              <div className="bg-gradient-to-br from-blue-50/90 to-indigo-50/90 border border-blue-150 rounded-2xl p-4 text-left space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#1565C0] text-white flex items-center justify-center font-bold">
                      <Building2 size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-gray-900">{selectedPharmacy.name}</h3>
                      <p className="text-[10px] text-gray-500 font-bold">{selectedPharmacy.distance} away · {selectedPharmacy.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg text-[10px] font-black text-amber-700">
                    <Star size={10} className="fill-amber-400 text-amber-400" /> {selectedPharmacy.rating}
                  </div>
                </div>

                <div className="bg-white/80 rounded-xl p-3 border border-gray-150 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-extrabold text-gray-800">
                    <span>Prescribed Medicines Package</span>
                    <span className="text-[#1565C0]">₹{totals.total > 0 ? totals.total.toFixed(2) : '149.00'}</span>
                  </div>
                  <p className="text-[10px] text-green-700 font-extrabold flex items-center gap-1">
                    <CheckCircle2 size={11} /> Stock confirmed by registered pharmacist
                  </p>
                </div>

                {isUrgent && (
                  <div className="flex items-center gap-1.5 text-rose-600 text-[10px] font-extrabold uppercase tracking-wider">
                    <Zap size={12} className="animate-pulse" /> Urgent Priority Order Dispatch (Sub-10m)
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Button
                  onClick={() => {
                    addToCart({
                      id: `prescribed-bundle-${Date.now()}`,
                      name: 'Prescribed Medicines Package',
                      brand: selectedPharmacy.name,
                      price: totals.total > 0 ? totals.total : 149.00,
                      quantity: 1,
                      images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60']
                    });
                    navigate('/cart');
                  }}
                  variant="primary"
                  className="w-full py-4 text-sm font-extrabold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={18} />
                  Proceed to Checkout
                </Button>

                <button
                  onClick={handleReset}
                  className="w-full py-2.5 text-xs font-extrabold text-gray-500 hover:text-gray-800 transition-colors uppercase tracking-wider"
                >
                  Upload Another Slip
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── UPLOAD FORM (Shown when IDLE or ERROR) ───────────────────── */}
        <AnimatePresence>
          {(status === STATUS.IDLE || status === STATUS.ERROR || status === STATUS.UPLOADING) && (
            <motion.form 
              key="form" 
              variants={containerVariants} 
              initial="hidden" 
              animate="visible" 
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
              {/* Urgent Emergency Badge */}
              <AnimatePresence>
                {isUrgent && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="flex items-center gap-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold px-4 py-3 rounded-2xl shadow-sm mb-4"
                  >
                    <div className="bg-white p-1.5 rounded-lg shadow-sm">
                      <Zap size={16} className="text-rose-600 animate-pulse" />
                    </div>
                    Emergency mode — prioritized for immediate courier dispatch
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ⚡ GEMINI AI INTEGRATION CARD */}


              {/* ⚡ INSTANT DEMO PRESCRIPTIONS (1-Click Test) */}
              <motion.div variants={itemVariants} className="bg-gradient-to-br from-indigo-50/90 via-blue-50/60 to-white rounded-3xl p-5 border border-indigo-200 shadow-md space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
                      <Zap size={18} className="text-amber-300" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black uppercase tracking-wider text-indigo-950">
                          Instant Demo Prescriptions
                        </h4>
                        <span className="text-[10px] font-black text-indigo-700 bg-indigo-100/90 px-2 py-0.5 rounded-full">
                          1-Click Live Test
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 font-medium mt-0.5">
                        Test the multi-pharmacy broadcast & live customer approval flow instantly without uploading
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {DEMO_PRESCRIPTIONS.map(demo => (
                    <div
                      key={demo.id}
                      className="bg-white rounded-2xl p-4 border border-gray-200/90 hover:border-indigo-300 shadow-sm transition-all flex flex-col justify-between space-y-3 hover:shadow-md"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                            {demo.badge}
                          </span>
                          <span className="text-[10px] text-gray-400 font-extrabold">{demo.medicines.length} Medicines</span>
                        </div>
                        <h5 className="font-extrabold text-xs text-gray-900 mt-2 leading-snug">{demo.title}</h5>
                        <p className="text-[10px] text-gray-500 font-medium mt-0.5">{demo.doctorName.split(',')[0]}</p>
                        <p className="text-[10px] text-blue-700 font-bold mt-1.5 truncate">
                          💊 {demo.medicines.map(m => m.name.split(' ')[0]).join(' + ')}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => handleRunInstantDemo(demo)}
                          className="py-2 px-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-[10px] font-black flex items-center justify-center gap-1 shadow-sm transition-all"
                        >
                          <Zap size={12} className="text-amber-300" />
                          <span>Fast Demo</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRunPipelineDemo(demo)}
                          className="py-2 px-2.5 bg-slate-100 hover:bg-slate-200 text-gray-800 rounded-xl text-[10px] font-extrabold flex items-center justify-center gap-1 transition-all"
                        >
                          <Play size={11} className="text-blue-600" />
                          <span>Run OCR</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* 1. Prescription File Uploader */}
              <motion.div variants={itemVariants} className="bg-white rounded-3xl p-5 border border-gray-200/90 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest flex items-center">
                    <FileText size={14} className="mr-1.5 text-blue-600" /> Prescription Slip / Doctor Rx
                  </p>
                  <span className="text-[10px] font-extrabold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200">
                    JPG, PNG, PDF
                  </span>
                </div>
                
                <div className="bg-slate-50/70 rounded-2xl border border-dashed border-gray-300 p-1">
                  <PrescriptionUploader file={file} onChange={setFile} />
                </div>

                {/* Pipeline Trigger Button */}
                {file && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 pt-3 border-t border-gray-100"
                  >
                    <button
                      type="button"
                      id="btn-run-pipeline"
                      onClick={handleStartPipeline}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-600 hover:from-blue-800 hover:to-cyan-700 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2.5 transition-all transform hover:scale-[1.01]"
                    >
                      <Sparkles size={18} className="text-cyan-300" />
                      <span>Scan & Check Medicine Availability</span>
                      <ArrowRight size={16} />
                    </button>
                    <p className="text-[11px] text-center text-gray-500 font-semibold mt-2">
                      Instant verification & live stock check across licensed pharmacies near you.
                    </p>
                  </motion.div>
                )}
              </motion.div>

              {/* 2. Optional Notes */}
              <motion.div variants={itemVariants} className="bg-white rounded-3xl p-5 border border-gray-200/90 shadow-sm">
                <label
                  htmlFor="note"
                  className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3"
                >
                  Patient Notes & Instructions <span className="normal-case font-medium text-gray-400 ml-1">(optional)</span>
                </label>
                <textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Need sugar-free syrup, doctor mentioned substitute is allowed"
                  rows={3}
                  maxLength={300}
                  className="w-full resize-none rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all leading-relaxed"
                />
                <p className="text-right text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">{note.length}/300</p>
              </motion.div>

              {/* 3. Urgent Checkbox */}
              <motion.div variants={itemVariants} className="bg-white rounded-3xl p-5 border border-gray-200/90 shadow-sm">
                <label
                  htmlFor="urgent"
                  className="flex items-center gap-4 cursor-pointer select-none"
                >
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
                        isUrgent ? "bg-rose-600 border-rose-600 shadow-rose-600/20" : "border-gray-300 bg-white"
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
                      Mark as Emergency / Urgent
                      {isUrgent && (
                        <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-widest shadow-sm flex items-center">
                          <Zap size={10} className="mr-1" /> Priority
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                      Pharmacy will dispatch in express sub-10 minute slot
                    </p>
                  </div>
                </label>
              </motion.div>

              {/* Error Message Display */}
              <AnimatePresence>
                {errMsg && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold px-4 py-3.5 rounded-2xl shadow-sm"
                  >
                    <AlertTriangle size={16} className="text-rose-600 flex-shrink-0 mt-0.5" />
                    <span>{errMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Direct Submit to Pharmacist button */}
              <motion.div variants={itemVariants}>
                <Button
                  id="btn-submit-prescription"
                  type="submit"
                  disabled={!file || status === STATUS.UPLOADING}
                  className="w-full py-5 rounded-2xl font-extrabold text-base shadow-lg transition-all"
                  size="lg"
                  variant={(!file || status === STATUS.UPLOADING) ? "outline" : "primary"}
                >
                  {status === STATUS.UPLOADING ? (
                    <>
                      <Loader2 size={20} className="animate-spin mr-2" />
                      Broadcasting to Pharmacy…
                    </>
                  ) : (
                    <>
                      <Send size={20} className="mr-2" />
                      Submit to Pharmacy Directly
                    </>
                  )}
                </Button>
              </motion.div>

            </motion.form>
          )}
        </AnimatePresence>

        {/* ── SAFETY & LICENSING GUARANTEE ───────────────────────────── */}
        <motion.div variants={itemVariants} className="flex items-start gap-3.5 bg-emerald-50 border border-emerald-200/80 rounded-3xl p-5 shadow-sm">
          <div className="bg-white p-2.5 rounded-2xl shadow-sm flex-shrink-0 border border-emerald-100">
            <ShieldCheck size={22} className="text-emerald-600" />
          </div>
          <div className="text-xs text-emerald-900 leading-relaxed">
            <span className="font-extrabold block mb-0.5 text-[11px] uppercase tracking-widest text-emerald-800">
              CDSCO Compliant & Registered Pharmacist Verification
            </span>
            All extracted medicines and dosages are cross-verified by a registered licensed pharmacist before dispensing and final invoice generation.
          </div>
        </motion.div>

      </motion.div>

      {/* ── MULTI-PHARMACY BROADCAST & REAL-TIME CUSTOMER APPROVAL MODAL ── */}
      <AnimatePresence>
        {broadcastModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-2xl w-full overflow-hidden my-8"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-5 text-white flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-extrabold tracking-widest uppercase text-blue-200 mb-1 border border-white/15">
                    <Radio size={12} className="animate-pulse text-amber-300" />
                    MediRush Live Dispatch Radar
                  </div>
                  <h3 className="text-lg font-black text-white">
                    {broadcastStep === 'pinging' && "Broadcasting to Nearest Connected Pharmacies..."}
                    {broadcastStep === 'approvals_ready' && "Pharmacy Approvals Received!"}
                    {broadcastStep === 'order_confirmed' && "Prescription Order Confirmed!"}
                  </h3>
                  <p className="text-xs text-blue-100/80 font-medium">
                    {broadcastStep === 'pinging' && "Connecting with 3 partner pharmacies in a 2.5 km radius"}
                    {broadcastStep === 'approvals_ready' && "All 3 pharmacies verified your prescription. Select who fulfills your order:"}
                    {broadcastStep === 'order_confirmed' && "Packed and assigned for 10-minute express doorstep delivery"}
                  </p>
                </div>

                {broadcastStep !== 'order_confirmed' && (
                  <button
                    onClick={() => setBroadcastModalOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors relative z-10"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Modal Content Body */}
              <div className="p-6 space-y-6">

                {/* ── STEP 1: PINGING / RADAR BROADCASTING ── */}
                {broadcastStep === 'pinging' && (
                  <div className="space-y-6 py-2">
                    {/* Visual Pulsing Radar */}
                    <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
                      <motion.div
                        animate={{ scale: [1, 2.3], opacity: [0.6, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                        className="absolute w-20 h-20 rounded-full border-2 border-blue-500 bg-blue-500/10"
                      />
                      <motion.div
                        animate={{ scale: [1, 2.3], opacity: [0.6, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: 0.6 }}
                        className="absolute w-20 h-20 rounded-full border-2 border-indigo-500 bg-indigo-500/10"
                      />
                      <motion.div
                        animate={{ scale: [1, 2.3], opacity: [0.6, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: 1.2 }}
                        className="absolute w-20 h-20 rounded-full border-2 border-emerald-500 bg-emerald-500/10"
                      />

                      <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex flex-col items-center justify-center shadow-xl shadow-blue-500/40 border-2 border-white">
                        <Radio size={22} className="animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-wider mt-0.5">YOU</span>
                      </div>
                    </div>

                    <div className="text-center space-y-1">
                      <h4 className="text-sm font-black text-gray-900 flex items-center justify-center gap-1.5">
                        <Loader2 size={16} className="animate-spin text-blue-600" />
                        Transmitting to Connected Pharmacies in {userLocation.locality}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium">
                        Pharmacists are examining your prescription slip and validating inventory in real time...
                      </p>
                    </div>

                    {/* Live Pharmacy Responses Stream */}
                    <div className="space-y-2.5">
                      {(nearbyPharmacies || PARTNER_PHARMACIES).map(pharm => {
                        const resp = pharmacyResponses[pharm.id] || { status: 'pinging', statusText: 'Connecting...' };
                        const isApproved = resp.status === 'approved';
                        const isReviewing = resp.status === 'reviewing';

                        return (
                          <div
                            key={pharm.id}
                            className={cn(
                              "p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3",
                              isApproved
                                ? "bg-emerald-50/80 border-emerald-200"
                                : isReviewing
                                ? "bg-amber-50/80 border-amber-200"
                                : "bg-slate-50 border-slate-200"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0 font-bold",
                                isApproved ? "bg-emerald-600" : isReviewing ? "bg-amber-500" : "bg-blue-600"
                              )}>
                                <Building2 size={18} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="font-extrabold text-xs text-gray-900">{pharm.name}</h5>
                                  <span className="text-[10px] text-gray-400 font-bold">({pharm.distance})</span>
                                </div>
                                <p className="text-[11px] font-medium text-gray-600 mt-0.5 leading-snug">
                                  {resp.statusText}
                                </p>
                              </div>
                            </div>

                            <div className="flex-shrink-0">
                              {isApproved ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-white px-2.5 py-1 rounded-xl border border-emerald-200 shadow-sm">
                                  <CheckCircle2 size={12} /> Accepted
                                </span>
                              ) : isReviewing ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-700 bg-white px-2.5 py-1 rounded-xl border border-amber-200 shadow-sm">
                                  <Loader2 size={12} className="animate-spin text-amber-600" /> Reviewing
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-blue-700 bg-white px-2.5 py-1 rounded-xl border border-blue-200 shadow-sm">
                                  <Radio size={12} className="animate-pulse" /> Pinging
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── STEP 2: ALL APPROVALS READY (CUSTOMER SELECTION & SPLIT OPTIONS) ── */}
                {broadcastStep === 'approvals_ready' && (
                  <div className="space-y-4">
                    {/* Top Mode Selector Tabs */}
                    {splitPlan && (
                      <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200">
                        <button
                          type="button"
                          onClick={() => setApprovalsTab('split')}
                          className={cn(
                            "flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                            approvalsTab === 'split'
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                              : "text-gray-600 hover:text-gray-900"
                          )}
                        >
                          <span>⚡ Smart Split Delivery (2 Pharmacies)</span>
                          <span className="text-[9px] bg-amber-400 text-slate-900 px-1.5 py-0.2 rounded-full font-extrabold">100% Stock</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setApprovalsTab('single')}
                          className={cn(
                            "flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                            approvalsTab === 'single'
                              ? "bg-white text-gray-900 shadow-sm"
                              : "text-gray-600 hover:text-gray-900"
                          )}
                        >
                          <span>Single Store Fulfillment</span>
                        </button>
                      </div>
                    )}

                    {/* ── TAB A: SMART SPLIT SOURCING ACROSS 2 PHARMACIES ── */}
                    {approvalsTab === 'split' && splitPlan ? (
                      <div className="space-y-3.5">
                        <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white p-4 rounded-3xl shadow-lg border border-indigo-700/50 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-900 px-2.5 py-0.5 rounded-full shadow-sm">
                              ⚡ Single Rider Multi-Stop Sourcing
                            </span>
                            <span className="text-xs text-indigo-200 font-bold">1 Dedicated Delivery Partner</span>
                          </div>
                          <h4 className="text-sm font-black text-white">
                            Can't find all medicines in one store?
                          </h4>
                          <p className="text-xs text-indigo-200 leading-relaxed font-medium">
                            Our dedicated rider (<strong className="text-amber-300">{splitPlan.rider?.name || 'Vikram Rathore'}</strong>) picks up package 1 from Apollo and package 2 from MedPlus, then delivers your complete order together in one trip!
                          </p>
                        </div>

                        {/* Dual Package Breakdown */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Package 1 Card */}
                          <div className="p-4 rounded-2xl border-2 border-blue-400/60 bg-gradient-to-br from-blue-50/70 to-white shadow-sm space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                                📦 Stop 1 (Apollo Store)
                              </span>
                              <span className="text-xs font-black text-emerald-700 flex items-center gap-1">
                                <Clock size={12} /> {splitPlan.store1.eta}
                              </span>
                            </div>

                            <div>
                              <h5 className="font-black text-sm text-gray-900">{splitPlan.store1.pharmacy.name}</h5>
                              <p className="text-[11px] text-gray-500 font-medium">📍 {splitPlan.store1.pharmacy.address || userLocation.locality}</p>
                            </div>

                            <div className="bg-white/80 p-2.5 rounded-xl border border-gray-200/80 space-y-1">
                              <span className="text-[9px] uppercase font-black text-gray-400 block">Medicines in this Package:</span>
                              {splitPlan.store1.items.map((it, idx) => (
                                <p key={idx} className="text-xs font-bold text-gray-800 flex items-center justify-between">
                                  <span>• {it.name}</span>
                                  <span className="text-gray-500 text-[11px]">₹{it.price}</span>
                                </p>
                              ))}
                            </div>

                            <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-150">
                              <span className="text-[10px] text-gray-700 font-bold">Rider: {splitPlan.rider?.name || 'Vikram Rathore'}</span>
                              <span className="font-black text-gray-900">₹{splitPlan.store1.total.toFixed(2)}</span>
                            </div>
                          </div>

                          {/* Package 2 Card */}
                          <div className="p-4 rounded-2xl border-2 border-indigo-400/60 bg-gradient-to-br from-indigo-50/70 to-white shadow-sm space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">
                                📦 Stop 2 (MedPlus Store)
                              </span>
                              <span className="text-xs font-black text-emerald-700 flex items-center gap-1">
                                <Clock size={12} /> {splitPlan.store2.eta}
                              </span>
                            </div>

                            <div>
                              <h5 className="font-black text-sm text-gray-900">{splitPlan.store2.pharmacy.name}</h5>
                              <p className="text-[11px] text-gray-500 font-medium">📍 {splitPlan.store2.pharmacy.address || userLocation.locality}</p>
                            </div>

                            <div className="bg-white/80 p-2.5 rounded-xl border border-gray-200/80 space-y-1">
                              <span className="text-[9px] uppercase font-black text-gray-400 block">Medicines in this Package:</span>
                              {splitPlan.store2.items.map((it, idx) => (
                                <p key={idx} className="text-xs font-bold text-gray-800 flex items-center justify-between">
                                  <span>• {it.name}</span>
                                  <span className="text-gray-500 text-[11px]">₹{it.price}</span>
                                </p>
                              ))}
                            </div>

                            <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-150">
                              <span className="text-[10px] text-gray-700 font-bold">Rider: {splitPlan.rider?.name || 'Vikram Rathore'}</span>
                              <span className="font-black text-gray-900">₹{splitPlan.store2.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Confirm Split Order Button */}
                        <div className="pt-2">
                          <Button
                            onClick={handleConfirmSplitOrder}
                            variant="primary"
                            className="w-full py-4 text-sm font-extrabold shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-700 hover:to-blue-700 text-white cursor-pointer"
                          >
                            <ShieldCheck size={18} />
                            <span>Confirm ⚡ Split Delivery (All {splitPlan.activeCount} Meds via 1 Rider) · ₹{splitPlan.total.toFixed(2)}</span>
                          </Button>
                          <p className="text-[10px] text-center text-gray-400 font-medium mt-1.5">
                            1 Dedicated Delivery Partner • Multi-Stop Pickup • Single Doorstep Delivery
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* ── TAB B: SINGLE STORE FULFILLMENT / PARTIAL ORDER ── */
                      <div className="space-y-3">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-3.5 rounded-2xl flex items-center justify-between shadow-md">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold">
                              <CheckCheck size={18} />
                            </div>
                            <div>
                              <p className="text-xs font-black uppercase tracking-wider text-emerald-100">Single Pharmacy Store Select</p>
                              <p className="text-sm font-extrabold">Choose one store to fulfill your selected items:</p>
                            </div>
                          </div>
                          <span className="text-xs bg-white text-emerald-800 font-black px-2.5 py-1 rounded-lg shadow-sm">
                            {totals.selectedCount} Items
                          </span>
                        </div>

                        {/* Pharmacy Cards for Selection */}
                        <div className="space-y-3">
                          {(nearbyPharmacies || PARTNER_PHARMACIES).map(pharm => {
                            const resp = pharmacyResponses[pharm.id];
                            const quotePrice = resp?.quotePrice || totals.total;
                            const isSelected = selectedApprovedPharm?.id === pharm.id;

                            return (
                              <div
                                key={pharm.id}
                                onClick={() => setSelectedApprovedPharm(pharm)}
                                className={cn(
                                  "p-4 rounded-2xl border cursor-pointer transition-all relative overflow-hidden",
                                  isSelected
                                    ? "border-blue-600 bg-gradient-to-br from-blue-50/90 via-indigo-50/50 to-white shadow-md ring-2 ring-blue-600/30"
                                    : "border-gray-200 hover:border-blue-300 bg-white"
                                )}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-start gap-3">
                                    <div className={cn(
                                      "w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors",
                                      isSelected ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 bg-white"
                                    )}>
                                      {isSelected && <Check size={12} strokeWidth={3} />}
                                    </div>

                                    <div>
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className="font-black text-sm text-gray-900">{pharm.name}</h4>
                                        <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">
                                          {pharm.badge}
                                        </span>
                                        <span className="flex items-center text-[10px] text-amber-600 font-bold">
                                          <Star size={10} className="fill-amber-400 text-amber-400 mr-0.5" /> {pharm.rating}
                                        </span>
                                      </div>

                                      <p className="text-[11px] text-gray-500 font-medium mt-1">
                                        👨‍⚕️ Verified by <span className="text-gray-800 font-bold">{pharm.pharmacistName}</span>
                                      </p>

                                      <p className="text-[10px] text-gray-400 mt-0.5">
                                        📍 {pharm.address} ({pharm.distance} away)
                                      </p>

                                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100 text-[11px]">
                                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                                          <CheckCircle2 size={12} /> Stock Confirmed ({totals.selectedCount} Meds)
                                        </span>
                                        <span className="text-gray-300">·</span>
                                        <span className="text-blue-700 font-extrabold flex items-center gap-1">
                                          <Clock size={12} /> {pharm.deliveryEta} Dispatch
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="text-right flex-shrink-0">
                                    <span className="text-lg font-black text-gray-900 block">₹{quotePrice.toFixed(2)}</span>
                                    {pharm.discountPercent > 0 && (
                                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                        Save {pharm.discountPercent}%
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Confirm Button */}
                        <div className="pt-2">
                          <Button
                            onClick={() => handleConfirmOrder(selectedApprovedPharm)}
                            variant="primary"
                            className="w-full py-4 text-sm font-extrabold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white cursor-pointer"
                          >
                            <ShieldCheck size={18} />
                            Confirm Order with {selectedApprovedPharm?.name} · ₹{(pharmacyResponses[selectedApprovedPharm?.id]?.quotePrice || totals.total).toFixed(2)}
                          </Button>
                          <p className="text-[10px] text-center text-gray-400 font-medium mt-1.5">
                            Free express delivery • Pay on Delivery (Cash/UPI) • Pharmacist Verified
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── STEP 3: ORDER CONFIRMED & DISPATCHING ── */}
                {broadcastStep === 'order_confirmed' && confirmedOrderData && (
                  <div className="space-y-5 text-center py-2">
                    <div className="relative w-20 h-20 mx-auto">
                      <div className="absolute inset-0 bg-emerald-500/20 rounded-full scale-125 animate-ping opacity-40" />
                      <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                        <CheckCircle2 size={40} />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xl font-black text-gray-900">
                        {confirmedOrderData.isSplitOrder 
                          ? "⚡ Split Prescription Order Dispatched!" 
                          : confirmedOrderData.isPartialOrder 
                          ? "Partial Prescription Order Dispatched!" 
                          : "Order Locked & Dispatched!"}
                      </h4>
                      <p className="text-xs text-gray-600 font-medium mt-1 max-w-md mx-auto">
                        {confirmedOrderData.isSplitOrder ? (
                          <span>Your order has been split between <strong className="text-blue-700">{confirmedOrderData.pharmacy_name}</strong>. 2 delivery riders have been assigned!</span>
                        ) : (
                          <span>Your prescription order has been accepted by <strong className="text-blue-700">{confirmedOrderData.pharmacy_name}</strong> and is currently being packed.</span>
                        )}
                      </p>
                    </div>

                    {/* Order Highlights Box */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                        <div>
                          <span className="text-[10px] uppercase font-black tracking-wider text-gray-400 block">Order ID</span>
                          <span className="text-sm font-black text-gray-900">#{confirmedOrderData.id}</span>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl text-right">
                          <span className="text-[9px] uppercase font-black tracking-wider text-amber-700 block">Delivery OTP</span>
                          <span className="text-sm font-black text-amber-900 tracking-wider">{confirmedOrderData.otp}</span>
                        </div>
                      </div>

                      {confirmedOrderData.isSplitOrder && confirmedOrderData.packages ? (
                        <div className="space-y-2">
                          <span className="text-[10px] uppercase font-black text-indigo-700 block">2 Live Packages in Transit:</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {confirmedOrderData.packages.map((pkg, i) => (
                              <div key={i} className="p-2.5 rounded-xl bg-white border border-gray-200 space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-extrabold text-blue-700">📦 Package {i + 1}</span>
                                  <span className="text-emerald-700 font-black">{pkg.deliveryEta}</span>
                                </div>
                                <p className="text-[11px] font-bold text-gray-800">{pkg.pharmacy_name}</p>
                                <p className="text-[10px] text-gray-500">Rider: {pkg.rider?.name}</p>
                                <p className="text-[10px] text-amber-700 font-black">OTP: {pkg.otp}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-gray-400 block">Fulfilling Store</span>
                            <p className="font-bold text-gray-800">{confirmedOrderData.pharmacy_name}</p>
                            <p className="text-[11px] text-gray-500">{confirmedOrderData.pharmacy_address}</p>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-gray-400 block">Estimated Arrival</span>
                            <p className="font-extrabold text-emerald-700">{confirmedOrderData.deliveryEta}</p>
                            <p className="text-[11px] text-gray-500">Live Rider Assigned</p>
                          </div>
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                        <span className="font-bold text-gray-600">Total Payable Amount:</span>
                        <span className="text-base font-black text-blue-700">₹{confirmedOrderData.total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-2">
                      <Button
                        onClick={() => {
                          setBroadcastModalOpen(false);
                          navigate(`/track-order/${confirmedOrderData.id}`);
                        }}
                        variant="primary"
                        className="w-full py-4 text-sm font-extrabold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <MapPin size={18} />
                        Track Live Delivery in Real Time
                      </Button>

                      <Button
                        onClick={() => {
                          setBroadcastModalOpen(false);
                          navigate('/orders');
                        }}
                        variant="outline"
                        className="w-full py-3 text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ShoppingBag size={15} />
                        View in My Orders
                      </Button>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

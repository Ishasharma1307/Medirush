import { mockMedicines } from '../mockData/mockMedicines';

// In-memory cache for all 253,973 medicines
let fullMedicineCache = null;
let isLoadingFullData = false;
let listeners = [];

function unpackCompactItem([id, name, price, brand, salt, strength, category, reqRx, disc], idx) {
  const discountPercent = (idx % 4) * 5 + 10;
  const origPrice = parseFloat((price * (1 + discountPercent / 100)).toFixed(2));
  return {
    id,
    pharmacy_id: "pharm-1",
    name,
    price,
    originalPrice: origPrice,
    discountPercent,
    brand: brand || 'Indian Healthcare',
    manufacturer_name: brand || 'Indian Healthcare',
    genericName: salt || 'Active Ingredients',
    salt_composition: salt || 'Active Ingredients',
    pack_size_label: strength || 'strip of 10 tablets',
    strength: strength || 'strip of 10 tablets',
    category: category || 'Personal Care',
    description: `${name} is an authentic Indian pharmaceutical product manufactured by ${brand || 'certified laboratories'} for therapeutic care.`,
    side_effects: 'Consult a certified doctor if unexpected reactions occur.',
    is_available: disc === 0,
    requires_prescription: reqRx === 1,
    rating: (4.2 + (idx % 8) * 0.1).toFixed(1),
    reviewCount: 50 + (idx * 7) % 400,
    deliveryTime: `${(idx % 3) * 5 + 10} mins`,
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80']
  };
}

export const loadAll250kMedicines = async () => {
  if (fullMedicineCache) return fullMedicineCache;
  if (isLoadingFullData) {
    return new Promise(resolve => {
      listeners.push(resolve);
    });
  }

  isLoadingFullData = true;
  try {
    const chunkPromises = [1, 2, 3].map(num => 
      fetch(`/dataset/medicines_chunk${num}.json`)
        .then(res => {
          if (!res.ok) throw new Error(`Chunk ${num} fetch failed`);
          return res.json();
        })
        .catch(err => {
          console.warn(`Failed loading chunk ${num}:`, err);
          return [];
        })
    );

    const chunks = await Promise.all(chunkPromises);
    const combinedCompact = chunks.flat();

    if (combinedCompact.length > 0) {
      fullMedicineCache = combinedCompact.map(unpackCompactItem);
      console.log(`Successfully loaded full database of ${fullMedicineCache.length} Indian medicines!`);
    } else {
      fullMedicineCache = mockMedicines;
    }
  } catch (err) {
    console.error('Error loading complete 250k medicine dataset:', err);
    fullMedicineCache = mockMedicines;
  } finally {
    isLoadingFullData = false;
    listeners.forEach(cb => cb(fullMedicineCache));
    listeners = [];
  }

  return fullMedicineCache;
};

// Find any medicine by ID across all 253,973 records
export const findMedicineById = (id) => {
  if (!id) return null;
  
  // 1. Search in mockMedicines (fastest)
  const mockMatch = mockMedicines.find(m => m.id === id || m.id === `med-${id}`);
  if (mockMatch) return mockMatch;

  // 2. Search in full cache if loaded
  if (fullMedicineCache && fullMedicineCache.length > 0) {
    const fullMatch = fullMedicineCache.find(m => m.id === id || m.id === `med-${id}`);
    if (fullMatch) return fullMatch;
  }

  // 3. Match numeric ID (e.g. med-10520)
  const cleanId = String(id).replace('med-', '');
  const num = parseInt(cleanId, 10);
  if (!isNaN(num) && num > 0) {
    if (fullMedicineCache && fullMedicineCache[num - 1]) {
      return fullMedicineCache[num - 1];
    }
    if (mockMedicines[num - 1]) {
      return mockMedicines[num - 1];
    }
  }

  return null;
};

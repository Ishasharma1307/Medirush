const fs = require('fs');
const path = require('path');

const csvPath = 'C:\\Users\\ishas\\MEDIRUSH.APP\\Indian-Medicine-Dataset-main\\DATA\\updated_indian_medicine_data.csv';
const outputPath = 'C:\\Users\\ishas\\MEDIRUSH.APP\\medirush-app\\src\\mockData\\mockMedicines.js';

// Medical images mapping by category and product form
const IMAGES = {
  tablet_blue: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80",
  tablet_white: "https://images.unsplash.com/photo-1550572017-edf79286102a?w=500&auto=format&fit=crop&q=80",
  capsule_red: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=80",
  syrup_amber: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&auto=format&fit=crop&q=80",
  cream_tube: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80",
  spray_bottle: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=500&auto=format&fit=crop&q=80",
  first_aid: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&auto=format&fit=crop&q=80",
  vitamins: "https://images.unsplash.com/photo-1577401239170-897942555fb3?w=500&auto=format&fit=crop&q=80",
  eye_drops: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=80"
};

function getMedicineImage(name, category) {
  const lname = name.toLowerCase();
  if (lname.includes('eye drop') || lname.includes('drops') || lname.includes('nasal spray')) {
    return IMAGES.eye_drops;
  }
  if (lname.includes('syrup') || lname.includes('liquid') || lname.includes('suspension') || lname.includes('solution')) {
    return IMAGES.syrup_amber;
  }
  if (lname.includes('cream') || lname.includes('gel') || lname.includes('ointment') || lname.includes('lotion')) {
    return IMAGES.cream_tube;
  }
  if (lname.includes('spray') || lname.includes('inhaler')) {
    return IMAGES.spray_bottle;
  }
  if (lname.includes('capsule') || lname.includes('softgel')) {
    return IMAGES.capsule_red;
  }
  if (category === 'Vitamins') {
    return IMAGES.vitamins;
  }
  if (category === 'First Aid') {
    return IMAGES.first_aid;
  }
  if (lname.includes('tablet') || lname.includes('tab')) {
    return IMAGES.tablet_blue;
  }
  return IMAGES.tablet_white;
}

function categorizeMedicine(name, composition, shortDesc) {
  const text = (name + ' ' + composition + ' ' + shortDesc).toLowerCase();
  
  if (text.includes('metformin') || text.includes('glimepiride') || text.includes('vildagliptin') || text.includes('sitagliptin') || text.includes('insulin') || text.includes('diabetic') || text.includes('diabetes') || text.includes('teneligliptin') || text.includes('dapagliflozin')) {
    return 'Diabetes Care';
  }
  if (text.includes('atorvastatin') || text.includes('telmisartan') || text.includes('amlodipine') || text.includes('rosuvastatin') || text.includes('clopidogrel') || text.includes('cardiac') || text.includes('blood pressure') || text.includes('hypertension') || text.includes('bp')) {
    return 'Cardiac Care';
  }
  if (text.includes('paracetamol') || text.includes('aceclofenac') || text.includes('ibuprofen') || text.includes('nimesulide') || text.includes('pain') || text.includes('spas') || text.includes('diclofenac') || text.includes('tramadol') || text.includes('combiflam') || text.includes('dolo') || text.includes('crocin') || text.includes('volini') || text.includes('voveran') || text.includes('meftal')) {
    return 'Pain Relief';
  }
  if (text.includes('amoxycillin') || text.includes('azithromycin') || text.includes('cefixime') || text.includes('ciprofloxacin') || text.includes('antibiotic') || text.includes('ofloxacin') || text.includes('erythromycin') || text.includes('clavulanic') || text.includes('augmentin') || text.includes('azithral') || text.includes('taxim') || text.includes('azee') || text.includes('almox') || text.includes('zifi') || text.includes('moxikind')) {
    return 'Antibiotics';
  }
  if (text.includes('cough') || text.includes('syrup') || text.includes('cold') || text.includes('fexofenadine') || text.includes('cetirizine') || text.includes('pheniramine') || text.includes('montelukast') || text.includes('ambroxol') || text.includes('allegra') || text.includes('ascoril') || text.includes('vicks') || text.includes('strepsils') || text.includes('avil') || text.includes('cheston') || text.includes('sinarest') || text.includes('alex') || text.includes('benadryl') || text.includes('otrivin')) {
    return 'Cold & Cough';
  }
  if (text.includes('acid') || text.includes('antacid') || text.includes('ranitidine') || text.includes('pantoprazole') || text.includes('omeprazole') || text.includes('rabeprazole') || text.includes('digestive') || text.includes('eno') || text.includes('electral') || text.includes('digene') || text.includes('pudin') || text.includes('aciloc') || text.includes('gelusil') || text.includes('pan 40') || text.includes('pantocid') || text.includes('dulcolax')) {
    return 'Digestive Health';
  }
  if (text.includes('vitamin') || text.includes('calcium') || text.includes('zinc') || text.includes('methylcobalamin') || text.includes('becosules') || text.includes('shelcal') || text.includes('limcee') || text.includes('neurobion') || text.includes('evion') || text.includes('supradyn') || text.includes('revital') || text.includes('arachitol') || text.includes('zincovit') || text.includes('tayo')) {
    return 'Vitamins';
  }
  if (text.includes('gel') || text.includes('cream') || text.includes('ointment') || text.includes('skin') || text.includes('adapalene') || text.includes('clindamycin') || text.includes('betadine') || text.includes('azelaic') || text.includes('ketoconazole') || text.includes('candid') || text.includes('anovate') || text.includes('clocip') || text.includes('burnol') || text.includes('omnigel')) {
    return 'Skin Care';
  }
  if (text.includes('dettol') || text.includes('band-aid') || text.includes('antiseptic') || text.includes('bandage') || text.includes('savlon') || text.includes('first aid') || text.includes('cotton') || text.includes('gauze') || text.includes('hydrogen peroxide')) {
    return 'First Aid';
  }
  return 'Personal Care';
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Iconic everyday Indian medicines to guarantee inclusion
const TOP_MUST_HAVE_MEDICINES = [
  {
    name: "Dolo 650 Tablet",
    price: 30.50,
    manufacturer: "Micro Labs Ltd",
    category: "Pain Relief",
    composition: "Paracetamol (650mg)",
    packSize: "strip of 15 tablets",
    description: "Dolo 650 Tablet is a widely trusted antipyretic and analgesic used to relieve pain and fever. It is commonly prescribed for headache, muscle ache, toothache, and fever during viral infections.",
    side_effects: "Nausea, Allergic reactions, Stomach upset (rare)",
    requiresPrescription: false
  },
  {
    name: "Crocin Advance 500mg Tablet",
    price: 22.40,
    manufacturer: "GlaxoSmithKline Consumer Healthcare",
    category: "Pain Relief",
    composition: "Paracetamol (500mg)",
    packSize: "strip of 15 tablets",
    description: "Crocin Advance 500mg Tablet features fast release technology for quick pain and fever relief. Safe and gentle on the stomach when taken as directed.",
    side_effects: "Nausea, Skin rash",
    requiresPrescription: false
  },
  {
    name: "Combiflam Tablet",
    price: 45.80,
    manufacturer: "Sanofi India Ltd",
    category: "Pain Relief",
    composition: "Ibuprofen (400mg) + Paracetamol (325mg)",
    packSize: "strip of 20 tablets",
    description: "Combiflam Tablet combines Ibuprofen and Paracetamol to treat body pain, joint pain, toothache, and fever with fast anti-inflammatory action.",
    side_effects: "Heartburn, Stomach pain, Dizziness",
    requiresPrescription: false
  },
  {
    name: "Volini Pain Relief Spray 100g",
    price: 249.00,
    manufacturer: "Sun Pharmaceutical Industries Ltd",
    category: "Pain Relief",
    composition: "Diclofenac Diethylamine (1.16%) + Menthol (5%) + Methyl Salicylate (10%)",
    packSize: "bottle of 100g Spray",
    description: "Volini Pain Relief Spray provides instant, deep-penetrating relief from joint pain, lower back pain, neck pain, strain, and sprains.",
    side_effects: "Mild skin redness or tingling",
    requiresPrescription: false
  },
  {
    name: "Digene Antacid Gel (Mint Flavor) 200ml",
    price: 135.00,
    manufacturer: "Abbott Healthcare",
    category: "Digestive Health",
    composition: "Magnesium Hydroxide (185mg) + Simethicone (50mg) + Aluminium Hydroxide (830mg)",
    packSize: "bottle of 200ml Liquid",
    description: "Digene Gel provides fast and long-lasting relief from acidity, heartburn, gas, and stomach bloating. Sugar-free mint formula.",
    side_effects: "Constipation or mild diarrhea (if taken in excess)",
    requiresPrescription: false
  },
  {
    name: "Eno Fruit Salt (Lemon) 100g",
    price: 160.00,
    manufacturer: "GlaxoSmithKline",
    category: "Digestive Health",
    composition: "Sodium Bicarbonate (2.32g) + Citric Acid (2.18g)",
    packSize: "bottle of 100g Powder",
    description: "Eno Fruit Salt acts in just 6 seconds to neutralize excess stomach acid and relieve acidity, heaviness, and indigestion.",
    side_effects: "Mild belching",
    requiresPrescription: false
  },
  {
    name: "Electral ORS Powder (Orange) 21.8g",
    price: 21.50,
    manufacturer: "FDC Ltd",
    category: "Digestive Health",
    composition: "Sodium Chloride (0.52g) + Potassium Chloride (0.30g) + Sodium Citrate (0.58g) + Dextrose (2.70g)",
    packSize: "sachet of 21.8g Powder",
    description: "Electral Powder is a WHO-based Oral Rehydration Salt formula that restores fluids and essential electrolytes lost due to dehydration, diarrhea, or heat stroke.",
    side_effects: "None when reconstituted as directed",
    requiresPrescription: false
  },
  {
    name: "Becosules Capsule (Pack of 20)",
    price: 52.00,
    manufacturer: "Pfizer Ltd",
    category: "Vitamins",
    composition: "Vitamin B-Complex + Vitamin C",
    packSize: "strip of 20 capsules",
    description: "Becosules Capsule is a daily multivitamin supplement containing Vitamin B-Complex and Vitamin C to combat tissue repair, mouth ulcers, and weakness.",
    side_effects: "Bright yellow urine (normal B-vitamin clearance)",
    requiresPrescription: false
  },
  {
    name: "Shelcal 500 Tablet",
    price: 131.50,
    manufacturer: "Torrent Pharmaceuticals Ltd",
    category: "Vitamins",
    composition: "Elemental Calcium (500mg) + Vitamin D3 (250IU)",
    packSize: "strip of 15 tablets",
    description: "Shelcal 500 Tablet supports strong bones and joints by addressing Calcium and Vitamin D3 deficiencies in men and women.",
    side_effects: "Constipation, Stomach upset",
    requiresPrescription: false
  },
  {
    name: "Dettol Antiseptic Liquid 250ml",
    price: 145.00,
    manufacturer: "Reckitt Benckiser",
    category: "First Aid",
    composition: "Chloroxylenol (4.8% w/v)",
    packSize: "bottle of 250ml Liquid",
    description: "Dettol Antiseptic Liquid provides protection against 100 illness-causing germs. Used for wound cleaning, bathing, and household sanitation.",
    side_effects: "For external use only. Skin irritation if undiluted.",
    requiresPrescription: false
  },
  {
    name: "Band-Aid Washproof (Pack of 100)",
    price: 210.00,
    manufacturer: "Johnson & Johnson",
    category: "First Aid",
    composition: "Waterproof Medicated Strip",
    packSize: "box of 100 Strips",
    description: "Band-Aid Washproof strips protect minor cuts and scrapes from water, dirt, and bacteria with non-stick pad technology.",
    side_effects: "None",
    requiresPrescription: false
  },
  {
    name: "Betadine 10% Ointment 20g",
    price: 134.00,
    manufacturer: "Win-Medicare Pvt Ltd",
    category: "Skin Care",
    composition: "Povidone Iodine (10% w/w)",
    packSize: "tube of 20g Ointment",
    description: "Betadine Ointment is a broad-spectrum antiseptic for minor burns, cuts, abrasions, and skin infections.",
    side_effects: "Mild burning sensation at application site",
    requiresPrescription: false
  },
  {
    name: "Vicks Vaporub 50g",
    price: 165.00,
    manufacturer: "Procter & Gamble",
    category: "Cold & Cough",
    composition: "Menthol (2.82%) + Camphor (5.25%) + Eucalyptus Oil (1.33%)",
    packSize: "jar of 50g Rub",
    description: "Vicks Vaporub provides quick relief from cold symptoms, nasal congestion, cough, and body ache upon application or steam inhalation.",
    side_effects: "External use only. Avoid nostrils in children under 2.",
    requiresPrescription: false
  },
  {
    name: "Strepsils Honey & Lemon (Pack of 8)",
    price: 36.00,
    manufacturer: "Reckitt Benckiser",
    category: "Cold & Cough",
    composition: "2,4-Dichlorobenzyl Alcohol (1.2mg) + Amylmetacresol (0.6mg)",
    packSize: "strip of 8 Lozenges",
    description: "Strepsils Honey & Lemon lozenges soothe sore throat, throat irritation, and dry cough with antibacterial relief.",
    side_effects: "None when taken as recommended",
    requiresPrescription: false
  }
];

console.log('Extracting comprehensive 1000+ medicine dataset from Indian Medicine CSV...');
const content = fs.readFileSync(csvPath, 'utf8');
const lines = content.split('\n');

const extractedList = [...TOP_MUST_HAVE_MEDICINES];
const seenNames = new Set(TOP_MUST_HAVE_MEDICINES.map(m => m.name.toLowerCase()));

// Stream through lines to extract 1000 unique valid non-discontinued Indian medicines
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  const record = parseCSVLine(line);
  if (record.length >= 10) {
    const id = record[0];
    const name = record[1].replace(/^"|"$/g, '').trim();
    const price = parseFloat(record[2]);
    const discontinued = record[3].trim() === 'TRUE';
    const manufacturer = record[4].replace(/^"|"$/g, '').trim();
    const packSize = record[6].replace(/^"|"$/g, '').trim();
    const shortComp1 = record[7].replace(/^"|"$/g, '').trim();
    const shortComp2 = record[8].replace(/^"|"$/g, '').trim();
    const saltComp = record[9].replace(/^"|"$/g, '').trim();
    const desc = record[10] ? record[10].replace(/^"|"$/g, '').trim() : '';
    const sideEff = record[11] ? record[11].replace(/^"|"$/g, '').trim() : '';

    if (name && price > 0 && !discontinued && !seenNames.has(name.toLowerCase())) {
      seenNames.add(name.toLowerCase());
      
      const comp = saltComp || (shortComp1 + (shortComp2 ? ' + ' + shortComp2 : ''));
      const cat = categorizeMedicine(name, comp, desc);
      
      extractedList.push({
        name: name,
        price: price,
        manufacturer: manufacturer || 'Standard Indian Pharmaceuticals',
        category: cat,
        composition: comp || 'Active Pharmaceutical Ingredients',
        packSize: packSize || 'strip of 10 tablets',
        description: desc || `${name} is an authentic Indian pharmaceutical product manufactured by ${manufacturer || 'licensed laboratories'} for targeted relief and symptom management.`,
        side_effects: sideEff || 'Consult your physician if severe reactions occur.',
        requiresPrescription: name.toLowerCase().includes('625') || name.toLowerCase().includes('500') || cat === 'Antibiotics' || cat === 'Diabetes Care' || cat === 'Cardiac Care'
      });
      
      if (extractedList.length >= 1000) break;
    }
  }
}

console.log(`Prepared ${extractedList.length} authentic Indian medicines for MediRush.`);

// Transform to JS mockMedicines array
const finalMedicines = extractedList.map((med, index) => {
  const seed = index + 1;
  const discountPercent = (seed % 4) * 5 + 10; // 10%, 15%, 20%, 25%
  const origPrice = parseFloat((med.price * (1 + discountPercent / 100)).toFixed(2));
  const rating = (4.2 + (seed % 8) * 0.1).toFixed(1);
  const reviewCount = 80 + (seed * 13) % 450;
  const deliveryTime = `${(seed % 3) * 5 + 10} mins`;
  const isAvailable = seed % 15 !== 0; // Most available
  
  return {
    id: `med-${seed}`,
    pharmacy_id: "pharm-1",
    name: med.name,
    category: med.category,
    price: med.price,
    originalPrice: origPrice,
    discountPercent: discountPercent,
    brand: med.manufacturer,
    manufacturer_name: med.manufacturer,
    genericName: med.composition,
    salt_composition: med.composition,
    pack_size_label: med.packSize,
    strength: med.packSize,
    description: med.description,
    side_effects: med.side_effects,
    is_available: isAvailable,
    requires_prescription: med.requiresPrescription,
    rating: rating,
    reviewCount: reviewCount,
    deliveryTime: deliveryTime,
    images: [getMedicineImage(med.name, med.category)],
    created_at: new Date(Date.now() - seed * 86400000).toISOString()
  };
});

const fileContent = `export const mockMedicines = ${JSON.stringify(finalMedicines, null, 2)};\n`;

fs.writeFileSync(outputPath, fileContent, 'utf8');
console.log(`Successfully written ${finalMedicines.length} real Indian medicines to ${outputPath}`);

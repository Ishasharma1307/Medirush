const fs = require('fs');
const path = require('path');

const csvPath = 'C:\\Users\\ishas\\MEDIRUSH.APP\\Indian-Medicine-Dataset-main\\DATA\\updated_indian_medicine_data.csv';
const datasetDir = 'C:\\Users\\ishas\\MEDIRUSH.APP\\medirush-app\\public\\dataset';
const jsOutputPath = 'C:\\Users\\ishas\\MEDIRUSH.APP\\medirush-app\\src\\mockData\\mockMedicines.js';

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
  const lname = (name || '').toLowerCase();
  if (lname.includes('eye drop') || lname.includes('drops') || lname.includes('nasal spray')) return IMAGES.eye_drops;
  if (lname.includes('syrup') || lname.includes('liquid') || lname.includes('suspension') || lname.includes('solution')) return IMAGES.syrup_amber;
  if (lname.includes('cream') || lname.includes('gel') || lname.includes('ointment') || lname.includes('lotion')) return IMAGES.cream_tube;
  if (lname.includes('spray') || lname.includes('inhaler')) return IMAGES.spray_bottle;
  if (lname.includes('capsule') || lname.includes('softgel')) return IMAGES.capsule_red;
  if (category === 'Vitamins') return IMAGES.vitamins;
  if (category === 'First Aid') return IMAGES.first_aid;
  if (lname.includes('tablet') || lname.includes('tab')) return IMAGES.tablet_blue;
  return IMAGES.tablet_white;
}

function categorizeMedicine(name, composition, shortDesc) {
  const text = ((name || '') + ' ' + (composition || '') + ' ' + (shortDesc || '')).toLowerCase();
  
  if (text.includes('metformin') || text.includes('glimepiride') || text.includes('vildagliptin') || text.includes('sitagliptin') || text.includes('insulin') || text.includes('diabetic') || text.includes('diabetes') || text.includes('teneligliptin') || text.includes('dapagliflozin')) return 'Diabetes Care';
  if (text.includes('atorvastatin') || text.includes('telmisartan') || text.includes('amlodipine') || text.includes('rosuvastatin') || text.includes('clopidogrel') || text.includes('cardiac') || text.includes('blood pressure') || text.includes('hypertension') || text.includes('bp')) return 'Cardiac Care';
  if (text.includes('paracetamol') || text.includes('aceclofenac') || text.includes('ibuprofen') || text.includes('nimesulide') || text.includes('pain') || text.includes('spas') || text.includes('diclofenac') || text.includes('tramadol') || text.includes('combiflam') || text.includes('dolo') || text.includes('crocin') || text.includes('volini') || text.includes('voveran') || text.includes('meftal')) return 'Pain Relief';
  if (text.includes('amoxycillin') || text.includes('azithromycin') || text.includes('cefixime') || text.includes('ciprofloxacin') || text.includes('antibiotic') || text.includes('ofloxacin') || text.includes('erythromycin') || text.includes('clavulanic') || text.includes('augmentin') || text.includes('azithral') || text.includes('taxim') || text.includes('azee') || text.includes('almox') || text.includes('zifi') || text.includes('moxikind')) return 'Antibiotics';
  if (text.includes('cough') || text.includes('syrup') || text.includes('cold') || text.includes('fexofenadine') || text.includes('cetirizine') || text.includes('pheniramine') || text.includes('montelukast') || text.includes('ambroxol') || text.includes('allegra') || text.includes('ascoril') || text.includes('vicks') || text.includes('strepsils') || text.includes('avil') || text.includes('cheston') || text.includes('sinarest') || text.includes('alex') || text.includes('benadryl') || text.includes('otrivin')) return 'Cold & Cough';
  if (text.includes('acid') || text.includes('antacid') || text.includes('ranitidine') || text.includes('pantoprazole') || text.includes('omeprazole') || text.includes('rabeprazole') || text.includes('digestive') || text.includes('eno') || text.includes('electral') || text.includes('digene') || text.includes('pudin') || text.includes('aciloc') || text.includes('gelusil') || text.includes('pan 40') || text.includes('pantocid') || text.includes('dulcolax')) return 'Digestive Health';
  if (text.includes('vitamin') || text.includes('calcium') || text.includes('zinc') || text.includes('methylcobalamin') || text.includes('becosules') || text.includes('shelcal') || text.includes('limcee') || text.includes('neurobion') || text.includes('evion') || text.includes('supradyn') || text.includes('revital') || text.includes('arachitol') || text.includes('zincovit') || text.includes('tayo')) return 'Vitamins';
  if (text.includes('gel') || text.includes('cream') || text.includes('ointment') || text.includes('skin') || text.includes('adapalene') || text.includes('clindamycin') || text.includes('betadine') || text.includes('azelaic') || text.includes('ketoconazole') || text.includes('candid') || text.includes('anovate') || text.includes('clocip') || text.includes('burnol') || text.includes('omnigel')) return 'Skin Care';
  if (text.includes('dettol') || text.includes('band-aid') || text.includes('antiseptic') || text.includes('bandage') || text.includes('savlon') || text.includes('first aid') || text.includes('cotton') || text.includes('gauze') || text.includes('hydrogen peroxide')) return 'First Aid';
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

console.log('Processing EVERY SINGLE medicine row from Indian Medicine CSV (253,974 rows)...');

if (!fs.existsSync(datasetDir)) {
  fs.mkdirSync(datasetDir, { recursive: true });
}

const content = fs.readFileSync(csvPath, 'utf8');
const lines = content.split('\n');

const allRows = [];
const topMockList = [];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  const record = parseCSVLine(line);
  if (record.length >= 2) {
    const csvId = record[0] || `${i}`;
    const id = `med-${i}`;
    const name = record[1] ? record[1].replace(/^"|"$/g, '').trim() : '';
    
    if (name) {
      const priceRaw = parseFloat(record[2]);
      const price = !isNaN(priceRaw) && priceRaw > 0 ? priceRaw : 45.0;
      const discontinued = record[3] ? record[3].trim() === 'TRUE' : false;
      const manufacturer = record[4] ? record[4].replace(/^"|"$/g, '').trim() : 'Indian Healthcare Ltd';
      const packSize = record[6] ? record[6].replace(/^"|"$/g, '').trim() : 'strip of 10 tablets';
      const shortComp1 = record[7] ? record[7].replace(/^"|"$/g, '').trim() : '';
      const shortComp2 = record[8] ? record[8].replace(/^"|"$/g, '').trim() : '';
      const saltComp = record[9] ? record[9].replace(/^"|"$/g, '').trim() : '';
      const desc = record[10] ? record[10].replace(/^"|"$/g, '').trim() : '';
      const sideEff = record[11] ? record[11].replace(/^"|"$/g, '').trim() : '';

      const comp = saltComp || (shortComp1 + (shortComp2 ? ' + ' + shortComp2 : ''));
      const cat = categorizeMedicine(name, comp, desc);
      const discountPercent = (i % 4) * 5 + 10;
      const origPrice = parseFloat((price * (1 + discountPercent / 100)).toFixed(2));
      const rating = (4.2 + (i % 8) * 0.1).toFixed(1);
      const reviewCount = 50 + (i * 7) % 400;
      const deliveryTime = `${(i % 3) * 5 + 10} mins`;
      const isAvailable = !discontinued && (i % 20 !== 0);
      const reqRx = name.toLowerCase().includes('625') || name.toLowerCase().includes('500') || cat === 'Antibiotics' || cat === 'Diabetes Care' || cat === 'Cardiac Care';

      const fullObj = {
        id: id,
        csv_id: csvId,
        pharmacy_id: "pharm-1",
        name: name,
        category: cat,
        price: price,
        originalPrice: origPrice,
        discountPercent: discountPercent,
        brand: manufacturer,
        manufacturer_name: manufacturer,
        genericName: comp || 'Active Pharmaceutical Ingredient',
        salt_composition: comp || 'Active Pharmaceutical Ingredient',
        pack_size_label: packSize,
        strength: packSize,
        description: desc || `${name} is an authentic pharmaceutical product manufactured by ${manufacturer} for clinical therapy.`,
        side_effects: sideEff || 'Consult a certified physician if severe symptoms persist.',
        is_available: isAvailable,
        requires_prescription: reqRx,
        rating: rating,
        reviewCount: reviewCount,
        deliveryTime: deliveryTime,
        images: [getMedicineImage(name, cat)],
        created_at: new Date(Date.now() - (i % 100) * 86400000).toISOString()
      };

      if (topMockList.length < 2000) {
        topMockList.push(fullObj);
      }

      // Compact representation array for chunking
      allRows.push([
        id,
        name,
        price,
        manufacturer,
        comp || 'Active Ingredients',
        packSize,
        cat,
        reqRx ? 1 : 0,
        discontinued ? 1 : 0
      ]);
    }
  }
}

console.log(`Processed EXACT TOTAL ${allRows.length} medicine records from the CSV file!`);

// Write top 2000 to mockMedicines.js for instant UI rendering
const jsContent = `export const mockMedicines = ${JSON.stringify(topMockList, null, 2)};\n`;
fs.writeFileSync(jsOutputPath, jsContent, 'utf8');
console.log(`Saved top 2,000 medicines to ${jsOutputPath}`);

// Split ALL 253,973 records into 3 chunks (~84,000 items per chunk)
const CHUNK_SIZE = 85000;
const chunksCount = Math.ceil(allRows.length / CHUNK_SIZE);

for (let c = 0; c < chunksCount; c++) {
  const start = c * CHUNK_SIZE;
  const end = Math.min(start + CHUNK_SIZE, allRows.length);
  const chunkData = allRows.slice(start, end);
  const chunkPath = path.join(datasetDir, `medicines_chunk${c + 1}.json`);
  
  fs.writeFileSync(chunkPath, JSON.stringify(chunkData), 'utf8');
  const sizeMb = (fs.statSync(chunkPath).size / (1024 * 1024)).toFixed(2);
  console.log(`Chunk ${c + 1}/${chunksCount}: ${chunkData.length} medicines (${sizeMb} MB) -> ${chunkPath}`);
}

// Save dataset metadata info file
const metaPath = path.join(datasetDir, 'metadata.json');
fs.writeFileSync(metaPath, JSON.stringify({
  total_medicines: allRows.length,
  chunks: chunksCount,
  created_at: new Date().toISOString()
}, null, 2), 'utf8');

console.log(`Dataset processing complete! 100% of all ${allRows.length} CSV rows are included across ${chunksCount} chunk files.`);

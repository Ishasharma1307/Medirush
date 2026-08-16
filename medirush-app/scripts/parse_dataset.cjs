const fs = require('fs');
const path = require('path');

const csvPath = 'C:\\Users\\ishas\\MEDIRUSH.APP\\Indian-Medicine-Dataset-main\\DATA\\updated_indian_medicine_data.csv';

console.log('Reading dataset from:', csvPath);
const fileStream = fs.createReadStream(csvPath, { encoding: 'utf8' });

let buffer = '';
let count = 0;
const medicines = [];

fileStream.on('data', (chunk) => {
  buffer += chunk;
  const lines = buffer.split('\n');
  buffer = lines.pop(); // keep remainder

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    count++;
    if (count === 1) continue; // skip header

    // Parse simple CSV record
    // CSV Header: id,name,price,Is_discontinued,manufacturer_name,type,pack_size_label,short_composition1,short_composition2,salt_composition,medicine_desc,side_effects,drug_interactions
    // extract fields safely
    if (medicines.length < 500) {
      const match = line.match(/^(\d+),("(?:[^"]|"")*"|[^,]*),(\d+(?:\.\d+)?),([^,]*),("(?:[^"]|"")*"|[^,]*),([^,]*),("(?:[^"]|"")*"|[^,]*)/);
      if (match) {
        const id = match[1];
        const name = match[2].replace(/^"|"$/g, '').trim();
        const price = parseFloat(match[3]);
        const discontinued = match[4].trim() === 'TRUE';
        const manufacturer = match[5].replace(/^"|"$/g, '').trim();
        const type = match[6].trim();
        const packSize = match[7].replace(/^"|"$/g, '').trim();

        if (name && price > 0 && !discontinued) {
          medicines.push({ id, name, price, manufacturer, type, packSize, raw: line.substring(0, 300) });
        }
      }
    }
  }
});

fileStream.on('end', () => {
  console.log(`Finished reading. Extracted ${medicines.length} valid medicines.`);
  console.log('Sample medicines:', medicines.slice(0, 10));
});

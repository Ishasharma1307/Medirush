const fs = require('fs');
const path = require('path');

const csvPath = 'C:\\Users\\ishas\\MEDIRUSH.APP\\Indian-Medicine-Dataset-main\\DATA\\updated_indian_medicine_data.csv';

// Read CSV
const content = fs.readFileSync(csvPath, 'utf8');
const lines = content.split('\n');

console.log('Total lines in CSV:', lines.length);
console.log('Header:', lines[0]);

// Simple CSV parser
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

const header = parseCSVLine(lines[0]);
console.log('Parsed Header:', header);

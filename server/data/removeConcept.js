const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'carsSeed.js');
let content = fs.readFileSync(filePath, 'utf8');

// Replace "name": "Brand Concept" with "name": "Brand"
content = content.replace(/"name":\s*"([^"]+)\s+Concept"/g, '"name": "$1"');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully removed "Concept" from car names.');

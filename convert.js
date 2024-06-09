const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const results = [];

const filePath = path.join(__dirname,'table.csv');

fs.createReadStream(filePath)
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    fs.writeFileSync('data.json', JSON.stringify(results, null, 2));
    console.log('CSV data converted to JSON');
  })
  .on('error', (error) => {
    console.error('Error reading the file:', error);
  });

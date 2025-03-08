// filepath: c:\Users\bmias\Documents\app-prontuario-medico\frontend\check-permissions.js
const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'dist');

fs.access(distPath, fs.constants.W_OK, (err) => {
  if (err) {
    console.error(`No write permission for ${distPath}`);
    process.exit(1);
  } else {
    console.log(`Write permission confirmed for ${distPath}`);
  }
});
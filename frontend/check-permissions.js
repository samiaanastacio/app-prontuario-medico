// filepath: c:\Users\bmias\Documents\app-prontuario-medico\frontend\check-permissions.js
import { access, constants } from 'fs';
import { join } from 'path';

// eslint-disable-next-line no-undef
const distPath = join(__dirname, 'dist');

access(distPath, constants.W_OK, (err) => {
  if (err) {
    console.error(`No write permission for ${distPath}`);
    // eslint-disable-next-line no-undef
    process.exit(1);
  } else {
    console.log(`Write permission confirmed for ${distPath}`);
  }
});
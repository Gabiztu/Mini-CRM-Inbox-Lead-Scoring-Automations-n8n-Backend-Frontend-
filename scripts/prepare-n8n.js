const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'docs', 'workflows', 'inbound_scoring.json');
const destDir = path.join(__dirname, '..', 'n8n_data', 'workflows');
const dest = path.join(destDir, 'inbound_scoring.json');

try {
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  const data = fs.readFileSync(src);
  fs.writeFileSync(dest, data);
  console.log('n8n workflow prepared at', dest);
} catch (e) {
  console.error('Failed to prepare n8n workflow:', e.message);
  process.exit(0);
}

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'docs', 'workflows');
const destDir = path.join(__dirname, '..', 'n8n_data', 'workflows');

try {
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  if (fs.existsSync(srcDir)) {
    const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.json'));
    for (const f of files) {
      const src = path.join(srcDir, f);
      const dest = path.join(destDir, f);
      fs.copyFileSync(src, dest);
      console.log('Copied workflow:', f);
    }
  }
  console.log('n8n workflows prepared in', destDir);
} catch (e) {
  console.error('Failed to prepare n8n workflows:', e.message);
  process.exit(0);
}

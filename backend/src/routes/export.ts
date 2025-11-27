import { Router } from 'express';
import { prisma } from '../db';
import { Parser as Json2CsvParser } from 'json2csv';

const router = Router();

// GET /api/export
router.get('/', async (_req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        score: true,
        source: true,
        lastInteraction: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const fields = [
      { label: 'ID', value: 'id' },
      { label: 'Name', value: 'name' },
      { label: 'Email', value: 'email' },
      { label: 'Status', value: 'status' },
      { label: 'Score', value: 'score' },
      { label: 'Source', value: 'source' },
      {
        label: 'Last Interaction',
        value: (row: { lastInteraction: Date | null }) =>
          row.lastInteraction ? new Date(row.lastInteraction).toISOString() : '',
      },
    ];

    const parser = new Json2CsvParser({ fields });
    const csv = parser.parse(leads);

    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `leads-export-${ts}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    return res.status(200).send(csv);
  } catch (err) {
    console.error('GET /api/export error', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/export/n8n - proxy to n8n webhook-based CSV export
router.get('/n8n', async (_req, res) => {
  try {
    const url = 'http://localhost:5678/webhook/export'
    const r = await fetch(url)
    if (!r.ok) {
      return res.status(502).json({ error: `n8n export failed: ${r.status}` })
    }
    const csv = await r.text()
    const ts = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `leads-export-${ts}.csv`
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`)
    return res.status(200).send(csv)
  } catch (err) {
    console.error('GET /api/export/n8n error', err)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

export default router;

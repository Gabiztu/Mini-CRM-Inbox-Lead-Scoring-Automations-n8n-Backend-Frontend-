import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

const isValidDirection = (dir: unknown): dir is 'INBOUND' | 'OUTBOUND' =>
  dir === 'INBOUND' || dir === 'OUTBOUND';

// POST /api/messages
router.post('/', async (req, res) => {
  try {
    const { leadId, content, direction } = req.body || {};

    if (!leadId || !content || !direction) {
      return res.status(400).json({ error: 'leadId, content, and direction are required' });
    }

    if (!isValidDirection(direction)) {
      return res.status(400).json({ error: "direction must be 'INBOUND' or 'OUTBOUND'" });
    }

    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const now = new Date();

    const [message] = await prisma.$transaction([
      prisma.message.create({
        data: {
          leadId,
          content,
          direction, // stored as string; validated against allowed values
          timestamp: now,
        },
      }),
      prisma.lead.update({
        where: { id: leadId },
        data: { lastInteraction: now },
      }),
    ]);

    return res.status(201).json(message);
  } catch (err) {
    console.error('POST /api/messages error', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/messages/:leadId
router.get('/:leadId', async (req, res) => {
  try {
    const { leadId } = req.params;
    if (!leadId) {
      return res.status(400).json({ error: 'leadId is required' });
    }

    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const messages = await prisma.message.findMany({
      where: { leadId },
      orderBy: { timestamp: 'asc' },
    });

    return res.json(messages);
  } catch (err) {
    console.error('GET /api/messages/:leadId error', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;

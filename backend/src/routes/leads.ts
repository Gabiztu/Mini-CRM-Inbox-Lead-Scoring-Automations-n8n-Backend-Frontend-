import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

// GET /leads?q=&status=&minScore=&maxScore=&tags=tag1,tag2&page=1&pageSize=20&sortBy=createdAt&sortOrder=desc
router.get('/', async (req, res) => {
  try {
    const {
      q: rawQ,
      status,
      minScore,
      maxScore,
      tags,
      page = '1',
      pageSize = '20',
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query as Record<string, string>;

    const searchParam = (req.query as any).search as string | undefined;
    const q = rawQ || searchParam;

    const pageNum = Math.max(parseInt(String(page), 10) || 1, 1);
    const takeNum = Math.min(Math.max(parseInt(String(pageSize), 10) || 20, 1), 100);
    const skipNum = (pageNum - 1) * takeNum;

    const where: any = {};

    if (status && status.trim()) {
      where.status = status;
    }

    if (minScore || maxScore) {
      where.score = {};
      if (minScore) where.score.gte = Number(minScore);
      if (maxScore) where.score.lte = Number(maxScore);
    }

    if (tags && tags.trim()) {
      const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean);
      if (tagList.length) {
        where.tags = {
          some: {
            name: { in: tagList },
          },
        };
      }
    }

    const orderBy: any = {};
    orderBy[String(sortBy)] = sortOrder === 'asc' ? 'asc' : 'desc';

    // Prisma SQLite string filters can be limited; perform q search in-memory for reliability
    if (q && q.trim()) {
      const all = await prisma.lead.findMany({
        where,
        orderBy,
        include: { tags: true },
      });
      const qLower = String(q).toLowerCase();
      const filtered = all.filter((l) =>
        l.name.toLowerCase().includes(qLower) || l.email.toLowerCase().includes(qLower)
      );
      const total = filtered.length;
      const items = filtered.slice(skipNum, skipNum + takeNum);
      return res.json({ items, total, page: pageNum, pageSize: takeNum });
    }

    const [items, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy,
        skip: skipNum,
        take: takeNum,
        include: { tags: true },
      }),
      prisma.lead.count({ where }),
    ]);

    return res.json({ items, total, page: pageNum, pageSize: takeNum });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch leads', detail: String(err?.message || err) });
  }
});

// GET /leads/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'id is required' });

    // Try by ID first
    let lead = await prisma.lead.findUnique({ where: { id }, include: { tags: true } });
    // Fallback: if not found and looks like an email, try by unique email
    if (!lead && id.includes('@')) {
      lead = await prisma.lead.findUnique({ where: { email: id }, include: { tags: true } });
    }
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    return res.json(lead);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch lead' });
  }
});

// POST /leads
router.post('/', async (req, res) => {
  try {
    const { name, email, status = 'NEW', source, score = 0, tags = [] } = req.body || {};
    if (!name || !email) return res.status(400).json({ error: 'name and email are required' });

    const created = await prisma.lead.create({
      data: {
        name,
        email,
        status,
        score,
        source,
        lastInteraction: new Date(),
        tags: {
          create: Array.isArray(tags)
            ? tags.map((t: string) => ({ name: t, color: '#999999' }))
            : [],
        },
      },
      include: { tags: true },
    });
    res.status(201).json(created);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

// PUT /leads/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, status, score, source, tags } = req.body || {};

    // Update lead basic fields
    const updated = await prisma.lead.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(email !== undefined ? { email } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(score !== undefined ? { score: Number(score) } : {}),
        ...(source !== undefined ? { source } : {}),
      },
      include: { tags: true },
    });

    // Replace tags if provided
    if (Array.isArray(tags)) {
      await prisma.$transaction([
        prisma.tag.deleteMany({ where: { leadId: id } }),
        prisma.tag.createMany({
          data: tags.map((t: string) => ({ name: t, color: '#999999', leadId: id })),
        }),
      ]);
    }

    const result = await prisma.lead.findUnique({ where: { id }, include: { tags: true } });
    res.json(result);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

// DELETE /leads/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.lead.delete({ where: { id } });
    res.status(204).send();
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

export default router;

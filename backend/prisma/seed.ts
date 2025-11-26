import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const STATUSES = [
  'NEW',
  'QUALIFIED',
  'WON',
  'LOST',
  'COLD',
  'NEEDS_FOLLOWUP',
] as const;

const TAG_COLORS: Record<string, string> = {
  'High Value': '#FFD700',
  Referral: '#1E90FF',
  Urgent: '#FF4500',
  Trial: '#9ACD32',
  'Churn Risk': '#FF69B4',
};

type SeedLead = {
  name: string;
  email: string;
  status: typeof STATUSES[number];
  score: number;
  source?: string | null;
  tags?: string[];
};

const leadsData: SeedLead[] = [
  { name: 'Alice Smith', email: 'alice.smith@example.com', status: 'NEW', score: 12, source: 'Website', tags: ['High Value'] },
  { name: 'Bob Johnson', email: 'bob.johnson@example.com', status: 'QUALIFIED', score: 38, source: 'Referral', tags: ['Referral'] },
  { name: 'Charlie Davis', email: 'charlie.davis@example.com', status: 'WON', score: 80, source: 'Conference', tags: ['High Value'] },
  { name: 'Diana Prince', email: 'diana.prince@example.com', status: 'LOST', score: 20, source: 'Cold Call' },
  { name: 'Ethan Hunt', email: 'ethan.hunt@example.com', status: 'NEEDS_FOLLOWUP', score: 55, source: 'LinkedIn', tags: ['Urgent'] },
  { name: 'Fiona Gallagher', email: 'fiona.gallagher@example.com', status: 'COLD', score: 5, source: 'Website' },
  { name: 'George Michaels', email: 'george.michaels@example.com', status: 'QUALIFIED', score: 45, source: 'Email', tags: ['Trial'] },
  { name: 'Hannah Lee', email: 'hannah.lee@example.com', status: 'NEW', score: 10, source: 'Website' },
  { name: 'Ian Wright', email: 'ian.wright@example.com', status: 'NEEDS_FOLLOWUP', score: 60, source: 'Referral', tags: ['Referral', 'Urgent'] },
  { name: 'Julia Roberts', email: 'julia.roberts@example.com', status: 'WON', score: 90, source: 'Conference', tags: ['High Value'] },
  { name: 'Karl Urban', email: 'karl.urban@example.com', status: 'COLD', score: 8, source: 'Website' },
  { name: 'Lara Croft', email: 'lara.croft@example.com', status: 'QUALIFIED', score: 40, source: 'LinkedIn' },
  { name: 'Michael Scott', email: 'michael.scott@example.com', status: 'LOST', score: 22, source: 'Cold Call', tags: ['Churn Risk'] },
  { name: 'Nina Simone', email: 'nina.simone@example.com', status: 'NEEDS_FOLLOWUP', score: 58, source: 'Referral' },
  { name: 'Oscar Wilde', email: 'oscar.wilde@example.com', status: 'NEW', score: 14, source: 'Website', tags: ['Trial'] },
];

async function seed() {
  console.log('Seeding: clearing existing data...');
  await prisma.message.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.lead.deleteMany({});

  console.log('Seeding: creating leads...');
  const createdLeads = await Promise.all(
    leadsData.map((l) =>
      prisma.lead.create({
        data: {
          name: l.name,
          email: l.email,
          status: l.status,
          score: l.score,
          source: l.source ?? null,
          lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 24),
        },
      })
    )
  );

  console.log('Seeding: attaching tags...');
  for (let i = 0; i < leadsData.length; i++) {
    const l = leadsData[i];
    const lead = createdLeads[i];
    const names = l.tags ?? [];
    if (!names.length) continue;
    await prisma.tag.createMany({
      data: names.map((name) => ({ name, color: TAG_COLORS[name] ?? '#999999', leadId: lead.id })),
    });
  }

  console.log('Seeding: creating message histories for a subset of leads...');
  const messageLeadIndexes = [0, 2, 4, 8, 9, 12]; // at least 5 leads
  for (const idx of messageLeadIndexes) {
    const lead = createdLeads[idx];
    const base = Date.now() - 1000 * 60 * 60; // 1 hour ago
    const msgs = [
      { content: 'Hello! Thanks for reaching out.', direction: 'OUTBOUND' as const, ts: new Date(base - 1000 * 60 * 45) },
      { content: 'Hi, I am interested in your product.', direction: 'INBOUND' as const, ts: new Date(base - 1000 * 60 * 30) },
      { content: 'Great! Let me share more details.', direction: 'OUTBOUND' as const, ts: new Date(base - 1000 * 60 * 15) },
      { content: 'Sounds good. What is the pricing?', direction: 'INBOUND' as const, ts: new Date(base - 1000 * 60 * 5) },
    ];

    for (const m of msgs) {
      await prisma.message.create({
        data: { leadId: lead.id, content: m.content, direction: m.direction, timestamp: m.ts },
      });
    }

    // Update lastInteraction to last message timestamp
    await prisma.lead.update({
      where: { id: lead.id },
      data: { lastInteraction: msgs[msgs.length - 1].ts },
    });
  }

  console.log('Seeding complete.');
}

async function main() {
  try {
    await seed();
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

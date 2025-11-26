import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import leadsRouter from './routes/leads';
import messagesRouter from './routes/messages';
import exportRouter from './routes/export';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: false }));

app.use('/leads', leadsRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/export', exportRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Backend API listening on http://localhost:${PORT}`);
});

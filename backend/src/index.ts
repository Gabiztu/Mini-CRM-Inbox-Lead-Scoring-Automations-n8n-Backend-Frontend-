import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import leadsRouter from './routes/leads';
import messagesRouter from './routes/messages';
import exportRouter from './routes/export';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
// Allow both localhost and 127.0.0.1 origins for dev convenience
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      const allowed = ['http://localhost:3000', 'http://127.0.0.1:3000']
      if (allowed.includes(origin)) return callback(null, true)
      return callback(null, false)
    },
    credentials: false,
  })
)

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

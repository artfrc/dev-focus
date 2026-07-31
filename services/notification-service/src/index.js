import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { requireInternalKey } from './middleware/internal.js';
import { notifyRouter } from './routes/notify.js';
import { iniciarJobsDiarios } from './jobs/dailyJobs.js';

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'notification-service' }));

app.use('/notify', requireInternalKey, notifyRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno no notification-service.' });
});

app.listen(PORT, () => {
  console.log(`notification-service rodando na porta ${PORT}`);
  iniciarJobsDiarios();
});

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { requireAuth, requireInternalKey } from './middleware/auth.js';
import { streakRouter } from './routes/streak.js';
import { internalRouter } from './routes/internal.js';
import { iniciarJobMeiaNoite } from './jobs/midnightJob.js';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'streak-service' }));

app.use('/streak', requireAuth, streakRouter);
app.use('/internal', requireInternalKey, internalRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno no streak-service.' });
});

app.listen(PORT, () => {
  console.log(`streak-service rodando na porta ${PORT}`);
  iniciarJobMeiaNoite();
});

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { requireAuth } from './middleware/auth.js';
import { areasRouter } from './routes/areas.js';
import { prioridadesRouter } from './routes/prioridades.js';
import { cardsRouter } from './routes/cards.js';
import { resumoRouter } from './routes/resumo.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'cards-service' }));

app.use('/areas', requireAuth, areasRouter);
app.use('/prioridades', requireAuth, prioridadesRouter);
app.use('/cards', requireAuth, cardsRouter);
app.use('/resumo', requireAuth, resumoRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno no cards-service.' });
});

app.listen(PORT, () => {
  console.log(`cards-service rodando na porta ${PORT}`);
});

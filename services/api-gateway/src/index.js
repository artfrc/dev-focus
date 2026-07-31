import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { proxyPara } from './routes/proxies.js';

const app = express();
const PORT = process.env.PORT || 3000;

const CARDS_SERVICE_URL = process.env.CARDS_SERVICE_URL || 'http://localhost:3001';
const STREAK_SERVICE_URL = process.env.STREAK_SERVICE_URL || 'http://localhost:3002';

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
    credentials: true,
  }),
);

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'api-gateway' }));

// cards-service: areas, prioridades, cards, resumo do dashboard
app.use('/api/areas', proxyPara(CARDS_SERVICE_URL));
app.use('/api/prioridades', proxyPara(CARDS_SERVICE_URL));
app.use('/api/cards', proxyPara(CARDS_SERVICE_URL));
app.use('/api/resumo', proxyPara(CARDS_SERVICE_URL));

// streak-service: ofensiva e historico (rotas /internal NAO sao expostas aqui)
app.use('/api/streak', proxyPara(STREAK_SERVICE_URL));

app.use((req, res) => {
  res.status(404).json({ error: 'Rota nao encontrada no api-gateway.' });
});

app.listen(PORT, () => {
  console.log(`api-gateway rodando na porta ${PORT}`);
  console.log(`-> cards-service: ${CARDS_SERVICE_URL}`);
  console.log(`-> streak-service: ${STREAK_SERVICE_URL}`);
});

import { Router } from 'express';

export const resumoRouter = Router();

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

resumoRouter.get('/', async (req, res) => {
  const [{ data: areas, error: areasError }, { data: cards, error: cardsError }] = await Promise.all([
    req.supabase.from('areas').select('id, nome, cor'),
    req.supabase.from('cards').select('id, area_id, status, prazo, essencial'),
  ]);

  if (areasError) return res.status(400).json({ error: areasError.message });
  if (cardsError) return res.status(400).json({ error: cardsError.message });

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const pendentes = cards.filter((c) => c.status === 'pendente');
  const concluidos = cards.filter((c) => c.status === 'concluido');

  const cardsPorArea = areas.map((area) => ({
    ...area,
    pendentes: pendentes.filter((c) => c.area_id === area.id).length,
  }));

  const alertasPrazo = pendentes.filter((c) => {
    const prazo = new Date(`${c.prazo}T00:00:00`);
    const diffDias = Math.ceil((prazo - hoje) / (24 * 60 * 60 * 1000));
    return diffDias <= 7;
  }).length;

  res.json({
    total_pendentes: pendentes.length,
    total_concluidos: concluidos.length,
    alertas_prazo: alertasPrazo,
    cards_por_area: cardsPorArea,
  });
});

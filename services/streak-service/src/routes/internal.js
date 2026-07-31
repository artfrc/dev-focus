import { Router } from 'express';
import { recalcularOfensivaTodos, recalcularOfensivaUsuario, dataOntem } from '../lib/recalcular.js';

export const internalRouter = Router();

/**
 * Endpoint interno para recalcular a ofensiva com base nos cards essenciais do dia.
 * Consumido pelo job agendado (ou manualmente para depuracao/backfill).
 * Body opcional: { data: 'YYYY-MM-DD', user_id: 'uuid' }
 */
internalRouter.post('/recalcular', async (req, res) => {
  const data = req.body?.data || dataOntem();

  try {
    if (req.body?.user_id) {
      const resultado = await recalcularOfensivaUsuario(req.body.user_id, data);
      return res.json(resultado);
    }
    const resultados = await recalcularOfensivaTodos(data);
    res.json({ data, total_usuarios: resultados.length, resultados });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

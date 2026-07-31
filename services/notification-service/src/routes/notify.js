import { Router } from 'express';
import { dispararLembreteDiario, dispararAlertaPrazos } from '../lib/dispatch.js';

export const notifyRouter = Router();

/** Disparo interno do lembrete diario — consumido pelo job agendado. */
notifyRouter.post('/lembrete-diario', async (req, res) => {
  try {
    const resultado = await dispararLembreteDiario();
    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/** Disparo interno do alerta de prazos (<= 7 dias) — consumido pelo job agendado. */
notifyRouter.post('/verificar-prazos', async (req, res) => {
  try {
    const resultado = await dispararAlertaPrazos();
    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

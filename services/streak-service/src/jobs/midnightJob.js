import cron from 'node-cron';
import { recalcularOfensivaTodos, dataOntem } from '../lib/recalcular.js';

/** Roda todo dia as 00:05 e recalcula a ofensiva de "ontem" (o dia que acabou de fechar). */
export function iniciarJobMeiaNoite() {
  cron.schedule('5 0 * * *', async () => {
    const data = dataOntem();
    try {
      const resultados = await recalcularOfensivaTodos(data);
      console.log(`[streak-service] Ofensiva recalculada para ${data} (${resultados.length} usuarios).`);
    } catch (err) {
      console.error(`[streak-service] Falha ao recalcular ofensiva de ${data}:`, err.message);
    }
  });

  console.log('[streak-service] Job de meia-noite agendado (05 00 * * *).');
}

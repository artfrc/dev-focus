import cron from 'node-cron';
import { dispararLembreteDiario, dispararAlertaPrazos } from '../lib/dispatch.js';

export function iniciarJobsDiarios() {
  const cronLembrete = process.env.CRON_LEMBRETE_DIARIO || '0 20 * * *';
  const cronPrazos = process.env.CRON_VERIFICAR_PRAZOS || '0 8 * * *';

  cron.schedule(cronLembrete, async () => {
    try {
      const resultado = await dispararLembreteDiario();
      console.log(`[notification-service] Lembrete diario enviado para ${resultado.enviados} usuario(s).`);
    } catch (err) {
      console.error('[notification-service] Falha no lembrete diario:', err.message);
    }
  });

  cron.schedule(cronPrazos, async () => {
    try {
      const resultado = await dispararAlertaPrazos();
      console.log(`[notification-service] Alerta de prazos enviado para ${resultado.enviados} usuario(s).`);
    } catch (err) {
      console.error('[notification-service] Falha no alerta de prazos:', err.message);
    }
  });

  console.log(`[notification-service] Jobs agendados — lembrete: "${cronLembrete}", prazos: "${cronPrazos}".`);
}

import { baseTemplate } from './base.js';

export function lembreteDiarioTemplate() {
  const appUrl = process.env.APP_URL || 'http://localhost:5173';

  const corpoHtml = `
    <p style="color:#D1D5DB;font-size:14px;line-height:1.6;margin:0 0 20px;">
      Reserve alguns minutos para planejar as atividades de amanhã. Revise seus cards
      pendentes, marque o que for essencial e mantenha sua ofensiva viva. 🔥
    </p>
    <a href="${appUrl}" style="display:inline-block;background-color:#6366F1;color:#F4F4F5;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:8px;">
      Planejar amanhã
    </a>`;

  return {
    subject: 'DevFocus — Planeje o seu amanhã',
    html: baseTemplate({
      titulo: 'Hora de planejar o amanhã',
      preheader: 'Revise seus cards e mantenha sua ofensiva viva.',
      corpoHtml,
    }),
  };
}

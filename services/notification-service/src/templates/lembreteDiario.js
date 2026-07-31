import { baseTemplate } from './base.js';

export function lembreteDiarioTemplate() {
  const corpoHtml = `
    <p style="color:#D1D5DB;font-size:14px;line-height:1.6;margin:0 0 20px;">
      Reserve alguns minutos para planejar as atividades de amanha. Revise seus cards
      pendentes, marque o que for essencial e mantenha sua ofensiva viva. 🔥
    </p>
    <a href="#" style="display:inline-block;background-color:#6366F1;color:#F4F4F5;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:8px;">
      Planejar amanha
    </a>`;

  return {
    subject: 'DevFocus — Planeje o seu amanha',
    html: baseTemplate({
      titulo: 'Hora de planejar o amanha',
      preheader: 'Revise seus cards e mantenha sua ofensiva viva.',
      corpoHtml,
    }),
  };
}

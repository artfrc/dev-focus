import { baseTemplate } from './base.js';

function diasRestantesLabel(dias) {
  if (dias < 0) return `<span style="color:#EF4444;">Atrasado ha ${Math.abs(dias)} dia(s)</span>`;
  if (dias === 0) return `<span style="color:#F59E0B;">Vence hoje</span>`;
  return `<span style="color:#F59E0B;">Vence em ${dias} dia(s)</span>`;
}

export function alertaPrazoTemplate(cards) {
  const itensHtml = cards
    .map(
      (c) => `
      <li style="margin-bottom:12px;padding:12px;background-color:#0F0F17;border-radius:8px;border-left:3px solid #F59E0B;">
        <p style="margin:0 0 4px;color:#F4F4F5;font-size:14px;font-weight:600;">${c.descricao}${c.essencial ? ' ⭐' : ''}</p>
        <p style="margin:0;color:#9CA3AF;font-size:12px;">${diasRestantesLabel(c.diasRestantes)} • prazo ${c.prazo}</p>
      </li>`,
    )
    .join('');

  const corpoHtml = `
    <p style="color:#D1D5DB;font-size:14px;line-height:1.6;margin:0 0 16px;">
      Voce tem ${cards.length} card(s) com prazo de 7 dias ou menos:
    </p>
    <ul style="list-style:none;padding:0;margin:0 0 20px;">${itensHtml}</ul>`;

  return {
    subject: `DevFocus — ${cards.length} card(s) proximos do prazo`,
    html: baseTemplate({
      titulo: 'Prazos se aproximando',
      preheader: `${cards.length} card(s) vencem em ate 7 dias.`,
      corpoHtml,
    }),
  };
}

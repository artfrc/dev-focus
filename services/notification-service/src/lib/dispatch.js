import { serviceClient } from './supabase.js';
import { enviarEmail } from './mailer.js';
import { lembreteDiarioTemplate } from '../templates/lembreteDiario.js';
import { alertaPrazoTemplate } from '../templates/alertaPrazo.js';

async function listarTodosUsuarios() {
  const usuarios = [];
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await serviceClient.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    usuarios.push(...data.users);
    if (data.users.length < perPage) break;
    page += 1;
  }

  return usuarios.filter((u) => u.email);
}

/** Job diario: lembra cada usuario de planejar as atividades do dia seguinte. */
export async function dispararLembreteDiario() {
  const usuarios = await listarTodosUsuarios();
  const { subject, html } = lembreteDiarioTemplate();

  let enviados = 0;
  for (const usuario of usuarios) {
    await enviarEmail({ to: usuario.email, subject, html });
    enviados += 1;
  }

  return { total_usuarios: usuarios.length, enviados };
}

/** Job diario: alerta cada usuario sobre cards pendentes a <= 7 dias do prazo. */
export async function dispararAlertaPrazos() {
  const usuarios = await listarTodosUsuarios();
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  let enviados = 0;
  for (const usuario of usuarios) {
    const { data: cards, error } = await serviceClient
      .from('cards')
      .select('descricao, prazo, essencial')
      .eq('user_id', usuario.id)
      .eq('status', 'pendente');
    if (error) throw error;

    const proximos = cards
      .map((c) => {
        const prazo = new Date(`${c.prazo}T00:00:00`);
        const diasRestantes = Math.ceil((prazo - hoje) / (24 * 60 * 60 * 1000));
        return { ...c, diasRestantes };
      })
      .filter((c) => c.diasRestantes <= 7)
      .sort((a, b) => a.diasRestantes - b.diasRestantes);

    if (proximos.length === 0) continue;

    const { subject, html } = alertaPrazoTemplate(proximos);
    await enviarEmail({ to: usuario.email, subject, html });
    enviados += 1;
  }

  return { total_usuarios: usuarios.length, enviados };
}

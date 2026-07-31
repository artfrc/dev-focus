import { serviceClient } from './supabase.js';

/** Retorna a data (YYYY-MM-DD) de "ontem" no fuso horario do processo. */
export function dataOntem() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function diaAnterior(dataISO) {
  const d = new Date(`${dataISO}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/**
 * Recalcula a ofensiva de um usuario para uma data especifica:
 * 1. Verifica se todos os cards essenciais com prazo == data foram concluidos.
 * 2. Registra o resultado em streak_historico (idempotente via upsert).
 * 3. Recomputa sequencia_atual contando dias consecutivos com meta batida,
 *    terminando em `data` — assim o job pode rodar mais de uma vez sem
 *    corromper o contador.
 */
export async function recalcularOfensivaUsuario(userId, dataISO) {
  if (!serviceClient) throw new Error('SUPABASE_SERVICE_ROLE_KEY não configurada.');

  const { data: essenciais, error: essenciaisError } = await serviceClient
    .from('cards')
    .select('id, status')
    .eq('user_id', userId)
    .eq('essencial', true)
    .eq('prazo', dataISO);

  if (essenciaisError) throw essenciaisError;

  const pendentes = essenciais.filter((c) => c.status !== 'concluido').length;
  const metaBatida = pendentes === 0;

  const { error: historicoError } = await serviceClient
    .from('streak_historico')
    .upsert(
      { user_id: userId, data: dataISO, meta_batida: metaBatida },
      { onConflict: 'user_id,data' },
    );
  if (historicoError) throw historicoError;

  const { data: historico, error: listError } = await serviceClient
    .from('streak_historico')
    .select('data, meta_batida')
    .eq('user_id', userId)
    .lte('data', dataISO)
    .order('data', { ascending: false })
    .limit(400);
  if (listError) throw listError;

  let sequencia = 0;
  let esperado = dataISO;
  for (const linha of historico) {
    if (linha.data !== esperado || !linha.meta_batida) break;
    sequencia += 1;
    esperado = diaAnterior(esperado);
  }

  const { data: streakAtual, error: streakError } = await serviceClient
    .from('streak')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (streakError) throw streakError;

  const maiorSequencia = Math.max(streakAtual?.maior_sequencia ?? 0, sequencia);

  const { data: atualizado, error: updateError } = await serviceClient
    .from('streak')
    .upsert(
      {
        user_id: userId,
        sequencia_atual: sequencia,
        maior_sequencia: maiorSequencia,
        ultima_atualizacao: dataISO,
      },
      { onConflict: 'user_id' },
    )
    .select()
    .single();
  if (updateError) throw updateError;

  return { userId, data: dataISO, meta_batida: metaBatida, streak: atualizado };
}

/** Recalcula a ofensiva de todos os usuarios cadastrados para uma data. */
export async function recalcularOfensivaTodos(dataISO) {
  if (!serviceClient) throw new Error('SUPABASE_SERVICE_ROLE_KEY não configurada.');

  const { data: usuarios, error } = await serviceClient.from('streak').select('user_id');
  if (error) throw error;

  const resultados = [];
  for (const { user_id } of usuarios) {
    resultados.push(await recalcularOfensivaUsuario(user_id, dataISO));
  }
  return resultados;
}

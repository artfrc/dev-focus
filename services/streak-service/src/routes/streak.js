import { Router } from 'express';

export const streakRouter = Router();

streakRouter.get('/', async (req, res) => {
  let { data, error } = await req.supabase
    .from('streak')
    .select('*')
    .eq('user_id', req.userId)
    .maybeSingle();

  if (error) return res.status(400).json({ error: error.message });

  if (!data) {
    const inserted = await req.supabase
      .from('streak')
      .insert({ user_id: req.userId, sequencia_atual: 0, maior_sequencia: 0, ultima_atualizacao: new Date().toISOString().slice(0, 10) })
      .select()
      .single();
    if (inserted.error) return res.status(400).json({ error: inserted.error.message });
    data = inserted.data;
  }

  res.json(data);
});

streakRouter.get('/historico', async (req, res) => {
  const { ano, mes } = req.query;

  let query = req.supabase
    .from('streak_historico')
    .select('*')
    .order('data', { ascending: true });

  if (ano && mes) {
    const inicio = `${ano}-${String(mes).padStart(2, '0')}-01`;
    const fimData = new Date(Number(ano), Number(mes), 0).getDate();
    const fim = `${ano}-${String(mes).padStart(2, '0')}-${String(fimData).padStart(2, '0')}`;
    query = query.gte('data', inicio).lte('data', fim);
  }

  const { data, error } = await query;
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

import { Router } from 'express';

export const cardsRouter = Router();

const SELECT_WITH_RELATIONS = '*, areas(id, nome, cor), prioridades(id, nome, cor, ordem)';

cardsRouter.get('/', async (req, res) => {
  const { area_id, prioridade_id, status, essencial } = req.query;

  let query = req.supabase.from('cards').select(SELECT_WITH_RELATIONS);

  if (area_id) query = query.eq('area_id', area_id);
  if (prioridade_id) query = query.eq('prioridade_id', prioridade_id);
  if (status) query = query.eq('status', status);
  if (essencial !== undefined) query = query.eq('essencial', essencial === 'true');

  query = query.order('prazo', { ascending: true });

  const { data, error } = await query;
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

cardsRouter.get('/:id', async (req, res) => {
  const { data, error } = await req.supabase
    .from('cards')
    .select(SELECT_WITH_RELATIONS)
    .eq('id', req.params.id)
    .maybeSingle();

  if (error) return res.status(400).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Card nao encontrado.' });
  res.json(data);
});

cardsRouter.post('/', async (req, res) => {
  const { descricao, area_id, prioridade_id, prazo, essencial } = req.body;
  if (!descricao || !area_id || !prazo) {
    return res.status(400).json({ error: 'descricao, area_id e prazo sao obrigatorios.' });
  }

  const { data, error } = await req.supabase
    .from('cards')
    .insert({
      descricao,
      area_id,
      prioridade_id: prioridade_id ?? null,
      prazo,
      essencial: Boolean(essencial),
      user_id: req.userId,
    })
    .select(SELECT_WITH_RELATIONS)
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

cardsRouter.patch('/:id', async (req, res) => {
  const { descricao, area_id, prioridade_id, prazo, essencial, status } = req.body;
  const updates = {};
  if (descricao !== undefined) updates.descricao = descricao;
  if (area_id !== undefined) updates.area_id = area_id;
  if (prioridade_id !== undefined) updates.prioridade_id = prioridade_id;
  if (prazo !== undefined) updates.prazo = prazo;
  if (essencial !== undefined) updates.essencial = Boolean(essencial);
  if (status !== undefined) {
    updates.status = status;
    updates.concluido_em = status === 'concluido' ? new Date().toISOString() : null;
  }

  const { data, error } = await req.supabase
    .from('cards')
    .update(updates)
    .eq('id', req.params.id)
    .select(SELECT_WITH_RELATIONS)
    .maybeSingle();

  if (error) return res.status(400).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Card nao encontrado.' });
  res.json(data);
});

cardsRouter.post('/:id/concluir', async (req, res) => {
  const { data, error } = await req.supabase
    .from('cards')
    .update({ status: 'concluido', concluido_em: new Date().toISOString() })
    .eq('id', req.params.id)
    .select(SELECT_WITH_RELATIONS)
    .maybeSingle();

  if (error) return res.status(400).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Card nao encontrado.' });
  res.json(data);
});

cardsRouter.post('/:id/reabrir', async (req, res) => {
  const { data, error } = await req.supabase
    .from('cards')
    .update({ status: 'pendente', concluido_em: null })
    .eq('id', req.params.id)
    .select(SELECT_WITH_RELATIONS)
    .maybeSingle();

  if (error) return res.status(400).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Card nao encontrado.' });
  res.json(data);
});

cardsRouter.delete('/:id', async (req, res) => {
  const { error } = await req.supabase.from('cards').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

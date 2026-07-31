import { Router } from 'express';

export const areasRouter = Router();

areasRouter.get('/', async (req, res) => {
  const { data, error } = await req.supabase
    .from('areas')
    .select('*')
    .order('criado_em', { ascending: true });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

areasRouter.post('/', async (req, res) => {
  const { nome, cor } = req.body;
  if (!nome) return res.status(400).json({ error: 'nome e obrigatorio.' });

  const { data, error } = await req.supabase
    .from('areas')
    .insert({ nome, cor: cor ?? null, user_id: req.userId })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

areasRouter.patch('/:id', async (req, res) => {
  const { nome, cor } = req.body;
  const updates = {};
  if (nome !== undefined) updates.nome = nome;
  if (cor !== undefined) updates.cor = cor;

  const { data, error } = await req.supabase
    .from('areas')
    .update(updates)
    .eq('id', req.params.id)
    .select()
    .maybeSingle();

  if (error) return res.status(400).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Area nao encontrada.' });
  res.json(data);
});

areasRouter.delete('/:id', async (req, res) => {
  const { error } = await req.supabase.from('areas').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

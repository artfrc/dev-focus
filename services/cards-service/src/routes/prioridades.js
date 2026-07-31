import { Router } from 'express';

export const prioridadesRouter = Router();

prioridadesRouter.get('/', async (req, res) => {
  const { data, error } = await req.supabase
    .from('prioridades')
    .select('*')
    .order('ordem', { ascending: true });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

prioridadesRouter.post('/', async (req, res) => {
  const { nome, cor, ordem } = req.body;
  if (!nome || !cor || ordem === undefined) {
    return res.status(400).json({ error: 'nome, cor e ordem sao obrigatorios.' });
  }

  const { data, error } = await req.supabase
    .from('prioridades')
    .insert({ nome, cor, ordem, user_id: req.userId })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

prioridadesRouter.patch('/:id', async (req, res) => {
  const { nome, cor, ordem } = req.body;
  const updates = {};
  if (nome !== undefined) updates.nome = nome;
  if (cor !== undefined) updates.cor = cor;
  if (ordem !== undefined) updates.ordem = ordem;

  const { data, error } = await req.supabase
    .from('prioridades')
    .update(updates)
    .eq('id', req.params.id)
    .select()
    .maybeSingle();

  if (error) return res.status(400).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Prioridade nao encontrada.' });
  res.json(data);
});

prioridadesRouter.delete('/:id', async (req, res) => {
  const { error } = await req.supabase.from('prioridades').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

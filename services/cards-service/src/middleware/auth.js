import { anonClient, createUserClient } from '../lib/supabase.js';

/**
 * Extrai o Bearer token, valida o usuario no Supabase Auth e disponibiliza
 * um client escopado (req.supabase) + req.userId para as rotas.
 */
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação ausente.' });
  }

  const { data, error } = await anonClient.auth.getUser(token);
  if (error || !data?.user) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }

  req.userId = data.user.id;
  req.userEmail = data.user.email;
  req.supabase = createUserClient(token);
  next();
}

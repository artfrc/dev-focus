import { anonClient, createUserClient } from '../lib/supabase.js';

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticacao ausente.' });
  }

  const { data, error } = await anonClient.auth.getUser(token);
  if (error || !data?.user) {
    return res.status(401).json({ error: 'Token invalido ou expirado.' });
  }

  req.userId = data.user.id;
  req.userEmail = data.user.email;
  req.supabase = createUserClient(token);
  next();
}

export function requireInternalKey(req, res, next) {
  const key = req.headers['x-internal-key'];
  if (!process.env.INTERNAL_API_KEY || key !== process.env.INTERNAL_API_KEY) {
    return res.status(403).json({ error: 'Acesso interno negado.' });
  }
  next();
}

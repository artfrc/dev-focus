export function requireInternalKey(req, res, next) {
  const key = req.headers['x-internal-key'];
  if (!process.env.INTERNAL_API_KEY || key !== process.env.INTERNAL_API_KEY) {
    return res.status(403).json({ error: 'Acesso interno negado.' });
  }
  next();
}

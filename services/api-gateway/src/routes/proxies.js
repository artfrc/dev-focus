import { createProxyMiddleware } from 'http-proxy-middleware';

/**
 * Encaminha /api/<recurso>/* para <target>/<recurso>/*, removendo apenas o
 * prefixo "/api" (pathRewrite), preservando o restante do path exatamente
 * como cada microsservico o expoe. O header Authorization (JWT do usuario)
 * e repassado sem alteracoes; cada microsservico valida o token e aplica
 * RLS por conta propria.
 */
export function proxyPara(target) {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
  });
}

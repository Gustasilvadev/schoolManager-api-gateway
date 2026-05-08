const { createProxyMiddleware } = require('http-proxy-middleware');
const { PROXY_MAP } = require('../config/services');

module.exports = (app) => {
  const proxyTimeout = Number(process.env.PROXY_TIMEOUT_MS) || 5000;

  PROXY_MAP.forEach(({ prefix, target }) => {
    if (!target) {
      console.warn(`[GATEWAY] Sem URL configurada para prefixo ${prefix} — rota desabilitada.`);
      return;
    }

    app.use(
      prefix,
      createProxyMiddleware({
        target,
        changeOrigin: true,
        proxyTimeout,
        timeout: proxyTimeout,
        pathRewrite: (path, req) => req.originalUrl,
        on: {
          error: (err, req, res) => {
            console.error(`[GATEWAY] Erro ao encaminhar ${req.method} ${req.originalUrl} → ${target}:`, err.message);
            if (!res.headersSent) {
              res.status(503).json({ error: 'Serviço indisponível' });
            }
          }
        }
      })
    );
  });
};

const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  max: Number(process.env.RATE_LIMIT_MAX) || 600,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) =>
    req.method === 'OPTIONS' || req.path === '/health' || req.path === '/api/health',
  message: { error: 'Limite de requisições excedido. Tente novamente em instantes.' }
});

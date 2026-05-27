const cors = require('cors');

const raw = (process.env.CORS_ORIGIN || '').trim();
const allowedOrigins = raw.split(',').map((s) => s.trim()).filter(Boolean);

if (allowedOrigins.length === 0) {
  console.warn('[GATEWAY] CORS_ORIGIN não definida — cookies não funcionarão em ambiente cross-origin.');
}

const originResolver = (origin, callback) => {
  if (!origin) return callback(null, true);

  if (allowedOrigins.includes(origin)) return callback(null, true);

  callback(new Error(`CORS bloqueado para origem ${origin}`));
};

module.exports = cors({
  origin: originResolver,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

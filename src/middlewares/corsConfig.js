const cors = require('cors');

const raw = (process.env.CORS_ORIGIN || '*').trim();
const allowedOrigins = raw.split(',').map((s) => s.trim()).filter(Boolean);
const allowAny = allowedOrigins.length === 1 && allowedOrigins[0] === '*';

const originResolver = allowAny
  ? '*'
  : (origin, callback) => {
      // Permite ferramentas sem origin (curl, Postman, mesmo host) e origens listadas.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error(`CORS bloqueado para origem ${origin}`));
    };

module.exports = cors({
  origin: originResolver,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

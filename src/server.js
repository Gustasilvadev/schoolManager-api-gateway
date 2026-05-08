require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

const corsConfig = require('./middlewares/corsConfig');
const rateLimiter = require('./middlewares/rateLimiter');
const authMiddleware = require('./middlewares/authMiddleware');
const errorHandler = require('./middlewares/errorHandler');
const mountProxy = require('./proxy/proxyRouter');

const app = express();

app.use(corsConfig);
app.use(morgan('combined'));
app.use(rateLimiter);

// Dois paths para atender tanto CMD (/health) quanto Swagger UI dos MS que prefixa com /api.
const healthHandler = (req, res) => {
  res.json({ status: 'ok', service: 'api-gateway', ts: Date.now() });
};
app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// Body parser fica DEPOIS do proxy: http-proxy-middleware precisa do stream original para encaminhar POST/PUT.
app.use(authMiddleware);
mountProxy(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[GATEWAY] API Gateway rodando na porta ${PORT}`);
});

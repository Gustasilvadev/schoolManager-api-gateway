require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const corsConfig = require('./middlewares/corsConfig');
const rateLimiter = require('./middlewares/rateLimiter');
const internalRouteBlocker = require('./middlewares/internalRouteBlocker');
const authMiddleware = require('./middlewares/authMiddleware');
const errorHandler = require('./middlewares/errorHandler');
const mountProxy = require('./proxy/proxyRouter');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.set('trust proxy', 1);

app.use(corsConfig);
app.use(morgan('combined'));
app.use(rateLimiter);

// Bloqueio rotas internas (chamadas serviço-a-serviço).
app.use(internalRouteBlocker);

app.use(cookieParser());

const healthHandler = (req, res) => {
  res.json({ status: 'ok', service: 'api-gateway', ts: Date.now() });
};
app.get('/health', healthHandler);
app.get('/api/health', healthHandler);


app.use('/api/auth', express.json(), express.urlencoded({ extended: true }), authRoutes);

app.use(authMiddleware);
mountProxy(app);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[GATEWAY] API Gateway rodando na porta ${PORT}`);
});

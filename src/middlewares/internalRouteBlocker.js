const { HTTP_STATUS } = require('../utils/constants');

// Rotas internas dos MS que NÃO podem ser acessadas externamente.
// Mantemos uma blocklist explícita para evitar que o proxy encaminhe acidentalmente
// estas rotas (ex.: /api/teachers/byUser é chamado pelo MS1 durante o login,
// quando o JWT ainda não foi emitido — só deve ser acessível dentro da rede privada).
const INTERNAL_ROUTE_PATTERNS = [
  /^\/api\/teachers\/byUser\//
];

module.exports = (req, res, next) => {
  if (INTERNAL_ROUTE_PATTERNS.some((rx) => rx.test(req.path))) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Not Found' });
  }
  return next();
};

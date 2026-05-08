const jwt = require('jsonwebtoken');
const { PUBLIC_ROUTES } = require('../config/services');

const isPublic = (req) =>
  PUBLIC_ROUTES.some((r) => r.method === req.method && r.path === req.path);

module.exports = (req, res, next) => {
  if (isPublic(req)) return next();

  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'TOKEN_MISSING' });
  }

  const token = header.slice('Bearer '.length).trim();
  if (!token) {
    return res.status(401).json({ error: 'TOKEN_MISSING' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.headers['x-user-id'] = String(decoded.id ?? decoded.user_id ?? '');
    req.headers['x-user-role'] = decoded.role ?? '';
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'TOKEN_INVALID' });
  }
};

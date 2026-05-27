const jwt = require('jsonwebtoken');
const { PUBLIC_ROUTES } = require('../config/services');
const { HTTP_STATUS, MESSAGES } = require('../utils/constants');
const { COOKIE_NAME } = require('./cookieConfig');

const isPublic = (req) =>
  PUBLIC_ROUTES.some((r) => r.method === req.method && r.path === req.path);

const extractToken = (req) => {
  const fromCookie = req.cookies?.[COOKIE_NAME];
  if (fromCookie) return fromCookie;

  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    return header.slice('Bearer '.length).trim();
  }

  return null;
};

module.exports = (req, res, next) => {
  if (isPublic(req)) return next();

  const token = extractToken(req);
  if (!token) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: MESSAGES.TOKEN_MISSING });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.headers['x-user-id'] = String(decoded.id ?? decoded.user_id ?? '');
    req.headers['x-user-role'] = decoded.role ?? '';
    req.headers['authorization'] = `Bearer ${token}`;
    return next();
  } catch (err) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: MESSAGES.TOKEN_INVALID });
  }
};

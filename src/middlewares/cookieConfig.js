const COOKIE_NAME = 'access_token';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 8 * 60 * 60 * 1000,
  path: '/'
};

module.exports = { COOKIE_NAME, COOKIE_OPTIONS };

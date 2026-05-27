const axios = require('axios');
const { COOKIE_NAME, COOKIE_OPTIONS } = require('../middlewares/cookieConfig');
const { HTTP_STATUS, MESSAGES } = require('../utils/constants');

const proxyLogin = async (req, res) => {
  try {
    const ms1Url = process.env.MS1_URL;
    const { data } = await axios.post(`${ms1Url}/api/auth/login`, req.body);

    res.cookie(COOKIE_NAME, data.token, COOKIE_OPTIONS);

    return res.status(HTTP_STATUS.OK).json({ user: data.user });
  } catch (err) {
    const status = err.response?.status;
    const message = err.response?.data?.error;

    if (status === HTTP_STATUS.UNAUTHORIZED) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: message || MESSAGES.INVALID_CREDENTIALS });
    }
    if (status === HTTP_STATUS.NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: message || MESSAGES.USER_NOT_FOUND });
    }

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.EXTERNAL_SERVICE_UNAVAILABLE });
  }
};

const proxyLogout = async (req, res) => {
  res.clearCookie(COOKIE_NAME, { path: '/' });
  return res.status(HTTP_STATUS.OK).json({ message: 'Logout realizado com sucesso' });
};

module.exports = { proxyLogin, proxyLogout };

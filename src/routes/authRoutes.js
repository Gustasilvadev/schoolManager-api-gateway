const express = require('express');
const router = express.Router();
const { proxyLogin, proxyLogout } = require('../controllers/authProxyController');

router.post('/login', proxyLogin);
router.post('/logout', proxyLogout);

module.exports = router;

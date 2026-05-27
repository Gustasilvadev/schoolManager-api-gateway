const PROXY_MAP = [
  { prefix: '/api/auth',           target: process.env.MS1_URL },
  { prefix: '/api/users',          target: process.env.MS1_URL },
  { prefix: '/api/students',       target: process.env.MS2_URL },
  { prefix: '/api/teachers',       target: process.env.MS3_URL },
  { prefix: '/api/classes',        target: process.env.MS4_URL },
  { prefix: '/api/disciplines',    target: process.env.MS4_URL },
  { prefix: '/api/tests',          target: process.env.MS5_URL },
  { prefix: '/api/grades',         target: process.env.MS5_URL },
  { prefix: '/api/finalAverages', target: process.env.MS5_URL },
  { prefix: '/api/notices',        target: process.env.MS6_URL }
];

// Login e logout são tratados diretamente pelo Gateway (authRoutes.js), não chegam ao authMiddleware.
const PUBLIC_ROUTES = [];

module.exports = { PROXY_MAP, PUBLIC_ROUTES };

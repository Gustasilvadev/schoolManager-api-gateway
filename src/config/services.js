const PROXY_MAP = [
  { prefix: '/api/auth',           target: process.env.MS1_URL },
  { prefix: '/api/users',          target: process.env.MS1_URL },
  { prefix: '/api/students',       target: process.env.MS2_URL },
  { prefix: '/api/teachers',       target: process.env.MS3_URL },
  { prefix: '/api/classes',        target: process.env.MS4_URL },
  { prefix: '/api/tests',          target: process.env.MS5_URL },
  { prefix: '/api/grades',         target: process.env.MS5_URL },
  { prefix: '/api/finalAverages', target: process.env.MS5_URL },
  { prefix: '/api/notices',        target: process.env.MS6_URL }
];

const PUBLIC_ROUTES = [
  { method: 'POST', path: '/api/auth/login' }
];

module.exports = { PROXY_MAP, PUBLIC_ROUTES };

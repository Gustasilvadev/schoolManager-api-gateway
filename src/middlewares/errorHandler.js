module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  console.error('[GATEWAY ERROR]', err.message);
  res.status(status).json({ error: err.message || 'Erro interno do gateway' });
};

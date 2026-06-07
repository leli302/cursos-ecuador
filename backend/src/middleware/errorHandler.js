const { logError } = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logError('ErrorHandler', err);

  // Error de Multer (archivo muy grande)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      error: 'El archivo es demasiado grande. Máximo 50MB.'
    });
  }

  // Error de Multer (tipo de archivo)
  if (err.message && err.message.includes('Tipo de archivo no permitido')) {
    return res.status(400).json({ error: err.message });
  }

  // Error de validación de PostgreSQL
  if (err.code === '23505') {
    return res.status(409).json({
      error: 'Ya existe un registro con esos datos.'
    });
  }

  if (err.code === '23503') {
    return res.status(400).json({
      error: 'Referencia inválida. El registro relacionado no existe.'
    });
  }

  // Error genérico
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Error interno del servidor'
    : err.message;

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

module.exports = errorHandler;

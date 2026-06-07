const { query } = require('../config/database');

const logAction = async (userId, accion, detalle, ip = null) => {
  try {
    await query(
      'INSERT INTO logs_sistema (usuario_id, accion, detalle, ip) VALUES ($1, $2, $3, $4)',
      [userId, accion, detalle, ip]
    );
  } catch (error) {
    console.error('Error registrando log:', error.message);
  }
};

const logError = (context, error) => {
  console.error(`[ERROR] [${context}]`, {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
};

const logInfo = (context, message) => {
  console.log(`[INFO] [${context}]`, {
    message,
    timestamp: new Date().toISOString()
  });
};

module.exports = { logAction, logError, logInfo };

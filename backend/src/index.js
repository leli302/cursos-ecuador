require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const errorHandler = require('./middleware/errorHandler');
const { logInfo } = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// MIDDLEWARE GLOBAL
// ==========================================

// Seguridad
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: { error: 'Demasiadas peticiones. Intenta de nuevo más tarde.' }
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('combined'));

// Archivos estáticos (storage)
const storagePath = path.join(__dirname, '..', process.env.STORAGE_PATH || 'storage');
if (!fs.existsSync(storagePath)) {
  fs.mkdirSync(storagePath, { recursive: true });
}
app.use('/storage', express.static(storagePath));

// ==========================================
// RUTAS API
// ==========================================

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/courses', require('./routes/courses.routes'));
app.use('/api/categories', require('./routes/categories.routes'));
app.use('/api/versions', require('./routes/versions.routes'));
app.use('/api/modules', require('./routes/modules.routes'));
app.use('/api/lessons', require('./routes/lessons.routes'));
app.use('/api/media', require('./routes/media.routes'));
app.use('/api/classrooms', require('./routes/classrooms.routes'));
app.use('/api/cart', require('./routes/cart.routes'));
app.use('/api/orders', require('./routes/orders.routes'));
app.use('/api/payments', require('./routes/payments.routes'));
app.use('/api/memberships', require('./routes/memberships.routes'));
app.use('/api/library', require('./routes/library.routes'));
app.use('/api/progress', require('./routes/progress.routes'));
app.use('/api/certificates', require('./routes/certificates.routes'));
app.use('/api/reviews', require('./routes/reviews.routes'));
app.use('/api/waitlist', require('./routes/waitlist.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Servir frontend en producción
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '..', '..', 'frontend', 'dist');
  app.use(express.static(frontendPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// ==========================================
// ERROR HANDLER
// ==========================================
app.use(errorHandler);

// ==========================================
// INICIAR SERVIDOR
// ==========================================
app.listen(PORT, () => {
  logInfo('Server', `🚀 Servidor corriendo en puerto ${PORT}`);
  logInfo('Server', `📋 API: http://localhost:${PORT}/api`);
  logInfo('Server', `🏥 Health: http://localhost:${PORT}/api/health`);
});

module.exports = app;

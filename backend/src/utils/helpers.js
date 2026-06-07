const { v4: uuidv4 } = require('uuid');

// Generar código único para órdenes
const generateOrderCode = () => {
  const date = new Date();
  const prefix = 'ORD';
  const timestamp = date.getFullYear().toString() +
    (date.getMonth() + 1).toString().padStart(2, '0') +
    date.getDate().toString().padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

// Generar código único para certificados
const generateCertificateCode = () => {
  const prefix = 'CERT';
  const uuid = uuidv4().split('-')[0].toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  return `${prefix}-${timestamp}-${uuid}`;
};

// Generar código de curso
const generateCourseCode = (categoryPrefix, index) => {
  return `${categoryPrefix}-${String(index).padStart(4, '0')}`;
};

// Paginar resultados
const paginate = (page = 1, limit = 12) => {
  const p = Math.max(1, parseInt(page));
  const l = Math.min(50, Math.max(1, parseInt(limit)));
  const offset = (p - 1) * l;
  return { limit: l, offset, page: p };
};

// Formatear respuesta paginada
const paginatedResponse = (data, total, page, limit) => {
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1
    }
  };
};

// Sanitizar nombre de archivo
const sanitizeFilename = (filename) => {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '_')
    .replace(/_+/g, '_');
};

module.exports = {
  generateOrderCode,
  generateCertificateCode,
  generateCourseCode,
  paginate,
  paginatedResponse,
  sanitizeFilename
};

const { query } = require('../config/database');

// GET /api/certificates
const getMyCertificates = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT cert.*, c.nombre as curso_nombre, c.imagen as curso_imagen,
              cv.numero_version, u.nombre, u.apellido
       FROM certificados cert
       JOIN cursos c ON cert.curso_id = c.id
       LEFT JOIN curso_versiones cv ON cert.version_id = cv.id
       JOIN usuarios u ON cert.usuario_id = u.id
       WHERE cert.usuario_id = $1
       ORDER BY cert.fecha_emision DESC`,
      [req.user.id]
    );
    res.json({ data: result.rows });
  } catch (error) { next(error); }
};

// GET /api/certificates/verify/:code
const verifyCertificate = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT cert.*, c.nombre as curso_nombre, cv.numero_version,
              u.nombre as estudiante_nombre, u.apellido as estudiante_apellido
       FROM certificados cert
       JOIN cursos c ON cert.curso_id = c.id
       LEFT JOIN curso_versiones cv ON cert.version_id = cv.id
       JOIN usuarios u ON cert.usuario_id = u.id
       WHERE cert.codigo_unico = $1`,
      [req.params.code]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Certificado no encontrado.', valid: false });
    }
    res.json({ certificate: result.rows[0], valid: true });
  } catch (error) { next(error); }
};

module.exports = { getMyCertificates, verifyCertificate };

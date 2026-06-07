const { query } = require('../config/database');

// POST /api/media/upload
const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Archivo requerido.' });
    }

    const { leccion_id, tipo, titulo, duracion_segundos, orden } = req.body;
    const fieldMap = { video: 'videos', pdf: 'pdfs', imagen: 'imagenes' };
    const folder = fieldMap[tipo] || 'recursos';
    const url = `/storage/cursos/${folder}/${req.file.filename}`;
    const tamano = (req.file.size / (1024 * 1024)).toFixed(2);

    const result = await query(
      `INSERT INTO recursos_multimedia (leccion_id, tipo, titulo, url_archivo, tamano_mb, duracion_segundos, orden)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [leccion_id, tipo, titulo || req.file.originalname, url, tamano, duracion_segundos || 0, orden || 1]
    );

    res.status(201).json({ message: 'Archivo subido.', resource: result.rows[0] });
  } catch (error) { next(error); }
};

// GET /api/media/lesson/:lessonId
const getMediaByLesson = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM recursos_multimedia WHERE leccion_id = $1 ORDER BY orden',
      [req.params.lessonId]
    );
    res.json({ data: result.rows });
  } catch (error) { next(error); }
};

// DELETE /api/media/:id
const deleteMedia = async (req, res, next) => {
  try {
    const result = await query('DELETE FROM recursos_multimedia WHERE id = $1 RETURNING url_archivo', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Recurso no encontrado.' });

    // Eliminar archivo físico
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(process.env.STORAGE_PATH || './storage', '..', result.rows[0].url_archivo);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.json({ message: 'Recurso eliminado.' });
  } catch (error) { next(error); }
};

// GET /api/media/stream/:id - Servir archivo protegido
const streamMedia = async (req, res, next) => {
  try {
    const resource = await query('SELECT * FROM recursos_multimedia WHERE id = $1', [req.params.id]);
    if (resource.rows.length === 0) return res.status(404).json({ error: 'Recurso no encontrado.' });

    // Verificar acceso del usuario
    const lesson = await query('SELECT modulo_id FROM lecciones WHERE id = $1', [resource.rows[0].leccion_id]);
    const module = await query('SELECT curso_id FROM modulos WHERE id = $1', [lesson.rows[0].modulo_id]);

    const hasAccess = await query(
      'SELECT id FROM inscripciones WHERE usuario_id = $1 AND curso_id = $2 AND estado = $3',
      [req.user.id, module.rows[0].curso_id, 'activa']
    );

    // Admins e instructores siempre tienen acceso
    if (hasAccess.rows.length === 0 && !req.user.roles.includes('administrador') && !req.user.roles.includes('instructor')) {
      return res.status(403).json({ error: 'No tienes acceso a este recurso.' });
    }

    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(process.env.STORAGE_PATH || './storage', '..', resource.rows[0].url_archivo);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Archivo no encontrado en el servidor.' });
    }

    res.sendFile(path.resolve(filePath));
  } catch (error) { next(error); }
};

module.exports = { uploadMedia, getMediaByLesson, deleteMedia, streamMedia };

const { query } = require('../config/database');
const { MAX_CLASSROOM_CAPACITY } = require('../utils/constants');

// GET /api/classrooms/course/:courseId
const getClassroomsByCourse = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT a.*,
              (a.cupo_maximo - a.cupo_ocupado) as cupos_disponibles
       FROM aulas a
       WHERE a.curso_id = $1
       ORDER BY a.nombre`,
      [req.params.courseId]
    );

    // Determinar mensaje de disponibilidad
    const activeClassrooms = result.rows.filter(a => a.estado === 'activa');
    const availableSpots = activeClassrooms.reduce((sum, a) => sum + (a.cupo_maximo - a.cupo_ocupado), 0);

    let availabilityMessage = '';
    if (availableSpots > 20) {
      availabilityMessage = 'Disponible ahora';
    } else if (availableSpots > 0) {
      availabilityMessage = `Últimos ${availableSpots} cupos disponibles`;
    } else {
      const nextClassroom = result.rows.find(a => a.estado === 'proxima');
      if (nextClassroom) {
        availabilityMessage = `Aula llena, próxima apertura el ${new Date(nextClassroom.fecha_inicio).toLocaleDateString('es-EC')}`;
      } else {
        availabilityMessage = 'Puedes reservar tu cupo';
      }
    }

    res.json({
      classrooms: result.rows,
      availability: {
        totalSpots: availableSpots,
        message: availabilityMessage
      }
    });
  } catch (error) { next(error); }
};

// POST /api/classrooms
const createClassroom = async (req, res, next) => {
  try {
    const { curso_id, nombre, cupo_maximo, fecha_inicio, fecha_fin } = req.body;
    const result = await query(
      `INSERT INTO aulas (curso_id, nombre, cupo_maximo, fecha_inicio, fecha_fin)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [curso_id, nombre, cupo_maximo || MAX_CLASSROOM_CAPACITY, fecha_inicio, fecha_fin]
    );
    res.status(201).json({ message: 'Aula creada.', classroom: result.rows[0] });
  } catch (error) { next(error); }
};

// PUT /api/classrooms/:id
const updateClassroom = async (req, res, next) => {
  try {
    const { nombre, cupo_maximo, fecha_inicio, fecha_fin, estado } = req.body;
    const result = await query(
      `UPDATE aulas SET
        nombre = COALESCE($1, nombre),
        cupo_maximo = COALESCE($2, cupo_maximo),
        fecha_inicio = COALESCE($3, fecha_inicio),
        fecha_fin = COALESCE($4, fecha_fin),
        estado = COALESCE($5, estado)
       WHERE id = $6 RETURNING *`,
      [nombre, cupo_maximo, fecha_inicio, fecha_fin, estado, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Aula no encontrada.' });
    res.json({ message: 'Aula actualizada.', classroom: result.rows[0] });
  } catch (error) { next(error); }
};

module.exports = { getClassroomsByCourse, createClassroom, updateClassroom };

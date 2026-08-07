const { query } = require('../config/database');

// GET /api/quizzes/module/:moduleId
const getModuleQuizzes = async (req, res, next) => {
  try {
    const { moduleId } = req.params;
    
    // Obtener la evaluación con sus preguntas y opciones
    const quizzesResult = await query(
      `SELECT e.*, 
        (
          SELECT json_agg(
            json_build_object(
              'id', p.id,
              'texto_pregunta', p.texto_pregunta,
              'orden', p.orden,
              'opciones', (
                SELECT json_agg(
                  json_build_object(
                    'id', o.id,
                    'texto_opcion', o.texto_opcion,
                    'es_correcta', o.es_correcta
                  ) ORDER BY o.orden
                )
                FROM opciones o WHERE o.pregunta_id = p.id
              )
            ) ORDER BY p.orden
          )
          FROM preguntas p WHERE p.evaluacion_id = e.id
        ) as preguntas
       FROM evaluaciones e
       WHERE e.modulo_id = $1
       ORDER BY e.orden`,
      [moduleId]
    );

    res.json({ data: quizzesResult.rows });
  } catch (err) {
    next(err);
  }
};

// POST /api/quizzes/:evaluacionId/submit
const submitQuiz = async (req, res, next) => {
  try {
    const { evaluacionId } = req.params;
    const { respuestas } = req.body; // Array de objetos { pregunta_id, opcion_id }
    
    // 1. Obtener la evaluación
    const evalResult = await query('SELECT * FROM evaluaciones WHERE id = $1', [evaluacionId]);
    if (evalResult.rows.length === 0) return res.status(404).json({ error: 'Quiz no encontrado' });
    const evaluacion = evalResult.rows[0];

    // 2. Obtener las opciones correctas
    const opcionesCorrectas = await query(
      `SELECT p.id as pregunta_id, o.id as opcion_id 
       FROM preguntas p 
       JOIN opciones o ON p.id = o.pregunta_id 
       WHERE p.evaluacion_id = $1 AND o.es_correcta = true`,
      [evaluacionId]
    );

    const correctMap = {};
    opcionesCorrectas.rows.forEach(r => correctMap[r.pregunta_id] = r.opcion_id);

    // 3. Calificar
    let correctas = 0;
    const totalPreguntas = opcionesCorrectas.rows.length;
    
    respuestas.forEach(r => {
      if (correctMap[r.pregunta_id] === r.opcion_id) {
        correctas++;
      }
    });

    const calificacion = totalPreguntas > 0 ? Math.round((correctas / totalPreguntas) * 100) : 0;
    const aprobado = calificacion >= (evaluacion.porcentaje_aprobacion || 70);

    // 4. Guardar intento
    const intentoResult = await query(
      `INSERT INTO intentos_evaluacion (usuario_id, evaluacion_id, calificacion, aprobado)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.user.id, evaluacionId, calificacion, aprobado]
    );

    res.json({
      calificacion,
      aprobado,
      correctas,
      totalPreguntas,
      mensaje: aprobado ? '¡Felicidades, aprobaste el quiz!' : 'No alcanzaste el puntaje mínimo. ¡Inténtalo de nuevo!'
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/quizzes (Solo instructores)
const createQuiz = async (req, res, next) => {
  try {
    const { modulo_id, titulo, instrucciones, porcentaje_aprobacion, preguntas } = req.body;

    await query('BEGIN');

    // Insertar evaluación
    const evalResult = await query(
      `INSERT INTO evaluaciones (modulo_id, titulo, instrucciones, porcentaje_aprobacion)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [modulo_id, titulo, instrucciones, porcentaje_aprobacion || 70]
    );
    const evalId = evalResult.rows[0].id;

    // Insertar preguntas y opciones
    if (preguntas && preguntas.length > 0) {
      for (let i = 0; i < preguntas.length; i++) {
        const p = preguntas[i];
        const pResult = await query(
          `INSERT INTO preguntas (evaluacion_id, texto_pregunta, orden)
           VALUES ($1, $2, $3) RETURNING id`,
          [evalId, p.texto_pregunta, i + 1]
        );
        const pId = pResult.rows[0].id;

        if (p.opciones && p.opciones.length > 0) {
          for (let j = 0; j < p.opciones.length; j++) {
            const o = p.opciones[j];
            await query(
              `INSERT INTO opciones (pregunta_id, texto_opcion, es_correcta, orden)
               VALUES ($1, $2, $3, $4)`,
              [pId, o.texto_opcion, o.es_correcta, j + 1]
            );
          }
        }
      }
    }

    await query('COMMIT');
    res.status(201).json({ success: true, evaluacionId: evalId });
  } catch (err) {
    await query('ROLLBACK');
    next(err);
  }
};

module.exports = {
  getModuleQuizzes,
  submitQuiz,
  createQuiz
};

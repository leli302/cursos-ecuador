require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'cursos_ecuador',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function test() {
  try {
    const courseId = 1; // ID válido

    const result = await pool.query(
      `SELECT c.*, cat.nombre as categoria_nombre,
              u.nombre as instructor_nombre, u.apellido as instructor_apellido,
              u.avatar as instructor_avatar
       FROM cursos c
       LEFT JOIN categorias cat ON c.categoria_id = cat.id
       LEFT JOIN usuarios u ON c.instructor_id = u.id
       WHERE c.id = $1`,
      [courseId]
    );

    console.log("Main query result:", result.rows.length > 0 ? "SUCCESS" : "NOT FOUND");

    // Módulos con lecciones
    const modules = await pool.query(
      `SELECT m.*, 
              json_agg(
                json_build_object(
                  'id', l.id, 'titulo', l.titulo, 'descripcion', l.descripcion,
                  'duracion_minutos', l.duracion_minutos, 'orden', l.orden, 'es_gratis', l.es_gratis
                ) ORDER BY l.orden
              ) FILTER (WHERE l.id IS NOT NULL) as lecciones
       FROM modulos m
       LEFT JOIN lecciones l ON m.id = l.modulo_id
       WHERE m.curso_id = $1
       GROUP BY m.id
       ORDER BY m.orden`,
      [courseId]
    );
    console.log("Modules query result:", modules.rows.length);

    // Versiones
    const versions = await pool.query(
      `SELECT * FROM curso_versiones WHERE curso_id = $1 ORDER BY creado_en DESC`,
      [courseId]
    );
    console.log("Versions query result:", versions.rows.length);

  } catch (err) {
    console.error("ERROR:", err);
  } finally {
    pool.end();
  }
}

test();

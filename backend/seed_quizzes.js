const fs = require('fs');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'cursos_ecuador'
});

const delay = ms => new Promise(res => setTimeout(res, ms));

async function seedQuizzes() {
  console.log('Iniciando seeding de Quizzes...');
  try {
    const cursosResult = await pool.query('SELECT id, codigo, nombre FROM cursos ORDER BY id');
    const cursos = cursosResult.rows;

    for (const curso of cursos) {
      console.log(`\nGenerando quizzes para: ${curso.nombre} (${curso.codigo})`);
      
      const modulosResult = await pool.query('SELECT id, titulo, orden FROM modulos WHERE curso_id = $1 ORDER BY orden', [curso.id]);
      const modulos = modulosResult.rows;

      // Generar 1 quiz para los dos primeros módulos
      const numQuizzes = Math.min(2, modulos.length);
      for (let i = 0; i < numQuizzes; i++) {
        const modulo = modulos[i];
        
        const evalResult = await pool.query(
          `INSERT INTO evaluaciones (modulo_id, titulo, instrucciones, porcentaje_aprobacion, orden)
           VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          [modulo.id, `Evaluación: ${modulo.titulo}`, 'Responde las siguientes preguntas para comprobar lo aprendido en este módulo.', 70, 99]
        );
        const evalId = evalResult.rows[0].id;

        // Pregunta 1
        const p1Result = await pool.query(
          `INSERT INTO preguntas (evaluacion_id, texto_pregunta, orden) VALUES ($1, $2, $3) RETURNING id`,
          [evalId, '¿Cuál de los siguientes es el concepto principal aprendido en este módulo?', 1]
        );
        const p1Id = p1Result.rows[0].id;
        
        await pool.query(`INSERT INTO opciones (pregunta_id, texto_opcion, es_correcta, orden) VALUES ($1, $2, $3, $4)`, [p1Id, 'El concepto correcto aprendido', true, 1]);
        await pool.query(`INSERT INTO opciones (pregunta_id, texto_opcion, es_correcta, orden) VALUES ($1, $2, $3, $4)`, [p1Id, 'Un concepto falso o incorrecto', false, 2]);
        await pool.query(`INSERT INTO opciones (pregunta_id, texto_opcion, es_correcta, orden) VALUES ($1, $2, $3, $4)`, [p1Id, 'Otra opción incorrecta', false, 3]);

        // Pregunta 2
        const p2Result = await pool.query(
          `INSERT INTO preguntas (evaluacion_id, texto_pregunta, orden) VALUES ($1, $2, $3) RETURNING id`,
          [evalId, '¿Cuál es la mejor práctica recomendada según las lecciones anteriores?', 2]
        );
        const p2Id = p2Result.rows[0].id;
        
        await pool.query(`INSERT INTO opciones (pregunta_id, texto_opcion, es_correcta, orden) VALUES ($1, $2, $3, $4)`, [p2Id, 'Ignorar los estándares', false, 1]);
        await pool.query(`INSERT INTO opciones (pregunta_id, texto_opcion, es_correcta, orden) VALUES ($1, $2, $3, $4)`, [p2Id, 'Seguir la documentación y buenas prácticas', true, 2]);
        await pool.query(`INSERT INTO opciones (pregunta_id, texto_opcion, es_correcta, orden) VALUES ($1, $2, $3, $4)`, [p2Id, 'Hacerlo al azar', false, 3]);

        console.log(`  -> Quiz creado para el módulo: ${modulo.titulo}`);
      }
    }
    
    console.log('\n¡Seeding de quizzes completado con éxito!');
  } catch (error) {
    console.error('Error durante el seeding:', error);
  } finally {
    pool.end();
  }
}

seedQuizzes();

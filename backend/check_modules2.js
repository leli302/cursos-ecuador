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
    const res = await pool.query(`
      SELECT c.codigo, c.nombre, COUNT(m.id) as num_modulos
      FROM cursos c
      LEFT JOIN modulos m ON c.id = m.curso_id
      GROUP BY c.id
      ORDER BY c.codigo
    `);
    console.table(res.rows);
  } catch (err) {
    console.error("ERROR:", err);
  } finally {
    pool.end();
  }
}

test();

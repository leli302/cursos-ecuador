require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'cursos_ecuador'
});

const getTemplate = (curso, modulo, leccion) => {
  return `¡Bienvenido a la lección **${leccion.titulo}**!
  
Esta clase pertenece al módulo *${modulo.titulo}* del curso **${curso.nombre}**.

### Objetivo de la clase
En esta sesión exploraremos los conceptos fundamentales y las mejores prácticas aplicadas en el entorno profesional. Al finalizar, serás capaz de comprender cómo implementar estas técnicas en proyectos reales.

### Conceptos Clave
- **Fundamentos**: Entenderemos la teoría detrás de esta herramienta.
- **Aplicación Práctica**: Veremos casos de uso reales donde esta tecnología brilla.
- **Optimización**: Tips y trucos para hacer tu trabajo más eficiente.

### Ejemplo Práctico
A continuación, un pequeño fragmento de ejemplo (pseudocódigo o estructura sugerida) para que te familiarices con la sintaxis y el flujo de trabajo:

\`\`\`javascript
// Ejemplo ilustrativo para ${leccion.titulo}
function iniciarLeccion() {
    console.log("¡Comenzando a aprender en Cursos Ecuador!");
    const progreso = "100%";
    return \`Éxito alcanzado al \${progreso}\`;
}

iniciarLeccion();
\`\`\`

> **Nota del Instructor:** Recuerda practicar lo aprendido antes de avanzar a la siguiente lección. La constancia es la clave del éxito. ¡Tú puedes!`;
};

async function generateAllContent() {
  console.log('Iniciando generación de contenido para todas las lecciones...');
  try {
    const cursosResult = await pool.query('SELECT id, codigo, nombre FROM cursos ORDER BY id');
    const cursos = cursosResult.rows;

    let leccionesActualizadas = 0;

    for (const curso of cursos) {
      const modulosResult = await pool.query('SELECT id, titulo, orden FROM modulos WHERE curso_id = $1 ORDER BY orden', [curso.id]);
      const modulos = modulosResult.rows;

      for (const modulo of modulos) {
        const leccionesResult = await pool.query('SELECT id, titulo, descripcion FROM lecciones WHERE modulo_id = $1 ORDER BY orden', [modulo.id]);
        const lecciones = leccionesResult.rows;

        for (const leccion of lecciones) {
          const nuevoContenido = getTemplate(curso, modulo, leccion);
          await pool.query('UPDATE lecciones SET descripcion = $1 WHERE id = $2', [nuevoContenido, leccion.id]);
          leccionesActualizadas++;
        }
      }
      console.log(`✓ Curso actualizado: ${curso.nombre}`);
    }
    
    console.log(`\n¡Generación completada! Se actualizaron ${leccionesActualizadas} lecciones con contenido formateado.`);
  } catch (error) {
    console.error('Error durante la generación:', error);
  } finally {
    pool.end();
  }
}

generateAllContent();

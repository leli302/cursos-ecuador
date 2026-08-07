const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'cursos_ecuador',
  password: 'admin',
  port: 5432,
});

async function migrate() {
  try {
    console.log('Iniciando migración de Markdown a HTML para compatibilidad con Quill...');
    
    // Función simple para convertir markdown básico a HTML
    const mdToHtml = (md) => {
      if (!md || md.includes('<p>')) return md; // Si ya tiene HTML, saltar
      
      let html = md
        // Convertir ## Título a <h2>Título</h2>
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        // Convertir # Título a <h1>Título</h1>
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        // Convertir **negrita** a <strong>negrita</strong>
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Convertir *cursiva* a <em>cursiva</em>
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Convertir --- a <hr>
        .replace(/^---/gim, '<hr>')
        // Convertir listas con - o * 
        .replace(/^\- (.*$)/gim, '<ul><li>$1</li></ul>')
        .replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>');

      // Limpiar uls adyacentes
      html = html.replace(/<\/ul>\n<ul>/g, '\n');

      // Envolver párrafos normales en <p>
      html = html.split('\n').map(line => {
        line = line.trim();
        if (!line) return '';
        if (line.match(/^(<h|<u|<li|<hr)/)) return line; // Ya es un bloque HTML
        return `<p>${line}</p>`;
      }).join('\n');

      return html;
    };

    const res = await pool.query('SELECT id, contenido, descripcion FROM lecciones');
    for (let row of res.rows) {
      let changed = false;
      let newContenido = row.contenido;
      let newDesc = row.descripcion;

      if (row.contenido && row.contenido.includes('**')) {
        newContenido = mdToHtml(row.contenido);
        changed = true;
      }
      if (row.descripcion && row.descripcion.includes('**')) {
        newDesc = mdToHtml(row.descripcion);
        changed = true;
      }

      if (changed) {
        await pool.query(
          'UPDATE lecciones SET contenido = $1, descripcion = $2 WHERE id = $3',
          [newContenido, newDesc, row.id]
        );
        console.log(`Lección ${row.id} actualizada.`);
      }
    }
    
    console.log('Migración completada!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    pool.end();
  }
}

migrate();

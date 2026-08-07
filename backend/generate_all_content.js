require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'cursos_ecuador'
});

const getTemplate = (curso, modulo, leccion, categoriaNombre) => {
  const isTech = categoriaNombre === 'Tecnología';
  const isMarketing = categoriaNombre === 'Marketing';
  const isDesign = categoriaNombre === 'Diseño';
  const isBusiness = categoriaNombre === 'Negocios';
  const isLanguage = categoriaNombre === 'Idiomas';

  let ejemploPractico = '';
  if (isTech) {
    ejemploPractico = `A continuación, analizaremos un fragmento de código fundamental para aplicar **${leccion.titulo}**:

\`\`\`javascript
// Implementación recomendada para ${leccion.titulo}
function procesarEstrategia(datos) {
    if (!datos) throw new Error("Datos requeridos");
    console.log("Iniciando procesamiento seguro en Cursos Ecuador...");
    return datos.map(item => item.valor * 2);
}

const resultados = procesarEstrategia([{ valor: 10 }]);
console.log("Éxito:", resultados);
\`\`\`

Este bloque ilustra la lógica principal. Observa cómo manejamos los posibles errores y estructuramos la función para que sea escalable.`;
  } else if (isMarketing) {
    ejemploPractico = `Supongamos que estamos creando una campaña para aplicar **${leccion.titulo}**. 
    
1. **Paso 1: Definir la audiencia.** Segmentamos a usuarios entre 25 y 45 años interesados en educación.
2. **Paso 2: Mensaje central.** Nos enfocamos en el beneficio principal: "Aprende a tu propio ritmo".
3. **Paso 3: Métrica de éxito.** Mediremos el Costo por Adquisición (CPA) y el Retorno de Inversión (ROI).

Implementar esto correctamente garantiza que el presupuesto no se desperdicie en audiencias no calificadas.`;
  } else if (isDesign) {
    ejemploPractico = `Para aplicar **${leccion.titulo}** en un proyecto visual:

1. Establece tu lienzo con un sistema de retículas claro (ej. 12 columnas).
2. Selecciona una paleta de colores coherente (regla 60-30-10).
3. Asegura que el contraste tipográfico guíe el ojo del espectador hacia el llamado a la acción (CTA).

Esta jerarquía visual es fundamental para que el diseño sea tanto estético como funcional.`;
  } else if (isBusiness) {
    ejemploPractico = `En un escenario corporativo aplicando **${leccion.titulo}**:

- **Situación:** El equipo enfrenta una disminución del 15% en la productividad.
- **Acción:** Implementar metodologías de retroalimentación 1 a 1 semanales.
- **Resultado esperado:** Alineación de objetivos, detección temprana de bloqueos y aumento de la motivación del equipo en un 20% durante el primer trimestre.`;
  } else {
    ejemploPractico = `Para dominar **${leccion.titulo}**, la clave está en la repetición consciente. 

Crea un horario semanal donde dediques al menos 20 minutos ininterrumpidos a practicar este tema específico. Graba tu progreso o documenta tus avances para que puedas revisar tu evolución en las próximas semanas.`;
  }

  return `# ${leccion.titulo}

---
**Duración:** ${leccion.duracion_minutos || 15} minutos
---

## Introducción

Bienvenido a esta lección fundamental del módulo **${modulo.titulo}**. En esta clase, nos sumergiremos en los principios, técnicas y aplicaciones prácticas de **${leccion.titulo}**. Comprender este tema es vital para tu crecimiento dentro del ámbito de ${categoriaNombre || curso.nombre}.

A lo largo de los próximos minutos, desglosaremos la teoría y pasaremos rápidamente a la acción, asegurándonos de que adquieras competencias reales y aplicables en el mercado laboral actual. Prepárate para tomar apuntes y participar activamente.

---

## Objetivo de aprendizaje

Al finalizar esta lección serás capaz de dominar las técnicas principales de **${leccion.titulo}**, aplicarlas en escenarios reales y solucionar los problemas más comunes asociados a esta metodología con total seguridad y profesionalismo.

---

## Desarrollo de la lección

El estudio de **${leccion.titulo}** requiere un enfoque estructurado. Para aplicarlo con éxito en entornos reales, debes comprender tres fases fundamentales que dictan su comportamiento y efectividad.

### 1. Fundamentos Teóricos
Antes de pasar a la ejecución, es crucial entender el "por qué". Esta técnica no nace del vacío, sino de la necesidad de optimizar procesos y mejorar los resultados. Cuando dominas la teoría, la adaptación a diferentes escenarios se vuelve intuitiva.

### 2. Preparación del Entorno
Un profesional destaca por su preparación. Asegúrate de contar con las herramientas adecuadas y de haber definido claramente los objetivos antes de iniciar. La falta de planificación en esta etapa es responsable de la mayoría de los fallos en la ejecución.

### 3. Ejecución Estratégica
La implementación debe ser progresiva. Comienza con pasos pequeños, verifica que los resultados iniciales sean los esperados y luego escala el proceso. Documentar cada paso te permitirá identificar cuellos de botella y áreas de mejora continua.

---

## Conceptos importantes

- **Precisión:** La exactitud con la que ejecutas cada paso del proceso.
- **Escalabilidad:** La capacidad de mantener la calidad del resultado sin importar el volumen de trabajo.
- **Optimización:** La reducción de recursos (tiempo o esfuerzo) manteniendo la eficacia.

---

## Ejemplo práctico

${ejemploPractico}

---

## Consejos del instructor

1. **La consistencia supera al talento:** Practica los conceptos de **${leccion.titulo}** diariamente, aunque sea por pocos minutos.
2. **Documenta tu proceso:** Tener un registro de lo que funciona y lo que falla te ahorrará horas de frustración en el futuro.
3. **No saltes etapas:** Asegúrate de comprender los fundamentos antes de intentar técnicas avanzadas.
4. **Compara con casos reales:** Analiza cómo profesionales de alto nivel aplican esto en el mundo real.

---

## Errores comunes

- **Falta de planificación:** Iniciar la ejecución sin un plan claro lleva al desperdicio de recursos. *Solución:* Dedica el 20% del tiempo a planificar y el 80% a ejecutar.
- **Ignorar los fundamentos:** Tratar de memorizar pasos en lugar de entender la lógica detrás de ellos. *Solución:* Siempre pregúntate "por qué" se hace un paso específico.
- **Sobrecarga de información:** Intentar aprender demasiadas variaciones al mismo tiempo. *Solución:* Domina una técnica central antes de explorar alternativas.

---

## Ejercicio práctico

**Tu misión para hoy:** 
Toma los conceptos discutidos en **${leccion.titulo}** y aplícalos en un escenario a pequeña escala. Define un objetivo de 15 minutos, ejecuta la técnica principal que hemos analizado y evalúa el resultado. Anota qué parte del proceso te resultó más difícil para repasarlo mañana.

---

## Resumen

En esta lección hemos desglosado la estructura esencial de **${leccion.titulo}**. Revisamos los fundamentos, analizamos un ejemplo práctico y detallamos los errores que debes evitar para ejecutar este proceso como un profesional.

---

## Próxima lección

En la siguiente clase, tomaremos todo lo aprendido hoy y lo aplicaremos en un contexto más avanzado. Estudia bien estos fundamentos, porque serán la base sobre la cual construiremos las estrategias del próximo nivel. ¡Nos vemos en la siguiente lección!`;
};

async function generateAllContent() {
  console.log('Iniciando generación de contenido para todas las lecciones...');
  try {
    const cursosResult = await pool.query(`
      SELECT c.id, c.codigo, c.nombre, cat.nombre as categoria_nombre 
      FROM cursos c 
      JOIN categorias cat ON c.categoria_id = cat.id 
      ORDER BY c.id
    `);
    const cursos = cursosResult.rows;

    let leccionesActualizadas = 0;

    for (const curso of cursos) {
      const modulosResult = await pool.query('SELECT id, titulo, orden FROM modulos WHERE curso_id = $1 ORDER BY orden', [curso.id]);
      const modulos = modulosResult.rows;

      for (const modulo of modulos) {
        const leccionesResult = await pool.query('SELECT id, titulo, descripcion, duracion_minutos FROM lecciones WHERE modulo_id = $1 ORDER BY orden', [modulo.id]);
        const lecciones = leccionesResult.rows;

        for (const leccion of lecciones) {
          const nuevoContenido = getTemplate(curso, modulo, leccion, curso.categoria_nombre);
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

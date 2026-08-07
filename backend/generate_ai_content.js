require('dotenv').config();
const { Pool } = require('pg');
const { GoogleGenAI } = require('@google/genai');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'cursos_ecuador'
});

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

const getPrompt = (curso, modulo, leccion) => {
  return `Eres un experto en diseño instruccional, pedagogía y creación de cursos online premium para una plataforma llamada "Cursos Ecuador".

Tu tarea es generar el contenido completo de UNA LECCIÓN utilizando la información del curso, módulo y lección.

## CONTEXTO
- Categoría del curso: ${curso.categoria_nombre}
- Nombre del curso: ${curso.nombre}
- Descripción del curso: ${curso.descripcion}
- Nivel: ${curso.nivel}
- Nombre del módulo: ${modulo.titulo}
- Nombre de la lección: ${leccion.titulo}
- Duración: ${leccion.duracion_minutos || 15} minutos

Toda la información debe estar estrictamente relacionada con estos datos.

------------------------------------------------
REGLAS IMPORTANTES
NO utilices plantillas genéricas.
NO hables de programación a menos que el curso sea de programación o tecnología.
NO escribas ejemplos de código en cursos de música, fotografía, cocina, idiomas, marketing, negocios o diseño.
Cada explicación debe sentirse escrita por un instructor experto en ese tema.
El contenido debe ser útil, práctico y educativo.
No inventes información fuera del contexto del curso.
Todo debe tener continuidad con el módulo al que pertenece.
Debe parecer un curso profesional de plataformas como Udemy, Coursera, Platzi o Domestika.

------------------------------------------------
GENERA EL CONTENIDO EN ESTE ORDEN:
# Título de la lección
Mostrar únicamente el nombre de la lección.
---
Duración: (indicar la duración recibida) minutos
---
## Introducción
Explica al estudiante qué aprenderá (2-3 párrafos sin texto de relleno).
---
## Objetivo de aprendizaje
Escribe un objetivo específico para ESTA LECCIÓN comenzando con: "Al finalizar esta lección serás capaz de..."
---
## Desarrollo de la lección
Explica el tema paso a paso. Divide el contenido en subtítulos. Utiliza listas. Incluye ejemplos reales.
Debe tener entre 700 y 1200 palabras y sentirse como una clase real.
---
## Conceptos importantes
Lista con una breve explicación de cada concepto clave.
---
## Ejemplo práctico
ESTRICTAMENTE relacionado con la categoría del curso (NO uses código si no es de tecnología).
---
## Consejos del instructor
Entre 4 y 6 consejos prácticos.
---
## Errores comunes
Los errores más frecuentes y cómo evitarlos.
---
## Ejercicio práctico
Un ejercicio realizable inmediatamente.
---
## Resumen
Resumen en pocas líneas.
---
## Próxima lección
Qué aprenderá en la siguiente clase.

------------------------------------------------
FORMATO:
Devuelve ÚNICAMENTE Markdown. Sin comentarios extra.
`;
};

async function generateAIContent() {
  if (!apiKey) {
    console.error("❌ ERROR: No se encontró la variable GEMINI_API_KEY en tu archivo .env");
    console.log("👉 Por favor, consigue tu clave gratuita en Google AI Studio y agrégala al .env");
    process.exit(1);
  }

  console.log('Iniciando generación avanzada de contenido con Google Gemini AI...');
  try {
    const cursosResult = await pool.query(`
      SELECT c.id, c.codigo, c.nombre, c.descripcion, c.nivel, cat.nombre as categoria_nombre 
      FROM cursos c JOIN categorias cat ON c.categoria_id = cat.id ORDER BY c.id
    `);
    
    let actualizadas = 0;

    for (const curso of cursosResult.rows) {
      console.log(`\\n📘 Procesando Curso: ${curso.nombre} (${curso.categoria_nombre})`);
      const modulosResult = await pool.query('SELECT id, titulo, orden FROM modulos WHERE curso_id = $1 ORDER BY orden', [curso.id]);
      
      for (const modulo of modulosResult.rows) {
        console.log(`  📦 Módulo: ${modulo.titulo}`);
        const leccionesResult = await pool.query('SELECT id, titulo, descripcion, duracion_minutos FROM lecciones WHERE modulo_id = $1 ORDER BY orden', [modulo.id]);
        
        for (const leccion of leccionesResult.rows) {
          // Si la lección ya tiene un contenido largo Y NO tiene la frase de la plantilla estática, asumimos que fue generada por IA
          const esPlantillaEstatica = leccion.descripcion && leccion.descripcion.includes('Bienvenido a esta lección fundamental del módulo');
          if (leccion.descripcion && leccion.descripcion.length > 500 && !esPlantillaEstatica) {
            console.log(`    ⏭️ Saltando: ${leccion.titulo} (Ya generada por IA)`);
            continue;
          }
          
          console.log(`    ⏳ Generando IA para: ${leccion.titulo}...`);
          try {
            const prompt = getPrompt(curso, modulo, leccion);
            const response = await ai.models.generateContent({
              model: 'gemini-2.0-flash',
              contents: prompt
            });
            
            const contenidoMarkdown = response.text;
            
            await pool.query('UPDATE lecciones SET descripcion = $1 WHERE id = $2', [contenidoMarkdown, leccion.id]);
            actualizadas++;
            console.log(`    ✅ Guardado.`);
          } catch (aiError) {
            console.error(`    ❌ Error de Gemini para ${leccion.titulo}:`, aiError.message);
            if (aiError.message.includes('429')) {
              console.log('    ⏳ Límite alcanzado. Pausando 40 segundos por seguridad...');
              await new Promise(resolve => setTimeout(resolve, 40000));
            }
          } finally {
            // Pausa obligatoria de 15 segundos en cada iteración (incluso si hay error) para respetar las 5 RPM
            await new Promise(resolve => setTimeout(resolve, 15000));
          }
        }
      }
    }
    
    console.log(`\\n🎉 ¡Proceso finalizado! Se generaron ${actualizadas} lecciones con IA de alta calidad.`);
  } catch (error) {
    console.error('Error general del script:', error);
  } finally {
    pool.end();
  }
}

generateAIContent();

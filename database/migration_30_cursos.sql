-- =============================================
-- MIGRACIÓN: 30 CURSOS (5 POR CATEGORÍA)
-- Ejecutar en el servidor PostgreSQL
-- =============================================

-- =============================================
-- TECNOLOGÍA (ya tiene 6 cursos, agregar solo los que falten para complementar)
-- Cursos existentes: Excel, Python, React, Data Science, Node.js, IA
-- =============================================

-- MARKETING (tiene 1, necesita 4 más)
INSERT INTO cursos (codigo, nombre, descripcion, categoria_id, instructor_id, precio, precio_premium, nivel, duracion_horas, estado, cupo_maximo, version_actual, valoracion, total_ventas, es_premium)
SELECT 'MKT-0002', 'SEO y Posicionamiento Web', 'Domina el SEO desde cero: investigación de palabras clave, optimización on-page y off-page, link building, SEO local, y Google Search Console. Posiciona tu sitio web en los primeros resultados de Google con técnicas actualizadas.', cat.id, u.id, 49.99, 39.99, 'intermedio', 35, 'disponible', 80, '1.0', 4.72, 156, false
FROM categorias cat, usuarios u WHERE cat.nombre = 'Marketing' AND u.email = 'maria.lopez@cursosecuador.com'
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO cursos (codigo, nombre, descripcion, categoria_id, instructor_id, precio, precio_premium, nivel, duracion_horas, estado, cupo_maximo, version_actual, valoracion, total_ventas, es_premium)
SELECT 'MKT-0003', 'Community Manager Profesional', 'Conviértete en Community Manager: gestión de redes sociales, creación de contenido, calendarios editoriales, métricas y KPIs, gestión de crisis y herramientas profesionales como Hootsuite y Buffer.', cat.id, u.id, 39.99, 29.99, 'principiante', 30, 'disponible', 60, '1.0', 4.58, 203, false
FROM categorias cat, usuarios u WHERE cat.nombre = 'Marketing' AND u.email = 'ana.garcia@cursosecuador.com'
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO cursos (codigo, nombre, descripcion, categoria_id, instructor_id, precio, precio_premium, nivel, duracion_horas, estado, cupo_maximo, version_actual, valoracion, total_ventas, es_premium)
SELECT 'MKT-0004', 'Email Marketing y Automatización', 'Estrategias avanzadas de email marketing: segmentación, automatización con Mailchimp y ActiveCampaign, copywriting para emails, secuencias de nurturing y análisis de métricas de conversión.', cat.id, u.id, 44.99, 35.99, 'intermedio', 40, 'disponible', 70, '1.0', 4.66, 128, false
FROM categorias cat, usuarios u WHERE cat.nombre = 'Marketing' AND u.email = 'juan.perez@cursosecuador.com'
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO cursos (codigo, nombre, descripcion, categoria_id, instructor_id, precio, precio_premium, nivel, duracion_horas, estado, cupo_maximo, version_actual, valoracion, total_ventas, es_premium)
SELECT 'MKT-0005', 'Google Ads y Facebook Ads Mastery', 'Publicidad digital avanzada: crea campañas rentables en Google Ads y Meta Ads. Segmentación de audiencias, retargeting, optimización de conversiones, presupuesto y escalamiento de campañas.', cat.id, u.id, 64.99, 49.99, 'avanzado', 50, 'disponible', 90, '1.1', 4.81, 245, true
FROM categorias cat, usuarios u WHERE cat.nombre = 'Marketing' AND u.email = 'maria.lopez@cursosecuador.com'
ON CONFLICT (codigo) DO NOTHING;

-- DISEÑO (tiene 1, necesita 4 más)
INSERT INTO cursos (codigo, nombre, descripcion, categoria_id, instructor_id, precio, precio_premium, nivel, duracion_horas, estado, cupo_maximo, version_actual, valoracion, total_ventas, es_premium)
SELECT 'DIS-0002', 'Adobe Photoshop de Cero a Experto', 'Domina Photoshop: edición fotográfica, retoque profesional, composición digital, manipulación de imágenes, diseño para redes sociales y preparación de archivos para impresión.', cat.id, u.id, 44.99, 35.99, 'principiante', 45, 'disponible', 100, '1.0', 4.73, 289, false
FROM categorias cat, usuarios u WHERE cat.nombre = 'Diseño' AND u.email = 'ana.garcia@cursosecuador.com'
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO cursos (codigo, nombre, descripcion, categoria_id, instructor_id, precio, precio_premium, nivel, duracion_horas, estado, cupo_maximo, version_actual, valoracion, total_ventas, es_premium)
SELECT 'DIS-0003', 'Ilustración Digital con Procreate', 'Aprende ilustración digital desde cero con Procreate para iPad. Pinceles, capas, color, composición, personajes, lettering y creación de portafolio profesional.', cat.id, u.id, 39.99, 31.99, 'principiante', 35, 'disponible', 50, '1.0', 4.62, 178, false
FROM categorias cat, usuarios u WHERE cat.nombre = 'Diseño' AND u.email = 'maria.lopez@cursosecuador.com'
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO cursos (codigo, nombre, descripcion, categoria_id, instructor_id, precio, precio_premium, nivel, duracion_horas, estado, cupo_maximo, version_actual, valoracion, total_ventas, es_premium)
SELECT 'DIS-0004', 'Motion Graphics con After Effects', 'Animación y motion graphics profesional: títulos animados, transiciones, efectos visuales, motion tracking, expresiones y exportación para redes sociales y producción audiovisual.', cat.id, u.id, 59.99, 47.99, 'intermedio', 55, 'disponible', 80, '1.0', 4.78, 145, false
FROM categorias cat, usuarios u WHERE cat.nombre = 'Diseño' AND u.email = 'juan.perez@cursosecuador.com'
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO cursos (codigo, nombre, descripcion, categoria_id, instructor_id, precio, precio_premium, nivel, duracion_horas, estado, cupo_maximo, version_actual, valoracion, total_ventas, es_premium)
SELECT 'DIS-0005', 'Branding y Diseño de Marca', 'Crea marcas poderosas: identidad visual, logo, tipografía, paleta de colores, manual de marca, aplicaciones y estrategia de branding para emprendedores y diseñadores.', cat.id, u.id, 49.99, 39.99, 'intermedio', 40, 'disponible', 70, '1.0', 4.69, 198, false
FROM categorias cat, usuarios u WHERE cat.nombre = 'Diseño' AND u.email = 'ana.garcia@cursosecuador.com'
ON CONFLICT (codigo) DO NOTHING;

-- NEGOCIOS (tiene 2, necesita 3 más)
INSERT INTO cursos (codigo, nombre, descripcion, categoria_id, instructor_id, precio, precio_premium, nivel, duracion_horas, estado, cupo_maximo, version_actual, valoracion, total_ventas, es_premium)
SELECT 'NEG-0003', 'Finanzas Personales e Inversión', 'Toma el control de tu dinero: presupuesto personal, ahorro inteligente, inversiones en la Bolsa de Valores de Quito, criptomonedas, bienes raíces y planificación para la jubilación en Ecuador.', cat.id, u.id, 34.99, 27.99, 'principiante', 30, 'disponible', 60, '1.0', 4.74, 312, false
FROM categorias cat, usuarios u WHERE cat.nombre = 'Negocios' AND u.email = 'maria.lopez@cursosecuador.com'
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO cursos (codigo, nombre, descripcion, categoria_id, instructor_id, precio, precio_premium, nivel, duracion_horas, estado, cupo_maximo, version_actual, valoracion, total_ventas, es_premium)
SELECT 'NEG-0004', 'Gestión de Proyectos con Scrum', 'Metodologías ágiles para gestión de proyectos: Scrum, Kanban, sprint planning, retrospectivas, herramientas como Jira y Trello. Prepárate para la certificación Scrum Master.', cat.id, u.id, 54.99, 43.99, 'intermedio', 45, 'disponible', 80, '1.0', 4.67, 176, false
FROM categorias cat, usuarios u WHERE cat.nombre = 'Negocios' AND u.email = 'juan.perez@cursosecuador.com'
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO cursos (codigo, nombre, descripcion, categoria_id, instructor_id, precio, precio_premium, nivel, duracion_horas, estado, cupo_maximo, version_actual, valoracion, total_ventas, es_premium)
SELECT 'NEG-0005', 'Liderazgo y Gestión de Equipos', 'Desarrolla habilidades de liderazgo: comunicación efectiva, delegación, resolución de conflictos, motivación de equipos, inteligencia emocional y gestión del cambio organizacional.', cat.id, u.id, 42.99, 33.99, 'intermedio', 35, 'disponible', 50, '1.0', 4.71, 134, false
FROM categorias cat, usuarios u WHERE cat.nombre = 'Negocios' AND u.email = 'ana.garcia@cursosecuador.com'
ON CONFLICT (codigo) DO NOTHING;

-- IDIOMAS (tiene 1, necesita 4 más)
INSERT INTO cursos (codigo, nombre, descripcion, categoria_id, instructor_id, precio, precio_premium, nivel, duracion_horas, estado, cupo_maximo, version_actual, valoracion, total_ventas, es_premium)
SELECT 'IDI-0002', 'Francés para Principiantes', 'Aprende francés desde cero: pronunciación, gramática básica, vocabulario cotidiano, conversación, cultura francófona y preparación para el examen DELF A1-A2.', cat.id, u.id, 39.99, 31.99, 'principiante', 40, 'disponible', 60, '1.0', 4.55, 98, false
FROM categorias cat, usuarios u WHERE cat.nombre = 'Idiomas' AND u.email = 'ana.garcia@cursosecuador.com'
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO cursos (codigo, nombre, descripcion, categoria_id, instructor_id, precio, precio_premium, nivel, duracion_horas, estado, cupo_maximo, version_actual, valoracion, total_ventas, es_premium)
SELECT 'IDI-0003', 'Portugués Brasileño Intermedio', 'Nivel intermedio de portugués: gramática avanzada, expresiones idiomáticas, comprensión auditiva con música y películas, conversación fluida y cultura brasileña.', cat.id, u.id, 44.99, 35.99, 'intermedio', 45, 'disponible', 50, '1.0', 4.48, 76, false
FROM categorias cat, usuarios u WHERE cat.nombre = 'Idiomas' AND u.email = 'juan.perez@cursosecuador.com'
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO cursos (codigo, nombre, descripcion, categoria_id, instructor_id, precio, precio_premium, nivel, duracion_horas, estado, cupo_maximo, version_actual, valoracion, total_ventas, es_premium)
SELECT 'IDI-0004', 'Inglés para IELTS y TOEFL', 'Preparación intensiva para exámenes internacionales: estrategias para reading, writing, listening y speaking. Simulacros de examen, vocabulario académico y tips para puntajes altos.', cat.id, u.id, 59.99, 47.99, 'avanzado', 60, 'disponible', 80, '1.0', 4.83, 189, true
FROM categorias cat, usuarios u WHERE cat.nombre = 'Idiomas' AND u.email = 'maria.lopez@cursosecuador.com'
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO cursos (codigo, nombre, descripcion, categoria_id, instructor_id, precio, precio_premium, nivel, duracion_horas, estado, cupo_maximo, version_actual, valoracion, total_ventas, es_premium)
SELECT 'IDI-0005', 'Chino Mandarín Básico', 'Introducción al mandarín: pinyin, tonos, caracteres básicos (HSK 1), conversaciones cotidianas, números, presentaciones y cultura china. Ideal para negocios internacionales.', cat.id, u.id, 49.99, 39.99, 'principiante', 50, 'disponible', 40, '1.0', 4.42, 65, false
FROM categorias cat, usuarios u WHERE cat.nombre = 'Idiomas' AND u.email = 'ana.garcia@cursosecuador.com'
ON CONFLICT (codigo) DO NOTHING;

-- ARTE Y CULTURA (tiene 1, necesita 4 más)
INSERT INTO cursos (codigo, nombre, descripcion, categoria_id, instructor_id, precio, precio_premium, nivel, duracion_horas, estado, cupo_maximo, version_actual, valoracion, total_ventas, es_premium)
SELECT 'ART-0002', 'Producción Musical con FL Studio', 'Crea música profesional desde tu computadora: composición, mezcla, mastering, síntesis sonora, sampling y producción de beats. Desde reguetón hasta música electrónica.', cat.id, u.id, 54.99, 43.99, 'intermedio', 50, 'disponible', 70, '1.0', 4.76, 187, false
FROM categorias cat, usuarios u WHERE cat.nombre = 'Arte y Cultura' AND u.email = 'juan.perez@cursosecuador.com'
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO cursos (codigo, nombre, descripcion, categoria_id, instructor_id, precio, precio_premium, nivel, duracion_horas, estado, cupo_maximo, version_actual, valoracion, total_ventas, es_premium)
SELECT 'ART-0003', 'Escritura Creativa y Narrativa', 'Desarrolla tu voz como escritor: técnicas narrativas, creación de personajes, diálogos, estructura de historias, poesía, microcuento y cómo publicar tu primera obra en Ecuador.', cat.id, u.id, 29.99, 23.99, 'principiante', 25, 'disponible', 40, '1.0', 4.63, 112, false
FROM categorias cat, usuarios u WHERE cat.nombre = 'Arte y Cultura' AND u.email = 'ana.garcia@cursosecuador.com'
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO cursos (codigo, nombre, descripcion, categoria_id, instructor_id, precio, precio_premium, nivel, duracion_horas, estado, cupo_maximo, version_actual, valoracion, total_ventas, es_premium)
SELECT 'ART-0004', 'Guitarra Acústica desde Cero', 'Aprende guitarra paso a paso: acordes básicos, rasgueo, arpegios, lectura de tabs, canciones populares ecuatorianas y latinoamericanas. Incluye ejercicios diarios de práctica.', cat.id, u.id, 34.99, 27.99, 'principiante', 30, 'disponible', 50, '1.0', 4.71, 234, false
FROM categorias cat, usuarios u WHERE cat.nombre = 'Arte y Cultura' AND u.email = 'maria.lopez@cursosecuador.com'
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO cursos (codigo, nombre, descripcion, categoria_id, instructor_id, precio, precio_premium, nivel, duracion_horas, estado, cupo_maximo, version_actual, valoracion, total_ventas, es_premium)
SELECT 'ART-0005', 'Historia del Arte Ecuatoriano', 'Recorre la historia del arte en Ecuador: arte precolombino, Escuela Quiteña, arte republicano, Guayasamín, Kingman, arte contemporáneo y el panorama actual de las artes visuales.', cat.id, u.id, 24.99, 19.99, 'principiante', 20, 'disponible', 30, '1.0', 4.45, 89, false
FROM categorias cat, usuarios u WHERE cat.nombre = 'Arte y Cultura' AND u.email = 'juan.perez@cursosecuador.com'
ON CONFLICT (codigo) DO NOTHING;

-- =============================================
-- VERSIONES PARA LOS NUEVOS CURSOS
-- =============================================
INSERT INTO curso_versiones (curso_id, numero_version, descripcion, cambios, estado)
SELECT c.id, '1.0', 'Versión inicial', 'Lanzamiento del curso', 'publicado'
FROM cursos c WHERE c.codigo IN (
  'MKT-0002','MKT-0003','MKT-0004','MKT-0005',
  'DIS-0002','DIS-0003','DIS-0004','DIS-0005',
  'NEG-0003','NEG-0004','NEG-0005',
  'IDI-0002','IDI-0003','IDI-0004','IDI-0005',
  'ART-0002','ART-0003','ART-0004','ART-0005'
) AND NOT EXISTS (SELECT 1 FROM curso_versiones cv WHERE cv.curso_id = c.id);

INSERT INTO curso_versiones (curso_id, numero_version, descripcion, cambios, estado)
SELECT c.id, '1.1', 'Actualización', 'Nuevas estrategias y contenido actualizado', 'publicado'
FROM cursos c WHERE c.codigo = 'MKT-0005'
AND NOT EXISTS (SELECT 1 FROM curso_versiones cv WHERE cv.curso_id = c.id AND cv.numero_version = '1.1');

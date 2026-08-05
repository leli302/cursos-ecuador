-- =============================================
-- MIGRACIÓN: PERFILES DE INSTRUCTORES Y MÓDULOS PARA TODOS LOS CURSOS
-- =============================================

-- 1. Campos de Perfil de Instructor en usuarios
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS titulo_profesional VARCHAR(200);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS experiencia VARCHAR(100);

-- Actualizar información de María López
UPDATE usuarios SET 
  titulo_profesional = 'Ingeniera en Sistemas & Especialista en Data Analytics',
  bio = 'Más de 10 años de experiencia en desarrollo web, análisis de datos con Excel avanzado y Python. Consultora de inteligencia de negocios para grandes empresas en Ecuador.',
  experiencia = '10+ años de experiencia'
WHERE email = 'maria.lopez@cursosecuador.com';

-- Actualizar información de Juan Pérez
UPDATE usuarios SET 
  titulo_profesional = 'Senior Full Stack Developer & Cloud Architect',
  bio = 'Desarrollador Full Stack apasionado por Node.js, React, Python y arquitecturas de microservicios. Ha liderado equipos de tecnología en fintechs latinoamericanas.',
  experiencia = '8+ años de experiencia'
WHERE email = 'juan.perez@cursosecuador.com';

-- Actualizar información de Ana García
UPDATE usuarios SET 
  titulo_profesional = 'Especialista en Marketing Digital & Diseño UI/UX',
  bio = 'Estratega digital y diseñadora UI/UX con enfoque en crecimiento de marcas, campañas publicitarias de alto rendimiento y experiencia de usuario para productos digitales.',
  experiencia = '7+ años de experiencia'
WHERE email = 'ana.garcia@cursosecuador.com';

-- =============================================
-- 2. MÓDULOS Y LECCIONES PARA CURSOS DE MARKETING
-- =============================================

-- MKT-0002: SEO y Posicionamiento Web
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT c.id, 'Fundamentos de SEO y Algoritmos', 'Cómo funcionan los motores de búsqueda', 1 FROM cursos c WHERE c.codigo = 'MKT-0002'
ON CONFLICT DO NOTHING;
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT c.id, 'Keyword Research y Estudio de Mercado', 'Investigación de palabras clave estratégicas', 2 FROM cursos c WHERE c.codigo = 'MKT-0002'
ON CONFLICT DO NOTHING;
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT c.id, 'SEO On-Page y Optimización Técnica', 'Etiquetas, velocidad, estructura e indexación', 3 FROM cursos c WHERE c.codigo = 'MKT-0002'
ON CONFLICT DO NOTHING;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Introducción al SEO en 2025', 'Panorama general del posicionamiento', 12, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id WHERE c.codigo = 'MKT-0002' AND m.orden = 1
ON CONFLICT DO NOTHING;
INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Búsqueda de Intención de Usuario', 'Cómo buscar palabras transaccionales e informativas', 20, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id WHERE c.codigo = 'MKT-0002' AND m.orden = 2
ON CONFLICT DO NOTHING;

-- MKT-0003: Community Manager Profesional
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT c.id, 'Rol del Community Manager', 'Funciones y responsabilidades principales', 1 FROM cursos c WHERE c.codigo = 'MKT-0003'
ON CONFLICT DO NOTHING;
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT c.id, 'Estrategia de Contenidos y Calendario', 'Planificación de publicaciones semanales y mensuales', 2 FROM cursos c WHERE c.codigo = 'MKT-0003'
ON CONFLICT DO NOTHING;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Definiendo la Voz y Tono de la Marca', 'Identidad verbal en redes sociales', 15, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id WHERE c.codigo = 'MKT-0003' AND m.orden = 1
ON CONFLICT DO NOTHING;

-- MKT-0005: Google Ads y Facebook Ads Mastery
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT c.id, 'Estructura de Campañas en Meta Ads', 'Píxel, audiencias personalizadas y conversiones', 1 FROM cursos c WHERE c.codigo = 'MKT-0005'
ON CONFLICT DO NOTHING;
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT c.id, 'Google Search y Display Ads', 'Anuncios en red de búsqueda y remarketing', 2 FROM cursos c WHERE c.codigo = 'MKT-0005'
ON CONFLICT DO NOTHING;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Configuración del Píxel de Meta', 'Instalación y eventos clave', 18, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id WHERE c.codigo = 'MKT-0005' AND m.orden = 1
ON CONFLICT DO NOTHING;

-- =============================================
-- 3. MÓDULOS Y LECCIONES PARA CURSOS DE DISEÑO
-- =============================================

-- DIS-0002: Photoshop
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT c.id, 'Interfaz y Herramientas Fundamentales', 'Espacio de trabajo, capas y selecciones', 1 FROM cursos c WHERE c.codigo = 'DIS-0002'
ON CONFLICT DO NOTHING;
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT c.id, 'Retoque Fotográfico Avanzado', 'Corrección de color, piel y filtros', 2 FROM cursos c WHERE c.codigo = 'DIS-0002'
ON CONFLICT DO NOTHING;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Primeros pasos en Photoshop CC', 'Entorno de trabajo y capas', 15, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id WHERE c.codigo = 'DIS-0002' AND m.orden = 1
ON CONFLICT DO NOTHING;

-- DIS-0005: Branding y Diseño de Marca
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT c.id, 'Investigación y Briefing de Marca', 'Entender el negocio antes de diseñar', 1 FROM cursos c WHERE c.codigo = 'DIS-0005'
ON CONFLICT DO NOTHING;
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT c.id, 'Construcción del Sistema Visual', 'Isotipo, logotipo, colores y tipografía', 2 FROM cursos c WHERE c.codigo = 'DIS-0005'
ON CONFLICT DO NOTHING;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Cómo estructurar un Brand Brief', 'Preguntas clave para el cliente', 14, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id WHERE c.codigo = 'DIS-0005' AND m.orden = 1
ON CONFLICT DO NOTHING;

-- =============================================
-- 4. MÓDULOS Y LECCIONES PARA CURSOS DE NEGOCIOS
-- =============================================

-- NEG-0003: Finanzas Personales e Inversión
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT c.id, 'Diagnóstico Financiero Personal', 'Ingresos, gastos fijos, variables y presupuesto', 1 FROM cursos c WHERE c.codigo = 'NEG-0003'
ON CONFLICT DO NOTHING;
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT c.id, 'Fondo de Emergencia e Inversiones', 'Renta fija, bolsa y vehículos financieros', 2 FROM cursos c WHERE c.codigo = 'NEG-0003'
ON CONFLICT DO NOTHING;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'El Método 50/30/20 para Presupuestos', 'Estrategia práctica de ahorro', 16, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id WHERE c.codigo = 'NEG-0003' AND m.orden = 1
ON CONFLICT DO NOTHING;

-- NEG-0004: Gestión de Proyectos con Scrum
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT c.id, 'Principios del Manifiesto Ágil', 'Valores y pilares de Scrum', 1 FROM cursos c WHERE c.codigo = 'NEG-0004'
ON CONFLICT DO NOTHING;
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT c.id, 'Eventos y Roles en Scrum', 'Product Owner, Scrum Master, Developers, Sprints', 2 FROM cursos c WHERE c.codigo = 'NEG-0004'
ON CONFLICT DO NOTHING;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, '¿Qué es Scrum y por qué usarlo?', 'Fundamentos de metodologías ágiles', 14, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id WHERE c.codigo = 'NEG-0004' AND m.orden = 1
ON CONFLICT DO NOTHING;

-- =============================================
-- 5. MÓDULOS Y LECCIONES PARA IDIOMAS
-- =============================================

-- IDI-0002: Francés para Principiantes
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT c.id, 'Alphabet, Salutations et Présentation', 'Alfabeto, saludos y presentaciones en francés', 1 FROM cursos c WHERE c.codigo = 'IDI-0002'
ON CONFLICT DO NOTHING;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Se présenter en français', 'Cómo saludarse y decir tu nombre', 15, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id WHERE c.codigo = 'IDI-0002' AND m.orden = 1
ON CONFLICT DO NOTHING;

-- IDI-0004: Inglés para IELTS y TOEFL
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT c.id, 'Academic Reading & Vocabulary', 'Estrategias de lectura rápida y skimming', 1 FROM cursos c WHERE c.codigo = 'IDI-0004'
ON CONFLICT DO NOTHING;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'IELTS Speaking Section Breakdown', 'Cómo estructurar tus respuestas', 22, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id WHERE c.codigo = 'IDI-0004' AND m.orden = 1
ON CONFLICT DO NOTHING;

-- =============================================
-- 6. MÓDULOS Y LECCIONES PARA ARTE Y CULTURA
-- =============================================

-- ART-0002: Producción Musical con FL Studio
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT c.id, 'Configuración y Channel Rack', 'Entorno de trabajo en FL Studio', 1 FROM cursos c WHERE c.codigo = 'ART-0002'
ON CONFLICT DO NOTHING;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Creando tu primer Beat en FL Studio', 'Patrones rítmicos básicos', 20, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id WHERE c.codigo = 'ART-0002' AND m.orden = 1
ON CONFLICT DO NOTHING;

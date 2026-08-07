-- =============================================
-- MIGRACIÓN: REPARACIÓN Y GENERACIÓN DE TODO EL CONTENIDO
-- =============================================

-- 1. Limpiar TODAS las lecciones y módulos existentes para evitar duplicados y contenido basura
TRUNCATE TABLE modulos RESTART IDENTITY CASCADE;

-- =============================================
-- CURSO: TEC-0001 (Excel)
-- =============================================
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Fundamentos de Excel', 'Conceptos básicos', 1 FROM cursos WHERE codigo = 'TEC-0001';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Interfaz y atajos', 'Descripción de Interfaz y atajos', 12, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0001' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Fórmulas básicas', 'Descripción de Fórmulas básicas', 21, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0001' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Formato condicional', 'Descripción de Formato condicional', 13, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0001' AND m.orden = 1;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Funciones Avanzadas', 'BUSCARV y lógicas', 2 FROM cursos WHERE codigo = 'TEC-0001';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'BUSCARV y BUSCARX', 'Descripción de BUSCARV y BUSCARX', 11, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0001' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Funciones SI anidadas', 'Descripción de Funciones SI anidadas', 13, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0001' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Manejo de errores', 'Descripción de Manejo de errores', 17, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0001' AND m.orden = 2;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Análisis de Datos', 'Tablas dinámicas', 3 FROM cursos WHERE codigo = 'TEC-0001';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Tablas y gráficos dinámicos', 'Descripción de Tablas y gráficos dinámicos', 13, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0001' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Filtros avanzados', 'Descripción de Filtros avanzados', 22, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0001' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Dashboards básicos', 'Descripción de Dashboards básicos', 18, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0001' AND m.orden = 3;

-- =============================================
-- CURSO: TEC-0002 (Python)
-- =============================================
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Introducción a Python', 'Sintaxis básica', 1 FROM cursos WHERE codigo = 'TEC-0002';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Instalación y variables', 'Descripción de Instalación y variables', 21, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0002' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Tipos de datos', 'Descripción de Tipos de datos', 22, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0002' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Operadores', 'Descripción de Operadores', 13, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0002' AND m.orden = 1;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Control de Flujo', 'Lógica condicional', 2 FROM cursos WHERE codigo = 'TEC-0002';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Condicionales if-else', 'Descripción de Condicionales if-else', 19, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0002' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Bucles for y while', 'Descripción de Bucles for y while', 20, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0002' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Manejo de excepciones', 'Descripción de Manejo de excepciones', 19, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0002' AND m.orden = 2;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Estructuras de Datos', 'Listas y diccionarios', 3 FROM cursos WHERE codigo = 'TEC-0002';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Listas y tuplas', 'Descripción de Listas y tuplas', 24, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0002' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Diccionarios', 'Descripción de Diccionarios', 17, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0002' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Funciones y módulos', 'Descripción de Funciones y módulos', 11, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0002' AND m.orden = 3;

-- =============================================
-- CURSO: TEC-0003 (React)
-- =============================================
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Fundamentos de React', 'Componentes y JSX', 1 FROM cursos WHERE codigo = 'TEC-0003';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Introducción a React', 'Descripción de Introducción a React', 20, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0003' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'JSX y Babel', 'Descripción de JSX y Babel', 21, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0003' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Componentes funcionales', 'Descripción de Componentes funcionales', 10, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0003' AND m.orden = 1;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Estado y Efectos', 'Hooks principales', 2 FROM cursos WHERE codigo = 'TEC-0003';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'useState', 'Descripción de useState', 15, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0003' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'useEffect', 'Descripción de useEffect', 14, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0003' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Custom Hooks', 'Descripción de Custom Hooks', 13, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0003' AND m.orden = 2;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Enrutamiento y Estado Global', 'React Router y Context', 3 FROM cursos WHERE codigo = 'TEC-0003';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'React Router', 'Descripción de React Router', 14, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0003' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Context API', 'Descripción de Context API', 24, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0003' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Integración con APIs', 'Descripción de Integración con APIs', 16, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0003' AND m.orden = 3;

-- =============================================
-- CURSO: TEC-0004 (Data Science)
-- =============================================
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Python para Datos', 'Librerías base', 1 FROM cursos WHERE codigo = 'TEC-0004';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Numpy básico', 'Descripción de Numpy básico', 13, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0004' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Pandas Dataframes', 'Descripción de Pandas Dataframes', 19, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0004' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Limpieza de datos', 'Descripción de Limpieza de datos', 21, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0004' AND m.orden = 1;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Visualización', 'Gráficos', 2 FROM cursos WHERE codigo = 'TEC-0004';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Matplotlib', 'Descripción de Matplotlib', 22, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0004' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Seaborn', 'Descripción de Seaborn', 22, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0004' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Dashboards interactivos', 'Descripción de Dashboards interactivos', 21, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0004' AND m.orden = 2;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Machine Learning', 'Modelos predictivos', 3 FROM cursos WHERE codigo = 'TEC-0004';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Regresión Lineal', 'Descripción de Regresión Lineal', 10, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0004' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Árboles de decisión', 'Descripción de Árboles de decisión', 15, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0004' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Evaluación de modelos', 'Descripción de Evaluación de modelos', 14, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0004' AND m.orden = 3;

-- =============================================
-- CURSO: TEC-0005 (Node.js)
-- =============================================
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Introducción a Node', 'Entorno de ejecución', 1 FROM cursos WHERE codigo = 'TEC-0005';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Arquitectura y Event Loop', 'Descripción de Arquitectura y Event Loop', 22, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0005' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Módulos y NPM', 'Descripción de Módulos y NPM', 18, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0005' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Manejo de archivos', 'Descripción de Manejo de archivos', 14, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0005' AND m.orden = 1;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Servidores web', 'Express.js', 2 FROM cursos WHERE codigo = 'TEC-0005';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Crear un servidor', 'Descripción de Crear un servidor', 13, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0005' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Rutas y Middlewares', 'Descripción de Rutas y Middlewares', 23, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0005' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'REST APIs', 'Descripción de REST APIs', 13, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0005' AND m.orden = 2;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Bases de Datos', 'Conexión a BD', 3 FROM cursos WHERE codigo = 'TEC-0005';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Conexión a PostgreSQL', 'Descripción de Conexión a PostgreSQL', 16, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0005' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Autenticación con JWT', 'Descripción de Autenticación con JWT', 14, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0005' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Despliegue a producción', 'Descripción de Despliegue a producción', 15, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0005' AND m.orden = 3;

-- =============================================
-- CURSO: TEC-0006 (Inteligencia Artificial)
-- =============================================
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Conceptos de IA', 'Fundamentos teóricos', 1 FROM cursos WHERE codigo = 'TEC-0006';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Historia de la IA', 'Descripción de Historia de la IA', 11, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0006' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Tipos de aprendizaje', 'Descripción de Tipos de aprendizaje', 11, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0006' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Redes neuronales básicas', 'Descripción de Redes neuronales básicas', 23, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0006' AND m.orden = 1;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Procesamiento de Lenguaje', 'NLP', 2 FROM cursos WHERE codigo = 'TEC-0006';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Tokenización', 'Descripción de Tokenización', 19, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0006' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Análisis de sentimiento', 'Descripción de Análisis de sentimiento', 15, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0006' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Modelos de lenguaje', 'Descripción de Modelos de lenguaje', 16, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0006' AND m.orden = 2;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Visión Computacional', 'Imágenes', 3 FROM cursos WHERE codigo = 'TEC-0006';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Detección de objetos', 'Descripción de Detección de objetos', 13, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0006' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Clasificación de imágenes', 'Descripción de Clasificación de imágenes', 14, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0006' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'OpenCV', 'Descripción de OpenCV', 14, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'TEC-0006' AND m.orden = 3;

-- =============================================
-- CURSO: MKT-0001 (Marketing Digital)
-- =============================================
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Estrategia Digital', 'Plan de marketing', 1 FROM cursos WHERE codigo = 'MKT-0001';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Buyer persona', 'Descripción de Buyer persona', 12, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0001' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Embudo de conversión', 'Descripción de Embudo de conversión', 19, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0001' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Métricas clave', 'Descripción de Métricas clave', 19, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0001' AND m.orden = 1;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Redes Sociales', 'Presencia online', 2 FROM cursos WHERE codigo = 'MKT-0001';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Estrategia de contenidos', 'Descripción de Estrategia de contenidos', 20, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0001' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Facebook e Instagram', 'Descripción de Facebook e Instagram', 10, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0001' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Gestión de crisis', 'Descripción de Gestión de crisis', 11, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0001' AND m.orden = 2;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Publicidad Online', 'Anuncios pagos', 3 FROM cursos WHERE codigo = 'MKT-0001';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Google Ads', 'Descripción de Google Ads', 16, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0001' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Meta Ads', 'Descripción de Meta Ads', 19, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0001' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Retargeting', 'Descripción de Retargeting', 24, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0001' AND m.orden = 3;

-- =============================================
-- CURSO: MKT-0002 (SEO)
-- =============================================
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Auditoría SEO', 'Estado del sitio', 1 FROM cursos WHERE codigo = 'MKT-0002';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Conceptos básicos de SEO', 'Descripción de Conceptos básicos de SEO', 10, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0002' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Keyword Research', 'Descripción de Keyword Research', 12, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0002' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Herramientas SEO', 'Descripción de Herramientas SEO', 12, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0002' AND m.orden = 1;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'SEO On-Page', 'Optimización interna', 2 FROM cursos WHERE codigo = 'MKT-0002';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Etiquetas meta', 'Descripción de Etiquetas meta', 14, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0002' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Estructura de URLs', 'Descripción de Estructura de URLs', 17, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0002' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Optimización de contenido', 'Descripción de Optimización de contenido', 13, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0002' AND m.orden = 2;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'SEO Off-Page', 'Link building', 3 FROM cursos WHERE codigo = 'MKT-0002';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Estrategias de enlaces', 'Descripción de Estrategias de enlaces', 15, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0002' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'SEO Local', 'Descripción de SEO Local', 20, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0002' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Métricas y Analytics', 'Descripción de Métricas y Analytics', 11, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0002' AND m.orden = 3;

-- =============================================
-- CURSO: MKT-0003 (Community Manager)
-- =============================================
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Rol del CM', 'Responsabilidades', 1 FROM cursos WHERE codigo = 'MKT-0003';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Funciones diarias', 'Descripción de Funciones diarias', 14, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0003' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Planificación y calendario', 'Descripción de Planificación y calendario', 19, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0003' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Herramientas de gestión', 'Descripción de Herramientas de gestión', 16, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0003' AND m.orden = 1;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Creación de Contenido', 'Posts creativos', 2 FROM cursos WHERE codigo = 'MKT-0003';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Copywriting para redes', 'Descripción de Copywriting para redes', 15, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0003' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Diseño visual con Canva', 'Descripción de Diseño visual con Canva', 20, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0003' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Formatos de video', 'Descripción de Formatos de video', 17, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0003' AND m.orden = 2;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Análisis de Redes', 'Reportes', 3 FROM cursos WHERE codigo = 'MKT-0003';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Métricas de engagement', 'Descripción de Métricas de engagement', 15, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0003' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Reportes mensuales', 'Descripción de Reportes mensuales', 11, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0003' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Casos de éxito', 'Descripción de Casos de éxito', 21, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0003' AND m.orden = 3;

-- =============================================
-- CURSO: MKT-0004 (Email Marketing)
-- =============================================
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Listas y Suscriptores', 'Captación', 1 FROM cursos WHERE codigo = 'MKT-0004';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Lead magnets', 'Descripción de Lead magnets', 16, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0004' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Formularios de registro', 'Descripción de Formularios de registro', 24, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0004' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Segmentación de audiencias', 'Descripción de Segmentación de audiencias', 18, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0004' AND m.orden = 1;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Campañas de Email', 'Diseño y envío', 2 FROM cursos WHERE codigo = 'MKT-0004';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Diseño de newsletters', 'Descripción de Diseño de newsletters', 15, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0004' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Líneas de asunto', 'Descripción de Líneas de asunto', 13, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0004' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Pruebas A/B', 'Descripción de Pruebas A/B', 19, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0004' AND m.orden = 2;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Automatización', 'Workflows', 3 FROM cursos WHERE codigo = 'MKT-0004';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Embudos de venta', 'Descripción de Embudos de venta', 20, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0004' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Secuencias de bienvenida', 'Descripción de Secuencias de bienvenida', 12, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0004' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Análisis de apertura', 'Descripción de Análisis de apertura', 23, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0004' AND m.orden = 3;

-- =============================================
-- CURSO: MKT-0005 (Google Ads)
-- =============================================
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Conceptos de Publicidad', 'Redes y tipos', 1 FROM cursos WHERE codigo = 'MKT-0005';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Red de Búsqueda vs Display', 'Descripción de Red de Búsqueda vs Display', 12, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0005' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Estructura de campañas', 'Descripción de Estructura de campañas', 20, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0005' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Presupuesto y pujas', 'Descripción de Presupuesto y pujas', 18, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0005' AND m.orden = 1;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Creación de Anuncios', 'Textos y gráficos', 2 FROM cursos WHERE codigo = 'MKT-0005';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Redacción de anuncios', 'Descripción de Redacción de anuncios', 20, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0005' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Extensiones de anuncios', 'Descripción de Extensiones de anuncios', 10, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0005' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Palabras clave negativas', 'Descripción de Palabras clave negativas', 15, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0005' AND m.orden = 2;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Optimización', 'Mejora de ROI', 3 FROM cursos WHERE codigo = 'MKT-0005';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Nivel de calidad', 'Descripción de Nivel de calidad', 15, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0005' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Seguimiento de conversiones', 'Descripción de Seguimiento de conversiones', 11, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0005' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Optimización de campañas', 'Descripción de Optimización de campañas', 22, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'MKT-0005' AND m.orden = 3;

-- =============================================
-- CURSO: DIS-0001 (Figma UX/UI)
-- =============================================
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Principios de UX', 'Experiencia de usuario', 1 FROM cursos WHERE codigo = 'DIS-0001';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Investigación de usuarios', 'Descripción de Investigación de usuarios', 12, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0001' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Arquitectura de información', 'Descripción de Arquitectura de información', 19, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0001' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Wireframing', 'Descripción de Wireframing', 11, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0001' AND m.orden = 1;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Diseño UI en Figma', 'Interfaz gráfica', 2 FROM cursos WHERE codigo = 'DIS-0001';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Herramientas de Figma', 'Descripción de Herramientas de Figma', 16, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0001' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Sistemas de diseño', 'Descripción de Sistemas de diseño', 12, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0001' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Tipografía y color', 'Descripción de Tipografía y color', 24, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0001' AND m.orden = 2;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Prototipado', 'Interacciones', 3 FROM cursos WHERE codigo = 'DIS-0001';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Prototipos interactivos', 'Descripción de Prototipos interactivos', 13, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0001' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Microinteracciones', 'Descripción de Microinteracciones', 20, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0001' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Handoff a desarrollo', 'Descripción de Handoff a desarrollo', 19, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0001' AND m.orden = 3;

-- =============================================
-- CURSO: DIS-0002 (Photoshop)
-- =============================================
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Interfaz y Herramientas', 'Primeros pasos', 1 FROM cursos WHERE codigo = 'DIS-0002';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Capas y modos de fusión', 'Descripción de Capas y modos de fusión', 22, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0002' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Herramientas de selección', 'Descripción de Herramientas de selección', 22, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0002' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Máscaras', 'Descripción de Máscaras', 13, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0002' AND m.orden = 1;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Retoque Fotográfico', 'Edición', 2 FROM cursos WHERE codigo = 'DIS-0002';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Corrección de color', 'Descripción de Corrección de color', 20, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0002' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Retoque de piel', 'Descripción de Retoque de piel', 23, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0002' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Eliminación de objetos', 'Descripción de Eliminación de objetos', 12, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0002' AND m.orden = 2;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Composición', 'Montajes', 3 FROM cursos WHERE codigo = 'DIS-0002';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Fotomontajes realistas', 'Descripción de Fotomontajes realistas', 24, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0002' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Filtros y efectos', 'Descripción de Filtros y efectos', 12, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0002' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Exportación web e impresión', 'Descripción de Exportación web e impresión', 10, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0002' AND m.orden = 3;

-- =============================================
-- CURSO: DIS-0003 (Procreate)
-- =============================================
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Conociendo Procreate', 'Herramientas', 1 FROM cursos WHERE codigo = 'DIS-0003';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Interfaz y gestos', 'Descripción de Interfaz y gestos', 17, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0003' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Pinceles y ajustes', 'Descripción de Pinceles y ajustes', 11, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0003' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Gestión de capas', 'Descripción de Gestión de capas', 10, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0003' AND m.orden = 1;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Técnicas de Ilustración', 'Dibujo digital', 2 FROM cursos WHERE codigo = 'DIS-0003';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Bocetado', 'Descripción de Bocetado', 16, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0003' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Tinta y línea', 'Descripción de Tinta y línea', 22, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0003' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Color y sombras', 'Descripción de Color y sombras', 18, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0003' AND m.orden = 2;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Proyectos Prácticos', 'Aplicación', 3 FROM cursos WHERE codigo = 'DIS-0003';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Diseño de personajes', 'Descripción de Diseño de personajes', 20, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0003' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Paisajes digitales', 'Descripción de Paisajes digitales', 21, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0003' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Animación básica en Procreate', 'Descripción de Animación básica en Procreate', 18, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0003' AND m.orden = 3;

-- =============================================
-- CURSO: DIS-0004 (After Effects)
-- =============================================
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Fundamentos de Animación', 'Conceptos', 1 FROM cursos WHERE codigo = 'DIS-0004';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Interfaz y composiciones', 'Descripción de Interfaz y composiciones', 10, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0004' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Keyframes y timeline', 'Descripción de Keyframes y timeline', 19, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0004' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Curvas de animación', 'Descripción de Curvas de animación', 15, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0004' AND m.orden = 1;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Animación de Texto', 'Motion Graphics', 2 FROM cursos WHERE codigo = 'DIS-0004';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Títulos animados', 'Descripción de Títulos animados', 19, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0004' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Animadores de texto', 'Descripción de Animadores de texto', 14, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0004' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Lower thirds', 'Descripción de Lower thirds', 15, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0004' AND m.orden = 2;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Composición y Efectos', 'VFX', 3 FROM cursos WHERE codigo = 'DIS-0004';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Máscaras y track mattes', 'Descripción de Máscaras y track mattes', 14, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0004' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Chroma key', 'Descripción de Chroma key', 24, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0004' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Exportación de video', 'Descripción de Exportación de video', 20, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0004' AND m.orden = 3;

-- =============================================
-- CURSO: DIS-0005 (Branding)
-- =============================================
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Identidad Corporativa', 'Conceptos', 1 FROM cursos WHERE codigo = 'DIS-0005';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Qué es una marca', 'Descripción de Qué es una marca', 20, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0005' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Valores y personalidad', 'Descripción de Valores y personalidad', 14, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0005' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Auditoría de marca', 'Descripción de Auditoría de marca', 12, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0005' AND m.orden = 1;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Diseño de Identidad', 'Creación visual', 2 FROM cursos WHERE codigo = 'DIS-0005';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Diseño de logotipo', 'Descripción de Diseño de logotipo', 11, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0005' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Paleta de colores', 'Descripción de Paleta de colores', 14, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0005' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Selección tipográfica', 'Descripción de Selección tipográfica', 15, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0005' AND m.orden = 2;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Manual de Marca', 'Normativas', 3 FROM cursos WHERE codigo = 'DIS-0005';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Estructura del manual', 'Descripción de Estructura del manual', 13, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0005' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Aplicaciones de marca', 'Descripción de Aplicaciones de marca', 17, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0005' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Presentación al cliente', 'Descripción de Presentación al cliente', 17, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'DIS-0005' AND m.orden = 3;

-- =============================================
-- CURSO: NEG-0001 (Emprendimiento)
-- =============================================
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Modelos de Negocio', 'Estrategia', 1 FROM cursos WHERE codigo = 'NEG-0001';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Ideación', 'Descripción de Ideación', 22, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0001' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Lean Canvas', 'Descripción de Lean Canvas', 14, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0001' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Validación de mercado', 'Descripción de Validación de mercado', 12, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0001' AND m.orden = 1;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Finanzas Básicas', 'Presupuesto', 2 FROM cursos WHERE codigo = 'NEG-0001';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Estructura de costos', 'Descripción de Estructura de costos', 18, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0001' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Fijación de precios', 'Descripción de Fijación de precios', 24, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0001' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Punto de equilibrio', 'Descripción de Punto de equilibrio', 21, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0001' AND m.orden = 2;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Lanzamiento', 'Go to market', 3 FROM cursos WHERE codigo = 'NEG-0001';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Estrategia de lanzamiento', 'Descripción de Estrategia de lanzamiento', 22, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0001' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Ventas iniciales', 'Descripción de Ventas iniciales', 21, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0001' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Pitch para inversores', 'Descripción de Pitch para inversores', 12, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0001' AND m.orden = 3;

-- =============================================
-- CURSO: NEG-0002 (Contabilidad)
-- =============================================
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Principios Contables', 'Conceptos', 1 FROM cursos WHERE codigo = 'NEG-0002';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Activos y pasivos', 'Descripción de Activos y pasivos', 21, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0002' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Partida doble', 'Descripción de Partida doble', 21, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0002' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Plan de cuentas', 'Descripción de Plan de cuentas', 14, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0002' AND m.orden = 1;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Estados Financieros', 'Reportes', 2 FROM cursos WHERE codigo = 'NEG-0002';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Balance General', 'Descripción de Balance General', 10, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0002' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Estado de Resultados', 'Descripción de Estado de Resultados', 18, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0002' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Flujo de Caja', 'Descripción de Flujo de Caja', 19, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0002' AND m.orden = 2;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Impuestos', 'Obligaciones fiscales', 3 FROM cursos WHERE codigo = 'NEG-0002';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'IVA e ISR', 'Descripción de IVA e ISR', 14, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0002' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Facturación electrónica', 'Descripción de Facturación electrónica', 16, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0002' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Declaraciones mensuales', 'Descripción de Declaraciones mensuales', 23, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0002' AND m.orden = 3;

-- =============================================
-- CURSO: NEG-0003 (Finanzas Personales)
-- =============================================
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Educación Financiera', 'Mentalidad', 1 FROM cursos WHERE codigo = 'NEG-0003';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Presupuesto personal', 'Descripción de Presupuesto personal', 21, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0003' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Fondo de emergencia', 'Descripción de Fondo de emergencia', 18, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0003' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Control de deudas', 'Descripción de Control de deudas', 21, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0003' AND m.orden = 1;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Ahorro e Inversión', 'Crecimiento', 2 FROM cursos WHERE codigo = 'NEG-0003';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Tipos de inversión', 'Descripción de Tipos de inversión', 18, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0003' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Interés compuesto', 'Descripción de Interés compuesto', 19, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0003' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Bolsa de valores básica', 'Descripción de Bolsa de valores básica', 10, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0003' AND m.orden = 2;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Planificación Futura', 'Largo plazo', 3 FROM cursos WHERE codigo = 'NEG-0003';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Seguros', 'Descripción de Seguros', 19, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0003' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Jubilación', 'Descripción de Jubilación', 24, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0003' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Bienes raíces', 'Descripción de Bienes raíces', 20, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0003' AND m.orden = 3;

-- =============================================
-- CURSO: NEG-0004 (Scrum)
-- =============================================
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Metodologías Ágiles', 'Conceptos', 1 FROM cursos WHERE codigo = 'NEG-0004';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Manifiesto Ágil', 'Descripción de Manifiesto Ágil', 23, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0004' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Diferencias con Waterfall', 'Descripción de Diferencias con Waterfall', 18, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0004' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Pilares de Scrum', 'Descripción de Pilares de Scrum', 17, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0004' AND m.orden = 1;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Roles y Eventos', 'Marco de trabajo', 2 FROM cursos WHERE codigo = 'NEG-0004';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Product Owner y Scrum Master', 'Descripción de Product Owner y Scrum Master', 22, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0004' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Sprint Planning y Daily', 'Descripción de Sprint Planning y Daily', 16, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0004' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Review y Retrospective', 'Descripción de Review y Retrospective', 20, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0004' AND m.orden = 2;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Artefactos', 'Entregables', 3 FROM cursos WHERE codigo = 'NEG-0004';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Product Backlog', 'Descripción de Product Backlog', 16, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0004' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Sprint Backlog', 'Descripción de Sprint Backlog', 22, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0004' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Incremento y DoD', 'Descripción de Incremento y DoD', 16, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0004' AND m.orden = 3;

-- =============================================
-- CURSO: NEG-0005 (Liderazgo)
-- =============================================
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Habilidades de Liderazgo', 'Competencias', 1 FROM cursos WHERE codigo = 'NEG-0005';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Estilos de liderazgo', 'Descripción de Estilos de liderazgo', 15, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0005' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Inteligencia Emocional', 'Descripción de Inteligencia Emocional', 18, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0005' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Comunicación asertiva', 'Descripción de Comunicación asertiva', 18, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0005' AND m.orden = 1;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Gestión de Equipos', 'Trabajo grupal', 2 FROM cursos WHERE codigo = 'NEG-0005';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Motivación', 'Descripción de Motivación', 14, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0005' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Resolución de conflictos', 'Descripción de Resolución de conflictos', 20, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0005' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Delegación de tareas', 'Descripción de Delegación de tareas', 16, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0005' AND m.orden = 2;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Desarrollo Organizacional', 'Cultura', 3 FROM cursos WHERE codigo = 'NEG-0005';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Gestión del cambio', 'Descripción de Gestión del cambio', 22, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0005' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Evaluación de desempeño', 'Descripción de Evaluación de desempeño', 18, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0005' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Mentoring y Coaching', 'Descripción de Mentoring y Coaching', 19, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'NEG-0005' AND m.orden = 3;

-- =============================================
-- CURSO: IDI-0001 (Inglés Profesional)
-- =============================================
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Inglés para Negocios', 'Vocabulario', 1 FROM cursos WHERE codigo = 'IDI-0001';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Saludos y presentaciones', 'Descripción de Saludos y presentaciones', 18, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0001' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Vocabulario de oficina', 'Descripción de Vocabulario de oficina', 20, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0001' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Llamadas telefónicas', 'Descripción de Llamadas telefónicas', 24, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0001' AND m.orden = 1;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Escritura Profesional', 'Emails', 2 FROM cursos WHERE codigo = 'IDI-0001';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Estructura de emails', 'Descripción de Estructura de emails', 17, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0001' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Tono formal e informal', 'Descripción de Tono formal e informal', 23, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0001' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Reportes breves', 'Descripción de Reportes breves', 21, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0001' AND m.orden = 2;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Reuniones y Presentaciones', 'Comunicación oral', 3 FROM cursos WHERE codigo = 'IDI-0001';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Participar en reuniones', 'Descripción de Participar en reuniones', 11, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0001' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Dar presentaciones', 'Descripción de Dar presentaciones', 14, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0001' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Negociación básica', 'Descripción de Negociación básica', 16, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0001' AND m.orden = 3;

-- =============================================
-- CURSO: IDI-0002 (Francés)
-- =============================================
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Bases del Francés', 'Conceptos iniciales', 1 FROM cursos WHERE codigo = 'IDI-0002';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'El alfabeto y pronunciación', 'Descripción de El alfabeto y pronunciación', 22, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0002' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Saludos y cortesía', 'Descripción de Saludos y cortesía', 17, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0002' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Los números', 'Descripción de Los números', 16, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0002' AND m.orden = 1;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Gramática Básica', 'Estructuras', 2 FROM cursos WHERE codigo = 'IDI-0002';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Verbos être y avoir', 'Descripción de Verbos être y avoir', 11, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0002' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Artículos y sustantivos', 'Descripción de Artículos y sustantivos', 24, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0002' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Adjetivos comunes', 'Descripción de Adjetivos comunes', 23, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0002' AND m.orden = 2;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Situaciones Cotidianas', 'Vocabulario útil', 3 FROM cursos WHERE codigo = 'IDI-0002';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'En el restaurante', 'Descripción de En el restaurante', 24, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0002' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Preguntar direcciones', 'Descripción de Preguntar direcciones', 13, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0002' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'La familia', 'Descripción de La familia', 19, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0002' AND m.orden = 3;

-- =============================================
-- CURSO: IDI-0003 (Portugués)
-- =============================================
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Pronunciación y Saludos', 'Bases', 1 FROM cursos WHERE codigo = 'IDI-0003';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Sonidos del portugués', 'Descripción de Sonidos del portugués', 11, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0003' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Saludos y despedidas', 'Descripción de Saludos y despedidas', 19, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0003' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Falsos amigos', 'Descripción de Falsos amigos', 17, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0003' AND m.orden = 1;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Tiempos Verbales', 'Gramática', 2 FROM cursos WHERE codigo = 'IDI-0003';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Presente del indicativo', 'Descripción de Presente del indicativo', 14, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0003' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Pasado perfecto', 'Descripción de Pasado perfecto', 24, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0003' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Futuro', 'Descripción de Futuro', 22, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0003' AND m.orden = 2;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Cultura y Conversación', 'Práctica', 3 FROM cursos WHERE codigo = 'IDI-0003';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Vocabulario de viajes', 'Descripción de Vocabulario de viajes', 19, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0003' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Comida brasileña', 'Descripción de Comida brasileña', 10, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0003' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Expresiones coloquiales', 'Descripción de Expresiones coloquiales', 15, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0003' AND m.orden = 3;

-- =============================================
-- CURSO: IDI-0004 (IELTS/TOEFL)
-- =============================================
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Estrategias de Lectura', 'Reading', 1 FROM cursos WHERE codigo = 'IDI-0004';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Skimming y scanning', 'Descripción de Skimming y scanning', 21, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0004' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Tipos de preguntas', 'Descripción de Tipos de preguntas', 24, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0004' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Manejo del tiempo', 'Descripción de Manejo del tiempo', 22, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0004' AND m.orden = 1;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Comprensión y Escritura', 'Listening & Writing', 2 FROM cursos WHERE codigo = 'IDI-0004';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Tomar notas', 'Descripción de Tomar notas', 21, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0004' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Estructura de ensayos', 'Descripción de Estructura de ensayos', 21, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0004' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Vocabulario académico', 'Descripción de Vocabulario académico', 10, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0004' AND m.orden = 2;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Práctica Oral', 'Speaking', 3 FROM cursos WHERE codigo = 'IDI-0004';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Fluidez y coherencia', 'Descripción de Fluidez y coherencia', 10, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0004' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Pronunciación', 'Descripción de Pronunciación', 18, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0004' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Simulacros de speaking', 'Descripción de Simulacros de speaking', 18, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0004' AND m.orden = 3;

-- =============================================
-- CURSO: IDI-0005 (Mandarín)
-- =============================================
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Pinyin y Tonos', 'Fonética', 1 FROM cursos WHERE codigo = 'IDI-0005';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Los 4 tonos', 'Descripción de Los 4 tonos', 22, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0005' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Vocales y consonantes', 'Descripción de Vocales y consonantes', 16, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0005' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Saludos básicos', 'Descripción de Saludos básicos', 12, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0005' AND m.orden = 1;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Caracteres y Gramática', 'Escritura', 2 FROM cursos WHERE codigo = 'IDI-0005';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Trazos básicos', 'Descripción de Trazos básicos', 21, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0005' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Orden de las palabras', 'Descripción de Orden de las palabras', 13, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0005' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Números y fechas', 'Descripción de Números y fechas', 20, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0005' AND m.orden = 2;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Conversación Básica', 'Práctica oral', 3 FROM cursos WHERE codigo = 'IDI-0005';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Presentarse', 'Descripción de Presentarse', 19, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0005' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Ir de compras', 'Descripción de Ir de compras', 19, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0005' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Pedir comida', 'Descripción de Pedir comida', 12, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'IDI-0005' AND m.orden = 3;

-- =============================================
-- CURSO: ART-0001 (Fotografía)
-- =============================================
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'La Cámara', 'Manejo', 1 FROM cursos WHERE codigo = 'ART-0001';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Triángulo de exposición', 'Descripción de Triángulo de exposición', 24, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0001' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Velocidad de obturación', 'Descripción de Velocidad de obturación', 13, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0001' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Apertura e ISO', 'Descripción de Apertura e ISO', 10, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0001' AND m.orden = 1;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Composición', 'Reglas visuales', 2 FROM cursos WHERE codigo = 'ART-0001';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Regla de los tercios', 'Descripción de Regla de los tercios', 15, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0001' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Líneas guía', 'Descripción de Líneas guía', 12, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0001' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Perspectiva y profundidad', 'Descripción de Perspectiva y profundidad', 17, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0001' AND m.orden = 2;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Iluminación y Edición', 'Postproducción', 3 FROM cursos WHERE codigo = 'ART-0001';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Luz natural vs artificial', 'Descripción de Luz natural vs artificial', 18, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0001' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Edición en Lightroom', 'Descripción de Edición en Lightroom', 24, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0001' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Exportación', 'Descripción de Exportación', 12, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0001' AND m.orden = 3;

-- =============================================
-- CURSO: ART-0002 (Producción Musical)
-- =============================================
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Fundamentos de Audio', 'Teoría', 1 FROM cursos WHERE codigo = 'ART-0002';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Frecuencias y ondas', 'Descripción de Frecuencias y ondas', 18, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0002' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Configuración de home studio', 'Descripción de Configuración de home studio', 10, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0002' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Interfaz de FL Studio', 'Descripción de Interfaz de FL Studio', 15, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0002' AND m.orden = 1;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Creación Musical', 'Composición', 2 FROM cursos WHERE codigo = 'ART-0002';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Creación de beats', 'Descripción de Creación de beats', 14, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0002' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Líneas de bajo', 'Descripción de Líneas de bajo', 11, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0002' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Uso de sintetizadores', 'Descripción de Uso de sintetizadores', 20, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0002' AND m.orden = 2;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Mezcla y Mastering', 'Postproducción', 3 FROM cursos WHERE codigo = 'ART-0002';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Ecualización (EQ)', 'Descripción de Ecualización (EQ)', 12, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0002' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Compresión', 'Descripción de Compresión', 18, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0002' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Masterización final', 'Descripción de Masterización final', 18, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0002' AND m.orden = 3;

-- =============================================
-- CURSO: ART-0003 (Escritura Creativa)
-- =============================================
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Bases de la Narrativa', 'Estructura', 1 FROM cursos WHERE codigo = 'ART-0003';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'El viaje del héroe', 'Descripción de El viaje del héroe', 21, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0003' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Tipos de narrador', 'Descripción de Tipos de narrador', 18, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0003' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Conflicto y trama', 'Descripción de Conflicto y trama', 24, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0003' AND m.orden = 1;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Creación de Personajes', 'Desarrollo', 2 FROM cursos WHERE codigo = 'ART-0003';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Fichas de personaje', 'Descripción de Fichas de personaje', 23, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0003' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Arcos de transformación', 'Descripción de Arcos de transformación', 19, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0003' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Diálogos realistas', 'Descripción de Diálogos realistas', 11, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0003' AND m.orden = 2;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Revisión y Publicación', 'Finalización', 3 FROM cursos WHERE codigo = 'ART-0003';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Corrección de estilo', 'Descripción de Corrección de estilo', 12, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0003' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Bloqueo del escritor', 'Descripción de Bloqueo del escritor', 23, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0003' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Opciones de publicación', 'Descripción de Opciones de publicación', 13, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0003' AND m.orden = 3;

-- =============================================
-- CURSO: ART-0004 (Guitarra)
-- =============================================
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Primeros Pasos', 'Bases', 1 FROM cursos WHERE codigo = 'ART-0004';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Partes de la guitarra', 'Descripción de Partes de la guitarra', 17, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0004' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Afinación', 'Descripción de Afinación', 12, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0004' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Postura correcta', 'Descripción de Postura correcta', 13, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0004' AND m.orden = 1;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Acordes y Ritmos', 'Acompañamiento', 2 FROM cursos WHERE codigo = 'ART-0004';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Acordes mayores y menores', 'Descripción de Acordes mayores y menores', 22, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0004' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Patrones de rasgueo', 'Descripción de Patrones de rasgueo', 20, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0004' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Cambios de acordes', 'Descripción de Cambios de acordes', 20, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0004' AND m.orden = 2;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Técnicas y Canciones', 'Práctica', 3 FROM cursos WHERE codigo = 'ART-0004';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Punteo básico', 'Descripción de Punteo básico', 14, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0004' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Lectura de tablaturas', 'Descripción de Lectura de tablaturas', 15, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0004' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Tu primera canción', 'Descripción de Tu primera canción', 19, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0004' AND m.orden = 3;

-- =============================================
-- CURSO: ART-0005 (Historia del Arte)
-- =============================================
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Arte Precolombino', 'Orígenes', 1 FROM cursos WHERE codigo = 'ART-0005';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Culturas originarias', 'Descripción de Culturas originarias', 18, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0005' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Cerámica y orfebrería', 'Descripción de Cerámica y orfebrería', 17, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0005' AND m.orden = 1;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Arquitectura andina', 'Descripción de Arquitectura andina', 19, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0005' AND m.orden = 1;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Arte Colonial', 'Escuela Quiteña', 2 FROM cursos WHERE codigo = 'ART-0005';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Arquitectura religiosa', 'Descripción de Arquitectura religiosa', 23, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0005' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Escultura policromada', 'Descripción de Escultura policromada', 18, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0005' AND m.orden = 2;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Pintura barroca', 'Descripción de Pintura barroca', 20, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0005' AND m.orden = 2;

INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Arte Contemporáneo', 'Siglos XX y XXI', 3 FROM cursos WHERE codigo = 'ART-0005';

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Indigenismo', 'Descripción de Indigenismo', 20, 1, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0005' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Oswaldo Guayasamín', 'Descripción de Oswaldo Guayasamín', 11, 2, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0005' AND m.orden = 3;

INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Nuevas tendencias', 'Descripción de Nuevas tendencias', 11, 3, false
FROM modulos m JOIN cursos c ON m.curso_id = c.id 
WHERE c.codigo = 'ART-0005' AND m.orden = 3;


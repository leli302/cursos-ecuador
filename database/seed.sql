-- =============================================
-- DATOS DE DEMOSTRACIÓN
-- =============================================

-- Admin (password: Admin123!)
INSERT INTO usuarios (nombre, apellido, email, password_hash, telefono, estado, email_verificado) VALUES
('Carlos', 'Administrador', 'admin@cursosecuador.com', '$2b$12$LJ3m4yPnVfWzLjH2GzWJXeKZq3YqY5vN8mR7kP6tQ9sX1wA2bC3dE', '0991234567', true, true)
ON CONFLICT (email) DO NOTHING;

-- Instructores (password: Instructor123!)
INSERT INTO usuarios (nombre, apellido, email, password_hash, telefono, estado, email_verificado) VALUES
('María', 'López', 'maria.lopez@cursosecuador.com', '$2b$12$LJ3m4yPnVfWzLjH2GzWJXeKZq3YqY5vN8mR7kP6tQ9sX1wA2bC3dE', '0987654321', true, true),
('Juan', 'Pérez', 'juan.perez@cursosecuador.com', '$2b$12$LJ3m4yPnVfWzLjH2GzWJXeKZq3YqY5vN8mR7kP6tQ9sX1wA2bC3dE', '0976543210', true, true),
('Ana', 'García', 'ana.garcia@cursosecuador.com', '$2b$12$LJ3m4yPnVfWzLjH2GzWJXeKZq3YqY5vN8mR7kP6tQ9sX1wA2bC3dE', '0965432109', true, true)
ON CONFLICT (email) DO NOTHING;

-- Estudiante demo (password: Estudiante123!)
INSERT INTO usuarios (nombre, apellido, email, password_hash, telefono, estado, email_verificado) VALUES
('Pedro', 'Estudiante', 'estudiante@cursosecuador.com', '$2b$12$LJ3m4yPnVfWzLjH2GzWJXeKZq3YqY5vN8mR7kP6tQ9sX1wA2bC3dE', '0954321098', true, true)
ON CONFLICT (email) DO NOTHING;

-- Asignar roles
INSERT INTO usuario_roles (usuario_id, rol_id)
SELECT u.id, r.id FROM usuarios u, roles r WHERE u.email = 'admin@cursosecuador.com' AND r.nombre = 'administrador'
ON CONFLICT DO NOTHING;

INSERT INTO usuario_roles (usuario_id, rol_id)
SELECT u.id, r.id FROM usuarios u, roles r WHERE u.email = 'maria.lopez@cursosecuador.com' AND r.nombre = 'instructor'
ON CONFLICT DO NOTHING;

INSERT INTO usuario_roles (usuario_id, rol_id)
SELECT u.id, r.id FROM usuarios u, roles r WHERE u.email = 'juan.perez@cursosecuador.com' AND r.nombre = 'instructor'
ON CONFLICT DO NOTHING;

INSERT INTO usuario_roles (usuario_id, rol_id)
SELECT u.id, r.id FROM usuarios u, roles r WHERE u.email = 'ana.garcia@cursosecuador.com' AND r.nombre = 'instructor'
ON CONFLICT DO NOTHING;

INSERT INTO usuario_roles (usuario_id, rol_id)
SELECT u.id, r.id FROM usuarios u, roles r WHERE u.email = 'estudiante@cursosecuador.com' AND r.nombre = 'estudiante'
ON CONFLICT DO NOTHING;

-- Carrito para usuario demo
INSERT INTO carrito (usuario_id) SELECT id FROM usuarios WHERE email = 'estudiante@cursosecuador.com' ON CONFLICT DO NOTHING;

-- =============================================
-- CURSOS DE DEMOSTRACIÓN
-- =============================================

-- Curso 1: Excel
INSERT INTO cursos (codigo, nombre, descripcion, categoria_id, instructor_id, precio, precio_premium, nivel, duracion_horas, estado, cupo_maximo, version_actual, valoracion, total_ventas, es_premium)
SELECT 'TEC-0001', 'Excel Avanzado para Negocios', 'Domina Excel desde tablas dinámicas hasta macros y VBA. Aprende a automatizar reportes, crear dashboards profesionales y analizar datos como un experto. Incluye casos prácticos del mercado ecuatoriano.', cat.id, u.id, 49.99, 39.99, 'intermedio', 40, 'disponible', 100, '1.0', 4.80, 234, false
FROM categorias cat, usuarios u WHERE cat.nombre = 'Tecnología' AND u.email = 'maria.lopez@cursosecuador.com';

-- Curso 2: Python
INSERT INTO cursos (codigo, nombre, descripcion, categoria_id, instructor_id, precio, precio_premium, nivel, duracion_horas, estado, cupo_maximo, version_actual, valoracion, total_ventas, es_premium)
SELECT 'TEC-0002', 'Python desde Cero hasta Experto', 'Aprende Python desde los fundamentos hasta desarrollo web con Django. Incluye proyectos reales: automatización, análisis de datos con Pandas, y APIs REST. El lenguaje más demandado del mercado.', cat.id, u.id, 69.99, 54.99, 'principiante', 80, 'disponible', 100, '2.0', 4.95, 567, false
FROM categorias cat, usuarios u WHERE cat.nombre = 'Tecnología' AND u.email = 'juan.perez@cursosecuador.com';

-- Curso 3: Marketing Digital
INSERT INTO cursos (codigo, nombre, descripcion, categoria_id, instructor_id, precio, precio_premium, nivel, duracion_horas, estado, cupo_maximo, version_actual, valoracion, total_ventas, es_premium)
SELECT 'MKT-0001', 'Marketing Digital Profesional', 'Estrategias comprobadas de marketing digital: Facebook Ads, Google Ads, Email Marketing, SEO y analítica web. Casos de éxito de emprendedores ecuatorianos y latinoamericanos.', cat.id, u.id, 59.99, 47.99, 'intermedio', 50, 'disponible', 100, '1.1', 4.70, 189, false
FROM categorias cat, usuarios u WHERE cat.nombre = 'Marketing' AND u.email = 'ana.garcia@cursosecuador.com';

-- Curso 4: Diseño UI/UX
INSERT INTO cursos (codigo, nombre, descripcion, categoria_id, instructor_id, precio, precio_premium, nivel, duracion_horas, estado, cupo_maximo, version_actual, valoracion, total_ventas, es_premium)
SELECT 'DIS-0001', 'Diseño UX/UI con Figma', 'Aprende a diseñar interfaces modernas y experiencias de usuario excepcionales usando Figma. Desde wireframes hasta prototipos interactivos. Incluye Design System completo.', cat.id, u.id, 54.99, 43.99, 'principiante', 60, 'disponible', 100, '1.0', 4.85, 312, false
FROM categorias cat, usuarios u WHERE cat.nombre = 'Diseño' AND u.email = 'maria.lopez@cursosecuador.com';

-- Curso 5: Emprendimiento
INSERT INTO cursos (codigo, nombre, descripcion, categoria_id, instructor_id, precio, precio_premium, nivel, duracion_horas, estado, cupo_maximo, version_actual, valoracion, total_ventas, es_premium)
SELECT 'NEG-0001', 'Emprendimiento en Ecuador', 'Todo lo que necesitas para emprender en Ecuador: constitución de empresas, SRI, IESS, plan de negocios, financiamiento y marketing. Con casos reales y plantillas descargables.', cat.id, u.id, 39.99, 29.99, 'principiante', 30, 'disponible', 100, '1.0', 4.60, 145, false
FROM categorias cat, usuarios u WHERE cat.nombre = 'Negocios' AND u.email = 'ana.garcia@cursosecuador.com';

-- Curso 6: React (Premium)
INSERT INTO cursos (codigo, nombre, descripcion, categoria_id, instructor_id, precio, precio_premium, nivel, duracion_horas, estado, cupo_maximo, version_actual, valoracion, total_ventas, es_premium)
SELECT 'TEC-0003', 'React.js Profesional - Desarrollo Web Moderno', 'Curso completo de React: Hooks, Context API, Redux, React Router, Testing, y despliegue. Construye 5 proyectos reales incluyendo un e-commerce y un dashboard administrativo.', cat.id, u.id, 89.99, 69.99, 'avanzado', 100, 'disponible', 100, '2.0', 4.90, 423, true
FROM categorias cat, usuarios u WHERE cat.nombre = 'Tecnología' AND u.email = 'juan.perez@cursosecuador.com';

-- Curso 7: Inglés
INSERT INTO cursos (codigo, nombre, descripcion, categoria_id, instructor_id, precio, precio_premium, nivel, duracion_horas, estado, cupo_maximo, version_actual, valoracion, total_ventas, es_premium)
SELECT 'IDI-0001', 'Inglés para Profesionales', 'Mejora tu inglés profesional con enfoque en Business English. Presentaciones, negociaciones, emails y conferencias. Desde nivel A2 hasta B2 con práctica conversacional.', cat.id, u.id, 44.99, 34.99, 'intermedio', 50, 'disponible', 100, '1.0', 4.65, 278, false
FROM categorias cat, usuarios u WHERE cat.nombre = 'Idiomas' AND u.email = 'maria.lopez@cursosecuador.com';

-- Curso 8: Data Science (Premium)
INSERT INTO cursos (codigo, nombre, descripcion, categoria_id, instructor_id, precio, precio_premium, nivel, duracion_horas, estado, cupo_maximo, version_actual, valoracion, total_ventas, es_premium)
SELECT 'TEC-0004', 'Data Science y Machine Learning', 'Ciencia de datos desde cero: Python, NumPy, Pandas, Matplotlib, Scikit-Learn y TensorFlow. Aprende a crear modelos predictivos con datos reales de la economía ecuatoriana.', cat.id, u.id, 99.99, 79.99, 'avanzado', 120, 'disponible', 100, '1.2', 4.92, 198, true
FROM categorias cat, usuarios u WHERE cat.nombre = 'Tecnología' AND u.email = 'juan.perez@cursosecuador.com';

-- Curso 9: Fotografía
INSERT INTO cursos (codigo, nombre, descripcion, categoria_id, instructor_id, precio, precio_premium, nivel, duracion_horas, estado, cupo_maximo, version_actual, valoracion, total_ventas, es_premium)
SELECT 'ART-0001', 'Fotografía Digital Profesional', 'Desde tomar tu primera foto hasta editar como profesional. Composición, iluminación, retrato, paisaje, producto y edición en Lightroom y Photoshop.', cat.id, u.id, 34.99, 27.99, 'principiante', 35, 'disponible', 100, '1.0', 4.55, 167, false
FROM categorias cat, usuarios u WHERE cat.nombre = 'Arte y Cultura' AND u.email = 'ana.garcia@cursosecuador.com';

-- Curso 10: Node.js (Premium)
INSERT INTO cursos (codigo, nombre, descripcion, categoria_id, instructor_id, precio, precio_premium, nivel, duracion_horas, estado, cupo_maximo, version_actual, valoracion, total_ventas, es_premium)
SELECT 'TEC-0005', 'Node.js y Express - Backend Profesional', 'Desarrollo backend completo con Node.js: Express, PostgreSQL, JWT, APIs REST, WebSockets, Docker y despliegue en producción. Construye sistemas escalables y seguros.', cat.id, u.id, 79.99, 63.99, 'avanzado', 90, 'disponible', 100, '1.1', 4.88, 356, true
FROM categorias cat, usuarios u WHERE cat.nombre = 'Tecnología' AND u.email = 'juan.perez@cursosecuador.com';

-- Curso 11: Contabilidad
INSERT INTO cursos (codigo, nombre, descripcion, categoria_id, instructor_id, precio, precio_premium, nivel, duracion_horas, estado, cupo_maximo, version_actual, valoracion, total_ventas, es_premium)
SELECT 'NEG-0002', 'Contabilidad para Emprendedores', 'Fundamentos de contabilidad aplicada: estados financieros, flujo de caja, declaraciones SRI, facturación electrónica y herramientas contables modernas para tu negocio.', cat.id, u.id, 35.99, 28.99, 'principiante', 25, 'disponible', 100, '1.0', 4.50, 98, false
FROM categorias cat, usuarios u WHERE cat.nombre = 'Negocios' AND u.email = 'ana.garcia@cursosecuador.com';

-- Curso 12: Próximamente
INSERT INTO cursos (codigo, nombre, descripcion, categoria_id, instructor_id, precio, precio_premium, nivel, duracion_horas, estado, cupo_maximo, version_actual, valoracion, total_ventas, es_premium)
SELECT 'TEC-0006', 'Inteligencia Artificial Aplicada', 'Próximamente: curso de IA aplicada con ChatGPT, visión por computadora, procesamiento de lenguaje natural y automatización inteligente. Inscríbete en la lista de espera.', cat.id, u.id, 109.99, 87.99, 'avanzado', 150, 'proximo', 100, '1.0', 0, 0, true
FROM categorias cat, usuarios u WHERE cat.nombre = 'Tecnología' AND u.email = 'juan.perez@cursosecuador.com';

-- =============================================
-- VERSIONES DE CURSOS
-- =============================================
INSERT INTO curso_versiones (curso_id, numero_version, descripcion, cambios, estado)
SELECT c.id, '1.0', 'Versión inicial', 'Lanzamiento del curso', 'publicado'
FROM cursos c WHERE c.codigo IN ('TEC-0001','MKT-0001','DIS-0001','NEG-0001','IDI-0001','ART-0001','NEG-0002','TEC-0006');

INSERT INTO curso_versiones (curso_id, numero_version, descripcion, cambios, estado)
SELECT c.id, '1.0', 'Versión inicial', 'Lanzamiento del curso', 'archivado'
FROM cursos c WHERE c.codigo = 'TEC-0002';

INSERT INTO curso_versiones (curso_id, numero_version, descripcion, cambios, estado)
SELECT c.id, '2.0', 'Actualización mayor', 'Nuevo contenido sobre Python 3.12, sección de IA, proyectos actualizados', 'publicado'
FROM cursos c WHERE c.codigo = 'TEC-0002';

INSERT INTO curso_versiones (curso_id, numero_version, descripcion, cambios, estado)
SELECT c.id, '2.0', 'Actualización completa', 'React 18, Server Components, nuevos proyectos', 'publicado'
FROM cursos c WHERE c.codigo = 'TEC-0003';

INSERT INTO curso_versiones (curso_id, numero_version, descripcion, cambios, estado)
SELECT c.id, '1.1', 'Actualización', 'Nuevos módulos de Express 5 y Prisma ORM', 'publicado'
FROM cursos c WHERE c.codigo = 'TEC-0005';

INSERT INTO curso_versiones (curso_id, numero_version, descripcion, cambios, estado)
SELECT c.id, '1.1', 'Actualización', 'Nuevas estrategias de TikTok y tendencias 2025', 'publicado'
FROM cursos c WHERE c.codigo = 'MKT-0001';

INSERT INTO curso_versiones (curso_id, numero_version, descripcion, cambios, estado)
SELECT c.id, '1.2', 'Mejoras', 'Sección de Deep Learning y NLP', 'publicado'
FROM cursos c WHERE c.codigo = 'TEC-0004';

-- =============================================
-- MÓDULOS Y LECCIONES (para los 3 primeros cursos)
-- =============================================

-- Módulos Excel Avanzado
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT c.id, 'Fundamentos de Excel', 'Repaso rápido de funciones esenciales', 1 FROM cursos c WHERE c.codigo = 'TEC-0001';
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT c.id, 'Tablas Dinámicas', 'Crear y personalizar tablas dinámicas', 2 FROM cursos c WHERE c.codigo = 'TEC-0001';
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT c.id, 'Fórmulas Avanzadas', 'BUSCARV, INDEX-MATCH, SUMAPRODUCTO', 3 FROM cursos c WHERE c.codigo = 'TEC-0001';
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT c.id, 'Macros y VBA', 'Automatización con Visual Basic', 4 FROM cursos c WHERE c.codigo = 'TEC-0001';
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT c.id, 'Dashboards Profesionales', 'Crear reportes visuales interactivos', 5 FROM cursos c WHERE c.codigo = 'TEC-0001';

-- Lecciones del módulo 1 de Excel
INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Bienvenida al curso', 'Presentación y objetivos', 5, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id WHERE c.codigo = 'TEC-0001' AND m.orden = 1;
INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden)
SELECT m.id, 'Atajos de teclado esenciales', 'Los atajos que te harán más productivo', 15, 2
FROM modulos m JOIN cursos c ON m.curso_id = c.id WHERE c.codigo = 'TEC-0001' AND m.orden = 1;
INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden)
SELECT m.id, 'Formato condicional avanzado', 'Resaltar datos automáticamente', 20, 3
FROM modulos m JOIN cursos c ON m.curso_id = c.id WHERE c.codigo = 'TEC-0001' AND m.orden = 1;
INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden)
SELECT m.id, 'Validación de datos', 'Controlar la entrada de datos', 18, 4
FROM modulos m JOIN cursos c ON m.curso_id = c.id WHERE c.codigo = 'TEC-0001' AND m.orden = 1;

-- Módulos Python
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT c.id, 'Introducción a Python', 'Instalación, primer programa, variables', 1 FROM cursos c WHERE c.codigo = 'TEC-0002';
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT c.id, 'Estructuras de Control', 'Condicionales, bucles, funciones', 2 FROM cursos c WHERE c.codigo = 'TEC-0002';
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT c.id, 'Programación Orientada a Objetos', 'Clases, herencia, polimorfismo', 3 FROM cursos c WHERE c.codigo = 'TEC-0002';
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT c.id, 'Análisis de Datos con Pandas', 'DataFrames, limpieza, análisis', 4 FROM cursos c WHERE c.codigo = 'TEC-0002';
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT c.id, 'Desarrollo Web con Django', 'Crear aplicaciones web completas', 5 FROM cursos c WHERE c.codigo = 'TEC-0002';
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT c.id, 'Proyecto Final', 'Aplicación completa de análisis de datos', 6 FROM cursos c WHERE c.codigo = 'TEC-0002';

-- Lecciones del módulo 1 de Python
INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, '¿Qué es Python y por qué aprenderlo?', 'Introducción al lenguaje', 10, 1, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id WHERE c.codigo = 'TEC-0002' AND m.orden = 1;
INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)
SELECT m.id, 'Instalación de Python y VS Code', 'Configuración del entorno', 15, 2, true
FROM modulos m JOIN cursos c ON m.curso_id = c.id WHERE c.codigo = 'TEC-0002' AND m.orden = 1;
INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden)
SELECT m.id, 'Variables y tipos de datos', 'Strings, números, booleanos', 20, 3
FROM modulos m JOIN cursos c ON m.curso_id = c.id WHERE c.codigo = 'TEC-0002' AND m.orden = 1;
INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden)
SELECT m.id, 'Operadores y expresiones', 'Aritméticos, lógicos, comparación', 18, 4
FROM modulos m JOIN cursos c ON m.curso_id = c.id WHERE c.codigo = 'TEC-0002' AND m.orden = 1;
INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden)
SELECT m.id, 'Entrada y salida de datos', 'Input, print, formateo de strings', 15, 5
FROM modulos m JOIN cursos c ON m.curso_id = c.id WHERE c.codigo = 'TEC-0002' AND m.orden = 1;

-- Módulos Marketing Digital
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT c.id, 'Fundamentos del Marketing Digital', 'Conceptos base y estrategia', 1 FROM cursos c WHERE c.codigo = 'MKT-0001';
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT c.id, 'SEO y Posicionamiento Web', 'Aparecer en los primeros resultados', 2 FROM cursos c WHERE c.codigo = 'MKT-0001';
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT c.id, 'Facebook e Instagram Ads', 'Publicidad en Meta', 3 FROM cursos c WHERE c.codigo = 'MKT-0001';
INSERT INTO modulos (curso_id, titulo, descripcion, orden)
SELECT c.id, 'Google Ads', 'Campañas en Google', 4 FROM cursos c WHERE c.codigo = 'MKT-0001';

-- =============================================
-- AULAS
-- =============================================
INSERT INTO aulas (curso_id, nombre, cupo_maximo, cupo_ocupado, fecha_inicio, estado)
SELECT c.id, 'Aula 1', 100, 78, '2025-01-15', 'activa' FROM cursos c WHERE c.codigo = 'TEC-0001';
INSERT INTO aulas (curso_id, nombre, cupo_maximo, cupo_ocupado, fecha_inicio, estado)
SELECT c.id, 'Aula 1', 100, 100, '2025-01-10', 'llena' FROM cursos c WHERE c.codigo = 'TEC-0002';
INSERT INTO aulas (curso_id, nombre, cupo_maximo, cupo_ocupado, fecha_inicio, estado)
SELECT c.id, 'Aula 2', 100, 45, '2025-01-17', 'activa' FROM cursos c WHERE c.codigo = 'TEC-0002';
INSERT INTO aulas (curso_id, nombre, cupo_maximo, cupo_ocupado, fecha_inicio, estado)
SELECT c.id, 'Aula 1', 100, 52, '2025-02-01', 'activa' FROM cursos c WHERE c.codigo = 'MKT-0001';
INSERT INTO aulas (curso_id, nombre, cupo_maximo, cupo_ocupado, fecha_inicio, estado)
SELECT c.id, 'Aula 1', 100, 35, '2025-02-15', 'activa' FROM cursos c WHERE c.codigo = 'DIS-0001';
INSERT INTO aulas (curso_id, nombre, cupo_maximo, cupo_ocupado, fecha_inicio, estado)
SELECT c.id, 'Aula 1', 100, 22, '2025-03-01', 'activa' FROM cursos c WHERE c.codigo = 'NEG-0001';
INSERT INTO aulas (curso_id, nombre, cupo_maximo, cupo_ocupado, fecha_inicio, estado)
SELECT c.id, 'Aula 1', 100, 90, '2025-01-20', 'activa' FROM cursos c WHERE c.codigo = 'TEC-0003';
INSERT INTO aulas (curso_id, nombre, cupo_maximo, cupo_ocupado, fecha_inicio, estado)
SELECT c.id, 'Aula 1', 100, 67, '2025-02-10', 'activa' FROM cursos c WHERE c.codigo = 'IDI-0001';
INSERT INTO aulas (curso_id, nombre, cupo_maximo, cupo_ocupado, fecha_inicio, estado)
SELECT c.id, 'Aula 1', 100, 44, '2025-03-15', 'activa' FROM cursos c WHERE c.codigo = 'TEC-0004';
INSERT INTO aulas (curso_id, nombre, cupo_maximo, cupo_ocupado, fecha_inicio, estado)
SELECT c.id, 'Aula 1', 100, 18, '2025-02-20', 'activa' FROM cursos c WHERE c.codigo = 'ART-0001';
INSERT INTO aulas (curso_id, nombre, cupo_maximo, cupo_ocupado, fecha_inicio, estado)
SELECT c.id, 'Aula 1', 100, 88, '2025-01-25', 'activa' FROM cursos c WHERE c.codigo = 'TEC-0005';
INSERT INTO aulas (curso_id, nombre, cupo_maximo, cupo_ocupado, fecha_inicio, estado)
SELECT c.id, 'Aula 1', 100, 15, '2025-04-01', 'activa' FROM cursos c WHERE c.codigo = 'NEG-0002';

-- =============================================
-- DISPONIBILIDAD
-- =============================================
INSERT INTO disponibilidad_curso (curso_id, tipo, mensaje)
SELECT c.id, 'disponible', 'Disponible ahora' FROM cursos c WHERE c.estado = 'disponible';

INSERT INTO disponibilidad_curso (curso_id, tipo, mensaje, fecha_estimada)
SELECT c.id, 'proximo', 'Este curso estará disponible próximamente', '2025-09-01' FROM cursos c WHERE c.codigo = 'TEC-0006';

-- =============================================
-- RESEÑAS DE EJEMPLO
-- =============================================
-- (Las reseñas se crean referenciando al usuario estudiante demo)

-- =============================================
-- MÓDULOS Y LECCIONES GENÉRICAS PARA EL RESTO DE CURSOS
-- =============================================
DO $$
DECLARE
    r_curso RECORD;
    v_modulo_id INT;
BEGIN
    FOR r_curso IN SELECT id, nombre FROM cursos LOOP
        -- Verificar si el curso ya tiene módulos
        IF NOT EXISTS (SELECT 1 FROM modulos WHERE curso_id = r_curso.id) THEN
            -- Módulo 1
            INSERT INTO modulos (curso_id, titulo, descripcion, orden)
            VALUES (r_curso.id, 'Introducción al Curso', 'Conceptos básicos y preparación del entorno.', 1)
            RETURNING id INTO v_modulo_id;
            
            INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis) VALUES
            (v_modulo_id, 'Bienvenida y presentación', 'Introducción al contenido y objetivos del curso.', 5, 1, true),
            (v_modulo_id, 'Preparación del entorno de trabajo', 'Instalación y configuración de herramientas necesarias.', 15, 2, false);
            
            -- Módulo 2
            INSERT INTO modulos (curso_id, titulo, descripcion, orden)
            VALUES (r_curso.id, 'Fundamentos y Primeros Pasos', 'Temas clave y primeros ejemplos prácticos.', 2)
            RETURNING id INTO v_modulo_id;
            
            INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis) VALUES
            (v_modulo_id, 'Conceptos fundamentales', 'Explicación teórica y ejemplos sencillos.', 20, 1, false),
            (v_modulo_id, 'Ejercicios de aplicación práctica', 'Retos guiados paso a paso.', 25, 2, false);
            
            -- Módulo 3
            INSERT INTO modulos (curso_id, titulo, descripcion, orden)
            VALUES (r_curso.id, 'Proyecto Final y Cierre', 'Consolidación de lo aprendido y siguientes pasos.', 3)
            RETURNING id INTO v_modulo_id;
            
            INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis) VALUES
            (v_modulo_id, 'Desarrollo del proyecto integrador', 'Proyecto de aplicación práctica de todo el curso.', 30, 1, false),
            (v_modulo_id, 'Cierre de curso y recomendaciones', 'Siguientes pasos y obtención de tu certificado.', 10, 2, false);
        END IF;
    END LOOP;
END $$;


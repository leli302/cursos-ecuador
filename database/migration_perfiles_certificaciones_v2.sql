-- =============================================
-- MIGRACIÓN V2: PERFILES PROFESIONALES DE DOCENTES, DETALLE DE CURSOS Y CERTIFICACIONES
-- =============================================

-- 1. CAMPOS DE PERFIL PROFESIONAL DE DOCENTES EN USUARIOS
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS universidad TEXT;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS titulos_academicos TEXT;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS maestrias_especializaciones TEXT;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS certificaciones_profesionales TEXT;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS anos_experiencia INT DEFAULT 8;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS empresas_trabajadas TEXT;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS pais VARCHAR(100) DEFAULT 'Ecuador';
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS ciudad VARCHAR(100) DEFAULT 'Quito';
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS idiomas VARCHAR(200) DEFAULT 'Español, Inglés';
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS areas_especializacion TEXT;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS nivel_insignia VARCHAR(50) DEFAULT 'Oro';
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS linkedin VARCHAR(255);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS github VARCHAR(255);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS website VARCHAR(255);

-- 2. CAMPOS ESTRUCTURADOS EN CURSOS
ALTER TABLE cursos ADD COLUMN IF NOT EXISTS lo_que_aprenderas JSONB;
ALTER TABLE cursos ADD COLUMN IF NOT EXISTS dirigido_a JSONB;
ALTER TABLE cursos ADD COLUMN IF NOT EXISTS requisitos TEXT DEFAULT 'No necesitas experiencia previa.';
ALTER TABLE cursos ADD COLUMN IF NOT EXISTS idioma VARCHAR(50) DEFAULT 'Español';
ALTER TABLE cursos ADD COLUMN IF NOT EXISTS fecha_actualizacion TIMESTAMP DEFAULT NOW();

-- 3. TABLA TIPOS DE CERTIFICACIÓN
CREATE TABLE IF NOT EXISTS tipos_certificacion (
    id SERIAL PRIMARY KEY,
    curso_id INT REFERENCES cursos(id) ON DELETE CASCADE,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    beneficios TEXT,
    requisitos TEXT,
    precio DECIMAL(10,2) NOT NULL DEFAULT 29.99,
    creado_en TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- ACTUALIZACIÓN DE DATOS DE DOCENTES
-- =============================================

-- María López
UPDATE usuarios SET 
  titulo_profesional = 'Ingeniera en Sistemas & Especialista en Data Analytics',
  bio = 'Experta y profesional apasionada por compartir conocimientos prácticos con metodologías adaptadas al mercado real. Ha formado a más de 3,500 profesionales en América Latina.',
  universidad = 'Escuela Politécnica Nacional (EPN) - Ecuador',
  titulos_academicos = 'Ingeniera en Sistemas de Información',
  maestrias_especializaciones = 'Maestría en Data Science & Big Analytics (Universidad de Barcelona)',
  certificaciones_profesionales = 'Microsoft Certified: Data Analyst Associate, AWS Certified Solutions Architect, Python Institute PCAP',
  anos_experiencia = 10,
  empresas_trabajadas = 'Banco Pichincha, Telefonica Movistar, IBM Ecuador, Cursos Ecuador',
  pais = 'Ecuador',
  ciudad = 'Quito',
  idiomas = 'Español, Inglés fluido',
  areas_especializacion = 'Data Science, Python, Excel Avanzado, SQL, Power BI, Business Intelligence',
  nivel_insignia = 'Platino',
  linkedin = 'https://linkedin.com/in/maria-lopez-analytics',
  github = 'https://github.com/marialopez-data',
  website = 'https://marialopezdata.com'
WHERE email = 'maria.lopez@cursosecuador.com';

-- Juan Pérez
UPDATE usuarios SET 
  titulo_profesional = 'Senior Full Stack Developer & Cloud Architect',
  bio = 'Arquitecto de Software y consultor sénior con amplia trayectoria en el diseño de plataformas educativas de alto rendimiento, microservicios y sistemas en la nube.',
  universidad = 'Universidad San Francisco de Quito (USFQ)',
  titulos_academicos = 'Licenciado en Ciencias de la Computación',
  maestrias_especializaciones = 'Máster en Arquitectura de Software Cloud (Universidad Politécnica de Madrid)',
  certificaciones_profesionales = 'AWS Certified DevOps Engineer Professional, Certified Kubernetes Administrator (CKA), Scrum Master (PSM I)',
  anos_experiencia = 12,
  empresas_trabajadas = 'Kruger Corporation, Thoughtworks, Mercado Libre, Cursos Ecuador',
  pais = 'Ecuador',
  ciudad = 'Guayaquil',
  idiomas = 'Español, Inglés, Portugués',
  areas_especializacion = 'Desarrollo Web Full Stack, React, Node.js, Cloud Computing, PostgreSQL, DevOps',
  nivel_insignia = 'Élite',
  linkedin = 'https://linkedin.com/in/juanperez-dev',
  github = 'https://github.com/juanperezdev',
  website = 'https://juanperez.dev'
WHERE email = 'juan.perez@cursosecuador.com';

-- Ana García
UPDATE usuarios SET 
  titulo_profesional = 'Especialista en Marketing Digital & Diseñadora UI/UX',
  bio = 'Estratega de marcas globales y diseñadora UI/UX centrada en la experiencia de usuario y crecimiento acelerado de productos digitales.',
  universidad = 'Universidad de las Américas (UDLA)',
  titulos_academicos = 'Licenciada en Diseño Gráfico e Industrial',
  maestrias_especializaciones = 'Especialización en UX Research (Nielsen Norman Group) y Master en Marketing Digital (IE Business School)',
  certificaciones_profesionales = 'Google Ads Certified Professional, Meta Certified Digital Marketing Associate, Figma Master Certification',
  anos_experiencia = 9,
  empresas_trabajadas = 'Nestlé Ecuador, McCann Erickson, Rappi, Cursos Ecuador',
  pais = 'Ecuador',
  ciudad = 'Cuenca',
  idiomas = 'Español, Inglés, Francés',
  areas_especializacion = 'Diseño UX/UI, Figma, Marketing Digital, SEO, Growth Hacking, Branding',
  nivel_insignia = 'Oro',
  linkedin = 'https://linkedin.com/in/ana-garcia-ux',
  github = 'https://github.com/anagarcia-ui',
  website = 'https://anagarcia.design'
WHERE email = 'ana.garcia@cursosecuador.com';

-- =============================================
-- ACTUALIZACIÓN DE OBJETIVOS Y PÚBLICO EN CURSOS
-- =============================================
UPDATE cursos SET
  lo_que_aprenderas = '[
    "Comprender los fundamentos teóricos y prácticos del área.",
    "Desarrollar proyectos reales aplicados a la industria ecuatoriana.",
    "Dominar las herramientas estándar utilizadas por empresas líderes.",
    "Implementar mejores prácticas y patrones profesionales de trabajo.",
    "Resolver casos de estudio del mundo real paso a paso.",
    "Prepararse eficazmente para evaluaciones y certificaciones de mercado."
  ]'::jsonb,
  dirigido_a = '[
    "Estudiantes universitarios y técnicos.",
    "Profesionales que buscan actualizar sus conocimientos.",
    "Emprendedores y dueños de negocios.",
    "Personas que desean aprender desde cero."
  ]'::jsonb,
  requisitos = 'No necesitas experiencia previa. Todo el contenido se enseña desde los fundamentos.',
  idioma = 'Español'
WHERE lo_que_aprenderas IS NULL;

-- =============================================
-- TIPOS DE CERTIFICACIÓN POR DEFECTO PARA CURSOS
-- =============================================
INSERT INTO tipos_certificacion (curso_id, nombre, descripcion, beneficios, requisitos, precio)
SELECT 
  id, 
  'Certificado de Aprobación', 
  'Certificación oficial de aprobación del curso respaldada por Cursos Ecuador.', 
  'Código de verificación único QR, descarga instantánea en PDF en alta resolución, validez para LinkedIn y currículum vitae.', 
  'Completar el 100% de los módulos y aprobar los quizzes.', 
  29.99
FROM cursos
ON CONFLICT DO NOTHING;

INSERT INTO tipos_certificacion (curso_id, nombre, descripcion, beneficios, requisitos, precio)
SELECT 
  id, 
  'Certificado Profesional Avanzado', 
  'Certificación de alto nivel con validación de competencias prácticas y proyecto final.', 
  'Firma digital verificada, insignia digital LinkedIn, revisión de proyecto por el instructor, inclusión en la bolsa de empleo de Cursos Ecuador.', 
  'Completar el 100% de los módulos, quizzes y entregar el proyecto final práctico.', 
  49.99
FROM cursos
ON CONFLICT DO NOTHING;

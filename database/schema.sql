-- =============================================
-- SISTEMA CURSOS ECUADOR - BASE DE DATOS
-- =============================================

-- 1. ROLES
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    creado_en TIMESTAMP DEFAULT NOW()
);

-- 2. USUARIOS
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    avatar VARCHAR(500),
    estado BOOLEAN DEFAULT true,
    email_verificado BOOLEAN DEFAULT false,
    creado_en TIMESTAMP DEFAULT NOW(),
    actualizado_en TIMESTAMP DEFAULT NOW()
);

-- 3. USUARIO_ROLES
CREATE TABLE IF NOT EXISTS usuario_roles (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    rol_id INT REFERENCES roles(id) ON DELETE CASCADE,
    creado_en TIMESTAMP DEFAULT NOW(),
    UNIQUE(usuario_id, rol_id)
);

-- 4. CATEGORIAS
CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    imagen VARCHAR(500),
    estado BOOLEAN DEFAULT true,
    creado_en TIMESTAMP DEFAULT NOW()
);

-- 5. CURSOS
CREATE TABLE IF NOT EXISTS cursos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    categoria_id INT REFERENCES categorias(id),
    instructor_id INT REFERENCES usuarios(id),
    precio DECIMAL(10,2) DEFAULT 0,
    precio_premium DECIMAL(10,2) DEFAULT 0,
    imagen VARCHAR(500),
    nivel VARCHAR(50),
    duracion_horas INT DEFAULT 0,
    estado VARCHAR(50) DEFAULT 'disponible',
    cupo_maximo INT DEFAULT 100,
    fecha_disponible DATE,
    version_actual VARCHAR(20) DEFAULT '1.0',
    valoracion DECIMAL(3,2) DEFAULT 0,
    total_ventas INT DEFAULT 0,
    es_premium BOOLEAN DEFAULT false,
    creado_en TIMESTAMP DEFAULT NOW(),
    actualizado_en TIMESTAMP DEFAULT NOW()
);

-- 6. CURSO_VERSIONES
CREATE TABLE IF NOT EXISTS curso_versiones (
    id SERIAL PRIMARY KEY,
    curso_id INT REFERENCES cursos(id) ON DELETE CASCADE,
    numero_version VARCHAR(20) NOT NULL,
    descripcion TEXT,
    cambios TEXT,
    estado VARCHAR(50) DEFAULT 'borrador',
    precio DECIMAL(10,2),
    acceso_usuarios_anteriores BOOLEAN DEFAULT true,
    creado_en TIMESTAMP DEFAULT NOW()
);

-- 7. MODULOS
CREATE TABLE IF NOT EXISTS modulos (
    id SERIAL PRIMARY KEY,
    curso_id INT REFERENCES cursos(id) ON DELETE CASCADE,
    version_id INT REFERENCES curso_versiones(id),
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    orden INT DEFAULT 1,
    creado_en TIMESTAMP DEFAULT NOW()
);

-- 8. LECCIONES
CREATE TABLE IF NOT EXISTS lecciones (
    id SERIAL PRIMARY KEY,
    modulo_id INT REFERENCES modulos(id) ON DELETE CASCADE,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    duracion_minutos INT DEFAULT 0,
    orden INT DEFAULT 1,
    es_gratis BOOLEAN DEFAULT false,
    creado_en TIMESTAMP DEFAULT NOW()
);

-- 9. RECURSOS_MULTIMEDIA
CREATE TABLE IF NOT EXISTS recursos_multimedia (
    id SERIAL PRIMARY KEY,
    leccion_id INT REFERENCES lecciones(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL,
    titulo VARCHAR(200),
    url_archivo VARCHAR(500) NOT NULL,
    tamano_mb DECIMAL(10,2),
    duracion_segundos INT,
    orden INT DEFAULT 1,
    creado_en TIMESTAMP DEFAULT NOW()
);

-- 10. AULAS
CREATE TABLE IF NOT EXISTS aulas (
    id SERIAL PRIMARY KEY,
    curso_id INT REFERENCES cursos(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    cupo_maximo INT DEFAULT 100,
    cupo_ocupado INT DEFAULT 0,
    fecha_inicio DATE,
    fecha_fin DATE,
    estado VARCHAR(50) DEFAULT 'activa',
    creado_en TIMESTAMP DEFAULT NOW()
);

-- 11. INSCRIPCIONES
CREATE TABLE IF NOT EXISTS inscripciones (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id),
    curso_id INT REFERENCES cursos(id),
    aula_id INT REFERENCES aulas(id),
    version_id INT REFERENCES curso_versiones(id),
    fecha_inscripcion TIMESTAMP DEFAULT NOW(),
    estado VARCHAR(50) DEFAULT 'activa'
);

-- 12. CARRITO
CREATE TABLE IF NOT EXISTS carrito (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    creado_en TIMESTAMP DEFAULT NOW(),
    actualizado_en TIMESTAMP DEFAULT NOW()
);

-- 13. CARRITO_DETALLE
CREATE TABLE IF NOT EXISTS carrito_detalle (
    id SERIAL PRIMARY KEY,
    carrito_id INT REFERENCES carrito(id) ON DELETE CASCADE,
    curso_id INT REFERENCES cursos(id),
    precio DECIMAL(10,2) NOT NULL,
    creado_en TIMESTAMP DEFAULT NOW()
);

-- 14. ORDENES
CREATE TABLE IF NOT EXISTS ordenes (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(100) UNIQUE NOT NULL,
    usuario_id INT REFERENCES usuarios(id),
    subtotal DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    estado VARCHAR(50) DEFAULT 'pendiente',
    creado_en TIMESTAMP DEFAULT NOW()
);

-- 15. ORDEN_DETALLE
CREATE TABLE IF NOT EXISTS orden_detalle (
    id SERIAL PRIMARY KEY,
    orden_id INT REFERENCES ordenes(id) ON DELETE CASCADE,
    curso_id INT REFERENCES cursos(id),
    precio DECIMAL(10,2) NOT NULL,
    creado_en TIMESTAMP DEFAULT NOW()
);

-- 16. PAGOS
CREATE TABLE IF NOT EXISTS pagos (
    id SERIAL PRIMARY KEY,
    orden_id INT REFERENCES ordenes(id),
    usuario_id INT REFERENCES usuarios(id),
    monto DECIMAL(10,2) NOT NULL,
    metodo VARCHAR(50) DEFAULT 'tarjeta_simulada',
    estado VARCHAR(50) DEFAULT 'pendiente',
    referencia VARCHAR(200),
    creado_en TIMESTAMP DEFAULT NOW()
);

-- 17. MEMBRESIAS
CREATE TABLE IF NOT EXISTS membresias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio_mensual DECIMAL(10,2),
    precio_anual DECIMAL(10,2),
    beneficios TEXT,
    estado BOOLEAN DEFAULT true,
    creado_en TIMESTAMP DEFAULT NOW()
);

-- 18. SUSCRIPCIONES
CREATE TABLE IF NOT EXISTS suscripciones (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id),
    membresia_id INT REFERENCES membresias(id),
    tipo VARCHAR(50) DEFAULT 'mensual',
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado VARCHAR(50) DEFAULT 'activa',
    creado_en TIMESTAMP DEFAULT NOW()
);

-- 19. PROGRESO_USUARIO
CREATE TABLE IF NOT EXISTS progreso_usuario (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id),
    curso_id INT REFERENCES cursos(id),
    leccion_id INT REFERENCES lecciones(id),
    completado BOOLEAN DEFAULT false,
    porcentaje INT DEFAULT 0,
    ultima_vez TIMESTAMP DEFAULT NOW()
);

-- 20. CERTIFICADOS
CREATE TABLE IF NOT EXISTS certificados (
    id SERIAL PRIMARY KEY,
    codigo_unico VARCHAR(100) UNIQUE NOT NULL,
    usuario_id INT REFERENCES usuarios(id),
    curso_id INT REFERENCES cursos(id),
    version_id INT REFERENCES curso_versiones(id),
    fecha_emision TIMESTAMP DEFAULT NOW(),
    estado VARCHAR(50) DEFAULT 'activo'
);

-- 21. RESEÑAS
CREATE TABLE IF NOT EXISTS resenas (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id),
    curso_id INT REFERENCES cursos(id),
    calificacion INT CHECK (calificacion BETWEEN 1 AND 5),
    comentario TEXT,
    creado_en TIMESTAMP DEFAULT NOW()
);

-- 22. DISPONIBILIDAD_CURSO
CREATE TABLE IF NOT EXISTS disponibilidad_curso (
    id SERIAL PRIMARY KEY,
    curso_id INT REFERENCES cursos(id),
    tipo VARCHAR(100) NOT NULL,
    mensaje VARCHAR(300),
    fecha_estimada DATE,
    creado_en TIMESTAMP DEFAULT NOW()
);

-- 23. LISTA_ESPERA
CREATE TABLE IF NOT EXISTS lista_espera (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id),
    curso_id INT REFERENCES cursos(id),
    aula_id INT REFERENCES aulas(id),
    fecha_registro TIMESTAMP DEFAULT NOW(),
    notificado BOOLEAN DEFAULT false
);

-- 24. HISTORIAL_VERSIONES
CREATE TABLE IF NOT EXISTS historial_versiones (
    id SERIAL PRIMARY KEY,
    curso_id INT REFERENCES cursos(id),
    version_anterior VARCHAR(20),
    version_nueva VARCHAR(20),
    descripcion TEXT,
    creado_en TIMESTAMP DEFAULT NOW()
);

-- 25. LOGS_SISTEMA
CREATE TABLE IF NOT EXISTS logs_sistema (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id),
    accion VARCHAR(200) NOT NULL,
    detalle TEXT,
    ip VARCHAR(50),
    creado_en TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- ÍNDICES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_cursos_categoria ON cursos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_cursos_instructor ON cursos(instructor_id);
CREATE INDEX IF NOT EXISTS idx_cursos_estado ON cursos(estado);
CREATE INDEX IF NOT EXISTS idx_cursos_valoracion ON cursos(valoracion);
CREATE INDEX IF NOT EXISTS idx_cursos_ventas ON cursos(total_ventas);
CREATE INDEX IF NOT EXISTS idx_inscripciones_usuario ON inscripciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_inscripciones_curso ON inscripciones(curso_id);
CREATE INDEX IF NOT EXISTS idx_progreso_usuario ON progreso_usuario(usuario_id);
CREATE INDEX IF NOT EXISTS idx_ordenes_usuario ON ordenes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_resenas_curso ON resenas(curso_id);
CREATE INDEX IF NOT EXISTS idx_logs_usuario ON logs_sistema(usuario_id);
CREATE INDEX IF NOT EXISTS idx_logs_accion ON logs_sistema(accion);

-- =============================================
-- DATOS INICIALES
-- =============================================

-- Roles
INSERT INTO roles (nombre, descripcion) VALUES
('administrador', 'Control total del sistema'),
('instructor', 'Crea y gestiona cursos'),
('estudiante', 'Compra y consume cursos'),
('premium', 'Acceso a contenido exclusivo')
ON CONFLICT (nombre) DO NOTHING;

-- Categorías
INSERT INTO categorias (nombre, descripcion) VALUES
('Tecnología', 'Cursos de programación, desarrollo web, bases de datos y más'),
('Negocios', 'Emprendimiento, administración, finanzas y liderazgo'),
('Diseño', 'Diseño gráfico, UX/UI, fotografía y edición'),
('Marketing', 'Marketing digital, SEO, redes sociales y publicidad'),
('Idiomas', 'Aprendizaje de inglés, francés, portugués y más'),
('Arte y Cultura', 'Arte, música, literatura y cultura ecuatoriana')
ON CONFLICT (nombre) DO NOTHING;

-- Membresías
INSERT INTO membresias (nombre, descripcion, precio_mensual, precio_anual, beneficios) VALUES
('Gratuito', 'Acceso básico a la plataforma', 0, 0, 'Acceso a cursos gratuitos, vista previa de cursos premium'),
('Premium Mensual', 'Acceso completo mensual', 9.99, 0, 'Todos los cursos, certificados incluidos, 15% de descuento, acceso anticipado'),
('Premium Anual', 'Acceso completo anual con descuento', 0, 99.99, 'Todos los cursos, certificados incluidos, 15% de descuento, acceso anticipado, prioridad en cupos')
ON CONFLICT DO NOTHING;

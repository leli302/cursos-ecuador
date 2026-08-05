-- =============================================
-- MIGRACIÓN: SISTEMA INTELIGENTE DE COMISIONES
-- Ejecutar en el servidor PostgreSQL
-- =============================================

-- 1. NIVELES DE COMISIÓN (configuración editable por admin)
CREATE TABLE IF NOT EXISTS niveles_comision (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    orden INT NOT NULL DEFAULT 1,
    porcentaje_comision DECIMAL(5,2) NOT NULL DEFAULT 10,
    min_estudiantes INT NOT NULL DEFAULT 0,
    min_certificados INT NOT NULL DEFAULT 0,
    min_calificacion DECIMAL(3,2) NOT NULL DEFAULT 0,
    min_tasa_finalizacion DECIMAL(5,2) NOT NULL DEFAULT 0,
    min_resenas INT NOT NULL DEFAULT 0,
    color VARCHAR(20) NOT NULL DEFAULT '#64748B',
    icono VARCHAR(50) NOT NULL DEFAULT 'Award',
    activo BOOLEAN DEFAULT true,
    creado_en TIMESTAMP DEFAULT NOW(),
    actualizado_en TIMESTAMP DEFAULT NOW()
);

-- 2. COMISIÓN POR CURSO (estado actual)
CREATE TABLE IF NOT EXISTS comision_cursos (
    id SERIAL PRIMARY KEY,
    curso_id INT REFERENCES cursos(id) ON DELETE CASCADE,
    nivel_id INT REFERENCES niveles_comision(id),
    porcentaje_actual DECIMAL(5,2) NOT NULL DEFAULT 10,
    bonus_temporal DECIMAL(5,2) DEFAULT 0,
    ganancias_acumuladas DECIMAL(12,2) DEFAULT 0,
    ultima_evaluacion TIMESTAMP DEFAULT NOW(),
    creado_en TIMESTAMP DEFAULT NOW(),
    UNIQUE(curso_id)
);

-- 3. HISTORIAL DE COMISIONES (cada ganancia registrada)
CREATE TABLE IF NOT EXISTS historial_comisiones (
    id SERIAL PRIMARY KEY,
    curso_id INT REFERENCES cursos(id) ON DELETE CASCADE,
    instructor_id INT REFERENCES usuarios(id),
    orden_id INT REFERENCES ordenes(id),
    monto_venta DECIMAL(10,2) NOT NULL,
    porcentaje_aplicado DECIMAL(5,2) NOT NULL,
    monto_comision DECIMAL(10,2) NOT NULL,
    nivel_nombre VARCHAR(50),
    creado_en TIMESTAMP DEFAULT NOW()
);

-- 4. PROMOCIONES DE COMISIÓN (bonificaciones temporales)
CREATE TABLE IF NOT EXISTS promociones_comision (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    porcentaje_bonus DECIMAL(5,2) NOT NULL DEFAULT 0,
    tipo VARCHAR(50) NOT NULL DEFAULT 'global',
    target_id INT,
    condicion VARCHAR(200),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    activa BOOLEAN DEFAULT true,
    creado_en TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- ÍNDICES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_comision_cursos_curso ON comision_cursos(curso_id);
CREATE INDEX IF NOT EXISTS idx_historial_comisiones_curso ON historial_comisiones(curso_id);
CREATE INDEX IF NOT EXISTS idx_historial_comisiones_instructor ON historial_comisiones(instructor_id);
CREATE INDEX IF NOT EXISTS idx_historial_comisiones_fecha ON historial_comisiones(creado_en);
CREATE INDEX IF NOT EXISTS idx_promociones_comision_tipo ON promociones_comision(tipo);
CREATE INDEX IF NOT EXISTS idx_promociones_comision_fechas ON promociones_comision(fecha_inicio, fecha_fin);

-- =============================================
-- DATOS INICIALES: 6 NIVELES DE COMISIÓN
-- =============================================
INSERT INTO niveles_comision (nombre, orden, porcentaje_comision, min_estudiantes, min_certificados, min_calificacion, min_tasa_finalizacion, min_resenas, color, icono) VALUES
('Inicial',  1, 10.00,    0,    0, 0.00,  0.00,   0, '#64748B', 'Sprout'),
('Bronce',   2, 15.00,  100,   30, 4.30, 40.00,  20, '#CD7F32', 'Medal'),
('Plata',    3, 20.00,  500,  300, 4.50, 55.00,  80, '#C0C0C0', 'Award'),
('Oro',      4, 25.00, 1000,  700, 4.70, 70.00, 200, '#FFD700', 'Trophy'),
('Platino',  5, 30.00, 5000, 3000, 4.85, 80.00, 500, '#E5E4E2', 'Crown'),
('Élite',    6, 35.00,10000, 7000, 4.90, 90.00,1000, '#B9F2FF', 'Gem')
ON CONFLICT (nombre) DO NOTHING;

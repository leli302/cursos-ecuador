-- =============================================
-- MIGRACIÓN: SISTEMA DE EVALUACIONES (QUIZZES)
-- =============================================

-- 1. EVALUACIONES
CREATE TABLE IF NOT EXISTS evaluaciones (
    id SERIAL PRIMARY KEY,
    modulo_id INT REFERENCES modulos(id) ON DELETE CASCADE,
    titulo VARCHAR(200) NOT NULL,
    instrucciones TEXT,
    porcentaje_aprobacion INT DEFAULT 70,
    orden INT DEFAULT 99, -- Por defecto van al final del módulo
    creado_en TIMESTAMP DEFAULT NOW()
);

-- 2. PREGUNTAS
CREATE TABLE IF NOT EXISTS preguntas (
    id SERIAL PRIMARY KEY,
    evaluacion_id INT REFERENCES evaluaciones(id) ON DELETE CASCADE,
    texto_pregunta TEXT NOT NULL,
    orden INT DEFAULT 1,
    creado_en TIMESTAMP DEFAULT NOW()
);

-- 3. OPCIONES
CREATE TABLE IF NOT EXISTS opciones (
    id SERIAL PRIMARY KEY,
    pregunta_id INT REFERENCES preguntas(id) ON DELETE CASCADE,
    texto_opcion TEXT NOT NULL,
    es_correcta BOOLEAN DEFAULT false,
    orden INT DEFAULT 1
);

-- 4. INTENTOS_EVALUACION
CREATE TABLE IF NOT EXISTS intentos_evaluacion (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    evaluacion_id INT REFERENCES evaluaciones(id) ON DELETE CASCADE,
    calificacion DECIMAL(5,2) NOT NULL,
    aprobado BOOLEAN NOT NULL,
    fecha_intento TIMESTAMP DEFAULT NOW()
);

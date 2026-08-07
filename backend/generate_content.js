const fs = require('fs');
const path = require('path');

const courses = [
  // TEC
  { codigo: 'TEC-0001', nombre: 'Excel', base: [
    { title: 'Fundamentos de Excel', desc: 'Conceptos básicos', lessons: ['Interfaz y atajos', 'Fórmulas básicas', 'Formato condicional'] },
    { title: 'Funciones Avanzadas', desc: 'BUSCARV y lógicas', lessons: ['BUSCARV y BUSCARX', 'Funciones SI anidadas', 'Manejo de errores'] },
    { title: 'Análisis de Datos', desc: 'Tablas dinámicas', lessons: ['Tablas y gráficos dinámicos', 'Filtros avanzados', 'Dashboards básicos'] }
  ]},
  { codigo: 'TEC-0002', nombre: 'Python', base: [
    { title: 'Introducción a Python', desc: 'Sintaxis básica', lessons: ['Instalación y variables', 'Tipos de datos', 'Operadores'] },
    { title: 'Control de Flujo', desc: 'Lógica condicional', lessons: ['Condicionales if-else', 'Bucles for y while', 'Manejo de excepciones'] },
    { title: 'Estructuras de Datos', desc: 'Listas y diccionarios', lessons: ['Listas y tuplas', 'Diccionarios', 'Funciones y módulos'] }
  ]},
  { codigo: 'TEC-0003', nombre: 'React', base: [
    { title: 'Fundamentos de React', desc: 'Componentes y JSX', lessons: ['Introducción a React', 'JSX y Babel', 'Componentes funcionales'] },
    { title: 'Estado y Efectos', desc: 'Hooks principales', lessons: ['useState', 'useEffect', 'Custom Hooks'] },
    { title: 'Enrutamiento y Estado Global', desc: 'React Router y Context', lessons: ['React Router', 'Context API', 'Integración con APIs'] }
  ]},
  { codigo: 'TEC-0004', nombre: 'Data Science', base: [
    { title: 'Python para Datos', desc: 'Librerías base', lessons: ['Numpy básico', 'Pandas Dataframes', 'Limpieza de datos'] },
    { title: 'Visualización', desc: 'Gráficos', lessons: ['Matplotlib', 'Seaborn', 'Dashboards interactivos'] },
    { title: 'Machine Learning', desc: 'Modelos predictivos', lessons: ['Regresión Lineal', 'Árboles de decisión', 'Evaluación de modelos'] }
  ]},
  { codigo: 'TEC-0005', nombre: 'Node.js', base: [
    { title: 'Introducción a Node', desc: 'Entorno de ejecución', lessons: ['Arquitectura y Event Loop', 'Módulos y NPM', 'Manejo de archivos'] },
    { title: 'Servidores web', desc: 'Express.js', lessons: ['Crear un servidor', 'Rutas y Middlewares', 'REST APIs'] },
    { title: 'Bases de Datos', desc: 'Conexión a BD', lessons: ['Conexión a PostgreSQL', 'Autenticación con JWT', 'Despliegue a producción'] }
  ]},
  { codigo: 'TEC-0006', nombre: 'Inteligencia Artificial', base: [
    { title: 'Conceptos de IA', desc: 'Fundamentos teóricos', lessons: ['Historia de la IA', 'Tipos de aprendizaje', 'Redes neuronales básicas'] },
    { title: 'Procesamiento de Lenguaje', desc: 'NLP', lessons: ['Tokenización', 'Análisis de sentimiento', 'Modelos de lenguaje'] },
    { title: 'Visión Computacional', desc: 'Imágenes', lessons: ['Detección de objetos', 'Clasificación de imágenes', 'OpenCV'] }
  ]},
  // MKT
  { codigo: 'MKT-0001', nombre: 'Marketing Digital', base: [
    { title: 'Estrategia Digital', desc: 'Plan de marketing', lessons: ['Buyer persona', 'Embudo de conversión', 'Métricas clave'] },
    { title: 'Redes Sociales', desc: 'Presencia online', lessons: ['Estrategia de contenidos', 'Facebook e Instagram', 'Gestión de crisis'] },
    { title: 'Publicidad Online', desc: 'Anuncios pagos', lessons: ['Google Ads', 'Meta Ads', 'Retargeting'] }
  ]},
  { codigo: 'MKT-0002', nombre: 'SEO', base: [
    { title: 'Auditoría SEO', desc: 'Estado del sitio', lessons: ['Conceptos básicos de SEO', 'Keyword Research', 'Herramientas SEO'] },
    { title: 'SEO On-Page', desc: 'Optimización interna', lessons: ['Etiquetas meta', 'Estructura de URLs', 'Optimización de contenido'] },
    { title: 'SEO Off-Page', desc: 'Link building', lessons: ['Estrategias de enlaces', 'SEO Local', 'Métricas y Analytics'] }
  ]},
  { codigo: 'MKT-0003', nombre: 'Community Manager', base: [
    { title: 'Rol del CM', desc: 'Responsabilidades', lessons: ['Funciones diarias', 'Planificación y calendario', 'Herramientas de gestión'] },
    { title: 'Creación de Contenido', desc: 'Posts creativos', lessons: ['Copywriting para redes', 'Diseño visual con Canva', 'Formatos de video'] },
    { title: 'Análisis de Redes', desc: 'Reportes', lessons: ['Métricas de engagement', 'Reportes mensuales', 'Casos de éxito'] }
  ]},
  { codigo: 'MKT-0004', nombre: 'Email Marketing', base: [
    { title: 'Listas y Suscriptores', desc: 'Captación', lessons: ['Lead magnets', 'Formularios de registro', 'Segmentación de audiencias'] },
    { title: 'Campañas de Email', desc: 'Diseño y envío', lessons: ['Diseño de newsletters', 'Líneas de asunto', 'Pruebas A/B'] },
    { title: 'Automatización', desc: 'Workflows', lessons: ['Embudos de venta', 'Secuencias de bienvenida', 'Análisis de apertura'] }
  ]},
  { codigo: 'MKT-0005', nombre: 'Google Ads', base: [
    { title: 'Conceptos de Publicidad', desc: 'Redes y tipos', lessons: ['Red de Búsqueda vs Display', 'Estructura de campañas', 'Presupuesto y pujas'] },
    { title: 'Creación de Anuncios', desc: 'Textos y gráficos', lessons: ['Redacción de anuncios', 'Extensiones de anuncios', 'Palabras clave negativas'] },
    { title: 'Optimización', desc: 'Mejora de ROI', lessons: ['Nivel de calidad', 'Seguimiento de conversiones', 'Optimización de campañas'] }
  ]},
  // DIS
  { codigo: 'DIS-0001', nombre: 'Figma UX/UI', base: [
    { title: 'Principios de UX', desc: 'Experiencia de usuario', lessons: ['Investigación de usuarios', 'Arquitectura de información', 'Wireframing'] },
    { title: 'Diseño UI en Figma', desc: 'Interfaz gráfica', lessons: ['Herramientas de Figma', 'Sistemas de diseño', 'Tipografía y color'] },
    { title: 'Prototipado', desc: 'Interacciones', lessons: ['Prototipos interactivos', 'Microinteracciones', 'Handoff a desarrollo'] }
  ]},
  { codigo: 'DIS-0002', nombre: 'Photoshop', base: [
    { title: 'Interfaz y Herramientas', desc: 'Primeros pasos', lessons: ['Capas y modos de fusión', 'Herramientas de selección', 'Máscaras'] },
    { title: 'Retoque Fotográfico', desc: 'Edición', lessons: ['Corrección de color', 'Retoque de piel', 'Eliminación de objetos'] },
    { title: 'Composición', desc: 'Montajes', lessons: ['Fotomontajes realistas', 'Filtros y efectos', 'Exportación web e impresión'] }
  ]},
  { codigo: 'DIS-0003', nombre: 'Procreate', base: [
    { title: 'Conociendo Procreate', desc: 'Herramientas', lessons: ['Interfaz y gestos', 'Pinceles y ajustes', 'Gestión de capas'] },
    { title: 'Técnicas de Ilustración', desc: 'Dibujo digital', lessons: ['Bocetado', 'Tinta y línea', 'Color y sombras'] },
    { title: 'Proyectos Prácticos', desc: 'Aplicación', lessons: ['Diseño de personajes', 'Paisajes digitales', 'Animación básica en Procreate'] }
  ]},
  { codigo: 'DIS-0004', nombre: 'After Effects', base: [
    { title: 'Fundamentos de Animación', desc: 'Conceptos', lessons: ['Interfaz y composiciones', 'Keyframes y timeline', 'Curvas de animación'] },
    { title: 'Animación de Texto', desc: 'Motion Graphics', lessons: ['Títulos animados', 'Animadores de texto', 'Lower thirds'] },
    { title: 'Composición y Efectos', desc: 'VFX', lessons: ['Máscaras y track mattes', 'Chroma key', 'Exportación de video'] }
  ]},
  { codigo: 'DIS-0005', nombre: 'Branding', base: [
    { title: 'Identidad Corporativa', desc: 'Conceptos', lessons: ['Qué es una marca', 'Valores y personalidad', 'Auditoría de marca'] },
    { title: 'Diseño de Identidad', desc: 'Creación visual', lessons: ['Diseño de logotipo', 'Paleta de colores', 'Selección tipográfica'] },
    { title: 'Manual de Marca', desc: 'Normativas', lessons: ['Estructura del manual', 'Aplicaciones de marca', 'Presentación al cliente'] }
  ]},
  // NEG
  { codigo: 'NEG-0001', nombre: 'Emprendimiento', base: [
    { title: 'Modelos de Negocio', desc: 'Estrategia', lessons: ['Ideación', 'Lean Canvas', 'Validación de mercado'] },
    { title: 'Finanzas Básicas', desc: 'Presupuesto', lessons: ['Estructura de costos', 'Fijación de precios', 'Punto de equilibrio'] },
    { title: 'Lanzamiento', desc: 'Go to market', lessons: ['Estrategia de lanzamiento', 'Ventas iniciales', 'Pitch para inversores'] }
  ]},
  { codigo: 'NEG-0002', nombre: 'Contabilidad', base: [
    { title: 'Principios Contables', desc: 'Conceptos', lessons: ['Activos y pasivos', 'Partida doble', 'Plan de cuentas'] },
    { title: 'Estados Financieros', desc: 'Reportes', lessons: ['Balance General', 'Estado de Resultados', 'Flujo de Caja'] },
    { title: 'Impuestos', desc: 'Obligaciones fiscales', lessons: ['IVA e ISR', 'Facturación electrónica', 'Declaraciones mensuales'] }
  ]},
  { codigo: 'NEG-0003', nombre: 'Finanzas Personales', base: [
    { title: 'Educación Financiera', desc: 'Mentalidad', lessons: ['Presupuesto personal', 'Fondo de emergencia', 'Control de deudas'] },
    { title: 'Ahorro e Inversión', desc: 'Crecimiento', lessons: ['Tipos de inversión', 'Interés compuesto', 'Bolsa de valores básica'] },
    { title: 'Planificación Futura', desc: 'Largo plazo', lessons: ['Seguros', 'Jubilación', 'Bienes raíces'] }
  ]},
  { codigo: 'NEG-0004', nombre: 'Scrum', base: [
    { title: 'Metodologías Ágiles', desc: 'Conceptos', lessons: ['Manifiesto Ágil', 'Diferencias con Waterfall', 'Pilares de Scrum'] },
    { title: 'Roles y Eventos', desc: 'Marco de trabajo', lessons: ['Product Owner y Scrum Master', 'Sprint Planning y Daily', 'Review y Retrospective'] },
    { title: 'Artefactos', desc: 'Entregables', lessons: ['Product Backlog', 'Sprint Backlog', 'Incremento y DoD'] }
  ]},
  { codigo: 'NEG-0005', nombre: 'Liderazgo', base: [
    { title: 'Habilidades de Liderazgo', desc: 'Competencias', lessons: ['Estilos de liderazgo', 'Inteligencia Emocional', 'Comunicación asertiva'] },
    { title: 'Gestión de Equipos', desc: 'Trabajo grupal', lessons: ['Motivación', 'Resolución de conflictos', 'Delegación de tareas'] },
    { title: 'Desarrollo Organizacional', desc: 'Cultura', lessons: ['Gestión del cambio', 'Evaluación de desempeño', 'Mentoring y Coaching'] }
  ]},
  // IDI
  { codigo: 'IDI-0001', nombre: 'Inglés Profesional', base: [
    { title: 'Inglés para Negocios', desc: 'Vocabulario', lessons: ['Saludos y presentaciones', 'Vocabulario de oficina', 'Llamadas telefónicas'] },
    { title: 'Escritura Profesional', desc: 'Emails', lessons: ['Estructura de emails', 'Tono formal e informal', 'Reportes breves'] },
    { title: 'Reuniones y Presentaciones', desc: 'Comunicación oral', lessons: ['Participar en reuniones', 'Dar presentaciones', 'Negociación básica'] }
  ]},
  { codigo: 'IDI-0002', nombre: 'Francés', base: [
    { title: 'Bases del Francés', desc: 'Conceptos iniciales', lessons: ['El alfabeto y pronunciación', 'Saludos y cortesía', 'Los números'] },
    { title: 'Gramática Básica', desc: 'Estructuras', lessons: ['Verbos être y avoir', 'Artículos y sustantivos', 'Adjetivos comunes'] },
    { title: 'Situaciones Cotidianas', desc: 'Vocabulario útil', lessons: ['En el restaurante', 'Preguntar direcciones', 'La familia'] }
  ]},
  { codigo: 'IDI-0003', nombre: 'Portugués', base: [
    { title: 'Pronunciación y Saludos', desc: 'Bases', lessons: ['Sonidos del portugués', 'Saludos y despedidas', 'Falsos amigos'] },
    { title: 'Tiempos Verbales', desc: 'Gramática', lessons: ['Presente del indicativo', 'Pasado perfecto', 'Futuro'] },
    { title: 'Cultura y Conversación', desc: 'Práctica', lessons: ['Vocabulario de viajes', 'Comida brasileña', 'Expresiones coloquiales'] }
  ]},
  { codigo: 'IDI-0004', nombre: 'IELTS/TOEFL', base: [
    { title: 'Estrategias de Lectura', desc: 'Reading', lessons: ['Skimming y scanning', 'Tipos de preguntas', 'Manejo del tiempo'] },
    { title: 'Comprensión y Escritura', desc: 'Listening & Writing', lessons: ['Tomar notas', 'Estructura de ensayos', 'Vocabulario académico'] },
    { title: 'Práctica Oral', desc: 'Speaking', lessons: ['Fluidez y coherencia', 'Pronunciación', 'Simulacros de speaking'] }
  ]},
  { codigo: 'IDI-0005', nombre: 'Mandarín', base: [
    { title: 'Pinyin y Tonos', desc: 'Fonética', lessons: ['Los 4 tonos', 'Vocales y consonantes', 'Saludos básicos'] },
    { title: 'Caracteres y Gramática', desc: 'Escritura', lessons: ['Trazos básicos', 'Orden de las palabras', 'Números y fechas'] },
    { title: 'Conversación Básica', desc: 'Práctica oral', lessons: ['Presentarse', 'Ir de compras', 'Pedir comida'] }
  ]},
  // ART
  { codigo: 'ART-0001', nombre: 'Fotografía', base: [
    { title: 'La Cámara', desc: 'Manejo', lessons: ['Triángulo de exposición', 'Velocidad de obturación', 'Apertura e ISO'] },
    { title: 'Composición', desc: 'Reglas visuales', lessons: ['Regla de los tercios', 'Líneas guía', 'Perspectiva y profundidad'] },
    { title: 'Iluminación y Edición', desc: 'Postproducción', lessons: ['Luz natural vs artificial', 'Edición en Lightroom', 'Exportación'] }
  ]},
  { codigo: 'ART-0002', nombre: 'Producción Musical', base: [
    { title: 'Fundamentos de Audio', desc: 'Teoría', lessons: ['Frecuencias y ondas', 'Configuración de home studio', 'Interfaz de FL Studio'] },
    { title: 'Creación Musical', desc: 'Composición', lessons: ['Creación de beats', 'Líneas de bajo', 'Uso de sintetizadores'] },
    { title: 'Mezcla y Mastering', desc: 'Postproducción', lessons: ['Ecualización (EQ)', 'Compresión', 'Masterización final'] }
  ]},
  { codigo: 'ART-0003', nombre: 'Escritura Creativa', base: [
    { title: 'Bases de la Narrativa', desc: 'Estructura', lessons: ['El viaje del héroe', 'Tipos de narrador', 'Conflicto y trama'] },
    { title: 'Creación de Personajes', desc: 'Desarrollo', lessons: ['Fichas de personaje', 'Arcos de transformación', 'Diálogos realistas'] },
    { title: 'Revisión y Publicación', desc: 'Finalización', lessons: ['Corrección de estilo', 'Bloqueo del escritor', 'Opciones de publicación'] }
  ]},
  { codigo: 'ART-0004', nombre: 'Guitarra', base: [
    { title: 'Primeros Pasos', desc: 'Bases', lessons: ['Partes de la guitarra', 'Afinación', 'Postura correcta'] },
    { title: 'Acordes y Ritmos', desc: 'Acompañamiento', lessons: ['Acordes mayores y menores', 'Patrones de rasgueo', 'Cambios de acordes'] },
    { title: 'Técnicas y Canciones', desc: 'Práctica', lessons: ['Punteo básico', 'Lectura de tablaturas', 'Tu primera canción'] }
  ]},
  { codigo: 'ART-0005', nombre: 'Historia del Arte', base: [
    { title: 'Arte Precolombino', desc: 'Orígenes', lessons: ['Culturas originarias', 'Cerámica y orfebrería', 'Arquitectura andina'] },
    { title: 'Arte Colonial', desc: 'Escuela Quiteña', lessons: ['Arquitectura religiosa', 'Escultura policromada', 'Pintura barroca'] },
    { title: 'Arte Contemporáneo', desc: 'Siglos XX y XXI', lessons: ['Indigenismo', 'Oswaldo Guayasamín', 'Nuevas tendencias'] }
  ]}
];

let sql = `-- =============================================\n`;
sql += `-- MIGRACIÓN: REPARACIÓN Y GENERACIÓN DE TODO EL CONTENIDO\n`;
sql += `-- =============================================\n\n`;

sql += `-- 1. Limpiar TODAS las lecciones y módulos existentes para evitar duplicados y contenido basura\n`;
sql += `TRUNCATE TABLE modulos RESTART IDENTITY CASCADE;\n\n`;

for (const c of courses) {
  sql += `-- =============================================\n`;
  sql += `-- CURSO: ${c.codigo} (${c.nombre})\n`;
  sql += `-- =============================================\n`;
  
  c.base.forEach((mod, mIdx) => {
    sql += `INSERT INTO modulos (curso_id, titulo, descripcion, orden)\n`;
    sql += `SELECT id, '${mod.title}', '${mod.desc}', ${mIdx + 1} FROM cursos WHERE codigo = '${c.codigo}';\n\n`;
    
    mod.lessons.forEach((les, lIdx) => {
      const isFree = (mIdx === 0 && lIdx === 0) ? 'true' : 'false';
      const duration = 10 + Math.floor(Math.random() * 15);
      
      sql += `INSERT INTO lecciones (modulo_id, titulo, descripcion, duracion_minutos, orden, es_gratis)\n`;
      sql += `SELECT m.id, '${les}', 'Descripción de ${les}', ${duration}, ${lIdx + 1}, ${isFree}\n`;
      sql += `FROM modulos m JOIN cursos c ON m.curso_id = c.id \n`;
      sql += `WHERE c.codigo = '${c.codigo}' AND m.orden = ${mIdx + 1};\n\n`;
    });
  });
}

const outPath = path.join(__dirname, '../database/migration_fix_contenido.sql');
fs.writeFileSync(outPath, sql);
console.log('Script generado correctamente en database/migration_fix_contenido.sql');

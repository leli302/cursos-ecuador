module.exports = {
  ROLES: {
    ADMIN: 'administrador',
    INSTRUCTOR: 'instructor',
    STUDENT: 'estudiante',
    PREMIUM: 'premium'
  },

  COURSE_STATUS: {
    AVAILABLE: 'disponible',
    UNAVAILABLE: 'no_disponible',
    IN_PRODUCTION: 'en_produccion',
    UPCOMING: 'proximo',
    PRESALE: 'preventa'
  },

  COURSE_LEVELS: ['principiante', 'intermedio', 'avanzado', 'todos'],

  VERSION_STATUS: {
    DRAFT: 'borrador',
    PUBLISHED: 'publicado',
    ARCHIVED: 'archivado'
  },

  ORDER_STATUS: {
    PENDING: 'pendiente',
    PAID: 'pagado',
    REJECTED: 'rechazado',
    CANCELLED: 'cancelado',
    REFUNDED: 'reembolsado'
  },

  PAYMENT_METHODS: {
    CARD: 'tarjeta_simulada',
    TRANSFER: 'transferencia_simulada'
  },

  PAYMENT_STATUS: {
    PENDING: 'pendiente',
    COMPLETED: 'completado',
    FAILED: 'fallido',
    REFUNDED: 'reembolsado'
  },

  CLASSROOM_STATUS: {
    ACTIVE: 'activa',
    FULL: 'llena',
    CLOSED: 'cerrada',
    UPCOMING: 'proxima'
  },

  ENROLLMENT_STATUS: {
    ACTIVE: 'activa',
    COMPLETED: 'completada',
    CANCELLED: 'cancelada'
  },

  SUBSCRIPTION_STATUS: {
    ACTIVE: 'activa',
    EXPIRED: 'expirada',
    CANCELLED: 'cancelada'
  },

  MEDIA_TYPES: ['video', 'pdf', 'imagen', 'presentacion', 'recurso'],

  MAX_CLASSROOM_CAPACITY: 100,
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB

  AVAILABILITY_MESSAGES: {
    AVAILABLE: 'Disponible ahora',
    LAST_SPOTS: 'Últimos cupos disponibles',
    FULL: 'Aula llena, próxima apertura el {date}',
    NEW_VERSION: 'Nueva versión disponible pronto',
    RESERVE: 'Puedes reservar tu cupo',
    UPCOMING: 'Este curso estará disponible próximamente'
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autorizado.' });
    }

    const userRoles = req.user.roles || [];
    const hasRole = roles.some(role => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        error: 'No tienes permisos para realizar esta acción.',
        required: roles,
        current: userRoles
      });
    }

    next();
  };
};

const requireAnyRole = (...roles) => requireRole(...roles);

const isAdmin = requireRole('administrador');
const isInstructor = requireRole('instructor');
const isStudent = requireRole('estudiante');
const isPremium = requireRole('premium');
const isAdminOrInstructor = requireRole('administrador', 'instructor');

module.exports = {
  requireRole,
  requireAnyRole,
  isAdmin,
  isInstructor,
  isStudent,
  isPremium,
  isAdminOrInstructor
};

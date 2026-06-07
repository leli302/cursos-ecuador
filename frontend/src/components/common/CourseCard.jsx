import { useNavigate } from 'react-router-dom';
import { Star, Users, Clock, Crown } from 'lucide-react';

export default function CourseCard({ course }) {
  const navigate = useNavigate();

  const renderStars = (rating) => {
    const stars = [];
    const r = parseFloat(rating) || 0;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star key={i} size={14} fill={i <= Math.round(r) ? 'var(--accent-gold)' : 'none'} color={i <= Math.round(r) ? 'var(--accent-gold)' : 'var(--text-muted)'} />
      );
    }
    return stars;
  };

  const getPlaceholderImage = (name) => {
    const colors = ['4ECDC4', '3B82F6', 'A855F7', 'F97316', 'EC4899', '10B981'];
    const idx = (name?.charCodeAt(0) || 0) % colors.length;
    return `https://placehold.co/640x360/${colors[idx]}/ffffff?text=${encodeURIComponent(name?.substring(0, 20) || 'Curso')}&font=roboto`;
  };

  return (
    <div
      className="course-card"
      onClick={() => navigate(`/curso/${course.id}`)}
      id={`course-card-${course.id}`}
    >
      <div className="course-image" style={{ position: 'relative' }}>
        <img
          src={course.imagen || getPlaceholderImage(course.nombre)}
          alt={course.nombre}
          loading="lazy"
          onError={(e) => { e.target.src = getPlaceholderImage(course.nombre); }}
        />
        {course.es_premium && (
          <span className="premium-badge"><Crown size={10} style={{ marginRight: 3 }} /> PREMIUM</span>
        )}
      </div>
      <div className="course-body">
        <span className="course-category">{course.categoria_nombre || 'General'}</span>
        <h3 className="course-title">{course.nombre}</h3>
        <p className="course-instructor">
          {course.instructor_nombre} {course.instructor_apellido}
        </p>
        <div className="flex items-center gap-2 mb-2">
          <div className="stars flex items-center gap-1">
            {renderStars(course.valoracion)}
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-gold)', fontWeight: 600 }}>
            {parseFloat(course.valoracion || 0).toFixed(1)}
          </span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            ({course.total_resenas || course.total_ventas || 0})
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted mb-3">
          <span className="flex items-center gap-1"><Clock size={12} /> {course.duracion_horas}h</span>
          <span className="flex items-center gap-1"><Users size={12} /> {course.total_ventas}</span>
          <span className="badge badge-teal" style={{ fontSize: '0.6rem' }}>{course.nivel}</span>
        </div>
        <div className="course-meta">
          <div>
            {course.precio_premium > 0 && course.precio_premium < course.precio && (
              <span className="course-price-premium">${parseFloat(course.precio).toFixed(2)}</span>
            )}
            <span className="course-price">${parseFloat(course.precio).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

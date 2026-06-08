import { useNavigate } from 'react-router-dom';
import { Star, Users, Clock, Crown, Code, Briefcase, Palette, Megaphone, Languages, Award, BookOpen } from 'lucide-react';

export default function CourseCard({ course }) {
  const navigate = useNavigate();

  const getCategoryIcon = (categoryName) => {
    switch (categoryName) {
      case 'Tecnología':
        return <Code size={40} style={{ color: '#ffffff', opacity: 0.9 }} />;
      case 'Negocios':
        return <Briefcase size={40} style={{ color: '#ffffff', opacity: 0.9 }} />;
      case 'Diseño':
        return <Palette size={40} style={{ color: '#ffffff', opacity: 0.9 }} />;
      case 'Marketing':
        return <Megaphone size={40} style={{ color: '#ffffff', opacity: 0.9 }} />;
      case 'Idiomas':
        return <Languages size={40} style={{ color: '#ffffff', opacity: 0.9 }} />;
      case 'Arte y Cultura':
        return <Award size={40} style={{ color: '#ffffff', opacity: 0.9 }} />;
      default:
        return <BookOpen size={40} style={{ color: '#ffffff', opacity: 0.9 }} />;
    }
  };

  const getCategoryGradient = (categoryName) => {
    switch (categoryName) {
      case 'Tecnología':
        return 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)';
      case 'Negocios':
        return 'linear-gradient(135deg, #10B981 0%, #047857 100%)';
      case 'Diseño':
        return 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)';
      case 'Marketing':
        return 'linear-gradient(135deg, #F97316 0%, #C2410C 100%)';
      case 'Idiomas':
        return 'linear-gradient(135deg, #A855F7 0%, #6B21A8 100%)';
      case 'Arte y Cultura':
        return 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)';
      default:
        return 'linear-gradient(135deg, #6B7280 0%, #374151 100%)';
    }
  };

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

  return (
    <div
      className="course-card"
      onClick={() => navigate(`/curso/${course.id}`)}
      id={`course-card-${course.id}`}
    >
      <div className="course-image" style={{ 
        position: 'relative', 
        height: 160, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: course.imagen ? 'transparent' : getCategoryGradient(course.categoria_nombre) 
      }}>
        {course.imagen ? (
          <img
            src={course.imagen}
            alt={course.nombre}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { 
              e.target.style.display = 'none';
              e.target.parentNode.style.background = getCategoryGradient(course.categoria_nombre);
              const iconWrapper = document.createElement('div');
              iconWrapper.style.display = 'flex';
              iconWrapper.style.alignItems = 'center';
              iconWrapper.style.justifyContent = 'center';
              iconWrapper.style.height = '100%';
              iconWrapper.style.width = '100%';
              iconWrapper.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #ffffff; opacity: 0.9;"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`;
              e.target.parentNode.appendChild(iconWrapper);
            }}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            {getCategoryIcon(course.categoria_nombre)}
          </div>
        )}
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

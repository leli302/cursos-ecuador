import { useNavigate } from 'react-router-dom';
import { Star, Users, Clock, Crown, Code, Briefcase, Palette, Megaphone, Languages, Award, BookOpen, Layers, CheckCircle2, ArrowRight } from 'lucide-react';

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
        <Star key={i} size={13} fill={i <= Math.round(r) ? 'var(--accent-gold)' : 'none'} color={i <= Math.round(r) ? 'var(--accent-gold)' : 'var(--text-muted)'} />
      );
    }
    return stars;
  };

  const teacherInitials = `${(course.instructor_nombre || 'D')[0]}${(course.instructor_apellido || 'O')[0]}`;

  return (
    <div
      className="course-card"
      onClick={() => navigate(`/curso/${course.id}`)}
      id={`course-card-${course.id}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between'
      }}
    >
      <div>
        {/* Course Image Header */}
        <div className="course-image" style={{ 
          position: 'relative', 
          height: 165, 
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

          {/* Badges de acceso y cert en portada */}
          <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 4, zIndex: 2 }}>
            <span className="badge" style={{ background: '#10B981', color: '#fff', fontSize: '0.65rem', padding: '3px 8px', fontWeight: 700 }}>
              <CheckCircle2 size={10} style={{ marginRight: 3, display: 'inline' }} /> Contenido Gratuito
            </span>
          </div>

          {course.es_premium && (
            <span className="premium-badge" style={{ position: 'absolute', top: 10, right: 10 }}>
              <Crown size={10} style={{ marginRight: 3 }} /> PREMIUM
            </span>
          )}
        </div>

        {/* Course Body */}
        <div className="course-body" style={{ padding: '16px' }}>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="course-category" style={{ fontSize: '0.7rem' }}>{course.categoria_nombre || 'General'}</span>
            <span className="badge badge-teal" style={{ fontSize: '0.65rem', textTransform: 'capitalize' }}>
              {course.nivel || 'Todos'}
            </span>
          </div>

          <h3 className="course-title" style={{ fontSize: '1.02rem', fontWeight: 700, lineHeight: 1.35, marginBottom: 12 }}>
            {course.nombre}
          </h3>

          {/* Docente con foto/iniciales */}
          <div 
            className="flex items-center gap-2 mb-3 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/instructores/${course.instructor_id || 1}`);
            }}
            title="Ver perfil profesional del docente"
            style={{ width: 'fit-content' }}
          >
            {course.instructor_avatar ? (
              <img 
                src={course.instructor_avatar} 
                alt={`${course.instructor_nombre} ${course.instructor_apellido}`}
                style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--accent-teal)' }}
              />
            ) : (
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-teal) 0%, #0d9488 100%)',
                color: '#fff', fontSize: '0.7rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {teacherInitials}
              </div>
            )}
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', transition: 'color 0.15s' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--accent-teal)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-primary)'}
            >
              {course.instructor_nombre} {course.instructor_apellido}
            </span>
          </div>

          {/* Calificación y Estudiantes */}
          <div className="flex items-center gap-2 mb-3">
            <div className="stars flex items-center gap-1">
              {renderStars(course.valoracion)}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 700 }}>
              {parseFloat(course.valoracion || 4.8).toFixed(1)}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              • <Users size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 2 }} />
              {course.total_ventas || 120} estudiantes
            </span>
          </div>

          {/* Duración y Módulos */}
          <div className="flex items-center gap-3 text-xs text-muted mb-4" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
            <span className="flex items-center gap-1"><Clock size={13} style={{ color: 'var(--accent-teal)' }} /> {course.duracion_horas || 12}h estimadas</span>
            <span className="flex items-center gap-1"><Layers size={13} style={{ color: 'var(--accent-teal)' }} /> {course.total_modulos || 6} módulos</span>
          </div>
        </div>
      </div>

      {/* Action Footer Button (SIN PRECIOS) */}
      <div style={{ padding: '0 16px 16px 16px' }}>
        <button 
          className="btn btn-outline w-full flex items-center justify-center gap-2"
          style={{ fontSize: '0.85rem', padding: '9px 16px', fontWeight: 600 }}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/curso/${course.id}`);
          }}
        >
          Ver Curso <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

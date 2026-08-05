import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import CourseCard from '../../components/common/CourseCard';
import { Users, BookOpen, Star, Award, CheckCircle2, ArrowLeft, Mail, ShieldCheck } from 'lucide-react';

export default function InstructorProfilePage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInstructor();
  }, [id]);

  const fetchInstructor = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/users/instructor/${id}`);
      setData(res.data.data);
    } catch (err) {
      console.error('Error al cargar perfil del instructor:', err);
      setError('No se pudo encontrar la información de este instructor.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page container">
        <div className="card" style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto var(--space-4)' }}></div>
          <p className="text-muted">Cargando perfil del instructor...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="page container">
        <div className="card text-center" style={{ padding: 'var(--space-12)' }}>
          <h2>Instructor no encontrado</h2>
          <p className="text-muted mt-2 mb-6">{error || 'El perfil solicitado no existe o fue deshabilitado.'}</p>
          <Link to="/catalogo" className="btn btn-primary">
            <ArrowLeft size={16} /> Volver al Catálogo
          </Link>
        </div>
      </div>
    );
  }

  const { instructor, courses, stats } = data;

  return (
    <div className="page animate-fade-in">
      <div className="container">
        {/* Navigation back */}
        <Link to="/catalogo" className="btn btn-ghost btn-sm mb-6 inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Volver a cursos
        </Link>

        {/* Hero Card del Instructor */}
        <div className="card mb-8" style={{
          background: 'linear-gradient(135deg, rgba(13,148,136,0.04) 0%, rgba(37,99,235,0.04) 100%)',
          border: '1px solid var(--border-active)',
          padding: 'var(--space-8)'
        }}>
          <div className="flex gap-6 items-start flex-wrap md:flex-nowrap">
            {/* Avatar */}
            <div style={{
              width: 110, height: 110, borderRadius: '50%',
              background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '2.5rem',
              flexShrink: 0, boxShadow: 'var(--shadow-md)', border: '4px solid white'
            }}>
              {instructor.avatar ? (
                <img src={instructor.avatar} alt={instructor.nombre} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                `${(instructor.nombre || 'I')[0]}${(instructor.apellido || '')[0] || ''}`
              )}
            </div>

            {/* Main Info */}
            <div style={{ flex: 1 }}>
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {instructor.nombre} {instructor.apellido}
                </h1>
                <span className="badge badge-teal flex items-center gap-1" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                  <ShieldCheck size={14} /> Instructor Certificado
                </span>
              </div>

              <p className="text-sm font-semibold" style={{ color: 'var(--accent-teal)', marginBottom: 'var(--space-3)' }}>
                {instructor.titulo_profesional || 'Docente & Especialista de Plataforma'} {instructor.experiencia ? `• ${instructor.experiencia}` : ''}
              </p>

              <p className="text-sm text-secondary" style={{ lineHeight: 1.7, maxWidth: 800, marginBottom: 'var(--space-4)' }}>
                {instructor.bio || 'Docente y profesional dedicado a formar estudiantes en el mercado tecnológico e industrial de Ecuador.'}
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-3 mt-6 pt-6" style={{ borderTop: '1px solid var(--border-color)', gap: 'var(--space-4)' }}>
            <div className="flex items-center gap-3 p-3 card" style={{ background: 'var(--bg-primary)' }}>
              <div style={{ padding: 10, borderRadius: 'var(--radius-md)', background: 'rgba(13,148,136,0.1)', color: 'var(--accent-teal)' }}>
                <BookOpen size={22} />
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{stats.total_cursos || 0}</div>
                <div className="text-xs text-muted">Cursos Impartidos</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 card" style={{ background: 'var(--bg-primary)' }}>
              <div style={{ padding: 10, borderRadius: 'var(--radius-md)', background: 'rgba(37,99,235,0.1)', color: 'var(--accent-blue)' }}>
                <Users size={22} />
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{stats.total_estudiantes || 0}</div>
                <div className="text-xs text-muted">Estudiantes Totales</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 card" style={{ background: 'var(--bg-primary)' }}>
              <div style={{ padding: 10, borderRadius: 'var(--radius-md)', background: 'rgba(230,150,10,0.1)', color: 'var(--accent-gold)' }}>
                <Star size={22} />
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>⭐ {stats.promedio_calificacion || '4.8'}</div>
                <div className="text-xs text-muted">Calificación Promedio</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Cursos del Instructor */}
        <div className="mb-8">
          <h2 className="mb-2 flex items-center gap-2" style={{ fontSize: '1.4rem' }}>
            <BookOpen size={20} style={{ color: 'var(--accent-teal)' }} /> Cursos de {instructor.nombre} ({courses.length})
          </h2>
          <p className="text-muted text-sm mb-6">Explora todos los programas académicos dictados por este instructor</p>

          {courses.length > 0 ? (
            <div className="grid grid-3 stagger-children">
              {courses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="card text-center p-8">
              <p className="text-muted">Este instructor aún no tiene cursos activos publicados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

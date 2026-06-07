import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import CourseCard from '../../components/common/CourseCard';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { Star, Clock, Users, BookOpen, ShoppingCart, Zap, Crown, ChevronDown, ChevronUp, PlayCircle, FileText, Lock, Check } from 'lucide-react';

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await api.get(`/courses/${id}`);
        setData(data);
        // Expand first module
        if (data.modules?.length > 0) setExpandedModules({ [data.modules[0].id]: true });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) return navigate('/login');
    const result = await addToCart(parseInt(id));
    if (result.success) toast.success(result.message);
    else toast.error(result.message);
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) return navigate('/login');
    const result = await addToCart(parseInt(id));
    if (result.success) navigate('/carrito');
    else toast.error(result.message);
  };

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const renderStars = (rating) => {
    const r = parseFloat(rating) || 0;
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={18} fill={i < Math.round(r) ? 'var(--accent-gold)' : 'none'} color={i < Math.round(r) ? 'var(--accent-gold)' : 'var(--text-muted)'} />
    ));
  };

  if (loading) return (
    <div className="page container">
      <div className="skeleton" style={{ height: 400, borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-8)' }} />
    </div>
  );

  if (!data?.course) return (
    <div className="page container text-center">
      <h2>Curso no encontrado</h2>
      <Link to="/catalogo" className="btn btn-primary mt-4">Volver al catálogo</Link>
    </div>
  );

  const { course, modules, versions, classrooms, availability, related } = data;
  const totalLessons = modules?.reduce((sum, m) => sum + (m.lecciones?.length || 0), 0) || 0;

  return (
    <div className="page">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--space-8)', alignItems: 'start' }}>
          {/* Left: Course Info */}
          <div className="animate-fade-in">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-4 text-sm text-muted">
              <Link to="/catalogo">Cursos</Link>
              <span>/</span>
              <span>{course.categoria_nombre}</span>
            </div>

            {/* Image */}
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 'var(--space-6)', position: 'relative' }}>
              <img
                src={course.imagen || `https://placehold.co/800x400/142241/4ECDC4?text=${encodeURIComponent(course.nombre)}&font=roboto`}
                alt={course.nombre}
                style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }}
                onError={(e) => { e.target.src = `https://placehold.co/800x400/142241/4ECDC4?text=${encodeURIComponent(course.nombre)}&font=roboto`; }}
              />
              {course.es_premium && (
                <span className="badge badge-gold" style={{ position: 'absolute', top: 16, right: 16, padding: '6px 12px', fontSize: 'var(--text-xs)' }}>
                  <Crown size={12} /> PREMIUM
                </span>
              )}
            </div>

            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>
              {course.nombre}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <div className="flex items-center gap-1">
                {renderStars(course.valoracion)}
                <span style={{ color: 'var(--accent-gold)', fontWeight: 700, marginLeft: 4 }}>
                  {parseFloat(course.promedio_calificacion || course.valoracion || 0).toFixed(1)}
                </span>
                <span className="text-muted text-sm">({course.total_resenas} reseñas)</span>
              </div>
              <span className="flex items-center gap-1 text-sm text-muted"><Users size={14} /> {course.total_ventas} estudiantes</span>
            </div>

            <p className="text-muted text-sm mb-2">
              Instructor: <span style={{ color: 'var(--accent-teal)', fontWeight: 500 }}>
                {course.instructor_nombre} {course.instructor_apellido}
              </span>
            </p>

            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <span className="badge badge-teal">{course.nivel}</span>
              <span className="flex items-center gap-1 text-sm text-muted"><Clock size={14} /> {course.duracion_horas} horas</span>
              <span className="flex items-center gap-1 text-sm text-muted"><BookOpen size={14} /> {totalLessons} lecciones</span>
              <span className="text-sm text-muted">Versión {course.version_actual}</span>
            </div>

            {/* Description */}
            <div className="card mb-8" style={{ borderLeft: '3px solid var(--accent-teal)' }}>
              <h3 style={{ marginBottom: 'var(--space-3)' }}>Descripción</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{course.descripcion}</p>
            </div>

            {/* Modules */}
            <div className="mb-8">
              <h3 className="mb-4">Contenido del Curso</h3>
              <p className="text-sm text-muted mb-4">{modules?.length || 0} módulos · {totalLessons} lecciones</p>
              <div className="flex flex-col gap-2">
                {modules?.map(mod => (
                  <div key={mod.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <button onClick={() => toggleModule(mod.id)} className="flex items-center justify-between w-full" style={{
                      padding: 'var(--space-4) var(--space-5)', background: 'transparent', color: 'var(--text-primary)', textAlign: 'left'
                    }}>
                      <div className="flex items-center gap-3">
                        <BookOpen size={18} style={{ color: 'var(--accent-teal)' }} />
                        <span style={{ fontWeight: 600 }}>{mod.titulo}</span>
                        <span className="badge badge-blue" style={{ fontSize: '0.6rem' }}>{mod.lecciones?.length || 0} lecciones</span>
                      </div>
                      {expandedModules[mod.id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {expandedModules[mod.id] && mod.lecciones && (
                      <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
                        {mod.lecciones.map(lesson => (
                          <div key={lesson.id} className="flex items-center gap-3" style={{
                            padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--border-subtle)'
                          }}>
                            {lesson.es_gratis ? (
                              <PlayCircle size={16} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />
                            ) : (
                              <Lock size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                            )}
                            <span className="text-sm" style={{ flex: 1 }}>{lesson.titulo}</span>
                            <span className="text-xs text-muted">{lesson.duracion_minutos} min</span>
                            {lesson.es_gratis && <span className="badge badge-green" style={{ fontSize: '0.55rem' }}>GRATIS</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Versions */}
            {versions?.length > 1 && (
              <div className="mb-8">
                <h3 className="mb-4">Historial de Versiones</h3>
                <div className="flex flex-col gap-2">
                  {versions.map(v => (
                    <div key={v.id} className="flex items-center gap-3 p-4" style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-md)' }}>
                      <span className="badge badge-purple">v{v.numero_version}</span>
                      <span className="text-sm" style={{ flex: 1 }}>{v.descripcion || v.cambios}</span>
                      <span className="badge badge-green">{v.estado}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Sticky Purchase Card */}
          <div className="animate-slide-right" style={{ position: 'sticky', top: 90 }}>
            <div className="card" style={{
              border: '1px solid rgba(78,205,196,0.2)',
              boxShadow: 'var(--shadow-lg)'
            }}>
              {/* Price */}
              <div className="mb-6">
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)', fontWeight: 800 }}>
                  ${parseFloat(course.precio).toFixed(2)}
                </div>
                {course.precio_premium > 0 && (
                  <p className="text-sm text-muted mt-1">
                    <Crown size={14} style={{ color: 'var(--accent-gold)', display: 'inline', verticalAlign: 'middle' }} />
                    {' '}Premium: <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>${parseFloat(course.precio_premium).toFixed(2)}</span>
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3 mb-6">
                <button onClick={handleBuyNow} className="btn btn-primary btn-lg w-full" id="buy-now-btn">
                  <Zap size={18} /> Comprar Ahora
                </button>
                <button onClick={handleAddToCart} className="btn btn-outline btn-lg w-full" id="add-to-cart-btn">
                  <ShoppingCart size={18} /> Agregar al Carrito
                </button>
              </div>

              {/* Availability */}
              {availability && (
                <div className={`availability-badge ${availability.tipo === 'disponible' ? 'available' : availability.tipo === 'proximo' ? 'upcoming' : 'limited'} mb-4 w-full`}
                  style={{ justifyContent: 'center' }}>
                  <div className="pulse-dot" />
                  {availability.mensaje}
                </div>
              )}

              {/* Classrooms */}
              {classrooms?.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-muted mb-2">Aulas disponibles:</p>
                  {classrooms.slice(0, 2).map(cls => (
                    <div key={cls.id} className="flex items-center justify-between text-xs mb-1" style={{ padding: '6px 0' }}>
                      <span>{cls.nombre}</span>
                      <span style={{ color: cls.cupo_maximo - cls.cupo_ocupado > 10 ? 'var(--accent-green)' : 'var(--accent-orange)' }}>
                        {cls.cupo_maximo - cls.cupo_ocupado} cupos
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Includes */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-4)' }}>
                <p className="text-sm font-semibold mb-3">Este curso incluye:</p>
                {[
                  `${course.duracion_horas} horas de contenido`,
                  `${totalLessons} lecciones en video`,
                  'Recursos descargables',
                  'Acceso de por vida',
                  'Certificado de finalización'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <Check size={14} style={{ color: 'var(--accent-green)' }} />
                    <span className="text-sm text-muted">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Courses */}
        {related?.length > 0 && (
          <div className="mt-16">
            <h3 className="section-title">Cursos Relacionados</h3>
            <div className="grid grid-4 stagger-children">
              {related.map(c => <CourseCard key={c.id} course={c} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

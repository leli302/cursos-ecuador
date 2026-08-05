import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import CourseCard from '../../components/common/CourseCard';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { Star, Clock, Users, BookOpen, ShoppingCart, Zap, Crown, ChevronDown, ChevronUp, PlayCircle, FileText, Lock, Check, CheckCircle2, Award, Infinity, Palette, Code, TrendingUp, ZoomIn, ZoomOut, RotateCcw, X, Maximize2, Eye } from 'lucide-react';

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});

  // Lightbox Zoom State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  const handleZoomIn = () => setZoomScale(prev => Math.min(prev + 0.3, 3));
  const handleZoomOut = () => setZoomScale(prev => Math.max(prev - 0.3, 0.5));
  const handleResetZoom = () => setZoomScale(1);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isLightboxOpen) {
        setIsLightboxOpen(false);
        setZoomScale(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);

  const getModuleIcon = (title) => {
    const t = (title || '').toLowerCase();
    if (t.includes('introduc') || t.includes('bienvenida') || t.includes('conceptos') || t.includes('fundamento')) {
      return <BookOpen size={18} style={{ color: 'var(--accent-teal)' }} />;
    }
    if (t.includes('diseño') || t.includes('ui') || t.includes('ux') || t.includes('pantalla') || t.includes('interfaz') || t.includes('maqueta')) {
      return <Palette size={18} style={{ color: 'var(--accent-teal)' }} />;
    }
    if (t.includes('desarrollo') || t.includes('código') || t.includes('program') || t.includes('python') || t.includes('javascript') || t.includes('react') || t.includes('base de datos') || t.includes('sql') || t.includes('api')) {
      return <Code size={18} style={{ color: 'var(--accent-teal)' }} />;
    }
    if (t.includes('negocio') || t.includes('venta') || t.includes('market') || t.includes('publicidad') || t.includes('ads') || t.includes('sri') || t.includes('financ') || t.includes('contabil')) {
      return <TrendingUp size={18} style={{ color: 'var(--accent-teal)' }} />;
    }
    if (t.includes('final') || t.includes('certific') || t.includes('proyecto') || t.includes('examen') || t.includes('concl')) {
      return <Award size={18} style={{ color: 'var(--accent-teal)' }} />;
    }
    return <BookOpen size={18} style={{ color: 'var(--accent-teal)' }} />;
  };

  const getModuleLessons = (mod) => {
    if (!mod || !Array.isArray(mod.lecciones)) return [];
    return mod.lecciones.filter(l => l && typeof l === 'object' && l.id);
  };

  const parseJsonArray = (val, fallback = []) => {
    if (!val) return fallback;
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        return [val];
      }
    }
    return fallback;
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await api.get(`/courses/${id}`);
        if (data && (data.course || data.data?.course)) {
          const payload = data.course ? data : data.data;
          setData(payload);
          if (payload.modules?.length > 0) setExpandedModules({ [payload.modules[0].id]: true });
        } else {
          setData(null);
        }
      } catch (error) {
        console.error('Error cargando detalle del curso:', error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const [enrolling, setEnrolling] = useState(false);

  const handleFreeEnroll = async () => {
    if (!isAuthenticated) return navigate('/login');
    setEnrolling(true);
    try {
      const res = await api.post(`/courses/${id}/enroll`);
      toast.success(res.data.message || '¡Matriculación gratuita exitosa!');
      navigate('/mi-panel');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Error al realizar la matriculación.');
    } finally {
      setEnrolling(false);
    }
  };

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
    <div className="page">
      <div className="container">
        <div className="course-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--space-8)', alignItems: 'start' }}>
          {/* Left skeleton */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="skeleton" style={{ height: 14, width: 50 }} />
              <div className="skeleton" style={{ height: 14, width: 80 }} />
            </div>
            <div className="skeleton" style={{ height: 340, borderRadius: 'var(--radius-xl)', marginBottom: 'var(--space-6)' }} />
            <div className="skeleton" style={{ height: 32, width: '75%', marginBottom: 'var(--space-4)' }} />
            <div className="flex items-center gap-3 mb-4">
              <div className="skeleton" style={{ height: 18, width: 100 }} />
              <div className="skeleton" style={{ height: 18, width: 120 }} />
            </div>
            <div className="flex items-center gap-2 mb-4">
              <div className="skeleton" style={{ height: 16, width: 160 }} />
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="skeleton" style={{ height: 24, width: 80, borderRadius: 'var(--radius-full)' }} />
              <div className="skeleton" style={{ height: 16, width: 70 }} />
              <div className="skeleton" style={{ height: 16, width: 90 }} />
            </div>
            <div className="card mb-8" style={{ borderLeft: '3px solid var(--border-subtle)' }}>
              <div className="skeleton" style={{ height: 20, width: 180, marginBottom: 12 }} />
              <div className="skeleton" style={{ height: 14, width: '100%', marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 14, width: '90%', marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 14, width: '70%' }} />
            </div>
            <div className="card mb-8">
              <div className="skeleton" style={{ height: 20, width: 220, marginBottom: 16 }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="skeleton" style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0 }} />
                    <div className="skeleton" style={{ height: 14, width: '80%' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Right skeleton (sidebar) */}
          <div className="card course-detail-sidebar" style={{ overflow: 'hidden' }}>
            <div className="skeleton" style={{ height: 70, margin: '-20px -20px 20px -20px' }} />
            <div className="skeleton" style={{ height: 48, borderRadius: 'var(--radius-md)', marginBottom: 16 }} />
            <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: 12 }} />
            <div className="skeleton" style={{ height: 14, width: '80%', marginBottom: 12 }} />
            <div className="skeleton" style={{ height: 14, width: '50%', marginBottom: 20 }} />
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
              <div className="skeleton" style={{ height: 16, width: 140, marginBottom: 12 }} />
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <div className="skeleton" style={{ width: 14, height: 14, borderRadius: '50%', flexShrink: 0 }} />
                  <div className="skeleton" style={{ height: 14, width: `${60 + Math.random() * 30}%` }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!data?.course) return (
    <div className="page container text-center" style={{ paddingTop: 80 }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%', margin: '0 auto 20px',
        background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <BookOpen size={36} style={{ color: 'var(--accent-red)' }} />
      </div>
      <h2 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: 8 }}>Curso no encontrado</h2>
      <p className="text-muted text-sm" style={{ maxWidth: 400, margin: '0 auto 24px' }}>
        El curso solicitado no existe, fue eliminado o no está disponible en este momento.
      </p>
      <Link to="/catalogo" className="btn btn-primary">Explorar el Catálogo</Link>
    </div>
  );

  const { course, modules, versions, classrooms, availability, related } = data;
  const totalLessons = modules?.reduce((sum, m) => sum + getModuleLessons(m).length, 0) || 0;

  return (
    <div className="page">
      <div className="container">
        <div className="course-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--space-8)', alignItems: 'start' }}>
          {/* Left: Course Info */}
          <div className="animate-fade-in">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-4 text-sm text-muted">
              <Link to="/catalogo">Cursos</Link>
              <span>/</span>
              <span>{course.categoria_nombre}</span>
            </div>

            {/* Image with Zoom Trigger */}
            <div 
              style={{ 
                borderRadius: 'var(--radius-xl)', 
                overflow: 'hidden', 
                marginBottom: 'var(--space-6)', 
                position: 'relative',
                cursor: 'pointer',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-md)',
                group: 'image-container'
              }}
              onClick={() => { setIsLightboxOpen(true); setZoomScale(1); }}
              title="Haz clic para ver e inspeccionar la imagen en pantalla completa"
            >
              <img
                src={course.imagen || `https://placehold.co/800x400/142241/4ECDC4?text=${encodeURIComponent(course.nombre)}&font=roboto`}
                alt={course.nombre}
                style={{ 
                  width: '100%', 
                  aspectRatio: '16/9', 
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease'
                }}
                onError={(e) => { e.target.src = `https://placehold.co/800x400/142241/4ECDC4?text=${encodeURIComponent(course.nombre)}&font=roboto`; }}
              />

              {/* Hover Badge */}
              <div style={{
                position: 'absolute', bottom: 12, right: 12,
                background: 'rgba(0, 0, 0, 0.65)', color: 'white',
                padding: '6px 12px', borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem', fontWeight: 600, backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', gap: 6,
                border: '1px solid var(--border-subtle)', pointerEvents: 'none'
              }}>
                <Maximize2 size={13} /> Ampliar Imagen
              </div>

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
              Instructor:{' '}
              <Link 
                to={`/instructores/${course.instructor_id || 1}`} 
                style={{ color: 'var(--accent-teal)', fontWeight: 600, textDecoration: 'underline' }}
                title="Ver perfil completo del instructor"
              >
                {course.instructor_nombre} {course.instructor_apellido}
              </Link>
            </p>

            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <span className="badge badge-teal">{course.nivel}</span>
              <span className="flex items-center gap-1 text-sm text-muted"><Clock size={14} /> {course.duracion_horas} horas</span>
              <span className="flex items-center gap-1 text-sm text-muted"><BookOpen size={14} /> {totalLessons} lecciones</span>
              <span className="text-sm text-muted">Versión {course.version_actual}</span>
            </div>

            {/* Description */}
            <div className="card mb-8" style={{ borderLeft: '3px solid var(--accent-teal)' }}>
              <h3 style={{ marginBottom: 'var(--space-3)' }}>Descripción del Curso</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{course.descripcion}</p>
            </div>

            {/* Lo que aprenderás */}
            <div className="card mb-8" style={{ background: 'linear-gradient(135deg, rgba(13,148,136,0.04) 0%, rgba(59,130,246,0.04) 100%)', border: '1px solid rgba(13,148,136,0.15)' }}>
              <h3 className="mb-4 flex items-center gap-2" style={{ fontSize: '1.2rem', color: 'var(--accent-teal)' }}>
                <CheckCircle2 size={20} /> Lo que aprenderás en este curso
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px 20px' }}>
                {parseJsonArray(course.lo_que_aprenderas, [
                  'Comprender los fundamentos teóricos y prácticos del área.',
                  'Desarrollar proyectos reales aplicados a la industria ecuatoriana.',
                  'Dominar las herramientas estándar utilizadas por empresas líderes.',
                  'Implementar mejores prácticas y patrones profesionales de trabajo.',
                  'Resolver casos de estudio del mundo real paso a paso.',
                  'Prepararse eficazmente para evaluaciones y certificaciones de mercado.'
                ]).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm" style={{ lineHeight: 1.5 }}>
                    <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0, marginTop: 2 }} />
                    <span style={{ color: 'var(--text-primary)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dirigido a & Requisitos Grid */}
            <div className="grid grid-2 gap-6 mb-8">
              <div className="card">
                <h4 className="mb-3 flex items-center gap-2" style={{ fontSize: '1rem', fontWeight: 700 }}>
                  <Users size={18} style={{ color: 'var(--accent-teal)' }} /> Este curso está dirigido a:
                </h4>
                <ul className="flex flex-col gap-2 text-sm text-secondary" style={{ paddingLeft: 8 }}>
                  {parseJsonArray(course.dirigido_a, [
                    'Estudiantes universitarios y técnicos.',
                    'Profesionales que buscan actualizar sus conocimientos.',
                    'Emprendedores y dueños de negocios.',
                    'Personas que desean aprender desde cero.'
                  ]).map((target, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span style={{ color: 'var(--accent-teal)', fontWeight: 800 }}>•</span> {target}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card">
                <h4 className="mb-3 flex items-center gap-2" style={{ fontSize: '1rem', fontWeight: 700 }}>
                  <BookOpen size={18} style={{ color: 'var(--accent-teal)' }} /> Requisitos previos:
                </h4>
                <p className="text-sm text-secondary" style={{ lineHeight: 1.6 }}>
                  {course.requisitos || 'No necesitas experiencia previa. Todo el contenido se enseña desde los fundamentos.'}
                </p>
              </div>
            </div>

            {/* Modules */}
            <div className="mb-8">
              <h3 className="mb-4">Contenido del Curso</h3>
              <p className="text-sm text-muted mb-4">{modules?.length || 0} módulos · {totalLessons} lecciones</p>
              <div className="flex flex-col gap-2">
                {modules?.map(mod => {
                  const validLessons = getModuleLessons(mod);
                  const freeLessons = validLessons.filter(l => l.es_gratis);
                  return (
                    <div key={mod.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                      <button onClick={() => toggleModule(mod.id)} className="flex items-center justify-between w-full" style={{
                        padding: 'var(--space-4) var(--space-5)', background: 'transparent', color: 'var(--text-primary)', textAlign: 'left'
                      }}>
                        <div className="flex items-center gap-3">
                          {getModuleIcon(mod.titulo)}
                          <span style={{ fontWeight: 600 }}>{mod.titulo}</span>
                          <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>{validLessons.length} lecciones</span>
                        </div>
                        {expandedModules[mod.id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>

                      {expandedModules[mod.id] && (
                        <div style={{ borderTop: '1px solid var(--border-subtle)', position: 'relative' }}>
                          {/* Free preview lessons if any */}
                          {freeLessons.map(lesson => (
                            <div key={lesson.id} className="flex items-center gap-3" style={{
                              padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--border-subtle)',
                              background: 'rgba(16, 185, 129, 0.05)'
                            }}>
                              <PlayCircle size={16} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />
                              <span className="text-sm font-medium" style={{ flex: 1 }}>{lesson.titulo}</span>
                              <span className="text-xs text-muted"><Clock size={12} style={{ display: 'inline', marginRight: 4 }} />{lesson.duracion_minutos} min</span>
                              <span className="badge badge-green flex items-center gap-1" style={{ fontSize: '0.65rem' }}>
                                <Eye size={12} /> Vista Previa Gratuita
                              </span>
                            </div>
                          ))}

                        {/* Blurred Locked Topics Container with CTA Card Overlay */}
                        <div style={{ position: 'relative', minHeight: 200, padding: 'var(--space-6)', overflow: 'hidden' }}>
                          {/* Blurred placeholder topic items */}
                          <div style={{ filter: 'blur(6px)', opacity: 0.35, userSelect: 'none', pointerEvents: 'none' }} className="flex flex-col gap-3">
                            <div className="flex items-center justify-between p-3" style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
                              <div className="flex items-center gap-3">
                                <Lock size={16} />
                                <span className="text-sm font-semibold">Lección 1: Fundamentos y Conceptos Clave</span>
                              </div>
                              <span className="text-xs">15 min</span>
                            </div>
                            <div className="flex items-center justify-between p-3" style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
                              <div className="flex items-center gap-3">
                                <Lock size={16} />
                                <span className="text-sm font-semibold">Lección 2: Aplicación Práctica</span>
                              </div>
                              <span className="text-xs">25 min</span>
                            </div>
                            <div className="flex items-center justify-between p-3" style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
                              <div className="flex items-center gap-3">
                                <Lock size={16} />
                                <span className="text-sm font-semibold">Lección 3: Evaluación y Material</span>
                              </div>
                              <span className="text-xs">20 min</span>
                            </div>
                          </div>

                          {/* Light Theme Glassmorphic Locked Overlay */}
                          <div style={{
                            position: 'absolute', inset: 8,
                            background: 'rgba(255, 255, 255, 0.88)', backdropFilter: 'blur(14px)',
                            borderRadius: 'var(--radius-lg)', border: '1px solid rgba(13,148,136,0.15)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            justifyContent: 'center', padding: '28px', textAlign: 'center',
                            boxShadow: '0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)'
                          }} className="animate-fade-in">
                            <div style={{
                              padding: 14, borderRadius: '50%',
                              background: 'linear-gradient(135deg, rgba(13,148,136,0.1), rgba(37,99,235,0.1))',
                              color: 'var(--accent-teal)', marginBottom: 14,
                              boxShadow: '0 0 0 4px rgba(13,148,136,0.06)'
                            }}>
                              <Lock size={26} />
                            </div>
                            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-primary)' }}>
                              Contenido Bloqueado
                            </h4>
                            <p className="text-xs" style={{ color: 'var(--text-secondary)', maxWidth: 380, marginBottom: 18, lineHeight: 1.6 }}>
                              Inscríbete o adquiere el curso para desbloquear los temas, videos HD, evaluaciones y material de esta unidad.
                            </p>
                            <div className="flex items-center gap-3 flex-wrap justify-center">
                              <button 
                                className="btn btn-primary btn-sm flex items-center gap-2"
                                onClick={handleBuyNow}
                                style={{ padding: '8px 18px' }}
                              >
                                <Zap size={15} /> Inscribirme al Curso
                              </button>
                              <button 
                                className="btn btn-outline btn-sm flex items-center gap-2"
                                onClick={handleAddToCart}
                                style={{ padding: '8px 16px' }}
                              >
                                <ShoppingCart size={15} /> Agregar al Carrito
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              </div>
            </div>

            {/* Instructor Profile Card */}
            <div className="card mb-8">
              <h3 className="mb-4 flex items-center gap-2" style={{ fontSize: '1.25rem' }}>
                <Users size={20} style={{ color: 'var(--accent-teal)' }} /> Acerca del Instructor
              </h3>
              <div className="flex gap-4 items-start flex-wrap sm:flex-nowrap">
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.5rem',
                  flexShrink: 0, boxShadow: 'var(--shadow-sm)'
                }}>
                  {course.instructor_avatar ? (
                    <img src={course.instructor_avatar} alt="Instructor" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    `${(course.instructor_nombre || 'I')[0]}${(course.instructor_apellido || '')[0] || ''}`
                  )}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 2 }}>
                    {course.instructor_nombre} {course.instructor_apellido}
                  </h4>
                  <p className="text-xs" style={{ color: 'var(--accent-teal)', fontWeight: 600, marginBottom: 8 }}>
                    {course.instructor_titulo || 'Instructor Certificado'} {course.instructor_experiencia ? `• ${course.instructor_experiencia}` : ''}
                  </p>
                  <p className="text-sm text-secondary" style={{ lineHeight: 1.6, marginBottom: 12 }}>
                    {course.instructor_bio || 'Experto y profesional apasionado por compartir conocimientos prácticos con metodologías adaptadas al mercado real.'}
                  </p>
                  <Link 
                    to={`/instructores/${course.instructor_id || 1}`}
                    className="btn btn-outline btn-sm inline-flex items-center gap-2"
                    style={{ fontSize: '0.8rem', padding: '5px 12px' }}
                  >
                    <Users size={14} /> Ver Perfil y Cursos del Instructor
                  </Link>
                </div>
              </div>
            </div>

            {/* Versions */}
            {versions?.length > 1 && (
              <div className="mb-8">
                <h3 className="mb-4">Historial de Versiones</h3>
                <div className="flex flex-col gap-2">
                  {versions.map(v => (
                    <div key={v.id} className="flex items-center gap-3 p-4" style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <span className="badge badge-purple">v{v.numero_version}</span>
                      <span className="text-sm" style={{ flex: 1 }}>{v.descripcion || v.cambios}</span>
                      <span className="badge badge-green">{v.estado}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Sticky Purchase & Enrollment Card */}
          <div className="animate-slide-right course-detail-sidebar" style={{ position: 'sticky', top: 90 }}>
            <div className="card" style={{
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden'
            }}>
              {/* Header: Modelo de acceso */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(13,148,136,0.12) 0%, rgba(13,148,136,0.04) 100%)',
                padding: '16px 20px',
                margin: '-20px -20px 20px -20px',
                borderBottom: '1px solid rgba(13,148,136,0.15)'
              }}>
                <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'rgba(13,148,136,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Check size={14} style={{ color: 'var(--accent-teal)' }} />
                  </div>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-teal)' }}>
                    Acceso Gratuito
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                  Matricúlate sin costo y accede a todas las lecciones. La certificación oficial es opcional y se adquiere por separado.
                </p>
              </div>

              {/* Enrollment Button */}
              <div className="flex flex-col gap-3 mb-6">
                <button 
                  onClick={handleFreeEnroll} 
                  disabled={enrolling}
                  className="btn btn-primary btn-lg w-full" 
                  id="free-enroll-btn"
                  style={{ fontSize: '0.95rem', padding: '14px 20px', fontWeight: 700 }}
                >
                  <Zap size={18} /> {enrolling ? 'Procesando...' : 'Matricularme Gratis'}
                </button>
              </div>

              {/* Certification Section (Sin precios antes del 100%) */}
              <div style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: 'var(--space-4)',
                marginBottom: 'var(--space-4)'
              }}>
                <div className="flex items-center gap-2 mb-2">
                  <Award size={16} style={{ color: 'var(--accent-teal)' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Certificación Verificable
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 12 }}>
                  Completa el 100% del curso para desbloquear tus opciones de certificación oficial y diploma digital con código QR.
                </p>
                <div style={{ padding: '8px 12px', background: 'var(--bg-body)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <span className="text-xs text-muted flex items-center gap-1 font-semibold">
                    <CheckCircle2 size={12} style={{ color: '#10B981' }} /> Opción de Certificado disponible al finalizar
                  </span>
                </div>
              </div>

              {/* Availability */}
              {availability && (
                <div className={`availability-badge ${availability.tipo === 'disponible' ? 'available' : availability.tipo === 'proximo' ? 'upcoming' : 'limited'} mb-4 w-full`}
                  style={{ justifyContent: 'center', flexDirection: 'column', gap: '4px', padding: '10px' }}>
                  <div className="flex items-center gap-2" style={{ justifyContent: 'center' }}>
                    <div className="pulse-dot" />
                    <span>{availability.mensaje}</span>
                  </div>
                  {availability.tipo === 'proximo' && availability.fecha_estimada && (
                    <span className="text-xs font-semibold" style={{ opacity: 0.9 }}>
                      Fecha de inicio: {new Date(availability.fecha_estimada).toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
                    </span>
                  )}
                </div>
              )}

              {/* Classrooms */}
              {classrooms?.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-muted mb-2">Aulas disponibles:</p>
                  {classrooms.slice(0, 2).map(cls => {
                    const startsInFuture = new Date(cls.fecha_inicio) > new Date();
                    return (
                      <div key={cls.id} className="flex flex-col mb-1" style={{ padding: '4px 0' }}>
                        <div className="flex items-center justify-between text-xs">
                          <span>{cls.nombre}</span>
                          <span style={{ color: cls.cupo_maximo - cls.cupo_ocupado > 10 ? 'var(--accent-green)' : 'var(--accent-orange)', fontWeight: 600 }}>
                            {cls.cupo_maximo - cls.cupo_ocupado} cupos
                          </span>
                        </div>
                        <div className="text-xs text-muted" style={{ fontSize: '0.7rem', marginTop: '2px' }}>
                          {startsInFuture ? (
                            <span style={{ color: 'var(--accent-gold)' }}>
                              Inicia el: {new Date(cls.fecha_inicio).toLocaleDateString('es-EC', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })}
                            </span>
                          ) : (
                            <span>Iniciado el: {new Date(cls.fecha_inicio).toLocaleDateString('es-EC', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Course Includes */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-4)' }}>
                <p className="text-sm font-semibold mb-3">Este curso incluye:</p>
                {[
                  { icon: <Clock size={14} style={{ color: 'var(--accent-teal)' }} />, text: `${course.duracion_horas} horas de contenido` },
                  { icon: <PlayCircle size={14} style={{ color: 'var(--accent-teal)' }} />, text: `${totalLessons} lecciones en video` },
                  { icon: <FileText size={14} style={{ color: 'var(--accent-teal)' }} />, text: 'Recursos descargables' },
                  { icon: <Infinity size={14} style={{ color: 'var(--accent-teal)' }} />, text: 'Acceso de por vida' },
                  { icon: <Award size={14} style={{ color: 'var(--accent-teal)' }} />, text: 'Certificado al completar (de pago)' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    {item.icon}
                    <span className="text-sm text-muted">{item.text}</span>
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

      {/* Interactive Lightbox Zoom Modal */}
      {isLightboxOpen && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(5, 12, 24, 0.95)', backdropFilter: 'blur(16px)',
            zIndex: 2000, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', padding: '20px'
          }}
          className="animate-fade-in"
          onClick={() => { setIsLightboxOpen(false); setZoomScale(1); }}
        >
          {/* Floating Controls Toolbar */}
          <div 
            style={{
              position: 'fixed', top: 20, zIndex: 2010,
              background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(12px)',
              padding: '8px 16px', borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(255,255,255,0.15)', display: 'flex',
              alignItems: 'center', gap: 12, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-teal)', marginRight: 4 }}>
              {Math.round(zoomScale * 100)}%
            </span>

            <button 
              type="button" 
              className="btn-icon" 
              onClick={handleZoomIn}
              title="Acercar (+)"
              style={{ color: 'white', background: 'rgba(255,255,255,0.1)' }}
            >
              <ZoomIn size={18} />
            </button>

            <button 
              type="button" 
              className="btn-icon" 
              onClick={handleZoomOut}
              title="Alejar (-)"
              style={{ color: 'white', background: 'rgba(255,255,255,0.1)' }}
            >
              <ZoomOut size={18} />
            </button>

            <button 
              type="button" 
              className="btn-icon" 
              onClick={handleResetZoom}
              title="Restablecer tamaño (100%)"
              style={{ color: 'white', background: 'rgba(255,255,255,0.1)' }}
            >
              <RotateCcw size={16} />
            </button>

            <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.2)' }} />

            <button 
              type="button" 
              className="btn-icon text-red-400 hover:text-red-300" 
              onClick={() => { setIsLightboxOpen(false); setZoomScale(1); }}
              title="Cerrar (Esc)"
              style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Zoomable Image Container */}
          <div 
            style={{
              maxHeight: '82vh', maxWidth: '90vw', overflow: 'auto',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: zoomScale > 1 ? 'grab' : 'zoom-in', transition: 'transform 0.25s cubic-bezier(0.2, 0, 0, 1)'
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (zoomScale === 1) handleZoomIn();
              else handleResetZoom();
            }}
            onWheel={(e) => {
              e.stopPropagation();
              if (e.deltaY < 0) handleZoomIn();
              else handleZoomOut();
            }}
          >
            <img
              src={course.imagen || `https://placehold.co/800x400/142241/4ECDC4?text=${encodeURIComponent(course.nombre)}&font=roboto`}
              alt={course.nombre}
              style={{
                maxHeight: '80vh', maxWidth: '85vw', objectFit: 'contain',
                borderRadius: 'var(--radius-lg)', boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
                transform: `scale(${zoomScale})`,
                transformOrigin: 'center center',
                transition: 'transform 0.2s ease-out'
              }}
            />
          </div>

          <p className="text-xs text-muted mt-4" style={{ position: 'fixed', bottom: 16, pointerEvents: 'none' }}>
            💡 Usa la rueda del mouse o los botones para hacer zoom. Presiona Esc para salir.
          </p>
        </div>
      )}
    </div>
  );
}

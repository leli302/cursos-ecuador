import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import CourseCard from '../../components/common/CourseCard';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { Star, Clock, Users, BookOpen, ShoppingCart, Zap, Crown, ChevronDown, ChevronUp, PlayCircle, FileText, Lock, Check, Award, Infinity, Palette, Code, TrendingUp, ZoomIn, ZoomOut, RotateCcw, X, Maximize2 } from 'lucide-react';

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
    const t = title.toLowerCase();
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
                background: 'rgba(10, 22, 40, 0.85)', color: 'white',
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
                        {getModuleIcon(mod.titulo)}
                        <span style={{ fontWeight: 600 }}>{mod.titulo}</span>
                        <span className="badge badge-blue" style={{ fontSize: '0.6rem' }}>{mod.lecciones?.length || 0} lecciones</span>
                      </div>
                      {expandedModules[mod.id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {expandedModules[mod.id] && (
                      <div style={{ borderTop: '1px solid var(--border-subtle)', position: 'relative' }}>
                        {/* Free preview lessons if any */}
                        {mod.lecciones?.filter(l => l.es_gratis).map(lesson => (
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
                          <div style={{ filter: 'blur(7px)', opacity: 0.25, userSelect: 'none', pointerEvents: 'none' }} className="flex flex-col gap-3">
                            <div className="flex items-center justify-between p-3 card" style={{ background: 'var(--bg-secondary)' }}>
                              <div className="flex items-center gap-3">
                                <Lock size={16} />
                                <span className="text-sm font-semibold">Lección 1: Fundamentos y Conceptos Clave de la Unidad</span>
                              </div>
                              <span className="text-xs">15 min</span>
                            </div>
                            <div className="flex items-center justify-between p-3 card" style={{ background: 'var(--bg-secondary)' }}>
                              <div className="flex items-center gap-3">
                                <Lock size={16} />
                                <span className="text-sm font-semibold">Lección 2: Aplicación Práctica y Ejercicios Guiados</span>
                              </div>
                              <span className="text-xs">25 min</span>
                            </div>
                            <div className="flex items-center justify-between p-3 card" style={{ background: 'var(--bg-secondary)' }}>
                              <div className="flex items-center gap-3">
                                <Lock size={16} />
                                <span className="text-sm font-semibold">Lección 3: Evaluación Práctica y Material Descargable</span>
                              </div>
                              <span className="text-xs">20 min</span>
                            </div>
                          </div>

                          {/* Glassmorphic Locked Overlay Card */}
                          <div style={{
                            position: 'absolute', inset: 12,
                            background: 'rgba(10, 22, 40, 0.88)', backdropFilter: 'blur(12px)',
                            borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            justifyContent: 'center', padding: '24px', textAlign: 'center',
                            boxShadow: 'var(--shadow-lg)'
                          }} className="animate-fade-in">
                            <div style={{
                              padding: 12, borderRadius: '50%', background: 'rgba(78, 205, 196, 0.12)',
                              color: 'var(--accent-teal)', marginBottom: 12
                            }}>
                              <Lock size={26} />
                            </div>
                            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 6 }}>
                              Contenido Bloqueado de la Unidad
                            </h4>
                            <p className="text-xs text-muted" style={{ maxWidth: 420, marginBottom: 18, lineHeight: 1.5 }}>
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

              {/* Includes */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-4)' }}>
                <p className="text-sm font-semibold mb-3">Este curso incluye:</p>
                {[
                  { icon: <Clock size={14} style={{ color: 'var(--accent-teal)' }} />, text: `${course.duracion_horas} horas de contenido` },
                  { icon: <PlayCircle size={14} style={{ color: 'var(--accent-teal)' }} />, text: `${totalLessons} lecciones en video` },
                  { icon: <FileText size={14} style={{ color: 'var(--accent-teal)' }} />, text: 'Recursos descargables' },
                  { icon: <Infinity size={14} style={{ color: 'var(--accent-teal)' }} />, text: 'Acceso de por vida' },
                  { icon: <Award size={14} style={{ color: 'var(--accent-teal)' }} />, text: 'Certificado de finalización' }
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

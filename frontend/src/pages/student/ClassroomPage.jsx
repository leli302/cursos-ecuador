import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import { ArrowLeft, BookOpen, PlayCircle, CheckCircle, FileText, Download, Check } from 'lucide-react';

export default function ClassroomPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        const { data } = await api.get(`/library/course/${id}`);
        setCourse(data.course);
        setModules(data.modules);
        
        // Calcular progreso inicial
        let total = 0;
        let completed = 0;
        
        // Buscar primera lección para activar
        let firstLesson = null;
        if (data.modules && data.modules.length > 0) {
          for (const mod of data.modules) {
            if (mod.lecciones && mod.lecciones.length > 0) {
              for (const les of mod.lecciones) {
                total++;
                if (les.completado) completed++;
                if (!firstLesson) firstLesson = les;
              }
            }
          }
        }
        
        setProgress(total > 0 ? Math.round((completed / total) * 100) : 0);
        setActiveLesson(firstLesson);
      } catch (error) {
        toast.error('Error al cargar las clases del curso');
        navigate('/mi-biblioteca');
      } finally {
        setLoading(false);
      }
    };
    fetchClassroom();
  }, [id, navigate, toast]);

  const handleToggleComplete = async (lesson) => {
    try {
      const isCompleted = !lesson.completado;
      const { data } = await api.post('/progress', {
        curso_id: parseInt(id),
        leccion_id: lesson.id,
        completado: isCompleted,
        porcentaje: isCompleted ? 100 : 0
      });
      
      // Actualizar estado local de lecciones
      setModules(prevModules => 
        prevModules.map(mod => ({
          ...mod,
          lecciones: mod.lecciones?.map(l => 
            l.id === lesson.id ? { ...l, completado: isCompleted } : l
          )
        }))
      );

      // Actualizar lección activa si corresponde
      if (activeLesson && activeLesson.id === lesson.id) {
        setActiveLesson(prev => ({ ...prev, completado: isCompleted }));
      }

      setProgress(data.progress);
      
      if (isCompleted) {
        toast.success('¡Lección completada!');
        if (data.certificate) {
          toast.success('🎉 ¡Felicidades! Has completado el curso y ganado un certificado.', { duration: 6000 });
        }
      }
    } catch (error) {
      toast.error('Error al actualizar el progreso');
    }
  };

  if (loading) return (
    <div className="page container">
      <div className="skeleton" style={{ height: 400, borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-8)' }} />
    </div>
  );

  if (!course) return null;

  return (
    <div className="page">
      <div className="container">
        {/* Header navigation */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <Link to="/mi-biblioteca" className="flex items-center gap-2 text-sm" style={{ color: 'var(--accent-teal)', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Volver a mi biblioteca
          </Link>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="badge badge-teal">{course.nivel}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted font-semibold">{progress}% completado</span>
              <div className="progress-bar" style={{ width: 120, height: 8, margin: 0 }}>
                <div className="progress-bar-fill" style={{ width: `${progress}%`, background: 'var(--accent-green)' }} />
              </div>
            </div>
          </div>
        </div>

        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-8)' }}>
          {course.nombre}
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-6)', alignItems: 'start' }}>
          
          {/* Left: Active Lesson Viewer */}
          <div className="flex flex-col gap-6">
            {activeLesson ? (
              <>
                {/* Mock Video Player */}
                <div style={{ 
                  width: '100%', 
                  aspectRatio: '16/9', 
                  background: '#0d162a', 
                  borderRadius: 'var(--radius-lg)', 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center',
                  border: '1px solid rgba(78,205,196,0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'var(--gradient-primary)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    boxShadow: '0 0 20px rgba(78,205,196,0.4)',
                    transition: 'transform 0.2s',
                    zIndex: 2
                  }}
                  className="hover-scale"
                  >
                    <PlayCircle size={36} color="white" />
                  </div>
                  <div className="text-center mt-4 text-sm text-muted" style={{ zIndex: 2 }}>
                    Reproductor de video simulado de clase
                  </div>
                  {/* Grid overlay lines */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: 'radial-gradient(rgba(78,205,196,0.05) 1px, transparent 0)',
                    backgroundSize: '24px 24px'
                  }} />
                </div>

                {/* Lesson Info */}
                <div className="card">
                  <div className="flex justify-between items-start gap-4 mb-4 flex-wrap">
                    <div>
                      <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                        {activeLesson.titulo}
                      </h2>
                      <p className="text-xs text-muted">Duración de clase: {activeLesson.duracion_minutos} minutos</p>
                    </div>
                    
                    <button 
                      onClick={() => handleToggleComplete(activeLesson)}
                      className={`btn ${activeLesson.completado ? 'btn-outline' : 'btn-primary'} btn-sm`}
                      style={{ borderRadius: 'var(--radius-full)' }}
                    >
                      {activeLesson.completado ? (
                        <>
                          <Check size={14} style={{ color: 'var(--accent-green)' }} /> Completada
                        </>
                      ) : (
                        'Marcar como Completada'
                      )}
                    </button>
                  </div>
                  
                  <p className="text-muted text-sm" style={{ lineHeight: 1.6 }}>
                    {activeLesson.descripcion || 'En esta lección aprenderás los conceptos clave y prácticos de este tema, explicados paso a paso con ejemplos aplicados.'}
                  </p>
                </div>

                {/* Resources */}
                {activeLesson.recursos && activeLesson.recursos.length > 0 && (
                  <div className="card">
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
                      Recursos de la Clase
                    </h3>
                    <div className="flex flex-col gap-2">
                      {activeLesson.recursos.map(rec => (
                        <div key={rec.id} className="flex items-center justify-between p-3" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                          <div className="flex items-center gap-3">
                            <FileText size={18} style={{ color: 'var(--accent-teal)' }} />
                            <div>
                              <p className="text-sm font-semibold">{rec.titulo || 'Archivo complementario'}</p>
                              <p className="text-xs text-muted">{rec.tamano_mb ? `${rec.tamano_mb} MB` : 'Recurso adicional'} · {rec.tipo.toUpperCase()}</p>
                            </div>
                          </div>
                          <a href={rec.url_archivo} download className="btn btn-icon" style={{ background: 'rgba(78,205,196,0.1)', color: 'var(--accent-teal)', borderRadius: '50%' }}>
                            <Download size={14} />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="card text-center p-8">
                <BookOpen size={48} style={{ color: 'var(--text-muted)', margin: '0 auto var(--space-4)' }} />
                <h3>No hay clases registradas</h3>
                <p className="text-muted">Este curso no contiene lecciones todavía.</p>
              </div>
            )}
          </div>

          {/* Right: Modules & Lessons Sidebar */}
          <div className="flex flex-col gap-4">
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, paddingBottom: '4px', borderBottom: '2px solid var(--accent-teal)' }}>
              Temario del Curso
            </h3>
            <div className="flex flex-col gap-3">
              {modules.map((mod, modIdx) => (
                <div key={mod.id} className="card" style={{ padding: 'var(--space-4)' }}>
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 'var(--space-3)', display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--accent-teal)' }}>Mód. {modIdx + 1}</span> {mod.titulo}
                  </h4>
                  <div className="flex flex-col gap-2">
                    {mod.lecciones && mod.lecciones.length > 0 ? (
                      mod.lecciones.map((lesson, lesIdx) => (
                        <div 
                          key={lesson.id} 
                          onClick={() => setActiveLesson(lesson)}
                          style={{
                            padding: '10px 12px',
                            borderRadius: 'var(--radius-md)',
                            background: activeLesson && activeLesson.id === lesson.id ? 'rgba(78,205,196,0.1)' : 'rgba(255,255,255,0.01)',
                            border: activeLesson && activeLesson.id === lesson.id ? '1px solid var(--accent-teal)' : '1px solid var(--border-subtle)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                          }}
                          className="hover-card"
                        >
                          <div style={{ flexShrink: 0 }}>
                            {lesson.completado ? (
                              <CheckCircle size={16} style={{ color: 'var(--accent-green)' }} />
                            ) : (
                              <PlayCircle size={16} style={{ color: 'var(--text-muted)' }} />
                            )}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ 
                              fontSize: '0.8rem', 
                              fontWeight: activeLesson && activeLesson.id === lesson.id ? 700 : 500,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              margin: 0
                            }}>
                              {lesIdx + 1}. {lesson.titulo}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted">No contiene lecciones.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

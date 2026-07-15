import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import { 
  ChevronLeft, Plus, Edit2, Trash2, ArrowUp, ArrowDown, 
  Play, BookOpen, Clock, CheckCircle, Save, X, Eye 
} from 'lucide-react';

export default function CourseContentPage() {
  const { id } = useParams();
  const toast = useToast();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModuleId, setActiveModuleId] = useState(null);

  // Modales
  const [modifyingModule, setModifyingModule] = useState(null); // 'new' o modulo object
  const [modifyingLesson, setModifyingLesson] = useState(null); // { mode: 'new'/'edit', module_id, lesson: {} }
  const [saving, setSaving] = useState(false);

  // Form states
  const [moduleForm, setModuleForm] = useState({ titulo: '', descripcion: '', orden: 1 });
  const [lessonForm, setLessonForm] = useState({ titulo: '', descripcion: '', duracion_minutos: 15, orden: 1, es_gratis: false });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/courses/${id}`);
      setCourse(data.course);
      setModules(data.modules || []);
      if (data.modules && data.modules.length > 0 && !activeModuleId) {
        setActiveModuleId(data.modules[0].id);
      }
    } catch (e) {
      console.error(e);
      toast.error('Error al cargar la información del curso');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // MODULE CRUD Operations
  const handleSaveModule = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modifyingModule === 'new') {
        const nextOrder = modules.length > 0 ? Math.max(...modules.map(m => m.orden || 0)) + 1 : 1;
        await api.post('/modules', {
          curso_id: parseInt(id),
          titulo: moduleForm.titulo,
          descripcion: moduleForm.descripcion,
          orden: nextOrder
        });
        toast.success('Módulo creado exitosamente');
      } else {
        await api.put(`/modules/${modifyingModule.id}`, {
          titulo: moduleForm.titulo,
          descripcion: moduleForm.descripcion,
          orden: modifyingModule.orden
        });
        toast.success('Módulo actualizado exitosamente');
      }
      setModifyingModule(null);
      fetchData();
    } catch (error) {
      toast.error('Error al guardar el módulo');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!confirm('¿Estás seguro de eliminar este módulo? Se eliminarán todas las lecciones dentro del mismo.')) return;
    try {
      await api.delete(`/modules/${moduleId}`);
      toast.success('Módulo eliminado');
      if (activeModuleId === moduleId) {
        setActiveModuleId(null);
      }
      fetchData();
    } catch (e) {
      toast.error('Error al eliminar el módulo');
    }
  };

  const handleMoveModule = async (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === modules.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const current = modules[index];
    const target = modules[targetIndex];

    try {
      // Swap order value
      const tempOrder = current.orden;
      await api.put(`/modules/${current.id}`, { orden: target.orden });
      await api.put(`/modules/${target.id}`, { orden: tempOrder });
      
      toast.success('Orden actualizado');
      fetchData();
    } catch (e) {
      toast.error('Error al cambiar el orden');
    }
  };

  // LESSON CRUD Operations
  const handleSaveLesson = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modifyingLesson.mode === 'new') {
        const parentModule = modules.find(m => m.id === modifyingLesson.module_id);
        const lecciones = parentModule?.lecciones || [];
        const nextOrder = lecciones.length > 0 ? Math.max(...lecciones.map(l => l.orden || 0)) + 1 : 1;

        await api.post('/lessons', {
          modulo_id: modifyingLesson.module_id,
          titulo: lessonForm.titulo,
          descripcion: lessonForm.descripcion,
          duracion_minutos: parseInt(lessonForm.duracion_minutos || 0),
          orden: nextOrder,
          es_gratis: lessonForm.es_gratis
        });
        toast.success('Lección creada exitosamente');
      } else {
        await api.put(`/lessons/${modifyingLesson.lesson.id}`, {
          titulo: lessonForm.titulo,
          descripcion: lessonForm.descripcion,
          duracion_minutos: parseInt(lessonForm.duracion_minutos || 0),
          orden: modifyingLesson.lesson.orden,
          es_gratis: lessonForm.es_gratis
        });
        toast.success('Lección actualizada exitosamente');
      }
      setModifyingLesson(null);
      fetchData();
    } catch (error) {
      toast.error('Error al guardar la lección');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!confirm('¿Estás seguro de eliminar esta lección?')) return;
    try {
      await api.delete(`/lessons/${lessonId}`);
      toast.success('Lección eliminada');
      fetchData();
    } catch (e) {
      toast.error('Error al eliminar la lección');
    }
  };

  const handleMoveLesson = async (moduleId, lessonIndex, direction) => {
    const parentModule = modules.find(m => m.id === moduleId);
    if (!parentModule) return;
    const lecciones = parentModule.lecciones || [];

    if (direction === 'up' && lessonIndex === 0) return;
    if (direction === 'down' && lessonIndex === lecciones.length - 1) return;

    const targetIndex = direction === 'up' ? lessonIndex - 1 : lessonIndex + 1;
    const current = lecciones[lessonIndex];
    const target = lecciones[targetIndex];

    try {
      const tempOrder = current.orden;
      await api.put(`/lessons/${current.id}`, { orden: target.orden });
      await api.put(`/lessons/${target.id}`, { orden: tempOrder });

      toast.success('Orden de lecciones actualizado');
      fetchData();
    } catch (e) {
      toast.error('Error al reordenar lecciones');
    }
  };

  if (loading && !course) {
    return (
      <div className="page flex justify-center items-center">
        <div className="skeleton" style={{ width: 60, height: 60, borderRadius: '50%' }} />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        {/* Header navigation */}
        <div className="mb-6">
          <Link to="/instructor/cursos" className="flex items-center gap-1 text-sm text-muted hover:text-primary">
            <ChevronLeft size={16} /> Volver a mis cursos
          </Link>
        </div>

        {/* Course Info Banner */}
        <div className="card-glass mb-8" style={{ padding: 'var(--space-6)', border: '1px solid rgba(78,205,196,0.15)' }}>
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className="badge badge-blue mb-2" style={{ display: 'inline-block' }}>
                {course?.categoria_nombre}
              </span>
              <h1 className="page-title mb-2" style={{ fontSize: 'var(--text-2xl)' }}>
                {course?.nombre}
              </h1>
              <p className="text-muted text-sm max-w-2xl">{course?.descripcion}</p>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="text-xs text-muted">ESTADO</span>
              <span className="badge badge-green font-semibold mt-1">{course?.estado}</span>
            </div>
          </div>
        </div>

        {/* Content management columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
          
          {/* Sidebar: Modules List */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <BookOpen size={16} /> Módulos ({modules.length})
              </h3>
              <button 
                className="btn btn-primary btn-sm flex items-center gap-1"
                onClick={() => {
                  setModifyingModule('new');
                  setModuleForm({ titulo: '', descripcion: '', orden: 1 });
                }}
              >
                <Plus size={14} /> Módulo
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {modules.map((mod, index) => (
                <div 
                  key={mod.id} 
                  className={`card flex justify-between items-center ${activeModuleId === mod.id ? 'border-primary' : ''}`}
                  style={{ 
                    padding: 'var(--space-3) var(--space-4)', 
                    cursor: 'pointer',
                    background: activeModuleId === mod.id ? 'rgba(78,205,196,0.05)' : 'var(--bg-card)'
                  }}
                  onClick={() => setActiveModuleId(mod.id)}
                >
                  <div style={{ flex: 1, minWidth: 0, paddingRight: '10px' }}>
                    <div className="font-semibold text-sm truncate">{mod.titulo}</div>
                    <div className="text-xs text-muted mt-1 flex items-center gap-2">
                      <span>{mod.lecciones?.length || 0} lecciones</span>
                    </div>
                  </div>
                  
                  {/* Actions & Reordering */}
                  <div className="flex gap-1 items-center" onClick={e => e.stopPropagation()}>
                    <button 
                      className="btn-icon btn-xs" 
                      title="Subir"
                      disabled={index === 0}
                      onClick={() => handleMoveModule(index, 'up')}
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button 
                      className="btn-icon btn-xs" 
                      title="Bajar"
                      disabled={index === modules.length - 1}
                      onClick={() => handleMoveModule(index, 'down')}
                    >
                      <ArrowDown size={12} />
                    </button>
                    <button 
                      className="btn-icon btn-xs text-primary" 
                      title="Editar"
                      onClick={() => {
                        setModifyingModule(mod);
                        setModuleForm({ titulo: mod.titulo, descripcion: mod.descripcion || '', orden: mod.orden });
                      }}
                    >
                      <Edit2 size={12} />
                    </button>
                    <button 
                      className="btn-icon btn-xs" 
                      title="Eliminar"
                      style={{ color: 'var(--accent-red)' }}
                      onClick={() => handleDeleteModule(mod.id)}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Panel: Lessons inside the active module */}
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            {activeModuleId ? (
              (() => {
                const currentModule = modules.find(m => m.id === activeModuleId);
                const lecciones = currentModule?.lecciones || [];

                return (
                  <div>
                    <div className="flex justify-between items-start border-bottom pb-4 mb-6">
                      <div>
                        <span className="text-xs text-muted uppercase font-semibold">MÓDULO SELECCIONADO</span>
                        <h2 className="font-bold text-lg mt-1">{currentModule?.titulo}</h2>
                        <p className="text-muted text-sm mt-1">{currentModule?.descripcion || 'Sin descripción para este módulo.'}</p>
                      </div>
                      <button 
                        className="btn btn-primary"
                        onClick={() => {
                          setModifyingLesson({ mode: 'new', module_id: activeModuleId });
                          setLessonForm({ titulo: '', descripcion: '', duracion_minutos: 15, orden: 1, es_gratis: false });
                        }}
                      >
                        <Plus size={16} /> Agregar Lección
                      </button>
                    </div>

                    {lecciones.length === 0 ? (
                      <div className="text-center py-10" style={{ border: '2px dashed rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)' }}>
                        <Play size={32} className="text-muted mb-3" style={{ margin: '0 auto' }} />
                        <h4 className="font-semibold text-sm">Este módulo no tiene lecciones</h4>
                        <p className="text-muted text-xs mt-1">Comienza agregando contenidos dinámicos, PDFs, o videos.</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {lecciones.map((lesson, lessonIndex) => (
                          <div 
                            key={lesson.id}
                            className="card flex justify-between items-center"
                            style={{ padding: 'var(--space-3) var(--space-4)', background: 'rgba(255,255,255,0.015)' }}
                          >
                            <div className="flex items-center gap-3" style={{ flex: 1, minWidth: 0 }}>
                              <div className="flex justify-center items-center" style={{ width: '32px', height: '32px', background: 'rgba(78,205,196,0.1)', borderRadius: '50%' }}>
                                <Play size={14} className="text-primary" />
                              </div>
                              <div style={{ flex: 1, minWidth: 0, paddingRight: '15px' }}>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-sm truncate m-0">{lesson.titulo}</h4>
                                  {lesson.es_gratis && <span className="badge badge-green text-xs font-semibold" style={{ padding: '2px 6px' }}>Gratis (Preview)</span>}
                                </div>
                                <p className="text-xs text-muted truncate mt-0.5">{lesson.descripcion || 'Sin descripción'}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <span className="text-xs text-muted flex items-center gap-1">
                                <Clock size={12} /> {lesson.duracion_minutos} min
                              </span>
                              
                              <div className="flex items-center gap-1">
                                <button 
                                  className="btn-icon btn-xs"
                                  title="Subir lección"
                                  disabled={lessonIndex === 0}
                                  onClick={() => handleMoveLesson(activeModuleId, lessonIndex, 'up')}
                                >
                                  <ArrowUp size={12} />
                                </button>
                                <button 
                                  className="btn-icon btn-xs"
                                  title="Bajar lección"
                                  disabled={lessonIndex === lecciones.length - 1}
                                  onClick={() => handleMoveLesson(activeModuleId, lessonIndex, 'down')}
                                >
                                  <ArrowDown size={12} />
                                </button>
                                <button 
                                  className="btn-icon btn-xs text-primary"
                                  title="Editar lección"
                                  onClick={() => {
                                    setModifyingLesson({ mode: 'edit', module_id: activeModuleId, lesson });
                                    setLessonForm({
                                      titulo: lesson.titulo,
                                      descripcion: lesson.descripcion || '',
                                      duracion_minutos: lesson.duracion_minutos || 15,
                                      orden: lesson.orden,
                                      es_gratis: lesson.es_gratis || false
                                    });
                                  }}
                                >
                                  <Edit2 size={12} />
                                </button>
                                <button 
                                  className="btn-icon btn-xs"
                                  title="Eliminar lección"
                                  style={{ color: 'var(--accent-red)' }}
                                  onClick={() => handleDeleteLesson(lesson.id)}
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()
            ) : (
              <div className="text-center py-12">
                <BookOpen size={48} className="text-muted mb-4" style={{ margin: '0 auto' }} />
                <h3>Selecciona o crea un módulo</h3>
                <p className="text-muted text-sm max-w-sm m-auto mt-2">
                  Los módulos organizan tu curso en capítulos o secciones, permitiendo añadir lecciones y contenido ordenado.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Module CREATE / EDIT */}
      {modifyingModule && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, padding: '20px'
        }} className="animate-fade-in">
          <div className="card-glass animate-scale" style={{ width: '100%', maxWidth: 500, padding: 'var(--space-6)' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0 }}>
                {modifyingModule === 'new' ? 'Crear Módulo' : 'Editar Módulo'}
              </h3>
              <button className="btn-icon" onClick={() => setModifyingModule(null)}><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveModule}>
              <div className="form-group">
                <label className="form-label">Título del Módulo</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={moduleForm.titulo} 
                  onChange={(e) => setModuleForm({ ...moduleForm, titulo: e.target.value })} 
                  placeholder="Ej: Introducción al desarrollo de React"
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea 
                  className="form-input" 
                  value={moduleForm.descripcion} 
                  onChange={(e) => setModuleForm({ ...moduleForm, descripcion: e.target.value })} 
                  placeholder="Breve explicación de los temas de este módulo..."
                  rows={4}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" className="btn btn-outline w-full" onClick={() => setModifyingModule(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary w-full" disabled={saving}>
                  <Save size={16} /> {saving ? 'Guardando...' : 'Guardar Módulo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Lesson CREATE / EDIT */}
      {modifyingLesson && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, padding: '20px'
        }} className="animate-fade-in">
          <div className="card-glass animate-scale" style={{ width: '100%', maxWidth: 500, padding: 'var(--space-6)' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0 }}>
                {modifyingLesson.mode === 'new' ? 'Crear Lección' : 'Editar Lección'}
              </h3>
              <button className="btn-icon" onClick={() => setModifyingLesson(null)}><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveLesson}>
              <div className="form-group">
                <label className="form-label">Título de la Lección</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={lessonForm.titulo} 
                  onChange={(e) => setLessonForm({ ...lessonForm, titulo: e.target.value })} 
                  placeholder="Ej: ¿Qué es JSX?"
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea 
                  className="form-input" 
                  value={lessonForm.descripcion} 
                  onChange={(e) => setLessonForm({ ...lessonForm, descripcion: e.target.value })} 
                  placeholder="Detalles de la lección..."
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="grid grid-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Duración (Minutos)</label>
                  <input 
                    type="number" 
                    min="1"
                    className="form-input" 
                    value={lessonForm.duracion_minutes || lessonForm.duracion_minutos} 
                    onChange={(e) => setLessonForm({ ...lessonForm, duracion_minutos: e.target.value })} 
                    placeholder="Duración estimada"
                    required 
                  />
                </div>
                
                <div className="form-group flex items-center" style={{ marginTop: '24px' }}>
                  <label className="flex items-center gap-2 text-sm" style={{ cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={lessonForm.es_gratis} 
                      onChange={(e) => setLessonForm({ ...lessonForm, es_gratis: e.target.checked })} 
                    />
                    <span>¿Es una lección gratuita? (Preview)</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" className="btn btn-outline w-full" onClick={() => setModifyingLesson(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary w-full" disabled={saving}>
                  <Save size={16} /> {saving ? 'Guardando...' : 'Guardar Lección'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import { 
  ChevronLeft, Plus, Edit2, Trash2, ArrowUp, ArrowDown, 
  Play, BookOpen, Clock, Save, X, Upload, File, FileText, 
  Image, Video, Download, Paperclip
} from 'lucide-react';

export default function CourseContentPage() {
  const { id } = useParams();
  const toast = useToast();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [expandedLessonId, setExpandedLessonId] = useState(null);
  const [lessonResources, setLessonResources] = useState({});

  // Modales
  const [modifyingModule, setModifyingModule] = useState(null);
  const [modifyingLesson, setModifyingLesson] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [moduleForm, setModuleForm] = useState({ titulo: '', descripcion: '', orden: 1 });
  const [lessonForm, setLessonForm] = useState({ titulo: '', descripcion: '', contenido: '', duracion_minutos: 15, orden: 1, es_gratis: false });

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

  useEffect(() => { fetchData(); }, [id]);

  // Fetch resources for a lesson
  const fetchResources = async (lessonId) => {
    try {
      const { data } = await api.get(`/media/lesson/${lessonId}`);
      setLessonResources(prev => ({ ...prev, [lessonId]: data.data || [] }));
    } catch (e) {
      console.error('Error al cargar recursos:', e);
    }
  };

  const toggleLesson = (lessonId) => {
    if (expandedLessonId === lessonId) {
      setExpandedLessonId(null);
    } else {
      setExpandedLessonId(lessonId);
      if (!lessonResources[lessonId]) {
        fetchResources(lessonId);
      }
    }
  };

  // Upload resource
  const handleUploadResource = async (lessonId, file, tipo) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resource', file);
      formData.append('leccion_id', lessonId);
      formData.append('tipo', tipo);
      formData.append('titulo', file.name);
      formData.append('orden', (lessonResources[lessonId]?.length || 0) + 1);
      
      await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Recurso subido exitosamente');
      fetchResources(lessonId);
    } catch (e) {
      toast.error(e.response?.data?.error || 'Error al subir el recurso');
    } finally {
      setUploading(false);
    }
  };

  // Delete resource
  const handleDeleteResource = async (resourceId, lessonId) => {
    if (!confirm('¿Eliminar este recurso?')) return;
    try {
      await api.delete(`/media/${resourceId}`);
      toast.success('Recurso eliminado');
      fetchResources(lessonId);
    } catch (e) { toast.error('Error al eliminar'); }
  };

  const [linkModal, setLinkModal] = useState(null); // { lessonId }
  const [linkForm, setLinkForm] = useState({ titulo: '', url: '', tipo: 'enlace' });

  const handleAddLinkResource = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      await api.post('/media/upload', {
        leccion_id: linkModal.lessonId,
        tipo: linkForm.tipo,
        titulo: linkForm.titulo,
        url: linkForm.url,
        orden: (lessonResources[linkModal.lessonId]?.length || 0) + 1
      });
      toast.success('Enlace añadido exitosamente');
      fetchResources(linkModal.lessonId);
      setLinkModal(null);
      setLinkForm({ titulo: '', url: '', tipo: 'enlace' });
    } catch (e) {
      toast.error(e.response?.data?.error || 'Error al añadir el enlace');
    } finally {
      setUploading(false);
    }
  };

  // Detect file type
  const detectTipo = (file) => {
    const mime = file.type;
    if (mime.startsWith('video/')) return 'video';
    if (mime === 'application/pdf') return 'pdf';
    if (mime.startsWith('image/')) return 'imagen';
    return 'recurso';
  };

  // Resource type icon
  const resourceIcon = (tipo) => {
    switch (tipo) {
      case 'video': return <Video size={14} style={{ color: '#E74C3C' }} />;
      case 'pdf': return <FileText size={14} style={{ color: '#E67E22' }} />;
      case 'imagen': return <Image size={14} style={{ color: '#2ECC71' }} />;
      default: return <File size={14} style={{ color: '#3498DB' }} />;
    }
  };

  const resourceLabel = (tipo) => {
    switch (tipo) {
      case 'video': return 'Video';
      case 'pdf': return 'PDF';
      case 'imagen': return 'Imagen';
      default: return 'Recurso';
    }
  };

  // MODULE CRUD
  const handleSaveModule = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modifyingModule === 'new') {
        const nextOrder = modules.length > 0 ? Math.max(...modules.map(m => m.orden || 0)) + 1 : 1;
        await api.post('/modules', { curso_id: parseInt(id), titulo: moduleForm.titulo, descripcion: moduleForm.descripcion, orden: nextOrder });
        toast.success('Módulo creado exitosamente');
      } else {
        await api.put(`/modules/${modifyingModule.id}`, { titulo: moduleForm.titulo, descripcion: moduleForm.descripcion, orden: modifyingModule.orden });
        toast.success('Módulo actualizado exitosamente');
      }
      setModifyingModule(null);
      fetchData();
    } catch (error) { toast.error('Error al guardar el módulo'); } finally { setSaving(false); }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!confirm('¿Eliminar este módulo y todas sus lecciones?')) return;
    try {
      await api.delete(`/modules/${moduleId}`);
      toast.success('Módulo eliminado');
      if (activeModuleId === moduleId) setActiveModuleId(null);
      fetchData();
    } catch (e) { toast.error('Error al eliminar el módulo'); }
  };

  const handleMoveModule = async (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === modules.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const current = modules[index];
    const target = modules[targetIndex];
    try {
      await api.put(`/modules/${current.id}`, { orden: target.orden });
      await api.put(`/modules/${target.id}`, { orden: current.orden });
      fetchData();
    } catch (e) { toast.error('Error al reordenar'); }
  };

  // LESSON CRUD
  const handleSaveLesson = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modifyingLesson.mode === 'new') {
        const parentModule = modules.find(m => m.id === modifyingLesson.module_id);
        const lecciones = parentModule?.lecciones || [];
        const nextOrder = lecciones.length > 0 ? Math.max(...lecciones.map(l => l.orden || 0)) + 1 : 1;
        await api.post('/lessons', { modulo_id: modifyingLesson.module_id, titulo: lessonForm.titulo, descripcion: lessonForm.descripcion, contenido: lessonForm.contenido, duracion_minutos: parseInt(lessonForm.duracion_minutos || 0), orden: nextOrder, es_gratis: lessonForm.es_gratis });
        toast.success('Lección creada exitosamente');
      } else {
        await api.put(`/lessons/${modifyingLesson.lesson.id}`, { titulo: lessonForm.titulo, descripcion: lessonForm.descripcion, contenido: lessonForm.contenido, duracion_minutos: parseInt(lessonForm.duracion_minutos || 0), orden: modifyingLesson.lesson.orden, es_gratis: lessonForm.es_gratis });
        toast.success('Lección actualizada exitosamente');
      }
      setModifyingLesson(null);
      fetchData();
    } catch (error) { toast.error('Error al guardar la lección'); } finally { setSaving(false); }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!confirm('¿Eliminar esta lección y sus recursos?')) return;
    try {
      await api.delete(`/lessons/${lessonId}`);
      toast.success('Lección eliminada');
      if (expandedLessonId === lessonId) setExpandedLessonId(null);
      fetchData();
    } catch (e) { toast.error('Error al eliminar la lección'); }
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
      await api.put(`/lessons/${current.id}`, { orden: target.orden });
      await api.put(`/lessons/${target.id}`, { orden: current.orden });
      fetchData();
    } catch (e) { toast.error('Error al reordenar'); }
  };

  if (loading && !course) {
    return <div className="page flex justify-center items-center"><div className="skeleton" style={{ width: 60, height: 60, borderRadius: '50%' }} /></div>;
  }

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="mb-6">
          <Link to="/instructor/cursos" className="flex items-center gap-1 text-sm text-muted hover:text-primary">
            <ChevronLeft size={16} /> Volver a mis cursos
          </Link>
        </div>

        {/* Course Info */}
        <div className="card-glass mb-8" style={{ padding: 'var(--space-6)', border: '1px solid rgba(78,205,196,0.15)' }}>
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className="badge badge-blue mb-2" style={{ display: 'inline-block' }}>{course?.categoria_nombre}</span>
              <h1 className="page-title mb-2" style={{ fontSize: 'var(--text-2xl)' }}>{course?.nombre}</h1>
              <p className="text-muted text-sm max-w-2xl">{course?.descripcion}</p>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="text-xs text-muted">ESTADO</span>
              <span className="badge badge-green font-semibold mt-1">{course?.estado}</span>
            </div>
          </div>
        </div>

        {/* Two columns */}
        <div className="course-content-grid" style={{ display: 'grid', gap: 'var(--space-6)', alignItems: 'start' }}>
          
          {/* Sidebar: Modules */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-base flex items-center gap-2"><BookOpen size={16} /> Módulos ({modules.length})</h3>
              <button className="btn btn-primary btn-sm flex items-center gap-1" onClick={() => { setModifyingModule('new'); setModuleForm({ titulo: '', descripcion: '', orden: 1 }); }}>
                <Plus size={14} /> Módulo
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {modules.map((mod, index) => (
                <div key={mod.id} className={`card flex justify-between items-center`}
                  style={{ padding: 'var(--space-3) var(--space-4)', cursor: 'pointer', background: activeModuleId === mod.id ? 'rgba(78,205,196,0.05)' : 'var(--bg-card)', borderLeft: activeModuleId === mod.id ? '3px solid var(--accent-teal)' : '3px solid transparent' }}
                  onClick={() => setActiveModuleId(mod.id)}>
                  <div style={{ flex: 1, minWidth: 0, paddingRight: '10px' }}>
                    <div className="font-semibold text-sm truncate">{mod.titulo}</div>
                    <div className="text-xs text-muted mt-1">{mod.lecciones?.length || 0} lecciones</div>
                  </div>
                  <div className="flex gap-1 items-center" onClick={e => e.stopPropagation()}>
                    <button className="btn-icon btn-xs" disabled={index === 0} onClick={() => handleMoveModule(index, 'up')}><ArrowUp size={12} /></button>
                    <button className="btn-icon btn-xs" disabled={index === modules.length - 1} onClick={() => handleMoveModule(index, 'down')}><ArrowDown size={12} /></button>
                    <button className="btn-icon btn-xs text-primary" onClick={() => { setModifyingModule(mod); setModuleForm({ titulo: mod.titulo, descripcion: mod.descripcion || '', orden: mod.orden }); }}><Edit2 size={12} /></button>
                    <button className="btn-icon btn-xs" style={{ color: 'var(--accent-red)' }} onClick={() => handleDeleteModule(mod.id)}><Trash2 size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Panel: Lessons */}
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            {activeModuleId ? (() => {
              const currentModule = modules.find(m => m.id === activeModuleId);
              const lecciones = currentModule?.lecciones || [];

              return (
                <div>
                  <div className="flex justify-between items-start mb-6" style={{ paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div>
                      <span className="text-xs text-muted uppercase font-semibold">MÓDULO SELECCIONADO</span>
                      <h2 className="font-bold text-lg mt-1">{currentModule?.titulo}</h2>
                      <p className="text-muted text-sm mt-1">{currentModule?.descripcion || 'Sin descripción.'}</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => { setModifyingLesson({ mode: 'new', module_id: activeModuleId }); setLessonForm({ titulo: '', descripcion: '', duracion_minutos: 15, orden: 1, es_gratis: false }); }}>
                      <Plus size={16} /> Agregar Lección
                    </button>
                  </div>

                  {lecciones.length === 0 ? (
                    <div className="text-center py-10" style={{ border: '2px dashed rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)' }}>
                      <Play size={32} className="text-muted mb-3" style={{ margin: '0 auto' }} />
                      <h4 className="font-semibold text-sm">Este módulo no tiene lecciones</h4>
                      <p className="text-muted text-xs mt-1">Agrega lecciones con videos, PDFs y material de estudio.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {lecciones.map((lesson, lessonIndex) => (
                        <div key={lesson.id}>
                          {/* Lesson Header */}
                          <div className="card" style={{ padding: 'var(--space-3) var(--space-4)', background: expandedLessonId === lesson.id ? 'rgba(78,205,196,0.04)' : 'rgba(255,255,255,0.015)', borderLeft: expandedLessonId === lesson.id ? '3px solid var(--accent-teal)' : '3px solid transparent' }}>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3" style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => toggleLesson(lesson.id)}>
                                <div className="flex justify-center items-center" style={{ width: '32px', height: '32px', background: 'rgba(78,205,196,0.1)', borderRadius: '50%', flexShrink: 0 }}>
                                  <Play size={14} className="text-primary" />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-semibold text-sm truncate m-0">{lesson.titulo}</h4>
                                    {lesson.es_gratis && <span className="badge badge-green text-xs" style={{ padding: '2px 6px' }}>Gratis</span>}
                                  </div>
                                  <p className="text-xs text-muted truncate mt-0.5">{lesson.descripcion || 'Sin descripción'}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="text-xs text-muted flex items-center gap-1"><Clock size={12} /> {lesson.duracion_minutos} min</span>
                                <span className="text-xs text-muted flex items-center gap-1"><Paperclip size={12} /> {lessonResources[lesson.id]?.length || '...'}</span>
                                <div className="flex items-center gap-1">
                                  <button className="btn-icon btn-xs" disabled={lessonIndex === 0} onClick={() => handleMoveLesson(activeModuleId, lessonIndex, 'up')}><ArrowUp size={12} /></button>
                                  <button className="btn-icon btn-xs" disabled={lessonIndex === lecciones.length - 1} onClick={() => handleMoveLesson(activeModuleId, lessonIndex, 'down')}><ArrowDown size={12} /></button>
                                  <button className="btn-icon btn-xs text-primary" onClick={() => { setModifyingLesson({ mode: 'edit', module_id: activeModuleId, lesson }); setLessonForm({ titulo: lesson.titulo, descripcion: lesson.descripcion || '', contenido: lesson.contenido || '', duracion_minutos: lesson.duracion_minutos || 15, orden: lesson.orden, es_gratis: lesson.es_gratis || false }); }}><Edit2 size={12} /></button>
                                  <button className="btn-icon btn-xs" style={{ color: 'var(--accent-red)' }} onClick={() => handleDeleteLesson(lesson.id)}><Trash2 size={12} /></button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Expanded: Resources Panel */}
                          {expandedLessonId === lesson.id && (
                            <div className="animate-fade-in" style={{ marginLeft: '16px', marginTop: '8px', padding: 'var(--space-4)', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                              <div className="flex justify-between items-center mb-3">
                                <h5 className="font-semibold text-sm flex items-center gap-2 m-0">
                                  <Paperclip size={14} /> Recursos de la Lección ({lessonResources[lesson.id]?.length || 0})
                                </h5>
                                <div className="flex gap-2">
                                  <label className="btn btn-outline btn-sm m-0 flex items-center gap-2 cursor-pointer" style={{ borderRadius: 'var(--radius-full)' }}>
                                    <Upload size={14} /> Subir Archivo
                                    <input
                                      type="file"
                                      style={{ display: 'none' }}
                                      accept="video/*,application/pdf,image/*,.ppt,.pptx,.zip,.rar"
                                      onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) { handleUploadResource(lesson.id, file, detectTipo(file)); }
                                        e.target.value = '';
                                      }}
                                    />
                                  </label>
                                  <button onClick={() => setLinkModal({ lessonId: lesson.id })} className="btn btn-outline btn-sm m-0 flex items-center gap-2" style={{ borderRadius: 'var(--radius-full)' }}>
                                    <Plus size={14} /> Añadir Enlace
                                  </button>
                                </div>
                              </div>

                              <div className="text-xs text-muted mb-3" style={{ padding: '6px 10px', background: 'rgba(78,205,196,0.05)', borderRadius: 'var(--radius-sm)' }}>
                                Formatos aceptados: Video (MP4, WebM), PDF, Imagen (JPG, PNG), Diapositivas (PPT), ZIP/RAR
                              </div>

                              {(!lessonResources[lesson.id] || lessonResources[lesson.id].length === 0) ? (
                                <div className="text-center text-muted text-xs py-4" style={{ border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 'var(--radius-md)' }}>
                                  No hay recursos adjuntos. Sube videos, PDFs o diapositivas.
                                </div>
                              ) : (
                                <div className="flex flex-col gap-2">
                                  {lessonResources[lesson.id].map(resource => (
                                    <div key={resource.id} className="flex justify-between items-center" style={{ padding: '8px 12px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)' }}>
                                      <div className="flex items-center gap-3" style={{ flex: 1, minWidth: 0 }}>
                                        {resourceIcon(resource.tipo)}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                          <span className="text-sm font-semibold truncate" style={{ display: 'block' }}>{resource.titulo}</span>
                                          <span className="text-xs text-muted">{resourceLabel(resource.tipo)} • {resource.tamano_mb || '?'} MB</span>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <a href={resource.url_archivo} target="_blank" rel="noreferrer" className="btn-icon btn-xs text-primary" title="Descargar">
                                          <Download size={14} />
                                        </a>
                                        <button className="btn-icon btn-xs" style={{ color: 'var(--accent-red)' }} title="Eliminar" onClick={() => handleDeleteResource(resource.id, lesson.id)}>
                                          <Trash2 size={14} />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })() : (
              <div className="text-center py-12">
                <BookOpen size={48} className="text-muted mb-4" style={{ margin: '0 auto' }} />
                <h3>Selecciona o crea un módulo</h3>
                <p className="text-muted text-sm max-w-sm m-auto mt-2">Los módulos organizan tu curso en secciones, permitiendo añadir lecciones y contenido.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Module */}
      {modifyingModule && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} className="animate-fade-in">
          <div className="card-glass animate-scale" style={{ width: '100%', maxWidth: 500, padding: 'var(--space-6)' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0 }}>{modifyingModule === 'new' ? 'Crear Módulo' : 'Editar Módulo'}</h3>
              <button className="btn-icon" onClick={() => setModifyingModule(null)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveModule}>
              <div className="form-group">
                <label className="form-label">Título del Módulo</label>
                <input type="text" className="form-input" value={moduleForm.titulo} onChange={(e) => setModuleForm({ ...moduleForm, titulo: e.target.value })} placeholder="Ej: Introducción al desarrollo de React" required />
              </div>
              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea className="form-input" value={moduleForm.descripcion} onChange={(e) => setModuleForm({ ...moduleForm, descripcion: e.target.value })} placeholder="Breve explicación de los temas..." rows={4} style={{ resize: 'vertical' }} />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" className="btn btn-outline w-full" onClick={() => setModifyingModule(null)}>Cancelar</button>
                <button type="submit" className="btn btn-primary w-full" disabled={saving}><Save size={16} /> {saving ? 'Guardando...' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Lesson */}
      {modifyingLesson && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} className="animate-fade-in">
          <div className="card-glass animate-scale" style={{ width: '100%', maxWidth: 800, padding: 'var(--space-6)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0 }}>{modifyingLesson.mode === 'new' ? 'Crear Lección' : 'Editar Lección'}</h3>
              <button className="btn-icon" onClick={() => setModifyingLesson(null)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveLesson}>
              <div className="form-group">
                <label className="form-label">Título de la Lección</label>
                <input type="text" className="form-input" value={lessonForm.titulo} onChange={(e) => setLessonForm({ ...lessonForm, titulo: e.target.value })} placeholder="Ej: ¿Qué es JSX?" required />
              </div>
              <div className="form-group">
                <label className="form-label">Descripción Breve</label>
                <textarea className="form-input" value={lessonForm.descripcion} onChange={(e) => setLessonForm({ ...lessonForm, descripcion: e.target.value })} placeholder="Detalles de la lección..." rows={2} style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group">
                <label className="form-label flex justify-between items-center">
                  <span>Contenido de la Lección (Soporta Markdown)</span>
                  <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">Ver Guía Markdown</a>
                </label>
                <textarea className="form-input" value={lessonForm.contenido} onChange={(e) => setLessonForm({ ...lessonForm, contenido: e.target.value })} placeholder="## Introducción&#10;Escribe aquí el texto de tu lección usando Markdown..." rows={12} style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: '0.9rem' }} required />
              </div>
              <div className="grid grid-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Duración (Minutos)</label>
                  <input type="number" min="1" className="form-input" value={lessonForm.duracion_minutos} onChange={(e) => setLessonForm({ ...lessonForm, duracion_minutos: e.target.value })} required />
                </div>
                <div className="form-group flex items-center" style={{ marginTop: '24px' }}>
                  <label className="flex items-center gap-2 text-sm" style={{ cursor: 'pointer' }}>
                    <input type="checkbox" checked={lessonForm.es_gratis} onChange={(e) => setLessonForm({ ...lessonForm, es_gratis: e.target.checked })} />
                    <span>¿Lección gratuita? (Preview)</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" className="btn btn-outline w-full" onClick={() => setModifyingLesson(null)}>Cancelar</button>
                <button type="submit" className="btn btn-primary w-full" disabled={saving}><Save size={16} /> {saving ? 'Guardando...' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Link */}
      {linkModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} className="animate-fade-in">
          <div className="card-glass animate-scale" style={{ width: '100%', maxWidth: 500, padding: 'var(--space-6)' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0 }}>Añadir Enlace Externo</h3>
              <button className="btn-icon" onClick={() => setLinkModal(null)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddLinkResource}>
              <div className="form-group">
                <label className="form-label">Título del Recurso</label>
                <input type="text" className="form-input" value={linkForm.titulo} onChange={(e) => setLinkForm({ ...linkForm, titulo: e.target.value })} placeholder="Ej: Diapositivas de la clase" required />
              </div>
              <div className="form-group">
                <label className="form-label">Enlace / URL</label>
                <input type="url" className="form-input" value={linkForm.url} onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })} placeholder="https://youtube.com/... o https://drive.google.com/..." required />
              </div>
              <div className="form-group">
                <label className="form-label">Tipo de Recurso</label>
                <select className="form-input" value={linkForm.tipo} onChange={(e) => setLinkForm({ ...linkForm, tipo: e.target.value })}>
                  <option value="video">Video (YouTube/Vimeo)</option>
                  <option value="pdf">Documento PDF (Drive)</option>
                  <option value="enlace">Enlace Web General</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" className="btn btn-outline w-full" onClick={() => setLinkModal(null)}>Cancelar</button>
                <button type="submit" className="btn btn-primary w-full" disabled={uploading}><Save size={16} /> {uploading ? 'Añadiendo...' : 'Añadir Enlace'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

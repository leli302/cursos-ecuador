import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import { 
  Plus, Edit, Trash2, BookOpen, GraduationCap, Star, Settings, Save, X, 
  Upload, Image as ImageIcon, Eye, DollarSign, Clock, Tag, Layers, Calendar, CheckCircle2, ShieldCheck, Crown
} from 'lucide-react';

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [activeTab, setActiveTab] = useState('general');
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria_id: '',
    precio: '',
    precio_premium: '',
    nivel: 'todos',
    duracion_horas: '',
    estado: 'disponible',
    cupo_maximo: 100,
    fecha_disponible: '',
    es_premium: false
  });

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/courses/my-courses');
      setCourses(data.data);
    } catch (e) {
      console.error(e);
      toast.error('Error al cargar tus cursos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    api.get('/categories')
      .then(({ data }) => setCategories(data.data || data))
      .catch(e => console.error(e));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const openModal = (course = 'new') => {
    setEditingCourse(course);
    setActiveTab('general');
    setImageFile(null);

    if (course === 'new') {
      setForm({
        codigo: 'CUR-' + Math.floor(1000 + Math.random() * 9000),
        nombre: '',
        descripcion: '',
        categoria_id: categories[0]?.id || '',
        precio: '0.00',
        precio_premium: '0.00',
        nivel: 'todos',
        duracion_horas: '10',
        estado: 'disponible',
        cupo_maximo: 100,
        fecha_disponible: '',
        es_premium: false
      });
      setImagePreview(null);
    } else {
      setForm({
        codigo: course.codigo || '',
        nombre: course.nombre || '',
        descripcion: course.descripcion || '',
        categoria_id: course.categoria_id || '',
        precio: course.precio !== undefined ? course.precio : '',
        precio_premium: course.precio_premium !== undefined ? course.precio_premium : '',
        nivel: course.nivel || 'todos',
        duracion_horas: course.duracion_horas !== undefined ? course.duracion_horas : '',
        estado: course.estado || 'disponible',
        cupo_maximo: course.cupo_maximo || 100,
        fecha_disponible: course.fecha_disponible ? course.fecha_disponible.substring(0, 10) : '',
        es_premium: course.es_premium || false
      });
      setImagePreview(course.imagen || null);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('codigo', form.codigo);
      formData.append('nombre', form.nombre);
      formData.append('descripcion', form.descripcion || '');
      formData.append('categoria_id', form.categoria_id || '');
      formData.append('precio', form.precio !== '' ? form.precio : '0');
      formData.append('precio_premium', form.precio_premium !== '' ? form.precio_premium : '0');
      formData.append('nivel', form.nivel);
      formData.append('duracion_horas', form.duracion_horas !== '' ? form.duracion_horas : '0');
      formData.append('estado', form.estado);
      formData.append('cupo_maximo', form.cupo_maximo !== '' ? form.cupo_maximo : '100');
      if (form.fecha_disponible) {
        formData.append('fecha_disponible', form.fecha_disponible);
      }
      formData.append('es_premium', form.es_premium);

      if (imageFile) {
        formData.append('course_image', imageFile);
      }

      if (editingCourse === 'new') {
        await api.post('/courses', formData);
        toast.success('¡Curso creado exitosamente!');
      } else {
        await api.put(`/courses/${editingCourse.id}`, formData);
        toast.success('¡Curso actualizado exitosamente!');
      }

      setEditingCourse(null);
      setImageFile(null);
      setImagePreview(null);
      fetchCourses();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || 'Error al guardar el curso');
    } finally {
      setSaving(false);
    }
  };

  const statusColors = { 
    disponible: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10B981', border: 'rgba(16, 185, 129, 0.3)', label: 'Disponible' }, 
    no_disponible: { bg: 'rgba(239, 68, 68, 0.15)', text: '#EF4444', border: 'rgba(239, 68, 68, 0.3)', label: 'Inactivo' }, 
    en_produccion: { bg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B', border: 'rgba(245, 158, 11, 0.3)', label: 'En Producción' }, 
    proximo: { bg: 'rgba(59, 130, 246, 0.15)', text: '#3B82F6', border: 'rgba(59, 130, 246, 0.3)', label: 'Próximamente' }, 
    preventa: { bg: 'rgba(168, 85, 247, 0.15)', text: '#A855F7', border: 'rgba(168, 85, 247, 0.3)', label: 'Preventa' } 
  };

  return (
    <div className="page">
      <div className="container">
        {/* Top Bar / Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8" style={{
          background: 'var(--bg-card)',
          padding: 'var(--space-6)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div style={{
                padding: 8,
                borderRadius: 'var(--radius-md)',
                background: 'rgba(78, 205, 196, 0.15)',
                color: 'var(--accent-teal)'
              }}>
                <GraduationCap size={24} />
              </div>
              <h1 className="page-title" style={{ margin: 0, fontSize: '1.75rem' }}>Panel de Gestión de Cursos</h1>
            </div>
            <p className="text-muted text-sm" style={{ marginLeft: 44 }}>
              Administra portadas, contenidos, aulas y estudiantes de tus cursos asignados.
            </p>
          </div>
          <button className="btn btn-primary flex items-center gap-2" onClick={() => openModal('new')} style={{ padding: '10px 20px' }}>
            <Plus size={18} /> Crear Nuevo Curso
          </button>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="grid grid-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton" style={{ height: 340, borderRadius: 'var(--radius-xl)' }} />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="card text-center" style={{ padding: '60px 20px', border: '1px dashed var(--border-subtle)', borderRadius: 'var(--radius-xl)' }}>
            <GraduationCap size={56} className="text-muted" style={{ margin: '0 auto 16px', opacity: 0.6 }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Aún no tienes cursos creados</h3>
            <p className="text-muted mb-6" style={{ maxWidth: 450, margin: '0 auto 24px' }}>
              Crea tu primer curso con recursos interactivos y empieza a dictar clases a estudiantes en todo el Ecuador.
            </p>
            <button className="btn btn-primary" onClick={() => openModal('new')}>
              <Plus size={16} /> Crear Curso Ahora
            </button>
          </div>
        ) : (
          <div className="grid grid-3 gap-6 stagger-children">
            {courses.map(course => {
              const status = statusColors[course.estado] || statusColors.disponible;
              return (
                <div 
                  key={course.id} 
                  className="card flex flex-col justify-between" 
                  style={{ 
                    padding: 0, 
                    overflow: 'hidden', 
                    borderRadius: 'var(--radius-xl)', 
                    border: '1px solid var(--border-subtle)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                >
                  {/* Card Banner Cover */}
                  <div style={{ position: 'relative', height: 160, background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                    {course.imagen ? (
                      <img 
                        src={course.imagen} 
                        alt={course.nombre} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div style={{ 
                        width: '100%', height: '100%', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.2) 0%, rgba(26, 83, 92, 0.4) 100%)'
                      }}>
                        <ImageIcon size={48} style={{ color: 'var(--accent-teal)', opacity: 0.4 }} />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: status.bg,
                        color: status.text,
                        border: `1px solid ${status.border}`,
                        backdropFilter: 'blur(8px)'
                      }}>
                        {status.label}
                      </span>
                      {course.es_premium && (
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: 'rgba(255, 215, 0, 0.2)',
                          color: '#FFD700',
                          border: '1px solid rgba(255, 215, 0, 0.4)',
                          backdropFilter: 'blur(8px)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}>
                          <Crown size={12} /> Premium
                        </span>
                      )}
                    </div>

                    {/* Code Badge */}
                    <span style={{
                      position: 'absolute', top: 12, right: 12,
                      padding: '4px 8px', borderRadius: 'var(--radius-sm)',
                      background: 'rgba(10, 22, 40, 0.8)', color: 'var(--text-muted)',
                      fontSize: '0.7rem', fontFamily: 'monospace', backdropFilter: 'blur(4px)'
                    }}>
                      {course.codigo}
                    </span>
                  </div>

                  {/* Card Content Body */}
                  <div style={{ padding: 'var(--space-5)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div className="text-xs text-muted mb-1 flex items-center gap-1 font-medium">
                      <Tag size={12} color="var(--accent-teal)" />
                      {course.categoria_nombre || 'General'} · <span className="capitalize">{course.nivel}</span>
                    </div>

                    <h3 className="font-semibold text-base mb-2" style={{ 
                      lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', 
                      overflow: 'hidden', height: '44px', lineHeight: '1.3' 
                    }}>
                      {course.nombre}
                    </h3>
                    
                    <p className="text-xs text-muted mb-4" style={{ 
                      lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', 
                      overflow: 'hidden', height: '36px', lineHeight: '1.4' 
                    }}>
                      {course.descripcion || 'Sin descripción detallada agregada.'}
                    </p>

                    {/* Metrics Grid */}
                    <div className="grid grid-3 gap-2 mb-4 mt-auto" style={{ 
                      background: 'var(--bg-secondary)', 
                      padding: '10px', 
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      <div className="text-center">
                        <div className="text-xs text-muted flex justify-center items-center gap-1 mb-1">
                          <GraduationCap size={12} color="var(--accent-teal)" /> Alumnos
                        </div>
                        <span className="font-bold text-sm">{course.total_estudiantes || 0}</span>
                      </div>
                      <div className="text-center" style={{ borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
                        <div className="text-xs text-muted flex justify-center items-center gap-1 mb-1">
                          <Star size={12} style={{ color: 'var(--accent-gold)' }} /> Rating
                        </div>
                        <span className="font-bold text-sm">
                          {course.promedio_calificacion ? parseFloat(course.promedio_calificacion).toFixed(1) : '0.0'}
                        </span>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted flex justify-center items-center gap-1 mb-1">
                          💰 Precio
                        </div>
                        <span className="font-bold text-sm" style={{ color: 'var(--accent-green)' }}>
                          ${parseFloat(course.precio || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <button 
                        className="btn btn-primary w-full flex items-center justify-center gap-2"
                        onClick={() => navigate(`/instructor/curso/${course.id}/contenido`)}
                        style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                      >
                        <BookOpen size={16} /> Contenido y Lecciones
                      </button>
                      <div className="flex gap-2">
                        <button 
                          className="btn btn-outline w-full flex items-center justify-center gap-1"
                          onClick={() => navigate(`/instructor/curso/${course.id}/alumnos`)}
                          style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                        >
                          <GraduationCap size={14} /> Alumnos
                        </button>
                        <button 
                          className="btn btn-outline w-full flex items-center justify-center gap-1"
                          onClick={() => openModal(course)}
                          style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                        >
                          <Settings size={14} /> Ajustes
                        </button>
                        <button 
                          className="btn btn-outline flex items-center justify-center"
                          onClick={() => window.open(`/curso/${course.id}`, '_blank')}
                          title="Ver vista previa pública del curso"
                          style={{ padding: '6px 10px' }}
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modern Tabbed Edit / Create Course Modal */}
      {editingCourse && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(10, 22, 40, 0.85)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
        }} className="animate-fade-in">
          <div className="card-glass animate-scale" style={{ 
            width: '100%', maxWidth: 720, padding: 0, maxHeight: '92vh', 
            overflow: 'hidden', display: 'flex', flexDirection: 'column',
            border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-2xl)',
            boxShadow: 'var(--shadow-2xl)'
          }}>
            {/* Modal Header */}
            <div style={{ 
              padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'var(--bg-card)'
            }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Settings size={20} color="var(--accent-teal)" />
                  {editingCourse === 'new' ? 'Crear Nuevo Curso' : `Ajustes: ${editingCourse.nombre}`}
                </h3>
                <p className="text-xs text-muted" style={{ margin: '4px 0 0 28px' }}>
                  Configura los detalles del curso, precios, imagen de portada y estado de publicación.
                </p>
              </div>
              <button className="btn-icon" onClick={() => { setEditingCourse(null); setImageFile(null); setImagePreview(null); }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div style={{ 
              display: 'flex', background: 'var(--bg-secondary)', 
              borderBottom: '1px solid var(--border-subtle)', padding: '0 24px' 
            }}>
              <button
                type="button"
                onClick={() => setActiveTab('general')}
                style={{
                  padding: '12px 16px', fontSize: '0.85rem', fontWeight: 600,
                  borderBottom: activeTab === 'general' ? '2px solid var(--accent-teal)' : '2px solid transparent',
                  color: activeTab === 'general' ? 'var(--accent-teal)' : 'var(--text-muted)',
                  background: 'none', cursor: 'pointer', transition: 'all 0.15s'
                }}
                className="flex items-center gap-2"
              >
                <BookOpen size={16} /> Información General
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('pricing')}
                style={{
                  padding: '12px 16px', fontSize: '0.85rem', fontWeight: 600,
                  borderBottom: activeTab === 'pricing' ? '2px solid var(--accent-teal)' : '2px solid transparent',
                  color: activeTab === 'pricing' ? 'var(--accent-teal)' : 'var(--text-muted)',
                  background: 'none', cursor: 'pointer', transition: 'all 0.15s'
                }}
                className="flex items-center gap-2"
              >
                <DollarSign size={16} /> Precios y Cupos
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('media')}
                style={{
                  padding: '12px 16px', fontSize: '0.85rem', fontWeight: 600,
                  borderBottom: activeTab === 'media' ? '2px solid var(--accent-teal)' : '2px solid transparent',
                  color: activeTab === 'media' ? 'var(--accent-teal)' : 'var(--text-muted)',
                  background: 'none', cursor: 'pointer', transition: 'all 0.15s'
                }}
                className="flex items-center gap-2"
              >
                <ImageIcon size={16} /> Portada y Estado
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSave} style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              {/* TAB 1: General Info */}
              {activeTab === 'general' && (
                <div className="flex flex-col gap-4 animate-fade-in">
                  <div className="grid grid-2 gap-4">
                    <div className="form-group">
                      <label className="form-label font-semibold">Código del Curso *</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={form.codigo} 
                        onChange={(e) => setForm({ ...form, codigo: e.target.value })} 
                        placeholder="Ej: TEC-0005"
                        disabled={editingCourse !== 'new'}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label font-semibold">Nombre del Curso *</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={form.nombre} 
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })} 
                        placeholder="Nombre descriptivo del curso"
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label font-semibold">Descripción Breve</label>
                    <textarea 
                      className="form-input" 
                      value={form.descripcion} 
                      onChange={(e) => setForm({ ...form, descripcion: e.target.value })} 
                      placeholder="Explica qué aprenderán los estudiantes en este curso..."
                      rows={4}
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <div className="grid grid-2 gap-4">
                    <div className="form-group">
                      <label className="form-label font-semibold">Categoría *</label>
                      <select 
                        className="form-input" 
                        value={form.categoria_id} 
                        onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}
                        required
                      >
                        <option value="" disabled>Selecciona una categoría</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label font-semibold">Nivel Académico</label>
                      <select 
                        className="form-input" 
                        value={form.nivel} 
                        onChange={(e) => setForm({ ...form, nivel: e.target.value })}
                      >
                        <option value="principiante">Principiante</option>
                        <option value="intermedio">Intermedio</option>
                        <option value="avanzado">Avanzado</option>
                        <option value="todos">Todos los niveles</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Pricing & Seats */}
              {activeTab === 'pricing' && (
                <div className="flex flex-col gap-4 animate-fade-in">
                  <div className="grid grid-3 gap-4">
                    <div className="form-group">
                      <label className="form-label font-semibold">Precio Estándar ($)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        min="0"
                        className="form-input" 
                        value={form.precio} 
                        onChange={(e) => setForm({ ...form, precio: e.target.value })} 
                        placeholder="0.00"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label font-semibold">Precio Premium ($)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        min="0"
                        className="form-input" 
                        value={form.precio_premium} 
                        onChange={(e) => setForm({ ...form, precio_premium: e.target.value })} 
                        placeholder="0.00"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label font-semibold">Duración Total (Horas)</label>
                      <input 
                        type="number" 
                        min="0"
                        className="form-input" 
                        value={form.duracion_horas} 
                        onChange={(e) => setForm({ ...form, duracion_horas: e.target.value })} 
                        placeholder="Horas estimadas"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label font-semibold">Cupo Máximo de Estudiantes por Cohorte</label>
                    <input 
                      type="number" 
                      min="1"
                      className="form-input" 
                      value={form.cupo_maximo} 
                      onChange={(e) => setForm({ ...form, cupo_maximo: e.target.value })} 
                      placeholder="Ej: 100"
                    />
                  </div>

                  <div style={{
                    padding: '16px', borderRadius: 'var(--radius-lg)',
                    background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)'
                  }} className="flex items-center justify-between mt-2">
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Crown size={16} color="var(--accent-gold)" /> Exclusivo para Usuarios Membresía Premium
                      </h4>
                      <p className="text-xs text-muted" style={{ margin: '2px 0 0 22px' }}>
                        Los alumnos suscritos a la Membresía Premium podrán acceder sin costo adicional.
                      </p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={form.es_premium} 
                      onChange={(e) => setForm({ ...form, es_premium: e.target.checked })} 
                      style={{ width: 20, height: 20, cursor: 'pointer' }}
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: Media & Status */}
              {activeTab === 'media' && (
                <div className="flex flex-col gap-4 animate-fade-in">
                  {/* Image Dropzone & Live Preview */}
                  <div className="form-group">
                    <label className="form-label font-semibold mb-2 flex items-center justify-between">
                      <span>Imagen de Portada del Curso</span>
                      {imagePreview && (
                        <button 
                          type="button" 
                          onClick={() => { setImageFile(null); setImagePreview(null); }}
                          className="text-xs text-red-400 hover:underline"
                        >
                          Quitar imagen
                        </button>
                      )}
                    </label>

                    {imagePreview ? (
                      <div style={{ 
                        position: 'relative', height: 180, borderRadius: 'var(--radius-lg)', 
                        overflow: 'hidden', border: '1px solid var(--border-subtle)' 
                      }}>
                        <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <label style={{
                          position: 'absolute', bottom: 12, right: 12,
                          background: 'rgba(10, 22, 40, 0.85)', padding: '6px 12px',
                          borderRadius: 'var(--radius-md)', cursor: 'pointer',
                          fontSize: '0.8rem', color: 'white', backdropFilter: 'blur(4px)',
                          display: 'flex', alignItems: 'center', gap: 6, border: '1px solid var(--border-subtle)'
                        }}>
                          <Upload size={14} /> Cambiar Foto
                          <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                        </label>
                      </div>
                    ) : (
                      <label style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        padding: '30px 20px', border: '2px dashed var(--border-subtle)', borderRadius: 'var(--radius-lg)',
                        background: 'var(--bg-secondary)', cursor: 'pointer', transition: 'all 0.2s'
                      }}>
                        <Upload size={32} style={{ color: 'var(--accent-teal)', marginBottom: 8 }} />
                        <span className="font-semibold text-sm">Haz clic para subir una imagen</span>
                        <span className="text-xs text-muted mt-1">Formato JPG, PNG o WebP (máx. 5MB)</span>
                        <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                      </label>
                    )}
                  </div>

                  <div className="grid grid-2 gap-4 mt-2">
                    <div className="form-group">
                      <label className="form-label font-semibold">Estado de Publicación</label>
                      <select 
                        className="form-input" 
                        value={form.estado} 
                        onChange={(e) => setForm({ ...form, estado: e.target.value })}
                      >
                        <option value="disponible">Disponible (Inscripciones Abiertas)</option>
                        <option value="no_disponible">No Disponible (Desactivado)</option>
                        <option value="proximo">Próximamente (Anuncio)</option>
                        <option value="en_produccion">En Producción (Borrador)</option>
                        <option value="preventa">Preventa (Inscripción Anticipada)</option>
                      </select>
                    </div>

                    {(form.estado === 'proximo' || form.estado === 'preventa') && (
                      <div className="form-group">
                        <label className="form-label font-semibold">Fecha de Lanzamiento *</label>
                        <input 
                          type="date" 
                          className="form-input" 
                          value={form.fecha_disponible} 
                          onChange={(e) => setForm({ ...form, fecha_disponible: e.target.value })} 
                          required 
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Modal Footer Buttons */}
              <div style={{ 
                marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-subtle)', 
                display: 'flex', gap: 12, justifyContent: 'flex-end' 
              }}>
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={() => { setEditingCourse(null); setImageFile(null); setImagePreview(null); }}
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary flex items-center gap-2" disabled={saving}>
                  <Save size={16} /> {saving ? 'Guardando...' : 'Guardar Curso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


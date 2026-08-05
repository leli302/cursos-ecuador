import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import { 
  Plus, Edit, Trash2, Search, X, Save, ChevronLeft, ChevronRight,
  BookOpen, Image as ImageIcon, Upload, Eye, GraduationCap, Star,
  DollarSign, Tag, Settings, LayoutGrid, List, Crown, CheckCircle2, AlertCircle
} from 'lucide-react';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const toast = useToast();
  const navigate = useNavigate();

  // Modal & Form State
  const [editingCourse, setEditingCourse] = useState(null); // null, 'new', or course object
  const [activeTab, setActiveTab] = useState('general');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);

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

  const fetchCourses = async (page = 1) => {
    setLoading(true);
    setCurrentPage(page);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (search) params.set('search', search);
      const { data } = await api.get(`/courses?${params}`);
      setCourses(data.data);
      setPagination(data.pagination);
    } catch (e) {
      console.error(e);
      toast.error('Error al cargar los cursos');
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

  const openModal = (c = 'new') => {
    setEditingCourse(c);
    setActiveTab('general');
    setImageFile(null);

    if (c === 'new') {
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
        codigo: c.codigo || '',
        nombre: c.nombre || '',
        descripcion: c.descripcion || '',
        categoria_id: c.categoria_id || '',
        precio: c.precio !== undefined ? c.precio : '',
        precio_premium: c.precio_premium !== undefined ? c.precio_premium : '',
        nivel: c.nivel || 'todos',
        duracion_horas: c.duracion_horas !== undefined ? c.duracion_horas : '',
        estado: c.estado || 'disponible',
        cupo_maximo: c.cupo_maximo || 100,
        fecha_disponible: c.fecha_disponible ? c.fecha_disponible.substring(0, 10) : '',
        es_premium: c.es_premium || false
      });
      setImagePreview(c.imagen || null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Seguro que deseas cambiar el estado de este curso a No Disponible?')) return;
    try {
      await api.delete(`/courses/${id}`);
      toast.success('Estado del curso actualizado');
      fetchCourses(currentPage);
    } catch (e) {
      toast.error('Error al actualizar el estado del curso');
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
      fetchCourses(currentPage);
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
        {/* Page Header Banner */}
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
                padding: 8, borderRadius: 'var(--radius-md)',
                background: 'rgba(78, 205, 196, 0.15)', color: 'var(--accent-teal)'
              }}>
                <BookOpen size={24} />
              </div>
              <h1 className="page-title" style={{ margin: 0, fontSize: '1.75rem' }}>Administración Global de Cursos</h1>
            </div>
            <p className="text-muted text-sm" style={{ marginLeft: 44 }}>
              Gestiona el catálogo global, precios, estados, instructores y asignaciones.
            </p>
          </div>
          <button className="btn btn-primary flex items-center gap-2" onClick={() => openModal('new')} style={{ padding: '10px 20px' }}>
            <Plus size={18} /> Crear Nuevo Curso
          </button>
        </div>

        {/* Search Bar & View Mode Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-center">
          <div style={{ flex: 1, position: 'relative', width: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Buscar por código, nombre o categoría..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && fetchCourses(1)} 
              style={{ paddingLeft: 44, width: '100%' }} 
            />
          </div>

          <div className="flex gap-2 items-center">
            <button className="btn btn-outline" onClick={() => fetchCourses(1)}>Buscar</button>
            <div style={{ background: 'var(--bg-secondary)', padding: 3, borderRadius: 'var(--radius-md)', display: 'flex', gap: 2 }}>
              <button 
                onClick={() => setViewMode('table')} 
                className={`btn-icon ${viewMode === 'table' ? 'active' : ''}`}
                style={{ background: viewMode === 'table' ? 'var(--accent-teal)' : 'transparent', color: viewMode === 'table' ? 'white' : 'var(--text-muted)' }}
                title="Vista de Tabla"
              >
                <List size={16} />
              </button>
              <button 
                onClick={() => setViewMode('grid')} 
                className={`btn-icon ${viewMode === 'grid' ? 'active' : ''}`}
                style={{ background: viewMode === 'grid' ? 'var(--accent-teal)' : 'transparent', color: viewMode === 'grid' ? 'white' : 'var(--text-muted)' }}
                title="Vista de Tarjetas"
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="skeleton" style={{ height: 320, borderRadius: 'var(--radius-xl)' }} />
        ) : courses.length === 0 ? (
          <div className="card text-center p-8" style={{ border: '1px dashed var(--border-subtle)' }}>
            <BookOpen size={48} className="text-muted" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <h3>No se encontraron cursos</h3>
            <p className="text-muted mb-4">Intenta ajustar tu término de búsqueda o crea un nuevo curso.</p>
          </div>
        ) : viewMode === 'table' ? (
          <div className="table-container" style={{ borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
            <table>
              <thead>
                <tr>
                  <th>Curso</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Ventas</th>
                  <th>Valoración</th>
                  <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(c => {
                  const status = statusColors[c.estado] || statusColors.disponible;
                  return (
                    <tr key={c.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div style={{
                            width: 44, height: 44, borderRadius: 'var(--radius-md)',
                            overflow: 'hidden', background: 'var(--bg-secondary)', flexShrink: 0
                          }}>
                            {c.imagen ? (
                              <img src={c.imagen} alt={c.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full text-xs text-muted">
                                <ImageIcon size={20} />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{c.nombre}</div>
                            <div className="text-xs text-muted font-mono">{c.codigo} {c.es_premium ? '• 👑 Premium' : ''}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-sm">{c.categoria_nombre || 'General'}</td>
                      <td className="font-semibold text-sm" style={{ color: 'var(--accent-green)' }}>
                        ${parseFloat(c.precio || 0).toFixed(2)}
                      </td>
                      <td>
                        <span style={{
                          padding: '4px 10px', borderRadius: 'var(--radius-full)',
                          fontSize: '0.75rem', fontWeight: 600, background: status.bg,
                          color: status.text, border: `1px solid ${status.border}`
                        }}>
                          {status.label}
                        </span>
                      </td>
                      <td className="text-sm">{c.total_ventas || 0}</td>
                      <td>
                        <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          {c.valoracion ? parseFloat(c.valoracion).toFixed(1) : '0.0'} ⭐
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2 justify-end">
                          <button 
                            className="btn-icon" 
                            title="Ver vista previa" 
                            onClick={() => window.open(`/curso/${c.id}`, '_blank')}
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            className="btn-icon" 
                            title="Editar" 
                            onClick={() => openModal(c)}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="btn-icon" 
                            title="Desactivar" 
                            onClick={() => handleDelete(c.id)} 
                            style={{ color: 'var(--accent-red)' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid View Mode */
          <div className="grid grid-3 gap-6 stagger-children">
            {courses.map(c => {
              const status = statusColors[c.estado] || statusColors.disponible;
              return (
                <div key={c.id} className="card flex flex-col justify-between" style={{ padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-xl)' }}>
                  <div style={{ position: 'relative', height: 150, background: 'var(--bg-secondary)' }}>
                    {c.imagen ? (
                      <img src={c.imagen} alt={c.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-muted">
                        <ImageIcon size={40} />
                      </div>
                    )}
                    <span style={{
                      position: 'absolute', top: 12, left: 12, padding: '4px 10px',
                      borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600,
                      background: status.bg, color: status.text, border: `1px solid ${status.border}`
                    }}>
                      {status.label}
                    </span>
                  </div>

                  <div style={{ padding: 'var(--space-4)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div className="text-xs text-muted mb-1">{c.categoria_nombre} · {c.codigo}</div>
                    <h3 className="font-semibold text-sm mb-2" style={{ lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {c.nombre}
                    </h3>
                    <div className="flex justify-between items-center mt-auto pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                      <span className="font-bold text-sm" style={{ color: 'var(--accent-green)' }}>${parseFloat(c.precio || 0).toFixed(2)}</span>
                      <div className="flex gap-1">
                        <button className="btn-icon" onClick={() => openModal(c)}><Edit size={14} /></button>
                        <button className="btn-icon" onClick={() => handleDelete(c.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="pagination flex justify-center gap-2 mt-6">
            <button disabled={!pagination.hasPrev} onClick={() => fetchCourses(currentPage - 1)}>
              <ChevronLeft size={16} />
            </button>
            {[...Array(pagination.totalPages)].map((_, i) => {
              const page = i + 1;
              return (
                <button key={page} className={page === currentPage ? 'active' : ''} onClick={() => fetchCourses(page)}>
                  {page}
                </button>
              );
            })}
            <button disabled={!pagination.hasNext} onClick={() => fetchCourses(currentPage + 1)}>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Tabbed Course Creation / Edit Modal */}
      {editingCourse && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)',
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
                  {editingCourse === 'new' ? 'Crear Nuevo Curso' : `Editar Curso: ${editingCourse.nombre}`}
                </h3>
                <p className="text-xs text-muted" style={{ margin: '4px 0 0 28px' }}>
                  Administra los metadatos globales, precios y portada del curso.
                </p>
              </div>
              <button className="btn-icon" onClick={() => { setEditingCourse(null); setImageFile(null); setImagePreview(null); }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Tabs Header */}
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
                  background: 'none', cursor: 'pointer'
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
                  background: 'none', cursor: 'pointer'
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
                  background: 'none', cursor: 'pointer'
                }}
                className="flex items-center gap-2"
              >
                <ImageIcon size={16} /> Portada y Estado
              </button>
            </div>

            {/* Modal Body */}
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
                      placeholder="Resumen del contenido del curso..."
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
                      <label className="form-label font-semibold">Duración (Horas)</label>
                      <input 
                        type="number" 
                        min="0"
                        className="form-input" 
                        value={form.duracion_horas} 
                        onChange={(e) => setForm({ ...form, duracion_horas: e.target.value })} 
                        placeholder="Ej: 20"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label font-semibold">Cupo Máximo</label>
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
                      <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, display: 'flex', itemsCenter: 'center', gap: 6 }}>
                        <Crown size={16} color="var(--accent-gold)" /> Acceso Membresía Premium
                      </h4>
                      <p className="text-xs text-muted" style={{ margin: '2px 0 0 22px' }}>
                        Permitir que los estudiantes con membresía Premium accedan sin costo.
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

              {/* TAB 3: Media & Publication Status */}
              {activeTab === 'media' && (
                <div className="flex flex-col gap-4 animate-fade-in">
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
                          background: 'rgba(255, 255, 255, 0.85)', padding: '6px 12px',
                          borderRadius: 'var(--radius-md)', cursor: 'pointer',
                          fontSize: '0.8rem', color: 'white', backdropFilter: 'blur(4px)',
                          display: 'flex', alignItems: 'center', gap: 6, border: '1px solid var(--border-subtle)'
                        }}>
                          <Upload size={14} /> Cambiar Imagen
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
                        <span className="font-semibold text-sm">Haz clic para subir una portada</span>
                        <span className="text-xs text-muted mt-1">Soporta JPG, PNG o WebP</span>
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
                        <option value="disponible">Disponible</option>
                        <option value="no_disponible">No Disponible</option>
                        <option value="proximo">Próximamente</option>
                        <option value="en_produccion">En Producción</option>
                        <option value="preventa">Preventa</option>
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

              {/* Modal Actions */}
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


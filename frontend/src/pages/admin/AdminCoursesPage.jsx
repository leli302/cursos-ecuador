import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import { Plus, Edit, Trash2, Search, X, Save, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const toast = useToast();

  // Modal & Form State
  const [editingCourse, setEditingCourse] = useState(null); // null, 'new', or course object
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
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);

  const fetchCourses = async (page = 1) => {
    setLoading(true);
    setCurrentPage(page);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
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

  const handleDelete = async (id) => {
    if (!confirm('¿Desactivar este curso?')) return;
    try {
      await api.delete(`/courses/${id}`);
      toast.success('Curso desactivado');
      fetchCourses();
    } catch (e) {
      toast.error('Error al desactivar el curso');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('codigo', form.codigo);
      formData.append('nombre', form.nombre);
      formData.append('descripcion', form.descripcion);
      formData.append('categoria_id', form.categoria_id);
      formData.append('precio', form.precio);
      formData.append('precio_premium', form.precio_premium);
      formData.append('nivel', form.nivel);
      formData.append('duracion_horas', form.duracion_horas || 0);
      formData.append('estado', form.estado);
      formData.append('cupo_maximo', form.cupo_maximo);
      if (form.fecha_disponible) {
        formData.append('fecha_disponible', form.fecha_disponible);
      }
      formData.append('es_premium', form.es_premium);

      if (imageFile) {
        formData.append('course_image', imageFile);
      }

      if (editingCourse === 'new') {
        await api.post('/courses', formData);
        toast.success('Curso creado exitosamente');
      } else {
        await api.put(`/courses/${editingCourse.id}`, formData);
        toast.success('Curso actualizado exitosamente');
      }

      setEditingCourse(null);
      setImageFile(null);
      fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al guardar el curso');
    } finally {
      setSaving(false);
    }
  };

  const statusColors = { disponible: 'badge-green', no_disponible: 'badge-red', en_produccion: 'badge-orange', proximo: 'badge-blue', preventa: 'badge-purple' };

  return (
    <div className="page"><div className="container">
      <div className="flex justify-between items-center mb-8">
        <h1 className="page-title">Gestionar Cursos</h1>
        <button className="btn btn-primary" onClick={() => {
          setEditingCourse('new');
          setForm({
            codigo: '',
            nombre: '',
            descripcion: '',
            categoria_id: categories[0]?.id || '',
            precio: '',
            precio_premium: '',
            nivel: 'todos',
            duracion_horas: '',
            estado: 'disponible',
            cupo_maximo: 100,
            fecha_disponible: '',
            es_premium: false
          });
          setImageFile(null);
        }}><Plus size={16} /> Nuevo Curso</button>
      </div>

      <div className="flex gap-4 mb-6">
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" className="form-input" placeholder="Buscar cursos..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchCourses()} style={{ paddingLeft: 44 }} />
        </div>
        <button className="btn btn-outline" onClick={() => fetchCourses()}>Buscar</button>
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 300, borderRadius: 'var(--radius-lg)' }} />
      ) : (
        <div className="table-container"><table>
          <thead><tr><th>Código</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Estado</th><th>Ventas</th><th>Valoración</th><th>Acciones</th></tr></thead>
          <tbody>{courses.map(c => (
            <tr key={c.id}>
              <td><code className="text-xs">{c.codigo}</code></td>
              <td className="text-sm font-semibold" style={{ maxWidth: 250 }}>{c.nombre}</td>
              <td className="text-sm">{c.categoria_nombre}</td>
              <td className="font-semibold">${parseFloat(c.precio).toFixed(2)}</td>
              <td><span className={`badge ${statusColors[c.estado] || 'badge-blue'}`}>{c.estado}</span></td>
              <td className="text-sm">{c.total_ventas}</td>
              <td><span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>{c.valoracion ? parseFloat(c.valoracion).toFixed(1) : '0.0'} ⭐</span></td>
              <td>
                <div className="flex gap-1">
                  <button className="btn-icon" title="Editar" onClick={() => {
                    setEditingCourse(c);
                    setForm({
                      codigo: c.codigo || '',
                      nombre: c.nombre || '',
                      descripcion: c.descripcion || '',
                      categoria_id: c.categoria_id || '',
                      precio: c.precio || '',
                      precio_premium: c.precio_premium || '',
                      nivel: c.nivel || 'todos',
                      duracion_horas: c.duracion_horas || '',
                      estado: c.estado || 'disponible',
                      cupo_maximo: c.cupo_maximo || 100,
                      fecha_disponible: c.fecha_disponible ? c.fecha_disponible.substring(0, 10) : '',
                      es_premium: c.es_premium || false
                    });
                    setImageFile(null);
                  }}><Edit size={14} /></button>
                  <button className="btn-icon" title="Desactivar" onClick={() => handleDelete(c.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={14} /></button>
                </div>
              </td>
          ))}</tbody>
        </table></div>
        
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pagination" style={{ marginTop: 'var(--space-6)' }}>
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
      )}

      {/* Create / Edit Modal */}
      {editingCourse && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, padding: '20px'
        }} className="animate-fade-in">
          <div className="card-glass animate-scale" style={{ width: '100%', maxWidth: 650, padding: 'var(--space-6)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0 }}>
                {editingCourse === 'new' ? 'Nuevo Curso' : 'Editar Curso'}
              </h3>
              <button className="btn-icon" onClick={() => { setEditingCourse(null); setImageFile(null); }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSave}>
              <div className="grid grid-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Código del Curso</label>
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
                  <label className="form-label">Nombre</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={form.nombre} 
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })} 
                    placeholder="Nombre del curso"
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea 
                  className="form-input" 
                  value={form.descripcion} 
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })} 
                  placeholder="Detalles del contenido del curso..."
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="grid grid-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Categoría</label>
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
                  <label className="form-label">Nivel</label>
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

              <div className="grid grid-3 gap-4">
                <div className="form-group">
                  <label className="form-label">Precio ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    className="form-input" 
                    value={form.precio} 
                    onChange={(e) => setForm({ ...form, precio: e.target.value })} 
                    placeholder="0.00"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Precio Premium ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    className="form-input" 
                    value={form.precio_premium} 
                    onChange={(e) => setForm({ ...form, precio_premium: e.target.value })} 
                    placeholder="0.00"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Duración (Horas)</label>
                  <input 
                    type="number" 
                    min="0"
                    className="form-input" 
                    value={form.duracion_horas} 
                    onChange={(e) => setForm({ ...form, duracion_horas: e.target.value })} 
                    placeholder="Horas totales"
                  />
                </div>
              </div>

              <div className="grid grid-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Estado</label>
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
                <div className="form-group">
                  <label className="form-label">Cupo Máximo</label>
                  <input 
                    type="number" 
                    min="1"
                    className="form-input" 
                    value={form.cupo_maximo} 
                    onChange={(e) => setForm({ ...form, cupo_maximo: e.target.value })} 
                  />
                </div>
              </div>

              {(form.estado === 'proximo' || form.estado === 'preventa') && (
                <div className="form-group">
                  <label className="form-label">Fecha de Lanzamiento / Disponibilidad</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={form.fecha_disponible} 
                    onChange={(e) => setForm({ ...form, fecha_disponible: e.target.value })} 
                    required 
                  />
                </div>
              )}

              <div className="grid grid-2 gap-4 items-center" style={{ margin: '15px 0' }}>
                <div className="form-group">
                  <label className="form-label">Imagen del Curso</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>
                <label className="flex items-center gap-2 text-sm" style={{ cursor: 'pointer', marginTop: '15px' }}>
                  <input 
                    type="checkbox" 
                    checked={form.es_premium} 
                    onChange={(e) => setForm({ ...form, es_premium: e.target.checked })} 
                  />
                  <span>¿Es curso Premium?</span>
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" className="btn btn-outline w-full" onClick={() => { setEditingCourse(null); setImageFile(null); }}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary w-full" disabled={saving}>
                  <Save size={16} /> {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div></div>
  );
}

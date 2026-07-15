import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import { Plus, Edit, Trash2, BookOpen, GraduationCap, Star, Settings, Save, X } from 'lucide-react';

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
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

  const statusColors = { 
    disponible: 'badge-green', 
    no_disponible: 'badge-red', 
    en_produccion: 'badge-orange', 
    proximo: 'badge-blue', 
    preventa: 'badge-purple' 
  };

  return (
    <div className="page">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="page-title">Panel del Instructor</h1>
            <p className="text-muted">Gestiona el contenido, alumnos y detalles de tus cursos dictados.</p>
          </div>
          <button className="btn btn-primary" onClick={() => {
            setEditingCourse('new');
            setForm({
              codigo: 'CUR-' + Math.floor(1000 + Math.random() * 9000),
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
          }}>
            <Plus size={16} /> Crear Nuevo Curso
          </button>
        </div>

        {loading ? (
          <div className="grid grid-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton" style={{ height: 260, borderRadius: 'var(--radius-lg)' }} />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="card text-center" style={{ padding: '60px 20px', border: '1px dashed var(--border-subtle)' }}>
            <GraduationCap size={48} className="text-muted" style={{ margin: '0 auto 16px' }} />
            <h3>Aún no tienes cursos creados</h3>
            <p className="text-muted mb-4">Crea tu primer curso para empezar a enseñar a miles de estudiantes en Ecuador.</p>
          </div>
        ) : (
          <div className="grid grid-3 gap-6">
            {courses.map(course => (
              <div key={course.id} className="card flex flex-col justify-between" style={{ padding: 'var(--space-5)', minHeight: 320 }}>
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className={`badge ${statusColors[course.estado] || 'badge-blue'}`}>{course.estado}</span>
                    <span className="text-xs text-muted font-mono">{course.codigo}</span>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2" style={{ lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '48px' }}>
                    {course.nombre}
                  </h3>
                  
                  <p className="text-sm text-muted mb-4" style={{ lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '40px' }}>
                    {course.descripcion || 'Sin descripción'}
                  </p>

                  <div className="grid grid-3 gap-2 mb-4" style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                    <div className="text-center">
                      <div className="text-xs text-muted flex justify-center items-center gap-1 mb-1">
                        <GraduationCap size={12} /> Alumnos
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
                      <span className="font-bold text-sm">${parseFloat(course.precio).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <button 
                    className="btn btn-primary w-full flex items-center justify-center gap-2"
                    onClick={() => navigate(`/instructor/curso/${course.id}/contenido`)}
                  >
                    <BookOpen size={16} /> Gestionar Contenido
                  </button>
                  <div className="flex gap-2">
                    <button 
                      className="btn btn-outline w-full flex items-center justify-center gap-1"
                      onClick={() => navigate(`/instructor/curso/${course.id}/alumnos`)}
                    >
                      <GraduationCap size={14} /> Alumnos
                    </button>
                    <button 
                      className="btn btn-outline w-full flex items-center justify-center gap-1"
                      onClick={() => {
                        setEditingCourse(course);
                        setForm({
                          codigo: course.codigo || '',
                          nombre: course.nombre || '',
                          descripcion: course.descripcion || '',
                          categoria_id: course.categoria_id || '',
                          precio: course.precio || '',
                          precio_premium: course.precio_premium || '',
                          nivel: course.nivel || 'todos',
                          duracion_horas: course.duracion_horas || '',
                          estado: course.estado || 'disponible',
                          cupo_maximo: course.cupo_maximo || 100,
                          fecha_disponible: course.fecha_disponible ? course.fecha_disponible.substring(0, 10) : '',
                          es_premium: course.es_premium || false
                        });
                        setImageFile(null);
                      }}
                    >
                      <Settings size={14} /> Ajustes
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit / Create Course Modal */}
      {editingCourse && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, padding: '20px'
        }} className="animate-fade-in">
          <div className="card-glass animate-scale" style={{ width: '100%', maxWidth: 650, padding: 'var(--space-6)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0 }}>
                {editingCourse === 'new' ? 'Crear Nuevo Curso' : 'Ajustes del Curso'}
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
    </div>
  );
}

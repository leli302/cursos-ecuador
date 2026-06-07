import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const toast = useToast();

  const fetchCourses = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (search) params.set('search', search);
      const { data } = await api.get(`/courses?${params}`);
      setCourses(data.data);
      setPagination(data.pagination);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('¿Desactivar este curso?')) return;
    try { await api.delete(`/courses/${id}`); toast.success('Curso desactivado'); fetchCourses(); }
    catch (e) { toast.error('Error'); }
  };

  const statusColors = { disponible: 'badge-green', no_disponible: 'badge-red', en_produccion: 'badge-orange', proximo: 'badge-blue', preventa: 'badge-purple' };

  return (
    <div className="page"><div className="container">
      <div className="flex justify-between items-center mb-8">
        <h1 className="page-title">Gestionar Cursos</h1>
        <button className="btn btn-primary"><Plus size={16} /> Nuevo Curso</button>
      </div>
      <div className="flex gap-4 mb-6">
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" className="form-input" placeholder="Buscar cursos..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchCourses()} style={{ paddingLeft: 44 }} />
        </div>
        <button className="btn btn-outline" onClick={() => fetchCourses()}>Buscar</button>
      </div>
      <div className="table-container"><table>
        <thead><tr><th>Código</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Estado</th><th>Ventas</th><th>Acciones</th></tr></thead>
        <tbody>{courses.map(c => (
          <tr key={c.id}>
            <td><code className="text-xs">{c.codigo}</code></td>
            <td className="text-sm font-semibold" style={{ maxWidth: 250 }}>{c.nombre}</td>
            <td className="text-sm">{c.categoria_nombre}</td>
            <td className="font-semibold">${parseFloat(c.precio).toFixed(2)}</td>
            <td><span className={`badge ${statusColors[c.estado] || 'badge-blue'}`}>{c.estado}</span></td>
            <td className="text-sm">{c.total_ventas}</td>
            <td>
              <div className="flex gap-1">
                <button className="btn-icon" title="Editar"><Edit size={14} /></button>
                <button className="btn-icon" title="Desactivar" onClick={() => handleDelete(c.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={14} /></button>
              </div>
            </td>
          </tr>
        ))}</tbody>
      </table></div>
    </div></div>
  );
}

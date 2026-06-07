import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Search, Edit, UserCheck, UserX } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 20 });
      if (search) params.set('search', search);
      const { data } = await api.get(`/users?${params}`);
      setUsers(data.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  return (
    <div className="page"><div className="container">
      <h1 className="page-title mb-8">Gestionar Usuarios</h1>
      <div className="flex gap-4 mb-6">
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" className="form-input" placeholder="Buscar por nombre o email..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchUsers()} style={{ paddingLeft: 44 }} />
        </div>
        <button className="btn btn-outline" onClick={() => fetchUsers()}>Buscar</button>
      </div>
      <div className="table-container"><table>
        <thead><tr><th>Nombre</th><th>Email</th><th>Roles</th><th>Estado</th><th>Registro</th><th>Acciones</th></tr></thead>
        <tbody>{users.map(u => (
          <tr key={u.id}>
            <td className="font-semibold text-sm">{u.nombre} {u.apellido}</td>
            <td className="text-sm">{u.email}</td>
            <td>{u.roles?.map(r => <span key={r} className="badge badge-teal" style={{ marginRight: 4 }}>{r}</span>)}</td>
            <td>{u.estado ? <span className="badge badge-green">Activo</span> : <span className="badge badge-red">Inactivo</span>}</td>
            <td className="text-xs text-muted">{new Date(u.creado_en).toLocaleDateString('es-EC')}</td>
            <td><button className="btn-icon"><Edit size={14} /></button></td>
          </tr>
        ))}</tbody>
      </table></div>
    </div></div>
  );
}

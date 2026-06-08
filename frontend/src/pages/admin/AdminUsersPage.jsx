import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import { Search, Edit, UserCheck, UserX, X, Save } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const toast = useToast();

  // Modal State
  const [editingUser, setEditingUser] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newUser, setNewUser] = useState({ nombre: '', apellido: '', email: '', password: '', telefono: '', estado: true, roles: ['estudiante'] });
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 20 });
      if (search) params.set('search', search);
      const { data } = await api.get(`/users?${params}`);
      setUsers(data.data);
    } catch (e) { 
      console.error(e); 
      toast.error('Error al cargar usuarios');
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    fetchUsers(); 
  }, []);

  const handleEditClick = (user) => {
    setEditingUser({
      ...user,
      // Clonamos roles para no mutar el estado principal antes de guardar
      roles: [...(user.roles || [])]
    });
  };

  const handleRoleToggle = (role) => {
    if (!editingUser) return;
    const currentRoles = editingUser.roles || [];
    const updatedRoles = currentRoles.includes(role)
      ? currentRoles.filter(r => r !== role)
      : [...currentRoles, role];
    setEditingUser({ ...editingUser, roles: updatedRoles });
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    
    setSaving(true);
    try {
      // 1. Guardar datos básicos y estado
      await api.put(`/users/${editingUser.id}`, {
        nombre: editingUser.nombre,
        apellido: editingUser.apellido,
        telefono: editingUser.telefono,
        estado: editingUser.estado
      });

      // 2. Guardar roles
      await api.put(`/users/${editingUser.id}/roles`, {
        roles: editingUser.roles
      });

      toast.success('Usuario actualizado correctamente');
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al actualizar el usuario');
    } finally {
      setSaving(false);
    }
  };

  const toggleUserStatus = async (user) => {
    try {
      const newStatus = !user.estado;
      await api.put(`/users/${user.id}`, { estado: newStatus });
      toast.success(`Usuario ${newStatus ? 'activado' : 'desactivado'}`);
      fetchUsers();
    } catch (error) {
      toast.error('Error al cambiar el estado del usuario');
    }
  };

  const handleNewUserRoleToggle = (role) => {
    const currentRoles = newUser.roles || [];
    const updatedRoles = currentRoles.includes(role)
      ? currentRoles.filter(r => r !== role)
      : [...currentRoles, role];
    setNewUser({ ...newUser, roles: updatedRoles });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.nombre || !newUser.apellido || !newUser.email || !newUser.password) {
      toast.error('Completa los campos obligatorios');
      return;
    }
    setSaving(true);
    try {
      await api.post('/users', newUser);
      toast.success('Usuario creado correctamente');
      setIsCreateOpen(false);
      setNewUser({ nombre: '', apellido: '', email: '', password: '', telefono: '', estado: true, roles: ['estudiante'] });
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al crear el usuario');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h1 className="page-title" style={{ margin: 0 }}>Gestionar Usuarios</h1>
          <button className="btn btn-primary" onClick={() => setIsCreateOpen(true)}>+ Crear Usuario</button>
        </div>
        
        <div className="flex gap-4 mb-6">
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Buscar por nombre o email..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && fetchUsers()} 
              style={{ paddingLeft: 44 }} 
            />
          </div>
          <button className="btn btn-outline" onClick={() => fetchUsers()}>Buscar</button>
        </div>

        {loading ? (
          <div className="skeleton" style={{ height: 300, borderRadius: 'var(--radius-lg)' }} />
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Roles</th>
                  <th>Estado</th>
                  <th>Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td className="font-semibold text-sm">{u.nombre} {u.apellido}</td>
                    <td className="text-sm">{u.email}</td>
                    <td>
                      {u.roles?.map(r => (
                        <span key={r} className={`badge ${r === 'administrador' ? 'badge-purple' : r === 'instructor' ? 'badge-blue' : 'badge-teal'}`} style={{ marginRight: 4 }}>
                          {r}
                        </span>
                      ))}
                    </td>
                    <td>
                      {u.estado ? (
                        <span className="badge badge-green">Activo</span>
                      ) : (
                        <span className="badge badge-red">Inactivo</span>
                      )}
                    </td>
                    <td className="text-xs text-muted">
                      {new Date(u.creado_en).toLocaleDateString('es-EC', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn-icon" onClick={() => handleEditClick(u)} title="Editar Usuario">
                          <Edit size={14} />
                        </button>
                        <button 
                          className="btn-icon" 
                          onClick={() => toggleUserStatus(u)} 
                          title={u.estado ? 'Desactivar Usuario' : 'Activar Usuario'}
                          style={{ color: u.estado ? 'var(--accent-orange)' : 'var(--accent-green)' }}
                        >
                          {u.estado ? <UserX size={14} /> : <UserCheck size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, padding: '20px'
        }} className="animate-fade-in">
          <div className="card-glass animate-scale" style={{ width: '100%', maxWidth: 500, padding: 'var(--space-6)' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0 }}>Editar Usuario</h3>
              <button className="btn-icon" onClick={() => setEditingUser(null)}><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveUser}>
              <div className="grid grid-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Nombre</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={editingUser.nombre} 
                    onChange={(e) => setEditingUser({ ...editingUser, nombre: e.target.value })} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Apellido</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={editingUser.apellido} 
                    onChange={(e) => setEditingUser({ ...editingUser, apellido: e.target.value })} 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editingUser.telefono || ''} 
                  onChange={(e) => setEditingUser({ ...editingUser, telefono: e.target.value })} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Estado</label>
                <select 
                  className="form-input" 
                  value={editingUser.estado ? 'true' : 'false'} 
                  onChange={(e) => setEditingUser({ ...editingUser, estado: e.target.value === 'true' })}
                >
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label mb-2" style={{ display: 'block' }}>Roles</label>
                <div className="flex gap-4 flex-wrap">
                  {['administrador', 'instructor', 'estudiante'].map(role => (
                    <label key={role} className="flex items-center gap-2 text-sm" style={{ cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={editingUser.roles?.includes(role)} 
                        onChange={() => handleRoleToggle(role)} 
                      />
                      <span className="capitalize">{role}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" className="btn btn-outline w-full" onClick={() => setEditingUser(null)}>
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

      {/* Create User Modal */}
      {isCreateOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, padding: '20px'
        }} className="animate-fade-in">
          <div className="card-glass animate-scale" style={{ width: '100%', maxWidth: 500, padding: 'var(--space-6)' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0 }}>Crear Nuevo Usuario</h3>
              <button className="btn-icon" onClick={() => setIsCreateOpen(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateUser}>
              <div className="grid grid-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Nombre *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={newUser.nombre} 
                    onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Apellido *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={newUser.apellido} 
                    onChange={(e) => setNewUser({ ...newUser, apellido: e.target.value })} 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email *</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={newUser.email} 
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contraseña *</label>
                <input 
                  type="password" 
                  className="form-input" 
                  value={newUser.password} 
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} 
                  placeholder="Mínimo 6 caracteres"
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={newUser.telefono} 
                  onChange={(e) => setNewUser({ ...newUser, telefono: e.target.value })} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Estado</label>
                <select 
                  className="form-input" 
                  value={newUser.estado ? 'true' : 'false'} 
                  onChange={(e) => setNewUser({ ...newUser, estado: e.target.value === 'true' })}
                >
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label mb-2" style={{ display: 'block' }}>Roles *</label>
                <div className="flex gap-4 flex-wrap">
                  {['administrador', 'instructor', 'estudiante'].map(role => (
                    <label key={role} className="flex items-center gap-2 text-sm" style={{ cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={newUser.roles?.includes(role)} 
                        onChange={() => handleNewUserRoleToggle(role)} 
                      />
                      <span className="capitalize">{role}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" className="btn btn-outline w-full" onClick={() => setIsCreateOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary w-full" disabled={saving}>
                  <Save size={16} /> {saving ? 'Creando...' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

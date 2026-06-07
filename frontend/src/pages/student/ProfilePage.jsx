import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';
import { User, Save } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ nombre: user?.nombre || '', apellido: user?.apellido || '', telefono: user?.telefono || '' });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/users/${user.id}`, form);
      toast.success('Perfil actualizado');
    } catch (error) {
      toast.error('Error al actualizar');
    } finally { setSaving(false); }
  };

  return (
    <div className="page"><div className="container" style={{ maxWidth: 600 }}>
      <h1 className="page-title mb-8">Mi Perfil</h1>
      <div className="card" style={{ padding: 'var(--space-8)' }}>
        <div className="text-center mb-6">
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'white', marginBottom: 'var(--space-3)' }}>
            {user?.nombre?.[0]}{user?.apellido?.[0]}
          </div>
          <p className="text-sm text-muted">{user?.email}</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            {user?.roles?.map(r => <span key={r} className="badge badge-teal">{r}</span>)}
          </div>
        </div>
        <form onSubmit={handleSave}>
          <div className="form-group"><label className="form-label">Nombre</label><input type="text" className="form-input" value={form.nombre} onChange={(e) => setForm({...form, nombre: e.target.value})} /></div>
          <div className="form-group"><label className="form-label">Apellido</label><input type="text" className="form-input" value={form.apellido} onChange={(e) => setForm({...form, apellido: e.target.value})} /></div>
          <div className="form-group"><label className="form-label">Teléfono</label><input type="tel" className="form-input" value={form.telefono} onChange={(e) => setForm({...form, telefono: e.target.value})} /></div>
          <button type="submit" className="btn btn-primary w-full" disabled={saving}><Save size={16} /> {saving ? 'Guardando...' : 'Guardar Cambios'}</button>
        </form>
      </div>
    </div></div>
  );
}

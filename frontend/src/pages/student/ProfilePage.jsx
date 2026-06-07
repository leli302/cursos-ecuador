import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';
import { User, Save, Crown, AlertCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user, isPremium } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ nombre: user?.nombre || '', apellido: user?.apellido || '', telefono: user?.telefono || '' });
  const [saving, setSaving] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    if (isPremium()) {
      api.get('/memberships/my-subscription')
        .then(({ data }) => {
          if (data.subscription && data.subscription.estado === 'activa') {
            setSubscription(data.subscription);
          }
        })
        .catch(() => {});
    }
  }, [isPremium]);

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

  const handleCancelSubscription = async () => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar tu membresía Premium? Perderás todos tus beneficios al finalizar el periodo actual.')) {
      return;
    }
    
    setCanceling(true);
    try {
      await api.delete('/memberships/cancel');
      toast.success('Membresía cancelada con éxito');
      setSubscription(null);
      // Recargar datos de autenticación para remover rol premium
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      toast.error('Error al cancelar la suscripción');
    } finally {
      setCanceling(false);
    }
  };

  return (
    <div className="page"><div className="container" style={{ maxWidth: 600 }}>
      <h1 className="page-title mb-8">Mi Perfil</h1>
      
      <div className="card mb-6" style={{ padding: 'var(--space-8)' }}>
        <div className="text-center mb-6">
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'white', marginBottom: 'var(--space-3)' }}>
            {user?.nombre?.[0]}{user?.apellido?.[0]}
          </div>
          <p className="text-sm text-muted">{user?.email}</p>
          <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
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

      {/* Tarjeta de Suscripción */}
      {subscription && (
        <div className="card" style={{ padding: 'var(--space-6)', border: '1px solid rgba(245,166,35,0.2)' }}>
          <div className="flex items-center gap-2 mb-4" style={{ color: 'var(--accent-gold)' }}>
            <Crown size={20} />
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, margin: 0 }}>Membresía Premium Activa</h3>
          </div>
          <div className="text-sm text-muted mb-4">
            <p><strong>Plan:</strong> {subscription.membresia_nombre} ({subscription.tipo})</p>
            <p className="mt-1">
              <strong>Vence el:</strong> {new Date(subscription.fecha_fin).toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
            </p>
          </div>
          <button 
            type="button" 
            onClick={handleCancelSubscription} 
            className="btn btn-outline btn-sm w-full" 
            style={{ borderColor: 'var(--accent-orange)', color: 'var(--accent-orange)' }}
            disabled={canceling}
          >
            <AlertCircle size={14} /> {canceling ? 'Cancelando...' : 'Cancelar Membresía Premium'}
          </button>
        </div>
      )}

    </div></div>
  );
}

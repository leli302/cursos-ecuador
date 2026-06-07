import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User, Mail, Lock, Phone, GraduationCap, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', password: '', confirmPassword: '', telefono: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Las contraseñas no coinciden');
    if (form.password.length < 6) return toast.error('La contraseña debe tener al menos 6 caracteres');
    setLoading(true);
    try {
      await register(form);
      toast.success('¡Registro exitoso! Bienvenido.');
      navigate('/mi-panel');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page flex items-center justify-center" style={{ minHeight: 'calc(100vh - 72px)', padding: 'var(--space-8) 0' }}>
      <div className="animate-scale" style={{ width: '100%', maxWidth: 480 }}>
        <div className="card-glass" style={{ padding: 'var(--space-10)', border: '1px solid rgba(78,205,196,0.15)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)' }}>
          <div className="text-center mb-8">
            <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-lg)', background: 'var(--gradient-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
              <GraduationCap size={28} color="white" />
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Crear Cuenta</h1>
            <p className="text-muted text-sm mt-2">Únete a miles de estudiantes</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input type="text" name="nombre" className="form-input" placeholder="Tu nombre" value={form.nombre} onChange={handleChange} required id="register-name" />
              </div>
              <div className="form-group">
                <label className="form-label">Apellido</label>
                <input type="text" name="apellido" className="form-input" placeholder="Tu apellido" value={form.apellido} onChange={handleChange} required id="register-lastname" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="email" name="email" className="form-input" placeholder="tu@email.com" value={form.email} onChange={handleChange} style={{ paddingLeft: 44 }} required id="register-email" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Teléfono (opcional)</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="tel" name="telefono" className="form-input" placeholder="0991234567" value={form.telefono} onChange={handleChange} style={{ paddingLeft: 44 }} id="register-phone" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type={showPass ? 'text' : 'password'} name="password" className="form-input" placeholder="Mínimo 6 caracteres" value={form.password} onChange={handleChange} style={{ paddingLeft: 44, paddingRight: 44 }} required id="register-password" />
                <button type="button" className="btn-icon" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirmar Contraseña</label>
              <input type="password" name="confirmPassword" className="form-input" placeholder="Repite tu contraseña" value={form.confirmPassword} onChange={handleChange} required id="register-confirm-password" />
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading} id="register-submit">
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-muted">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" style={{ color: 'var(--accent-teal)', fontWeight: 600 }}>Inicia sesión</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

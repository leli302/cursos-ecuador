import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Mail, Lock, GraduationCap, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      toast.success(`¡Bienvenido, ${data.user.nombre}!`);
      if (data.user.roles.includes('administrador')) navigate('/admin');
      else navigate('/mi-panel');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page flex items-center justify-center" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="animate-scale" style={{ width: '100%', maxWidth: 440 }}>
        <div className="card-glass" style={{
          padding: 'var(--space-10)',
          border: '1px solid rgba(78,205,196,0.15)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)'
        }}>
          <div className="text-center mb-8">
            <div style={{
              width: 56, height: 56, borderRadius: 'var(--radius-lg)',
              background: 'var(--gradient-primary)', display: 'inline-flex',
              alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)'
            }}>
              <GraduationCap size={28} color="white" />
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Inicia Sesión</h1>
            <p className="text-muted text-sm mt-2">Ingresa a tu cuenta para continuar aprendiendo</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="email" className="form-input" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ paddingLeft: 44 }} required id="login-email" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type={showPass ? 'text' : 'password'} className="form-input" placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ paddingLeft: 44, paddingRight: 44 }} required id="login-password" />
                <button type="button" className="btn-icon" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full mt-2" disabled={loading} id="login-submit">
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-muted">
              ¿No tienes cuenta?{' '}
              <Link to="/registro" style={{ color: 'var(--accent-teal)', fontWeight: 600 }}>Regístrate gratis</Link>
            </p>
          </div>

          {/* Demo credentials */}
          <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-4)', background: 'rgba(78,205,196,0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(78,205,196,0.1)' }}>
            <p className="text-xs text-muted text-center mb-2">Cuentas de demostración:</p>
            <div className="text-xs text-muted">
              <p><strong>Admin:</strong> admin@cursosecuador.com</p>
              <p><strong>Estudiante:</strong> estudiante@cursosecuador.com</p>
              <p className="mt-1" style={{ color: 'var(--text-muted)' }}>Contraseña para ambos: <code style={{ color: 'var(--accent-teal)' }}>123456</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

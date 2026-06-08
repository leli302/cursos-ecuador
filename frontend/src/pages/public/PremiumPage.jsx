import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Crown, Check, BookOpen, Award, Shield, Clock, Zap, Star } from 'lucide-react';

export default function PremiumPage() {
  const { isAuthenticated, isPremium, isAdmin, isInstructor } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/memberships').then(({ data }) => setMemberships(data.data));
  }, []);

  const handleSubscribe = async (membershipId, tipo) => {
    if (!isAuthenticated) return navigate('/login');
    if (isAdmin() || isInstructor()) {
      return toast.warning('Las cuentas de administrador o instructor no pueden adquirir membresías.');
    }
    if (isPremium()) return toast.info('Ya eres premium.');
    setLoading(true);
    try {
      await api.post('/memberships/subscribe', { membresia_id: membershipId, tipo });
      toast.success('¡Bienvenido a Premium! 🎉');
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al suscribirse');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <BookOpen size={20} />, title: 'Todos los cursos', desc: 'Acceso ilimitado a todo el catálogo' },
    { icon: <Award size={20} />, title: 'Certificados incluidos', desc: 'Sin costo adicional al completar cursos' },
    { icon: <Shield size={20} />, title: '15% de descuento', desc: 'En compras individuales de cursos' },
    { icon: <Clock size={20} />, title: 'Acceso anticipado', desc: 'Sé el primero en ver nuevos contenidos' },
    { icon: <Zap size={20} />, title: 'Prioridad en cupos', desc: 'Reserva tu lugar antes que nadie' },
    { icon: <Star size={20} />, title: 'Contenido exclusivo', desc: 'Cursos y materiales solo para premium' }
  ];

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 960 }}>
        {/* Hero */}
        <div className="text-center mb-16 animate-fade-in">
          <Crown size={56} style={{ color: 'var(--accent-gold)', margin: '0 auto var(--space-4)', display: 'block' }} />
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>
            Hazte <span style={{ color: 'var(--accent-gold)' }}>Premium</span>
          </h1>
          <p className="text-muted text-lg" style={{ maxWidth: 500, margin: '0 auto' }}>
            Invierte en tu futuro con acceso ilimitado a todos nuestros cursos y beneficios exclusivos.
          </p>
        </div>

        {/* Plans */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-16)' }}>
          {/* Free */}
          <div className="card" style={{ padding: 'var(--space-8)' }}>
            <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>Gratuito</h3>
            <p className="text-muted text-sm mb-6">Acceso básico</p>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)', fontWeight: 800, marginBottom: 'var(--space-6)' }}>
              $0<span className="text-muted text-sm" style={{ fontWeight: 400 }}>/siempre</span>
            </div>
            <div className="flex flex-col gap-3 mb-6">
              {['Cursos gratuitos', 'Vista previa de cursos', 'Comunidad básica'].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Check size={14} style={{ color: 'var(--accent-green)' }} /> {item}
                </div>
              ))}
            </div>
            <button className="btn btn-outline w-full" disabled>Plan actual</button>
          </div>

          {/* Monthly - Highlighted */}
          <div className="card" style={{
            padding: 'var(--space-8)',
            border: '2px solid var(--accent-gold)',
            position: 'relative',
            boxShadow: 'var(--shadow-glow-gold)'
          }}>
            <span className="badge badge-gold" style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', padding: '4px 16px' }}>
              MÁS POPULAR
            </span>
            <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)', color: 'var(--accent-gold)' }}>Premium Mensual</h3>
            <p className="text-muted text-sm mb-6">Acceso completo mes a mes</p>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)', fontWeight: 800, marginBottom: 'var(--space-6)' }}>
              $9.99<span className="text-muted text-sm" style={{ fontWeight: 400 }}>/mes</span>
            </div>
            <div className="flex flex-col gap-3 mb-6">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Check size={14} style={{ color: 'var(--accent-gold)' }} /> {f.title}
                </div>
              ))}
            </div>
            <button
              onClick={() => handleSubscribe(memberships.find(m => m.nombre.includes('Mensual'))?.id || 2, 'mensual')}
              className="btn btn-gold btn-lg w-full"
              disabled={loading}
              id="subscribe-monthly"
            >
              {loading ? 'Procesando...' : 'Suscribirse Mensual'}
            </button>
          </div>

          {/* Annual */}
          <div className="card" style={{ padding: 'var(--space-8)' }}>
            <span className="badge badge-green" style={{ position: 'absolute', top: 16, right: 16 }}>AHORRA 17%</span>
            <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>Premium Anual</h3>
            <p className="text-muted text-sm mb-6">Mejor precio, pago anual</p>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)', fontWeight: 800, marginBottom: 'var(--space-1)' }}>
              $99.99<span className="text-muted text-sm" style={{ fontWeight: 400 }}>/año</span>
            </div>
            <p className="text-sm text-muted mb-6">$8.33/mes equivalente</p>
            <div className="flex flex-col gap-3 mb-6">
              {[...features.map(f => f.title), 'Soporte prioritario'].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Check size={14} style={{ color: 'var(--accent-green)' }} /> {item}
                </div>
              ))}
            </div>
            <button
              onClick={() => handleSubscribe(memberships.find(m => m.nombre.includes('Anual'))?.id || 3, 'anual')}
              className="btn btn-primary btn-lg w-full"
              disabled={loading}
              id="subscribe-annual"
            >
              {loading ? 'Procesando...' : 'Suscribirse Anual'}
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="text-center mb-8">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', fontWeight: 700 }}>Todo lo que incluye Premium</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-6)' }} className="stagger-children">
          {features.map((f, i) => (
            <div key={i} className="card flex items-start gap-4">
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(245,166,35,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)', flexShrink: 0 }}>
                {f.icon}
              </div>
              <div>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 4 }}>{f.title}</h4>
                <p className="text-xs text-muted">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

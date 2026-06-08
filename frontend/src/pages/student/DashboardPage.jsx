import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Award, ShoppingCart, Crown, TrendingUp, Clock } from 'lucide-react';

export default function DashboardPage() {
  const { user, isPremium, isAdmin, isInstructor } = useAuth();

  if (isAdmin()) {
    return <Navigate to="/admin" replace />;
  }
  if (isInstructor()) {
    return <Navigate to="/admin/cursos" replace />;
  }
  const [library, setLibrary] = useState({ courses: [], certificates: [], totalCourses: 0, completedCourses: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/library').then(({ data }) => { setLibrary(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const stats = [
    { icon: <BookOpen size={22} />, value: library.totalCourses, label: 'Cursos Activos', color: 'var(--accent-teal)', bg: 'rgba(78,205,196,0.1)', path: '/mi-biblioteca' },
    { icon: <Award size={22} />, value: library.completedCourses, label: 'Completados', color: 'var(--accent-green)', bg: 'rgba(16,185,129,0.1)', path: '/mi-biblioteca' },
    { icon: <TrendingUp size={22} />, value: library.certificates.length, label: 'Certificados', color: 'var(--accent-purple)', bg: 'rgba(168,85,247,0.1)', path: '/mis-certificados' },
    { icon: <Crown size={22} />, value: isPremium() ? 'Activo' : 'No', label: 'Premium', color: 'var(--accent-gold)', bg: 'rgba(245,166,35,0.1)', path: isPremium() ? '/mi-perfil' : '/premium' }
  ];

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">¡Hola, {user?.nombre}! 👋</h1>
          <p className="text-muted mt-2">Continúa tu aprendizaje</p>
        </div>

        {/* Stats */}
        <div className="grid grid-4 mb-8 stagger-children">
          {stats.map((s, i) => (
            <Link key={i} to={s.path} className="stat-card" style={{ textDecoration: 'none', cursor: 'pointer' }}>
              <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </Link>
          ))}
        </div>

        {/* Recent Courses */}
        <div className="section">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title" style={{ marginBottom: 0 }}>Mis Cursos en Progreso</h2>
            <Link to="/mi-biblioteca" className="btn btn-ghost text-sm">Ver todos</Link>
          </div>
          {loading ? (
            <div className="grid grid-3">{[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 200, borderRadius: 'var(--radius-lg)' }} />)}</div>
          ) : library.courses.length > 0 ? (
            <div className="grid grid-3 stagger-children">
              {library.courses.slice(0, 6).map(course => (
                <Link to={`/mi-biblioteca`} key={course.id} className="card" style={{ textDecoration: 'none', padding: 0, overflow: 'hidden' }}>
                  <img src={course.imagen || `https://placehold.co/640x360/142241/4ECDC4?text=${encodeURIComponent(course.nombre)}&font=roboto`} alt={course.nombre} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                  <div style={{ padding: 'var(--space-4)' }}>
                    <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>{course.nombre}</h4>
                    <p className="text-xs text-muted mb-3">{course.instructor_nombre} {course.instructor_apellido}</p>
                    <div className="progress-bar mb-2">
                      <div className="progress-bar-fill" style={{ width: `${course.progreso}%` }} />
                    </div>
                    <span className="text-xs text-muted">{course.progreso}% completado</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="card text-center p-8">
              <BookOpen size={48} style={{ color: 'var(--text-muted)', margin: '0 auto var(--space-4)' }} />
              <h3 className="mb-2">Sin cursos aún</h3>
              <p className="text-muted mb-4">Explora nuestro catálogo y empieza a aprender</p>
              <Link to="/catalogo" className="btn btn-primary">Explorar Cursos</Link>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-3 stagger-children">
          <Link to="/mi-biblioteca" className="card flex items-center gap-4" style={{ textDecoration: 'none' }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'rgba(78,205,196,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-teal)' }}><BookOpen size={22} /></div>
            <div><h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Mi Biblioteca</h4><p className="text-xs text-muted">Videos, PDFs y recursos</p></div>
          </Link>
          <Link to="/mis-certificados" className="card flex items-center gap-4" style={{ textDecoration: 'none' }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'rgba(168,85,247,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple)' }}><Award size={22} /></div>
            <div><h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Mis Certificados</h4><p className="text-xs text-muted">Descarga tus certificados</p></div>
          </Link>
          <Link to="/mis-compras" className="card flex items-center gap-4" style={{ textDecoration: 'none' }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'rgba(245,166,35,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)' }}><ShoppingCart size={22} /></div>
            <div><h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Mis Compras</h4><p className="text-xs text-muted">Historial de compras</p></div>
          </Link>
        </div>
      </div>
    </div>
  );
}

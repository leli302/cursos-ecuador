import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Users, BookOpen, ShoppingCart, DollarSign, TrendingUp, BarChart3 } from 'lucide-react';

export default function AdminDashboardPage() {
  const { isInstructor } = useAuth();

  if (isInstructor()) {
    return <Navigate to="/admin/cursos" replace />;
  }

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => { setData(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="page container"><div className="grid grid-4">{[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 'var(--radius-lg)' }} />)}</div></div>;

  const stats = [
    { icon: <Users size={22} />, value: data?.stats.totalUsers, label: 'Usuarios', color: 'var(--accent-teal)', bg: 'rgba(78,205,196,0.1)' },
    { icon: <BookOpen size={22} />, value: data?.stats.totalCourses, label: 'Cursos', color: 'var(--accent-blue)', bg: 'rgba(59,130,246,0.1)' },
    { icon: <ShoppingCart size={22} />, value: data?.stats.totalOrders, label: 'Ventas', color: 'var(--accent-purple)', bg: 'rgba(168,85,247,0.1)' },
    { icon: <DollarSign size={22} />, value: `$${data?.stats.totalRevenue.toFixed(2)}`, label: 'Ingresos', color: 'var(--accent-green)', bg: 'rgba(16,185,129,0.1)' }
  ];

  return (
    <div className="page"><div className="container">
      <div className="page-header"><h1 className="page-title">Panel de Administración</h1></div>

      <div className="grid grid-4 mb-8 stagger-children">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        {/* Recent Orders */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg">Últimas Ventas</h3>
            <Link to="/admin/ordenes" className="btn btn-ghost btn-sm">Ver todas</Link>
          </div>
          <div className="table-container"><table>
            <thead><tr><th>Código</th><th>Cliente</th><th>Total</th></tr></thead>
            <tbody>{data?.recentOrders.map(o => (
              <tr key={o.id}><td className="text-sm"><code>{o.codigo}</code></td><td className="text-sm">{o.nombre} {o.apellido}</td><td className="font-semibold">${parseFloat(o.total).toFixed(2)}</td></tr>
            ))}</tbody>
          </table></div>
        </div>

        {/* Top Courses */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg">Cursos Top</h3>
            <Link to="/admin/cursos" className="btn btn-ghost btn-sm">Ver todos</Link>
          </div>
          <div className="flex flex-col gap-3">
            {data?.topCourses.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3">
                <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>{i + 1}</span>
                <span className="text-sm" style={{ flex: 1 }}>{c.nombre}</span>
                <span className="text-sm text-muted">{c.total_ventas} ventas</span>
                <span className="badge badge-gold">{parseFloat(c.valoracion).toFixed(1)}⭐</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-4 mt-8 stagger-children">
        {[
          { to: '/admin/cursos', icon: <BookOpen size={20} />, label: 'Gestionar Cursos', color: 'var(--accent-teal)' },
          { to: '/admin/usuarios', icon: <Users size={20} />, label: 'Gestionar Usuarios', color: 'var(--accent-blue)' },
          { to: '/admin/categorias', icon: <BarChart3 size={20} />, label: 'Categorías', color: 'var(--accent-purple)' },
          { to: '/admin/ordenes', icon: <ShoppingCart size={20} />, label: 'Órdenes', color: 'var(--accent-gold)' }
        ].map((link, i) => (
          <Link key={i} to={link.to} className="card flex items-center gap-3" style={{ textDecoration: 'none', padding: 'var(--space-5)' }}>
            <span style={{ color: link.color }}>{link.icon}</span>
            <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{link.label}</span>
          </Link>
        ))}
      </div>
    </div></div>
  );
}

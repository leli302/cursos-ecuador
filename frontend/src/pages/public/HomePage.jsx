import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import CourseCard from '../../components/common/CourseCard';
import { TrendingUp, Award, Crown, Zap, BookOpen, Users, ArrowRight, Star, Shield, Clock } from 'lucide-react';

export default function HomePage() {
  const [bestsellers, setBestsellers] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [premium, setPremium] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bs, rec, prem, cats] = await Promise.all([
          api.get('/courses/bestsellers?limit=4'),
          api.get('/courses/recommended?limit=4'),
          api.get('/courses/premium?limit=4'),
          api.get('/categories')
        ]);
        setBestsellers(bs.data.data);
        setRecommended(rec.data.data);
        setPremium(prem.data.data);
        setCategories(cats.data.data);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categoryIcons = {
    'Tecnología': <Zap size={24} />,
    'Negocios': <TrendingUp size={24} />,
    'Diseño': <Star size={24} />,
    'Marketing': <Users size={24} />,
    'Idiomas': <BookOpen size={24} />,
    'Arte y Cultura': <Award size={24} />
  };

  const SkeletonCard = () => (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="skeleton" style={{ height: 180 }} />
      <div style={{ padding: 'var(--space-5)' }}>
        <div className="skeleton" style={{ height: 12, width: 80, marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 18, marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 14, width: '40%' }} />
      </div>
    </div>
  );

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section style={{
        position: 'relative',
        padding: 'var(--space-20) 0',
        overflow: 'hidden',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center'
      }}>
        {/* Animated background orbs */}
        <div style={{
          position: 'absolute', top: '10%', left: '5%', width: 400, height: 400,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(78,205,196,0.08) 0%, transparent 70%)',
          animation: 'float 8s ease-in-out infinite', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '10%', width: 350, height: 350,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
          animation: 'float 10s ease-in-out infinite', animationDelay: '2s', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', top: '40%', right: '30%', width: 250, height: 250,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,166,35,0.06) 0%, transparent 70%)',
          animation: 'float 12s ease-in-out infinite', animationDelay: '4s', pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
            <div className="animate-fade-in">
              <span className="badge badge-teal mb-4" style={{ fontSize: 'var(--text-xs)', padding: '6px 16px' }}>
                🎓 Plataforma #1 de Ecuador
              </span>
            </div>

            <h1 className="animate-fade-in" style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 'var(--space-6)',
              animationDelay: '0.1s'
            }}>
              Transforma tu carrera con{' '}
              <span style={{
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>cursos profesionales</span>
            </h1>

            <p className="animate-fade-in" style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: 'var(--space-8)',
              maxWidth: 560,
              margin: '0 auto var(--space-8)',
              animationDelay: '0.2s'
            }}>
              Accede a más de 100 cursos de tecnología, negocios, diseño y más.
              Aprende desde cualquier lugar con certificación incluida.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Link to="/catalogo" className="btn btn-primary btn-lg" id="hero-cta-explore">
                Explorar Cursos <ArrowRight size={18} />
              </Link>
              <Link to="/premium" className="btn btn-gold btn-lg" id="hero-cta-premium">
                <Crown size={18} /> Ser Premium
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-12 flex-wrap animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {[
                { icon: <BookOpen size={18} />, value: '100+', label: 'Cursos' },
                { icon: <Users size={18} />, value: '5,000+', label: 'Estudiantes' },
                { icon: <Award size={18} />, value: '2,000+', label: 'Certificados' },
                { icon: <Star size={18} />, value: '4.8', label: 'Valoración' }
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div style={{ color: 'var(--accent-teal)' }}>{stat.icon}</div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-xl)' }}>{stat.value}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="section" style={{ paddingBottom: 'var(--space-12)' }}>
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title" style={{ marginBottom: 0 }}>Explora por Categoría</h2>
            <Link to="/catalogo" className="btn btn-ghost text-sm">Ver todas <ArrowRight size={14} /></Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--space-4)' }} className="stagger-children">
            {categories.map(cat => (
              <Link to={`/catalogo?category=${cat.id}`} key={cat.id} className="card" style={{
                padding: 'var(--space-5)', textAlign: 'center', textDecoration: 'none',
                cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)'
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 'var(--radius-md)',
                  background: 'rgba(78,205,196,0.1)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: 'var(--accent-teal)'
                }}>
                  {categoryIcons[cat.nombre] || <BookOpen size={24} />}
                </div>
                <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{cat.nombre}</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{cat.total_cursos} cursos</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BESTSELLERS ===== */}
      <section className="section">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="badge badge-orange mb-2"><TrendingUp size={12} /> TRENDING</span>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Cursos Más Vendidos</h2>
            </div>
            <Link to="/catalogo?sort=sales" className="btn btn-outline btn-sm">Ver todos <ArrowRight size={14} /></Link>
          </div>
          <div className="grid grid-4 stagger-children">
            {loading ? [1,2,3,4].map(i => <SkeletonCard key={i} />) :
              bestsellers.map(course => <CourseCard key={course.id} course={course} />)
            }
          </div>
        </div>
      </section>

      {/* ===== RECOMMENDED ===== */}
      <section className="section">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="badge badge-teal mb-2"><Zap size={12} /> PARA TI</span>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Recomendados</h2>
            </div>
            <Link to="/catalogo?sort=rating" className="btn btn-outline btn-sm">Ver todos <ArrowRight size={14} /></Link>
          </div>
          <div className="grid grid-4 stagger-children">
            {loading ? [1,2,3,4].map(i => <SkeletonCard key={i} />) :
              recommended.map(course => <CourseCard key={course.id} course={course} />)
            }
          </div>
        </div>
      </section>

      {/* ===== PREMIUM BANNER ===== */}
      <section className="section">
        <div className="container">
          <div className="card-glass" style={{
            padding: 'var(--space-12)',
            background: 'linear-gradient(135deg, rgba(245,166,35,0.08) 0%, rgba(236,72,153,0.08) 50%, rgba(168,85,247,0.08) 100%)',
            border: '1px solid rgba(245,166,35,0.2)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', top: -50, right: -50, width: 200, height: 200,
              borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,166,35,0.1) 0%, transparent 70%)'
            }} />
            <Crown size={48} style={{ color: 'var(--accent-gold)', marginBottom: 'var(--space-4)', display: 'inline-block' }} />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>
              Hazte <span style={{ color: 'var(--accent-gold)' }}>Premium</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto var(--space-6)', lineHeight: 1.7 }}>
              Acceso ilimitado a todos los cursos, certificados incluidos, 15% de descuento y acceso anticipado a nuevos contenidos.
            </p>
            <div className="flex items-center justify-center gap-6 mb-6 flex-wrap">
              {[
                { icon: <BookOpen size={16} />, text: 'Todos los cursos' },
                { icon: <Award size={16} />, text: 'Certificados gratis' },
                { icon: <Shield size={16} />, text: '15% descuento' },
                { icon: <Clock size={16} />, text: 'Acceso anticipado' }
              ].map((item, i) => (
                <span key={i} className="flex items-center gap-2" style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                  <span style={{ color: 'var(--accent-gold)' }}>{item.icon}</span> {item.text}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-center gap-4">
              <Link to="/premium" className="btn btn-gold btn-lg">
                <Crown size={18} /> Desde $9.99/mes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PREMIUM COURSES ===== */}
      {premium.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="badge badge-gold mb-2"><Crown size={12} /> EXCLUSIVOS</span>
                <h2 className="section-title" style={{ marginBottom: 0 }}>Cursos Premium</h2>
              </div>
              <Link to="/catalogo?premium=true" className="btn btn-outline btn-sm">Ver todos <ArrowRight size={14} /></Link>
            </div>
            <div className="grid grid-4 stagger-children">
              {premium.map(course => <CourseCard key={course.id} course={course} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

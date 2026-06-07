import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Search, ShoppingCart, User, Menu, X, BookOpen, LayoutDashboard, LogOut, Crown, GraduationCap, Settings, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, isInstructor, logout } = useAuth();
  const { cart } = useCart();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogo?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenu(false);
    navigate('/');
  };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 'var(--z-sticky)',
      background: 'rgba(10, 22, 40, 0.85)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)', height: '72px'
    }}>
      <div className="container flex items-center justify-between" style={{ height: '100%' }}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3" style={{ textDecoration: 'none' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 'var(--radius-md)',
            background: 'var(--gradient-primary)', display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}>
            <GraduationCap size={22} color="white" />
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-heading)', fontWeight: 800,
              fontSize: 'var(--text-lg)', color: 'var(--text-primary)'
            }}>Cursos</span>
            <span style={{
              fontFamily: 'var(--font-heading)', fontWeight: 800,
              fontSize: 'var(--text-lg)', color: 'var(--accent-teal)', marginLeft: 4
            }}>Ecuador</span>
          </div>
        </Link>

        {/* Search Bar (desktop) */}
        <form onSubmit={handleSearch} className="flex items-center" style={{
          flex: '0 1 480px', display: 'none', position: 'relative',
          ...(window.innerWidth > 768 ? { display: 'flex' } : {})
        }}>
          <input
            type="text"
            placeholder="Buscar cursos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{
              paddingRight: 48, background: 'var(--bg-card)',
              borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)',
              fontSize: 'var(--text-sm)'
            }}
          />
          <button type="submit" className="btn-icon" style={{
            position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)'
          }}>
            <Search size={18} />
          </button>
        </form>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Nav Links (desktop) */}
          <div className="flex items-center gap-1" style={{
            display: window.innerWidth > 768 ? 'flex' : 'none'
          }}>
            <Link to="/catalogo" className="btn btn-ghost" style={{ fontSize: 'var(--text-sm)' }}>
              Catálogo
            </Link>
            <Link to="/premium" className="btn btn-ghost" style={{ fontSize: 'var(--text-sm)', color: 'var(--accent-gold)' }}>
              <Crown size={16} /> Premium
            </Link>
          </div>

          {/* Cart */}
          {isAuthenticated && (
            <Link to="/carrito" className="btn-icon" style={{ position: 'relative' }}>
              <ShoppingCart size={22} />
              {cart.itemCount > 0 && (
                <span style={{
                  position: 'absolute', top: -2, right: -2,
                  background: 'var(--accent-red)', color: 'white',
                  fontSize: '0.65rem', fontWeight: 700,
                  width: 18, height: 18, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>{cart.itemCount}</span>
              )}
            </Link>
          )}

          {/* User Menu */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenu(!userMenu)}
                className="flex items-center gap-2 btn btn-ghost"
                style={{ padding: '6px 12px' }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'var(--gradient-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 'var(--text-sm)', fontWeight: 700, color: 'white'
                }}>
                  {user?.nombre?.[0]}{user?.apellido?.[0]}
                </div>
                <ChevronDown size={14} style={{
                  transition: 'transform 0.2s',
                  transform: userMenu ? 'rotate(180deg)' : 'rotate(0)'
                }} />
              </button>

              {userMenu && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setUserMenu(false)} />
                  <div style={{
                    position: 'absolute', right: 0, top: '100%', marginTop: 8,
                    background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-lg)', padding: '8px', minWidth: 220,
                    boxShadow: 'var(--shadow-xl)', zIndex: 100,
                    animation: 'scaleIn 0.15s ease-out'
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', marginBottom: 4 }}>
                      <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{user?.nombre} {user?.apellido}</p>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{user?.email}</p>
                    </div>

                    <Link to="/mi-panel" onClick={() => setUserMenu(false)} className="flex items-center gap-3" style={{ padding: '10px 16px', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', transition: 'all 0.15s' }}>
                      <LayoutDashboard size={16} /> Mi Panel
                    </Link>
                    <Link to="/mi-biblioteca" onClick={() => setUserMenu(false)} className="flex items-center gap-3" style={{ padding: '10px 16px', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', transition: 'all 0.15s' }}>
                      <BookOpen size={16} /> Mi Biblioteca
                    </Link>
                    <Link to="/mis-compras" onClick={() => setUserMenu(false)} className="flex items-center gap-3" style={{ padding: '10px 16px', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', transition: 'all 0.15s' }}>
                      <ShoppingCart size={16} /> Mis Compras
                    </Link>
                    <Link to="/mi-perfil" onClick={() => setUserMenu(false)} className="flex items-center gap-3" style={{ padding: '10px 16px', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', transition: 'all 0.15s' }}>
                      <Settings size={16} /> Mi Perfil
                    </Link>

                    {(isAdmin() || isInstructor()) && (
                      <>
                        <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '4px 0' }} />
                        <Link to="/admin" onClick={() => setUserMenu(false)} className="flex items-center gap-3" style={{ padding: '10px 16px', borderRadius: 'var(--radius-md)', color: 'var(--accent-teal)', fontSize: 'var(--text-sm)', transition: 'all 0.15s' }}>
                          <LayoutDashboard size={16} /> Panel Admin
                        </Link>
                      </>
                    )}

                    <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '4px 0' }} />
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full" style={{ padding: '10px 16px', borderRadius: 'var(--radius-md)', color: 'var(--accent-red)', fontSize: 'var(--text-sm)', background: 'transparent', textAlign: 'left' }}>
                      <LogOut size={16} /> Cerrar Sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn btn-ghost" style={{ fontSize: 'var(--text-sm)' }}>Ingresar</Link>
              <Link to="/registro" className="btn btn-primary btn-sm">Registrarse</Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button className="btn-icon" onClick={() => setMobileMenu(!mobileMenu)}
            style={{ display: window.innerWidth <= 768 ? 'flex' : 'none' }}>
            {mobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenu && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)',
          padding: 'var(--space-4)', animation: 'fadeIn 0.2s ease-out'
        }}>
          <form onSubmit={handleSearch} style={{ marginBottom: 'var(--space-4)' }}>
            <input type="text" placeholder="Buscar cursos..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} className="form-input w-full" />
          </form>
          <Link to="/catalogo" onClick={() => setMobileMenu(false)} className="flex items-center gap-3" style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>Catálogo</Link>
          <Link to="/premium" onClick={() => setMobileMenu(false)} className="flex items-center gap-3" style={{ padding: '12px 0', color: 'var(--accent-gold)' }}><Crown size={16} /> Premium</Link>
        </div>
      )}
    </nav>
  );
}

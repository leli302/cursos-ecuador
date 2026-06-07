import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-subtle)',
      padding: 'var(--space-16) 0 var(--space-8)'
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-10)' }}>
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4" style={{ textDecoration: 'none' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GraduationCap size={22} color="white" />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--text-primary)' }}>
                Cursos<span style={{ color: 'var(--accent-teal)' }}>Ecuador</span>
              </span>
            </Link>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.7, maxWidth: 300 }}>
              Plataforma líder de educación online en Ecuador. Aprende con los mejores instructores y transforma tu carrera profesional.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Plataforma</h4>
            <div className="flex flex-col gap-3">
              <Link to="/catalogo" style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Catálogo de Cursos</Link>
              <Link to="/premium" style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Membresía Premium</Link>
              <Link to="/catalogo?sort=sales" style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Más Vendidos</Link>
              <Link to="/catalogo?sort=newest" style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Nuevos Cursos</Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Categorías</h4>
            <div className="flex flex-col gap-3">
              <Link to="/catalogo?category=1" style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Tecnología</Link>
              <Link to="/catalogo?category=2" style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Negocios</Link>
              <Link to="/catalogo?category=3" style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Diseño</Link>
              <Link to="/catalogo?category=4" style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Marketing</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contacto</h4>
            <div className="flex flex-col gap-3">
              <span className="flex items-center gap-2" style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                <Mail size={14} /> info@cursosecuador.com
              </span>
              <span className="flex items-center gap-2" style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                <Phone size={14} /> +593 9 1234 5678
              </span>
              <span className="flex items-center gap-2" style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                <MapPin size={14} /> Quito, Ecuador
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          marginTop: 'var(--space-10)', paddingTop: 'var(--space-6)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 'var(--space-4)'
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
            © {new Date().getFullYear()} Cursos Ecuador. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>Términos</a>
            <a href="#" style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>Privacidad</a>
            <a href="#" style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>Soporte</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

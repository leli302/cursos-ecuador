import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, PlayCircle, FileText, Download, Lock, Code, Briefcase, Palette, Megaphone, Languages, Award } from 'lucide-react';

export default function LibraryPage() {
  const { isAdmin, isInstructor } = useAuth();

  if (isAdmin()) {
    return <Navigate to="/admin" replace />;
  }
  if (isInstructor()) {
    return <Navigate to="/admin/cursos" replace />;
  }
  const [library, setLibrary] = useState({ courses: [], certificates: [] });
  const [loading, setLoading] = useState(true);

  const getCategoryIcon = (categoryName) => {
    switch (categoryName) {
      case 'Tecnología':
        return <Code size={40} style={{ color: '#ffffff', opacity: 0.9 }} />;
      case 'Negocios':
        return <Briefcase size={40} style={{ color: '#ffffff', opacity: 0.9 }} />;
      case 'Diseño':
        return <Palette size={40} style={{ color: '#ffffff', opacity: 0.9 }} />;
      case 'Marketing':
        return <Megaphone size={40} style={{ color: '#ffffff', opacity: 0.9 }} />;
      case 'Idiomas':
        return <Languages size={40} style={{ color: '#ffffff', opacity: 0.9 }} />;
      case 'Arte y Cultura':
        return <Award size={40} style={{ color: '#ffffff', opacity: 0.9 }} />;
      default:
        return <BookOpen size={40} style={{ color: '#ffffff', opacity: 0.9 }} />;
    }
  };

  const getCategoryGradient = (categoryName) => {
    switch (categoryName) {
      case 'Tecnología':
        return 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)';
      case 'Negocios':
        return 'linear-gradient(135deg, #10B981 0%, #047857 100%)';
      case 'Diseño':
        return 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)';
      case 'Marketing':
        return 'linear-gradient(135deg, #F97316 0%, #C2410C 100%)';
      case 'Idiomas':
        return 'linear-gradient(135deg, #A855F7 0%, #6B21A8 100%)';
      case 'Arte y Cultura':
        return 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)';
      default:
        return 'linear-gradient(135deg, #6B7280 0%, #374151 100%)';
    }
  };

  useEffect(() => {
    api.get('/library').then(({ data }) => { setLibrary(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title mb-8">Mi Biblioteca</h1>
        {loading ? (
          <div className="grid grid-3">{[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 250, borderRadius: 'var(--radius-lg)' }} />)}</div>
        ) : library.courses.length > 0 ? (
          <div className="grid grid-3 stagger-children">
            {library.courses.map(course => (
              <div key={course.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="course-image" style={{ 
                  position: 'relative', 
                  height: 160, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  background: course.imagen ? 'transparent' : getCategoryGradient(course.categoria_nombre) 
                }}>
                  {course.imagen ? (
                    <img
                      src={course.imagen}
                      alt={course.nombre}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { 
                        e.target.style.display = 'none';
                        e.target.parentNode.style.background = getCategoryGradient(course.categoria_nombre);
                        const iconWrapper = document.createElement('div');
                        iconWrapper.style.display = 'flex';
                        iconWrapper.style.alignItems = 'center';
                        iconWrapper.style.justifyContent = 'center';
                        iconWrapper.style.height = '100%';
                        iconWrapper.style.width = '100%';
                        iconWrapper.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #ffffff; opacity: 0.9;"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`;
                        e.target.parentNode.appendChild(iconWrapper);
                      }}
                    />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                      {getCategoryIcon(course.categoria_nombre)}
                    </div>
                  )}
                </div>
                <div style={{ padding: 'var(--space-5)' }}>
                  <span className="badge badge-teal mb-2">{course.categoria_nombre}</span>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>{course.nombre}</h3>
                  <p className="text-xs text-muted mb-3">v{course.numero_version} · {course.instructor_nombre}</p>
                  <div className="progress-bar mb-2"><div className="progress-bar-fill" style={{ width: `${course.progreso}%` }} /></div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted">{course.estado === 'proximo' ? 'Sin iniciar' : `${course.progreso}% completado`}</span>
                    <span className={`badge ${course.estado === 'proximo' ? 'badge-purple' : course.progreso >= 100 ? 'badge-green' : 'badge-blue'}`}>
                      {course.estado === 'proximo' ? 'Preventa' : course.progreso >= 100 ? 'Completado' : 'En progreso'}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    {course.estado === 'proximo' ? (
                      <button className="btn btn-secondary btn-sm" style={{ flex: 1, cursor: 'not-allowed', opacity: 0.8 }} disabled>
                        <Lock size={14} /> Disponible: {course.fecha_disponible ? new Date(course.fecha_disponible).toLocaleDateString('es-EC', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }) : 'Próximamente'}
                      </button>
                    ) : course.aula_fecha_inicio && new Date(course.aula_fecha_inicio) > new Date() ? (
                      <button className="btn btn-secondary btn-sm" style={{ flex: 1, cursor: 'not-allowed', opacity: 0.8 }} title={`Inicia el ${new Date(course.aula_fecha_inicio).toLocaleDateString('es-EC', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })}`} disabled>
                        <Lock size={14} /> Inicia: {new Date(course.aula_fecha_inicio).toLocaleDateString('es-EC', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })}
                      </button>
                    ) : (
                      <Link to={`/aula/${course.id}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}><PlayCircle size={14} /> Continuar</Link>
                    )}
                    <button className="btn btn-outline btn-sm" disabled={course.estado === 'proximo'} style={course.estado === 'proximo' ? { cursor: 'not-allowed', opacity: 0.6 } : {}}><Download size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center p-8">
            <BookOpen size={48} style={{ color: 'var(--text-muted)', margin: '0 auto var(--space-4)' }} />
            <h3>Biblioteca vacía</h3>
            <p className="text-muted">Compra un curso para acceder a tu contenido</p>
          </div>
        )}
      </div>
    </div>
  );
}

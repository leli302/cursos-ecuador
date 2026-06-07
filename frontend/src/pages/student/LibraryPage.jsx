import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { BookOpen, PlayCircle, FileText, Download, Lock } from 'lucide-react';

export default function LibraryPage() {
  const [library, setLibrary] = useState({ courses: [], certificates: [] });
  const [loading, setLoading] = useState(true);

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
                <img src={course.imagen || `https://placehold.co/640x360/142241/4ECDC4?text=Curso&font=roboto`} alt={course.nombre} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
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

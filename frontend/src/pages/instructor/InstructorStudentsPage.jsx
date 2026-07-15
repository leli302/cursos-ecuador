import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import { ChevronLeft, Users, GraduationCap, Mail, Phone, Calendar, BarChart3 } from 'lucide-react';

export default function InstructorStudentsPage() {
  const { id } = useParams();
  const toast = useToast();
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [courseRes, studentsRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get(`/courses/${id}/students`)
        ]);
        setCourse(courseRes.data.course);
        setStudents(studentsRes.data.data || []);
      } catch (e) {
        console.error(e);
        toast.error('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const filtered = search
    ? students.filter(s => 
        `${s.nombre} ${s.apellido} ${s.email}`.toLowerCase().includes(search.toLowerCase())
      )
    : students;

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="skeleton" style={{ height: 200, borderRadius: 'var(--radius-lg)', marginBottom: 24 }} />
          <div className="skeleton" style={{ height: 400, borderRadius: 'var(--radius-lg)' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        {/* Back link */}
        <div className="mb-6">
          <Link to="/instructor/cursos" className="flex items-center gap-1 text-sm text-muted hover:text-primary">
            <ChevronLeft size={16} /> Volver a mis cursos
          </Link>
        </div>

        {/* Course info banner */}
        <div className="card-glass mb-8" style={{ padding: 'var(--space-6)', border: '1px solid rgba(78,205,196,0.15)' }}>
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className="badge badge-blue mb-2" style={{ display: 'inline-block' }}>{course?.categoria_nombre}</span>
              <h1 className="page-title mb-2" style={{ fontSize: 'var(--text-2xl)' }}>
                Estudiantes Matriculados
              </h1>
              <p className="text-muted text-sm">{course?.nombre}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2" style={{ padding: '8px 16px', background: 'rgba(78,205,196,0.1)', borderRadius: 'var(--radius-md)' }}>
                <Users size={18} className="text-primary" />
                <span className="font-bold text-lg">{students.length}</span>
                <span className="text-xs text-muted">inscritos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="mb-6" style={{ maxWidth: 400 }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Buscar por nombre o email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ fontSize: 'var(--text-sm)' }}
          />
        </div>

        {/* Students table */}
        {students.length === 0 ? (
          <div className="card text-center" style={{ padding: '60px 20px' }}>
            <GraduationCap size={48} className="text-muted" style={{ margin: '0 auto 16px' }} />
            <h3>No hay estudiantes matriculados aún</h3>
            <p className="text-muted text-sm mt-2">Cuando los estudiantes compren este curso, aparecerán aquí.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Estudiante</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Fecha Inscripción</th>
                  <th>Aula</th>
                  <th>Progreso</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(student => (
                  <tr key={student.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: 'var(--gradient-primary)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.75rem', fontWeight: 700, color: 'white', flexShrink: 0
                        }}>
                          {student.nombre?.[0]}{student.apellido?.[0]}
                        </div>
                        <div>
                          <span className="font-semibold text-sm">{student.nombre} {student.apellido}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm flex items-center gap-1">
                        <Mail size={12} className="text-muted" /> {student.email}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm flex items-center gap-1">
                        <Phone size={12} className="text-muted" /> {student.telefono || '—'}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm flex items-center gap-1">
                        <Calendar size={12} className="text-muted" />
                        {student.fecha_inscripcion ? new Date(student.fecha_inscripcion).toLocaleDateString('es-EC', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-blue text-xs">{student.aula_nombre || 'N/A'}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div style={{ width: 60, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ 
                            width: `${student.progreso || 0}%`, 
                            height: '100%', 
                            background: (student.progreso || 0) >= 100 ? 'var(--accent-green)' : 'var(--accent-teal)',
                            borderRadius: '3px',
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                        <span className="text-xs font-semibold">{student.progreso || 0}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${student.inscripcion_estado === 'activa' ? 'badge-green' : 'badge-red'} text-xs`}>
                        {student.inscripcion_estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary stats */}
        {students.length > 0 && (
          <div className="grid grid-3 gap-4 mt-6">
            <div className="card text-center" style={{ padding: 'var(--space-4)' }}>
              <BarChart3 size={20} className="text-primary" style={{ margin: '0 auto 8px' }} />
              <div className="text-2xl font-bold">{students.length}</div>
              <div className="text-xs text-muted">Total Inscritos</div>
            </div>
            <div className="card text-center" style={{ padding: 'var(--space-4)' }}>
              <GraduationCap size={20} style={{ color: 'var(--accent-green)', margin: '0 auto 8px' }} />
              <div className="text-2xl font-bold">{students.filter(s => (s.progreso || 0) >= 100).length}</div>
              <div className="text-xs text-muted">Completaron</div>
            </div>
            <div className="card text-center" style={{ padding: 'var(--space-4)' }}>
              <Users size={20} style={{ color: 'var(--accent-gold)', margin: '0 auto 8px' }} />
              <div className="text-2xl font-bold">{students.filter(s => s.inscripcion_estado === 'activa').length}</div>
              <div className="text-xs text-muted">Activos</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

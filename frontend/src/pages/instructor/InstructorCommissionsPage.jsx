import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  DollarSign, TrendingUp, Award, Trophy, Crown, Gem, Medal,
  Sprout, ChevronRight, BarChart3, Calendar, ArrowUpRight,
  ArrowDownRight, Star, Users, BookOpen, GraduationCap,
  CheckCircle, Lock, Zap, Gift, Clock, Target, ChevronDown, ChevronUp
} from 'lucide-react';

const ICON_MAP = {
  Sprout: Sprout, Medal: Medal, Award: Award, Trophy: Trophy, Crown: Crown, Gem: Gem
};

export default function InstructorCommissionsPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyFilter, setHistoryFilter] = useState({ cursoId: '', mes: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: result } = await api.get('/commissions/instructor');
      setData(result);
      // Auto-expand first course
      if (result.courses?.length > 0) setExpandedCourse(result.courses[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (page = 1) => {
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (historyFilter.cursoId) params.append('cursoId', historyFilter.cursoId);
      if (historyFilter.mes) params.append('mes', historyFilter.mes);
      const { data: result } = await api.get(`/commissions/history?${params}`);
      setHistoryData(result);
      setHistoryPage(page);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (activeTab === 'history' && !historyData) fetchHistory();
  }, [activeTab]);

  const getLevelIcon = (iconName, size = 22) => {
    const Icon = ICON_MAP[iconName] || Award;
    return <Icon size={size} />;
  };

  const formatCurrency = (val) => `$${parseFloat(val || 0).toFixed(2)}`;

  if (loading) return (
    <div className="page container">
      <div className="grid grid-4 mb-8">{[1,2,3,4].map(i =>
        <div key={i} className="skeleton" style={{ height: 120, borderRadius: 'var(--radius-lg)' }} />
      )}</div>
      <div className="skeleton" style={{ height: 400, borderRadius: 'var(--radius-lg)' }} />
    </div>
  );

  if (!data) return (
    <div className="page container text-center">
      <h2>No se pudieron cargar las comisiones</h2>
      <button className="btn btn-primary mt-4" onClick={() => window.location.reload()}>Reintentar</button>
    </div>
  );

  const { stats, courses, levels, monthlyEarnings, promotions } = data;

  // Generate bar chart data
  const maxEarning = Math.max(...(monthlyEarnings.map(m => parseFloat(m.total)) || [0]), 1);

  return (
    <div className="page"><div className="container">
      {/* Header */}
      <div className="page-header flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <DollarSign size={28} style={{ color: 'var(--accent-green)' }} />
            Mis Comisiones
          </h1>
          <p className="text-muted mt-1">Panel de rendimiento y ganancias de tus cursos</p>
        </div>
        <Link to="/instructor/cursos" className="btn btn-ghost btn-sm flex items-center gap-2">
          <BookOpen size={16} /> Mis Cursos
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-4 mb-8 stagger-children">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--accent-green)' }}>
            <DollarSign size={22} />
          </div>
          <div className="stat-value" style={{ color: 'var(--accent-green)' }}>{formatCurrency(stats.gananciasTotales)}</div>
          <div className="stat-label">Ganancias Totales</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--accent-blue)' }}>
            <TrendingUp size={22} />
          </div>
          <div className="stat-value" style={{ color: 'var(--accent-blue)' }}>{formatCurrency(stats.gananciasMes)}</div>
          <div className="stat-label">Ganancias este Mes</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(168,85,247,0.1)', color: 'var(--accent-purple)' }}>
            <BarChart3 size={22} />
          </div>
          <div className="stat-value" style={{ color: 'var(--accent-purple)' }}>{stats.cursosConVentas}</div>
          <div className="stat-label">Cursos con Ventas</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245,166,35,0.1)', color: 'var(--accent-gold)' }}>
            <BookOpen size={22} />
          </div>
          <div className="stat-value" style={{ color: 'var(--accent-gold)' }}>{stats.totalCursos}</div>
          <div className="stat-label">Total de Cursos</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6" style={{
        background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: 4, width: 'fit-content'
      }}>
        {[
          { id: 'overview', label: 'Mis Cursos', icon: <Target size={15} /> },
          { id: 'earnings', label: 'Ganancias', icon: <BarChart3 size={15} /> },
          { id: 'levels', label: 'Niveles', icon: <Award size={15} /> },
          { id: 'history', label: 'Historial', icon: <Clock size={15} /> }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="flex items-center gap-2"
            style={{
              padding: '8px 16px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)',
              fontWeight: 600, transition: 'all 0.2s', border: 'none', cursor: 'pointer',
              background: activeTab === tab.id ? 'var(--gradient-primary)' : 'transparent',
              color: activeTab === tab.id ? 'white' : 'var(--text-muted)'
            }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Overview — Cursos con Niveles */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-4">
          {courses.length === 0 ? (
            <div className="card text-center" style={{ padding: 'var(--space-10)' }}>
              <Sprout size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
              <h3>Aún no tienes cursos</h3>
              <p className="text-muted mt-2">Crea tu primer curso para comenzar a generar comisiones.</p>
              <Link to="/instructor/cursos" className="btn btn-primary mt-4">Crear Curso</Link>
            </div>
          ) : courses.map(course => {
            const isExpanded = expandedCourse === course.id;
            const levelColor = course.nivel_color || '#64748B';

            return (
              <div key={course.id} className="card" style={{ padding: 0, overflow: 'hidden', border: isExpanded ? `1px solid ${levelColor}40` : undefined }}>
                {/* Course Header */}
                <button onClick={() => setExpandedCourse(isExpanded ? null : course.id)}
                  className="flex items-center justify-between w-full" style={{
                    padding: 'var(--space-5) var(--space-6)', background: 'transparent',
                    color: 'var(--text-primary)', textAlign: 'left', cursor: 'pointer', border: 'none'
                  }}>
                  <div className="flex items-center gap-4" style={{ flex: 1 }}>
                    {/* Level Badge */}
                    <div style={{
                      width: 48, height: 48, borderRadius: 'var(--radius-md)',
                      background: `${levelColor}18`, color: levelColor,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      {getLevelIcon(course.nivel_icono || 'Sprout', 24)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span style={{ fontWeight: 700, fontSize: 'var(--text-base)' }}>{course.nombre}</span>
                        <span className="badge" style={{
                          background: `${levelColor}20`, color: levelColor,
                          fontSize: '0.65rem', fontWeight: 700
                        }}>
                          {course.nivel_nombre || 'Inicial'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-muted flex items-center gap-1">
                          <Users size={12} /> {course.total_estudiantes} estudiantes
                        </span>
                        <span className="text-xs text-muted flex items-center gap-1">
                          <Star size={12} /> {parseFloat(course.calificacion_promedio || 0).toFixed(1)}
                        </span>
                        <span className="text-xs flex items-center gap-1" style={{ color: 'var(--accent-green)' }}>
                          <DollarSign size={12} /> {formatCurrency(course.ganancias_acumuladas)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: levelColor }}>
                        {parseFloat(course.porcentaje_actual || 10).toFixed(0)}%
                      </div>
                      <div className="text-xs text-muted">comisión</div>
                    </div>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid var(--border-subtle)', padding: 'var(--space-6)' }} className="animate-fade-in">
                    {/* Progress to Next Level */}
                    {course.progress && (
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-sm font-semibold flex items-center gap-2">
                            <Target size={16} style={{ color: 'var(--accent-teal)' }} />
                            Progreso hacia {course.progress.nextLevel.nombre}
                            <span className="badge" style={{
                              background: `${course.progress.nextLevel.color}20`,
                              color: course.progress.nextLevel.color, fontSize: '0.65rem'
                            }}>
                              {course.progress.nextLevel.porcentaje}% comisión
                            </span>
                          </h4>
                          <span style={{ fontWeight: 700, color: 'var(--accent-teal)', fontSize: 'var(--text-sm)' }}>
                            {course.progress.overallProgress}%
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div style={{
                          height: 10, background: 'var(--bg-surface)', borderRadius: 'var(--radius-full)',
                          overflow: 'hidden', marginBottom: 16
                        }}>
                          <div style={{
                            height: '100%', borderRadius: 'var(--radius-full)',
                            background: course.progress.overallProgress >= 80
                              ? 'linear-gradient(90deg, var(--accent-green), var(--accent-teal))'
                              : course.progress.overallProgress >= 50
                              ? 'linear-gradient(90deg, var(--accent-blue), var(--accent-teal))'
                              : 'linear-gradient(90deg, var(--accent-orange), var(--accent-gold))',
                            width: `${course.progress.overallProgress}%`,
                            transition: 'width 1s ease-out'
                          }} />
                        </div>

                        {/* Metric Breakdown */}
                        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)' }}>
                          {Object.entries(course.progress.metrics).map(([key, m]) => {
                            const pct = m.required === 0 ? 100 : Math.min(100, (m.current / m.required) * 100);
                            const met = pct >= 100;
                            const labels = {
                              estudiantes: { label: 'Estudiantes', icon: <Users size={14} /> },
                              certificados: { label: 'Certificados', icon: <GraduationCap size={14} /> },
                              calificacion: { label: 'Calificación', icon: <Star size={14} /> },
                              finalizacion: { label: 'Tasa Finalización', icon: <CheckCircle size={14} /> },
                              resenas: { label: 'Reseñas Positivas', icon: <Award size={14} /> }
                            };
                            const { label, icon } = labels[key] || { label: key, icon: <Target size={14} /> };

                            return (
                              <div key={key} style={{
                                padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
                                background: met ? 'rgba(16,185,129,0.08)' : 'var(--bg-surface)',
                                border: `1px solid ${met ? 'rgba(16,185,129,0.2)' : 'var(--border-subtle)'}`
                              }}>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="flex items-center gap-2 text-xs" style={{
                                    color: met ? 'var(--accent-green)' : 'var(--text-muted)'
                                  }}>
                                    {icon} {label}
                                  </span>
                                  {met ? <CheckCircle size={14} style={{ color: 'var(--accent-green)' }} /> :
                                    <Lock size={12} style={{ color: 'var(--text-muted)' }} />}
                                </div>
                                <div className="flex items-baseline gap-1">
                                  <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: met ? 'var(--accent-green)' : 'var(--text-primary)' }}>
                                    {key === 'calificacion' || key === 'finalizacion'
                                      ? m.current.toFixed(key === 'calificacion' ? 2 : 1)
                                      : m.current}
                                  </span>
                                  <span className="text-xs text-muted">
                                    / {key === 'calificacion' ? m.required.toFixed(2) :
                                       key === 'finalizacion' ? `${m.required}%` : m.required}
                                  </span>
                                </div>
                                <div style={{
                                  height: 4, background: 'var(--bg-card)', borderRadius: 'var(--radius-full)',
                                  overflow: 'hidden', marginTop: 6
                                }}>
                                  <div style={{
                                    height: '100%', borderRadius: 'var(--radius-full)', width: `${pct}%`,
                                    background: met ? 'var(--accent-green)' : 'var(--accent-blue)',
                                    transition: 'width 0.8s ease-out'
                                  }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Motivational Message */}
                        {course.progress.overallProgress < 100 && (() => {
                          const m = course.progress.metrics;
                          const biggestGap = Object.entries(m).reduce((best, [key, val]) => {
                            const gap = val.required > 0 ? val.required - val.current : 0;
                            if (gap > 0) {
                              const pct = val.current / val.required;
                              if (!best || pct > best.pct) return { key, gap, pct };
                            }
                            return best;
                          }, null);

                          if (!biggestGap) return null;

                          const msgs = {
                            estudiantes: `¡Te faltan ${Math.ceil(biggestGap.gap)} estudiantes para alcanzar el nivel ${course.progress.nextLevel.nombre}!`,
                            certificados: `Necesitas ${Math.ceil(biggestGap.gap)} certificados más para el nivel ${course.progress.nextLevel.nombre}.`,
                            calificacion: `Sube tu calificación a ${course.progress.metrics.calificacion.required.toFixed(2)} para avanzar.`,
                            finalizacion: `Mejora tu tasa de finalización al ${course.progress.metrics.finalizacion.required}% para subir de nivel.`,
                            resenas: `Consigue ${Math.ceil(biggestGap.gap)} reseñas positivas más para avanzar.`
                          };

                          return (
                            <div style={{
                              marginTop: 16, padding: '12px 16px', borderRadius: 'var(--radius-md)',
                              background: 'rgba(78,205,196,0.08)', border: '1px solid rgba(78,205,196,0.2)',
                              fontSize: 'var(--text-sm)', color: 'var(--accent-teal)'
                            }} className="flex items-center gap-2">
                              <Zap size={16} style={{ flexShrink: 0 }} />
                              {msgs[biggestGap.key] || `Sigue trabajando para alcanzar el nivel ${course.progress.nextLevel.nombre}.`}
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* No next level = max level reached */}
                    {!course.progress && course.nivel_nombre && (
                      <div style={{
                        padding: '16px 20px', borderRadius: 'var(--radius-md)',
                        background: 'linear-gradient(135deg, rgba(245,166,35,0.1), rgba(168,85,247,0.1))',
                        border: '1px solid rgba(245,166,35,0.2)', textAlign: 'center'
                      }}>
                        <Crown size={32} style={{ color: 'var(--accent-gold)', margin: '0 auto 8px' }} />
                        <h4 style={{ color: 'var(--accent-gold)' }}>¡Nivel Máximo Alcanzado!</h4>
                        <p className="text-sm text-muted mt-1">Este curso ha alcanzado el nivel más alto. ¡Felicidades!</p>
                      </div>
                    )}

                    {/* Active Promotions for this course */}
                    {course.appliedPromotions?.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <Gift size={16} style={{ color: 'var(--accent-purple)' }} /> Promociones Activas
                        </h4>
                        <div className="flex flex-col gap-2">
                          {course.appliedPromotions.map(p => (
                            <div key={p.id} className="flex items-center justify-between" style={{
                              padding: '8px 12px', borderRadius: 'var(--radius-md)',
                              background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)'
                            }}>
                              <span className="text-sm">{p.nombre}</span>
                              <span className="badge badge-purple" style={{ fontWeight: 700 }}>+{p.porcentaje_bonus}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Global Promotions */}
          {promotions?.length > 0 && (
            <div className="card">
              <h3 className="mb-4 flex items-center gap-2">
                <Gift size={20} style={{ color: 'var(--accent-purple)' }} />
                Promociones Globales Activas
              </h3>
              <div className="flex flex-col gap-2">
                {promotions.map(p => (
                  <div key={p.id} className="flex items-center justify-between" style={{
                    padding: '12px 16px', borderRadius: 'var(--radius-md)',
                    background: 'rgba(168,85,247,0.06)', border: '1px solid var(--border-subtle)'
                  }}>
                    <div>
                      <span className="font-semibold text-sm">{p.nombre}</span>
                      {p.descripcion && <p className="text-xs text-muted mt-1">{p.descripcion}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted">
                        {new Date(p.fecha_inicio).toLocaleDateString()} — {new Date(p.fecha_fin).toLocaleDateString()}
                      </span>
                      <span className="badge badge-purple" style={{ fontWeight: 700 }}>+{p.porcentaje_bonus}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Earnings Chart */}
      {activeTab === 'earnings' && (
        <div className="card">
          <h3 className="mb-6 flex items-center gap-2">
            <BarChart3 size={20} style={{ color: 'var(--accent-blue)' }} />
            Ganancias Mensuales (Últimos 12 Meses)
          </h3>

          {monthlyEarnings.length === 0 ? (
            <div className="text-center" style={{ padding: 'var(--space-10)' }}>
              <BarChart3 size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
              <p className="text-muted">Aún no hay ganancias registradas.</p>
            </div>
          ) : (
            <>
              {/* Bar Chart */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 200, marginBottom: 24 }}>
                {monthlyEarnings.map((m, i) => {
                  const val = parseFloat(m.total);
                  const height = Math.max(4, (val / maxEarning) * 180);
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <span className="text-xs font-semibold" style={{ color: 'var(--accent-green)' }}>
                        ${val.toFixed(0)}
                      </span>
                      <div style={{
                        width: '100%', maxWidth: 48, height, borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                        background: `linear-gradient(180deg, var(--accent-teal) 0%, var(--accent-blue) 100%)`,
                        transition: 'height 0.8s ease-out', opacity: 0.85,
                        minHeight: 4
                      }} />
                      <span className="text-xs text-muted" style={{ fontSize: '0.6rem' }}>
                        {m.mes_label?.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Monthly Table */}
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Mes</th>
                      <th style={{ textAlign: 'right' }}>Ventas</th>
                      <th style={{ textAlign: 'right' }}>Ganancias</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyEarnings.slice().reverse().map((m, i) => (
                      <tr key={i}>
                        <td className="text-sm font-semibold">{m.mes_label}</td>
                        <td className="text-sm" style={{ textAlign: 'right' }}>{m.ventas}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--accent-green)' }}>
                          {formatCurrency(m.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {/* Tab: All Levels Roadmap */}
      {activeTab === 'levels' && (
        <div className="card">
          <h3 className="mb-6 flex items-center gap-2">
            <Award size={20} style={{ color: 'var(--accent-gold)' }} />
            Niveles de Comisión — Hoja de Ruta
          </h3>

          <div className="flex flex-col gap-1">
            {levels.map((level, i) => {
              // Check if any of user's courses is at or above this level
              const coursesAtLevel = courses.filter(c => (c.nivel_orden || 0) >= level.orden);
              const isCurrentForAny = courses.some(c => c.nivel_id === level.id);
              const isReached = coursesAtLevel.length > 0;

              return (
                <div key={level.id} className="flex items-stretch gap-4" style={{ minHeight: 90 }}>
                  {/* Timeline */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 40 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: isReached ? `${level.color}30` : 'var(--bg-surface)',
                      border: `2px solid ${isReached ? level.color : 'var(--border-subtle)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: isReached ? level.color : 'var(--text-muted)', flexShrink: 0,
                      boxShadow: isCurrentForAny ? `0 0 12px ${level.color}40` : 'none'
                    }}>
                      {getLevelIcon(level.icono, 18)}
                    </div>
                    {i < levels.length - 1 && (
                      <div style={{
                        flex: 1, width: 2, minHeight: 20,
                        background: isReached ? level.color : 'var(--border-subtle)',
                        opacity: isReached ? 0.5 : 0.3
                      }} />
                    )}
                  </div>

                  {/* Level Info */}
                  <div style={{
                    flex: 1, padding: '8px 16px', borderRadius: 'var(--radius-md)',
                    background: isCurrentForAny ? `${level.color}10` : 'transparent',
                    border: isCurrentForAny ? `1px solid ${level.color}25` : '1px solid transparent',
                    marginBottom: 8
                  }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span style={{ fontWeight: 700, color: isReached ? level.color : 'var(--text-muted)' }}>
                          {level.nombre}
                        </span>
                        {isCurrentForAny && (
                          <span className="badge" style={{
                            background: `${level.color}20`, color: level.color, fontSize: '0.6rem'
                          }}>TU NIVEL</span>
                        )}
                      </div>
                      <span style={{
                        fontWeight: 800, fontSize: 'var(--text-lg)',
                        color: isReached ? level.color : 'var(--text-muted)'
                      }}>{parseFloat(level.porcentaje_comision).toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 flex-wrap">
                      <span className="text-xs text-muted flex items-center gap-1">
                        <Users size={11} /> {level.min_estudiantes}+ est.
                      </span>
                      <span className="text-xs text-muted flex items-center gap-1">
                        <GraduationCap size={11} /> {level.min_certificados}+ cert.
                      </span>
                      <span className="text-xs text-muted flex items-center gap-1">
                        <Star size={11} /> ≥{parseFloat(level.min_calificacion).toFixed(1)}
                      </span>
                      <span className="text-xs text-muted flex items-center gap-1">
                        <CheckCircle size={11} /> ≥{parseFloat(level.min_tasa_finalizacion).toFixed(0)}%
                      </span>
                      <span className="text-xs text-muted flex items-center gap-1">
                        <Award size={11} /> {level.min_resenas}+ reseñas
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: History */}
      {activeTab === 'history' && (
        <div className="card">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
            <h3 className="flex items-center gap-2">
              <Clock size={20} style={{ color: 'var(--accent-teal)' }} />
              Historial de Comisiones
            </h3>
            <div className="flex items-center gap-2">
              <select className="form-input" style={{ width: 'auto', fontSize: 'var(--text-xs)' }}
                value={historyFilter.cursoId}
                onChange={(e) => { setHistoryFilter(p => ({ ...p, cursoId: e.target.value })); fetchHistory(1); }}>
                <option value="">Todos los cursos</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
              <input type="month" className="form-input" style={{ width: 'auto', fontSize: 'var(--text-xs)' }}
                value={historyFilter.mes}
                onChange={(e) => { setHistoryFilter(p => ({ ...p, mes: e.target.value })); fetchHistory(1); }}
              />
            </div>
          </div>

          {!historyData ? (
            <div className="skeleton" style={{ height: 200 }} />
          ) : historyData.data?.length === 0 ? (
            <div className="text-center" style={{ padding: 'var(--space-8)' }}>
              <Clock size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
              <p className="text-muted">No hay registros de comisiones aún.</p>
            </div>
          ) : (
            <>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Curso</th>
                      <th>Orden</th>
                      <th>Nivel</th>
                      <th style={{ textAlign: 'right' }}>Venta</th>
                      <th style={{ textAlign: 'right' }}>%</th>
                      <th style={{ textAlign: 'right' }}>Comisión</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyData.data.map(h => (
                      <tr key={h.id}>
                        <td className="text-xs text-muted">{new Date(h.creado_en).toLocaleDateString()}</td>
                        <td className="text-sm font-semibold">{h.curso_nombre}</td>
                        <td className="text-xs"><code>{h.orden_codigo}</code></td>
                        <td><span className="badge badge-blue" style={{ fontSize: '0.6rem' }}>{h.nivel_nombre}</span></td>
                        <td className="text-sm" style={{ textAlign: 'right' }}>{formatCurrency(h.monto_venta)}</td>
                        <td className="text-sm text-muted" style={{ textAlign: 'right' }}>{parseFloat(h.porcentaje_aplicado).toFixed(0)}%</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--accent-green)' }}>
                          {formatCurrency(h.monto_comision)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {historyData.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {Array.from({ length: historyData.totalPages }, (_, i) => (
                    <button key={i} onClick={() => fetchHistory(i + 1)} className="btn btn-ghost btn-sm"
                      style={{
                        background: historyPage === i + 1 ? 'var(--accent-teal)' : 'transparent',
                        color: historyPage === i + 1 ? 'white' : 'var(--text-muted)',
                        minWidth: 32
                      }}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div></div>
  );
}

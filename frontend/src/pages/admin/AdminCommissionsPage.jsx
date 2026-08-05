import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import {
  Settings, Award, Trophy, Crown, Gem, Medal, Sprout,
  DollarSign, Users, TrendingUp, Gift, Plus, ToggleLeft,
  ToggleRight, Save, Calendar, Target, Percent, Star,
  GraduationCap, CheckCircle, BarChart3, Edit3, X
} from 'lucide-react';

const ICON_MAP = {
  Sprout: Sprout, Medal: Medal, Award: Award, Trophy: Trophy, Crown: Crown, Gem: Gem
};

export default function AdminCommissionsPage() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('levels');
  const [levels, setLevels] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingLevel, setEditingLevel] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showPromoForm, setShowPromoForm] = useState(false);
  const [promoForm, setPromoForm] = useState({
    nombre: '', descripcion: '', porcentaje_bonus: '',
    tipo: 'global', target_id: '', fecha_inicio: '', fecha_fin: ''
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [levelsRes, promosRes, summaryRes] = await Promise.all([
        api.get('/commissions/levels'),
        api.get('/commissions/promotions'),
        api.get('/commissions/summary')
      ]);
      setLevels(levelsRes.data.data);
      setPromotions(promosRes.data.data);
      setSummary(summaryRes.data);
    } catch (err) {
      console.error(err);
      toast.error('Error cargando datos de comisiones');
    } finally {
      setLoading(false);
    }
  };

  const startEditLevel = (level) => {
    setEditingLevel(level.id);
    setEditForm({
      porcentaje_comision: level.porcentaje_comision,
      min_estudiantes: level.min_estudiantes,
      min_certificados: level.min_certificados,
      min_calificacion: level.min_calificacion,
      min_tasa_finalizacion: level.min_tasa_finalizacion,
      min_resenas: level.min_resenas
    });
  };

  const saveLevel = async (id) => {
    try {
      await api.put(`/commissions/levels/${id}`, editForm);
      toast.success('Nivel actualizado correctamente');
      setEditingLevel(null);
      fetchAll();
    } catch (err) {
      toast.error('Error al actualizar nivel');
    }
  };

  const createPromotion = async () => {
    try {
      if (!promoForm.nombre || !promoForm.porcentaje_bonus || !promoForm.fecha_inicio || !promoForm.fecha_fin) {
        return toast.error('Completa todos los campos requeridos');
      }
      await api.post('/commissions/promotions', {
        ...promoForm,
        porcentaje_bonus: parseFloat(promoForm.porcentaje_bonus),
        target_id: promoForm.target_id || null
      });
      toast.success('Promoción creada exitosamente');
      setShowPromoForm(false);
      setPromoForm({ nombre: '', descripcion: '', porcentaje_bonus: '', tipo: 'global', target_id: '', fecha_inicio: '', fecha_fin: '' });
      fetchAll();
    } catch (err) {
      toast.error('Error al crear promoción');
    }
  };

  const togglePromotion = async (id, activa) => {
    try {
      await api.put(`/commissions/promotions/${id}`, { activa: !activa });
      toast.success(activa ? 'Promoción desactivada' : 'Promoción activada');
      fetchAll();
    } catch (err) {
      toast.error('Error al cambiar estado');
    }
  };

  const getLevelIcon = (iconName, size = 22) => {
    const Icon = ICON_MAP[iconName] || Award;
    return <Icon size={size} />;
  };

  if (loading) return (
    <div className="page container">
      <div className="grid grid-3 mb-8">{[1,2,3].map(i =>
        <div key={i} className="skeleton" style={{ height: 120, borderRadius: 'var(--radius-lg)' }} />
      )}</div>
      <div className="skeleton" style={{ height: 400, borderRadius: 'var(--radius-lg)' }} />
    </div>
  );

  return (
    <div className="page"><div className="container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title flex items-center gap-3">
          <Settings size={28} style={{ color: 'var(--accent-teal)' }} />
          Sistema de Comisiones
        </h1>
        <p className="text-muted mt-1">Configura niveles, promociones y monitorea las comisiones de instructores</p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-3 mb-8 stagger-children">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--accent-green)' }}>
              <DollarSign size={22} />
            </div>
            <div className="stat-value" style={{ color: 'var(--accent-green)' }}>
              ${parseFloat(summary.totalComisionesPagadas).toFixed(2)}
            </div>
            <div className="stat-label">Total Comisiones Registradas</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--accent-blue)' }}>
              <Users size={22} />
            </div>
            <div className="stat-value" style={{ color: 'var(--accent-blue)' }}>
              {summary.topInstructores?.length || 0}
            </div>
            <div className="stat-label">Instructores con Ganancias</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(168,85,247,0.1)', color: 'var(--accent-purple)' }}>
              <Gift size={22} />
            </div>
            <div className="stat-value" style={{ color: 'var(--accent-purple)' }}>
              {promotions.filter(p => p.activa).length}
            </div>
            <div className="stat-label">Promociones Activas</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6" style={{
        background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: 4, width: 'fit-content'
      }}>
        {[
          { id: 'levels', label: 'Niveles', icon: <Award size={15} /> },
          { id: 'promotions', label: 'Promociones', icon: <Gift size={15} /> },
          { id: 'instructors', label: 'Instructores', icon: <Users size={15} /> },
          { id: 'distribution', label: 'Distribución', icon: <BarChart3 size={15} /> }
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

      {/* Tab: Levels Configuration */}
      {activeTab === 'levels' && (
        <div className="card">
          <h3 className="mb-6 flex items-center gap-2">
            <Award size={20} style={{ color: 'var(--accent-gold)' }} />
            Configuración de Niveles de Comisión
          </h3>
          <p className="text-sm text-muted mb-6">
            Edita los requisitos y porcentajes de cada nivel. Los cambios se aplicarán automáticamente al próximo recálculo.
          </p>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nivel</th>
                  <th style={{ textAlign: 'center' }}>Comisión</th>
                  <th style={{ textAlign: 'center' }}>Min. Estudiantes</th>
                  <th style={{ textAlign: 'center' }}>Min. Certificados</th>
                  <th style={{ textAlign: 'center' }}>Min. Calificación</th>
                  <th style={{ textAlign: 'center' }}>Min. Finalización</th>
                  <th style={{ textAlign: 'center' }}>Min. Reseñas</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {levels.map(level => {
                  const isEditing = editingLevel === level.id;
                  return (
                    <tr key={level.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <span style={{ color: level.color }}>{getLevelIcon(level.icono, 18)}</span>
                          <span style={{ fontWeight: 700, color: level.color }}>{level.nombre}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {isEditing ? (
                          <input type="number" step="0.5" className="form-input" style={{ width: 70, textAlign: 'center', padding: '4px 8px', fontSize: 'var(--text-sm)' }}
                            value={editForm.porcentaje_comision} onChange={(e) => setEditForm(p => ({ ...p, porcentaje_comision: e.target.value }))} />
                        ) : (
                          <span style={{ fontWeight: 800, color: level.color, fontSize: 'var(--text-base)' }}>
                            {parseFloat(level.porcentaje_comision).toFixed(0)}%
                          </span>
                        )}
                      </td>
                      {['min_estudiantes', 'min_certificados', 'min_calificacion', 'min_tasa_finalizacion', 'min_resenas'].map(field => (
                        <td key={field} style={{ textAlign: 'center' }}>
                          {isEditing ? (
                            <input type="number" step={field === 'min_calificacion' ? '0.1' : '1'}
                              className="form-input" style={{ width: 70, textAlign: 'center', padding: '4px 8px', fontSize: 'var(--text-sm)' }}
                              value={editForm[field]} onChange={(e) => setEditForm(p => ({ ...p, [field]: e.target.value }))} />
                          ) : (
                            <span className="text-sm">
                              {field === 'min_calificacion' ? parseFloat(level[field]).toFixed(1)
                                : field === 'min_tasa_finalizacion' ? `${parseFloat(level[field]).toFixed(0)}%`
                                : level[field].toLocaleString()}
                            </span>
                          )}
                        </td>
                      ))}
                      <td>
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <button className="btn btn-primary btn-sm flex items-center gap-1" onClick={() => saveLevel(level.id)}>
                              <Save size={14} /> Guardar
                            </button>
                            <button className="btn btn-ghost btn-sm" onClick={() => setEditingLevel(null)}>
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <button className="btn btn-ghost btn-sm flex items-center gap-1" onClick={() => startEditLevel(level)}>
                            <Edit3 size={14} /> Editar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Promotions */}
      {activeTab === 'promotions' && (
        <div className="flex flex-col gap-6">
          {/* Create Promotion */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="flex items-center gap-2">
                <Gift size={20} style={{ color: 'var(--accent-purple)' }} />
                Promociones de Comisión
              </h3>
              <button className="btn btn-primary btn-sm flex items-center gap-2" onClick={() => setShowPromoForm(!showPromoForm)}>
                {showPromoForm ? <><X size={15} /> Cancelar</> : <><Plus size={15} /> Nueva Promoción</>}
              </button>
            </div>

            {showPromoForm && (
              <div className="animate-fade-in" style={{
                padding: 'var(--space-5)', borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', marginBottom: 'var(--space-6)'
              }}>
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                  <div>
                    <label className="form-label">Nombre *</label>
                    <input className="form-input" placeholder="Ej: Campaña de verano"
                      value={promoForm.nombre} onChange={(e) => setPromoForm(p => ({ ...p, nombre: e.target.value }))} />
                  </div>
                  <div>
                    <label className="form-label">Bonus % *</label>
                    <input type="number" step="0.5" className="form-input" placeholder="5"
                      value={promoForm.porcentaje_bonus} onChange={(e) => setPromoForm(p => ({ ...p, porcentaje_bonus: e.target.value }))} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Descripción</label>
                    <input className="form-input" placeholder="Descripción opcional..."
                      value={promoForm.descripcion} onChange={(e) => setPromoForm(p => ({ ...p, descripcion: e.target.value }))} />
                  </div>
                  <div>
                    <label className="form-label">Tipo</label>
                    <select className="form-input" value={promoForm.tipo}
                      onChange={(e) => setPromoForm(p => ({ ...p, tipo: e.target.value, target_id: '' }))}>
                      <option value="global">Global (todos los cursos)</option>
                      <option value="curso">Curso específico</option>
                      <option value="instructor">Instructor específico</option>
                    </select>
                  </div>
                  {promoForm.tipo !== 'global' && (
                    <div>
                      <label className="form-label">ID del {promoForm.tipo === 'curso' ? 'Curso' : 'Instructor'}</label>
                      <input type="number" className="form-input" placeholder="ID"
                        value={promoForm.target_id} onChange={(e) => setPromoForm(p => ({ ...p, target_id: e.target.value }))} />
                    </div>
                  )}
                  <div>
                    <label className="form-label">Fecha Inicio *</label>
                    <input type="date" className="form-input"
                      value={promoForm.fecha_inicio} onChange={(e) => setPromoForm(p => ({ ...p, fecha_inicio: e.target.value }))} />
                  </div>
                  <div>
                    <label className="form-label">Fecha Fin *</label>
                    <input type="date" className="form-input"
                      value={promoForm.fecha_fin} onChange={(e) => setPromoForm(p => ({ ...p, fecha_fin: e.target.value }))} />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button className="btn btn-primary flex items-center gap-2" onClick={createPromotion}>
                    <Plus size={16} /> Crear Promoción
                  </button>
                </div>
              </div>
            )}

            {/* Promotions List */}
            {promotions.length === 0 ? (
              <div className="text-center" style={{ padding: 'var(--space-8)' }}>
                <Gift size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
                <p className="text-muted">No hay promociones creadas aún.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {promotions.map(p => {
                  const isActive = p.activa;
                  const isExpired = new Date(p.fecha_fin) < new Date();
                  return (
                    <div key={p.id} className="flex items-center justify-between" style={{
                      padding: '14px 18px', borderRadius: 'var(--radius-md)',
                      background: isActive && !isExpired ? 'rgba(168,85,247,0.06)' : 'var(--bg-surface)',
                      border: `1px solid ${isActive && !isExpired ? 'rgba(168,85,247,0.15)' : 'var(--border-subtle)'}`,
                      opacity: isExpired ? 0.5 : 1
                    }}>
                      <div style={{ flex: 1 }}>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{p.nombre}</span>
                          <span className="badge" style={{
                            fontSize: '0.6rem',
                            background: p.tipo === 'global' ? 'rgba(78,205,196,0.15)' :
                                        p.tipo === 'curso' ? 'rgba(59,130,246,0.15)' : 'rgba(245,166,35,0.15)',
                            color: p.tipo === 'global' ? 'var(--accent-teal)' :
                                   p.tipo === 'curso' ? 'var(--accent-blue)' : 'var(--accent-gold)'
                          }}>{p.tipo.toUpperCase()}</span>
                          {isExpired && <span className="badge" style={{ fontSize: '0.6rem', background: 'rgba(239,68,68,0.15)', color: 'var(--accent-red)' }}>EXPIRADA</span>}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          {p.target_nombre && <span className="text-xs text-muted">{p.target_nombre}</span>}
                          <span className="text-xs text-muted flex items-center gap-1">
                            <Calendar size={11} />
                            {new Date(p.fecha_inicio).toLocaleDateString()} — {new Date(p.fecha_fin).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span style={{
                          fontWeight: 800, color: 'var(--accent-purple)', fontSize: 'var(--text-base)'
                        }}>+{parseFloat(p.porcentaje_bonus).toFixed(0)}%</span>
                        <button onClick={() => togglePromotion(p.id, p.activa)}
                          className="btn-icon" style={{ color: isActive ? 'var(--accent-green)' : 'var(--text-muted)' }}>
                          {isActive ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Top Instructors */}
      {activeTab === 'instructors' && summary && (
        <div className="card">
          <h3 className="mb-6 flex items-center gap-2">
            <TrendingUp size={20} style={{ color: 'var(--accent-green)' }} />
            Top Instructores por Ganancias
          </h3>

          {summary.topInstructores?.length === 0 ? (
            <div className="text-center" style={{ padding: 'var(--space-8)' }}>
              <Users size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
              <p className="text-muted">Aún no hay comisiones registradas.</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Instructor</th>
                    <th style={{ textAlign: 'center' }}>Cursos</th>
                    <th style={{ textAlign: 'right' }}>Ganancias Totales</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.topInstructores.map((inst, i) => (
                    <tr key={inst.id}>
                      <td>
                        <span style={{
                          width: 28, height: 28, borderRadius: '50%', display: 'inline-flex',
                          alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem',
                          background: i === 0 ? 'var(--gradient-gold)' :
                                      i === 1 ? 'linear-gradient(135deg, #C0C0C0, #A8A8A8)' :
                                      i === 2 ? 'linear-gradient(135deg, #CD7F32, #B87333)' : 'var(--bg-surface)',
                          color: i < 3 ? 'white' : 'var(--text-muted)'
                        }}>{i + 1}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div style={{
                            width: 36, height: 36, borderRadius: '50%', background: 'var(--gradient-primary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, color: 'white', fontSize: 'var(--text-sm)'
                          }}>
                            {inst.nombre?.[0]}{inst.apellido?.[0]}
                          </div>
                          <span className="font-semibold text-sm">{inst.nombre} {inst.apellido}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>{inst.cursos}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--accent-green)' }}>
                        ${parseFloat(inst.ganancias_totales).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab: Distribution by Level */}
      {activeTab === 'distribution' && summary && (
        <div className="card">
          <h3 className="mb-6 flex items-center gap-2">
            <BarChart3 size={20} style={{ color: 'var(--accent-blue)' }} />
            Distribución de Cursos por Nivel
          </h3>

          {summary.distribucionPorNivel?.length === 0 ? (
            <div className="text-center" style={{ padding: 'var(--space-8)' }}>
              <BarChart3 size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
              <p className="text-muted">No hay datos de distribución aún.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {summary.distribucionPorNivel.map(d => {
                const maxCursos = Math.max(...summary.distribucionPorNivel.map(x => parseInt(x.cursos)), 1);
                const pct = (parseInt(d.cursos) / maxCursos) * 100;
                return (
                  <div key={d.nombre}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-sm" style={{ color: d.color }}>{d.nombre}</span>
                      <span className="text-sm text-muted">{d.cursos} cursos</span>
                    </div>
                    <div style={{
                      height: 8, background: 'var(--bg-surface)', borderRadius: 'var(--radius-full)',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%', borderRadius: 'var(--radius-full)',
                        background: d.color, width: `${pct}%`,
                        transition: 'width 1s ease-out', opacity: 0.8
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div></div>
  );
}

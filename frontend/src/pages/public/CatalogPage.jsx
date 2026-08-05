import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import CourseCard from '../../components/common/CourseCard';
import { Filter, X, Search, ChevronLeft, ChevronRight, Crown, CheckCircle2, Award, Sparkles, Layers, SlidersHorizontal } from 'lucide-react';

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    level: searchParams.get('level') || '',
    minRating: searchParams.get('minRating') || '',
    sort: searchParams.get('sort') || 'sales',
    premium: searchParams.get('premium') || '',
    page: parseInt(searchParams.get('page')) || 1
  });

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.data || []));
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
      const { data } = await api.get(`/courses?${params.toString()}`);
      setCourses(data.data || []);
      setPagination(data.pagination || {});
    } catch (error) {
      console.error('Error al cargar catálogo:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    if (key !== 'page') newFilters.page = 1;
    setFilters(newFilters);
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => { if (v) params.set(k, v); });
    setSearchParams(params);
    if (key !== 'page') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    const clean = { search: '', category: '', level: '', minRating: '', sort: 'sales', premium: '', page: 1 };
    setFilters(clean);
    setSearchParams({});
  };

  const removeSingleFilter = (key) => {
    updateFilter(key, '');
  };

  const levels = ['principiante', 'intermedio', 'avanzado', 'todos'];
  const hasActiveFilters = filters.category || filters.level || filters.minRating || filters.premium || filters.search;

  // Conteo aproximado de distribución por categoría
  const getCategoryCount = (catId) => {
    return courses.filter(c => String(c.categoria_id) === String(catId)).length || 5;
  };

  return (
    <div className="page animate-fade-in">
      <div className="container">
        {/* Banner Superior del Catálogo Gratuito */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(13,148,136,0.1) 0%, rgba(59,130,246,0.1) 100%)',
          border: '1px solid rgba(13,148,136,0.2)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px 32px',
          marginBottom: 'var(--space-8)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="badge badge-teal"><Sparkles size={12} /> APRENDIZAJE LIBRE</span>
                <span className="badge" style={{ background: '#10B981', color: '#fff' }}>100% GRATIS</span>
              </div>
              <h1 className="page-title" style={{ fontSize: 'var(--text-3xl)', marginBottom: 6 }}>
                Catálogo Oficial de Cursos
              </h1>
              <p className="text-muted text-sm" style={{ maxWidth: 650, margin: 0 }}>
                Explora todo el contenido educativo sin restricciones. Aprende a tu propio ritmo y desbloquea tu certificación verificable al finalizar el curso.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="card" style={{ padding: '12px 18px', textAlign: 'center', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)' }}>
                <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--accent-teal)' }}>{pagination.total || 30}</span>
                <p className="text-xs text-muted font-semibold" style={{ margin: 0 }}>Cursos Disponibles</p>
              </div>
            </div>
          </div>
        </div>

        {/* Buscador + Controles de Filtros y Ordenamiento */}
        <div className="card mb-6" style={{ padding: '16px 20px', borderRadius: 'var(--radius-lg)' }}>
          <div className="flex items-center gap-4 flex-wrap">
            {/* Input Buscador Inteligente */}
            <div style={{ flex: '1 1 350px', position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-teal)' }} />
              <input
                type="text"
                placeholder="Buscar cursos, categorías o docentes..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="form-input"
                style={{ paddingLeft: 46, borderRadius: 'var(--radius-full)', background: 'var(--bg-body)' }}
                id="catalog-search"
              />
            </div>

            {/* Toggle Panel Filtros */}
            <button 
              onClick={() => setShowFilters(!showFilters)} 
              className={`btn ${showFilters ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: '0.85rem' }}
            >
              <SlidersHorizontal size={16} /> {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
              {hasActiveFilters && <span className="badge badge-teal" style={{ marginLeft: 4 }}>!</span>}
            </button>

            {/* Selector de Ordenamiento (SIN PRECIOS) */}
            <div className="flex items-center gap-2" style={{ marginLeft: 'auto' }}>
              <label className="text-xs font-semibold text-muted" style={{ whiteSpace: 'nowrap' }}>Ordenar por:</label>
              <select 
                className="form-input form-select" 
                value={filters.sort} 
                onChange={(e) => updateFilter('sort', e.target.value)} 
                id="filter-sort"
                style={{ width: 'auto', padding: '8px 32px 8px 12px', fontSize: '0.85rem' }}
              >
                <option value="sales">Más populares</option>
                <option value="rating">Mejor calificados</option>
                <option value="newest">Más recientes</option>
                <option value="name">Nombre A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Etiquetas Removibles (Chips de Filtros Activos) */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mb-6 flex-wrap animate-fade-in" style={{ padding: '4px 0' }}>
            <span className="text-xs text-muted font-semibold">Filtros activos:</span>

            {filters.search && (
              <span className="badge badge-teal" style={{ padding: '6px 12px', fontSize: '0.75rem', gap: 6 }}>
                Búsqueda: "{filters.search}"
                <X size={12} className="cursor-pointer" onClick={() => removeSingleFilter('search')} />
              </span>
            )}

            {filters.category && (
              <span className="badge badge-teal" style={{ padding: '6px 12px', fontSize: '0.75rem', gap: 6 }}>
                Categoría: {categories.find(c => String(c.id) === String(filters.category))?.nombre || 'Seleccionada'}
                <X size={12} className="cursor-pointer" onClick={() => removeSingleFilter('category')} />
              </span>
            )}

            {filters.level && (
              <span className="badge badge-teal" style={{ padding: '6px 12px', fontSize: '0.75rem', gap: 6, textTransform: 'capitalize' }}>
                Nivel: {filters.level}
                <X size={12} className="cursor-pointer" onClick={() => removeSingleFilter('level')} />
              </span>
            )}

            {filters.minRating && (
              <span className="badge badge-teal" style={{ padding: '6px 12px', fontSize: '0.75rem', gap: 6 }}>
                Calificación: {filters.minRating}+ ⭐
                <X size={12} className="cursor-pointer" onClick={() => removeSingleFilter('minRating')} />
              </span>
            )}

            {filters.premium && (
              <span className="badge badge-gold" style={{ padding: '6px 12px', fontSize: '0.75rem', gap: 6 }}>
                Solo Premium
                <X size={12} className="cursor-pointer" onClick={() => removeSingleFilter('premium')} />
              </span>
            )}

            <button onClick={clearFilters} className="btn btn-ghost btn-sm text-xs" style={{ color: 'var(--accent-red)', padding: '2px 8px' }}>
              Limpiar todos
            </button>
          </div>
        )}

        {/* Layout Grid: Panel Izquierdo de Filtros + Lista de Cursos */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: showFilters ? '280px 1fr' : '1fr', 
          gap: 'var(--space-6)', 
          alignItems: 'start',
          transition: 'all 0.3s ease' 
        }}>
          {/* Panel Lateral Izquierdo de Filtros Avanzados */}
          {showFilters && (
            <aside className="animate-slide-left">
              <div className="card" style={{ position: 'sticky', top: 90, padding: '20px' }}>
                <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Filter size={16} style={{ color: 'var(--accent-teal)' }} /> Filtros de Búsqueda
                  </h3>
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="text-xs text-muted" style={{ cursor: 'pointer', background: 'none', border: 'none' }}>
                      Limpiar
                    </button>
                  )}
                </div>

                {/* Categorías con Contadores Numéricos */}
                <div className="mb-6">
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Categorías
                  </label>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => updateFilter('category', '')}
                      className={`btn btn-sm ${!filters.category ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ justifyFlex: 'start', justifyContent: 'space-between', fontSize: '0.8rem', padding: '6px 10px' }}
                    >
                      <span>Todas las categorías</span>
                      <span className="badge" style={{ fontSize: '0.65rem' }}>{pagination.total || 30}</span>
                    </button>
                    {categories.map(cat => {
                      const isSelected = String(filters.category) === String(cat.id);
                      return (
                        <button
                          key={cat.id}
                          onClick={() => updateFilter('category', isSelected ? '' : cat.id)}
                          className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-ghost'}`}
                          style={{ justifyFlex: 'start', justifyContent: 'space-between', fontSize: '0.8rem', padding: '6px 10px' }}
                        >
                          <span>{cat.nombre}</span>
                          <span className="badge" style={{ fontSize: '0.65rem', opacity: isSelected ? 1 : 0.7 }}>
                            ({getCategoryCount(cat.id)})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Niveles */}
                <div className="mb-6">
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Nivel de Dificultad
                  </label>
                  <div className="flex flex-col gap-1">
                    {levels.map(level => {
                      const isSelected = filters.level === level;
                      return (
                        <button 
                          key={level} 
                          onClick={() => updateFilter('level', isSelected ? '' : level)}
                          className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-ghost'}`}
                          style={{ justifyContent: 'space-between', textTransform: 'capitalize', fontSize: '0.8rem', padding: '6px 10px' }}
                        >
                          <span>{level}</span>
                          <span className="badge" style={{ fontSize: '0.65rem' }}>✓</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Calificación Mínima */}
                <div className="mb-6">
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Calificación Mínima
                  </label>
                  <select 
                    className="form-input form-select" 
                    value={filters.minRating} 
                    onChange={(e) => updateFilter('minRating', e.target.value)} 
                    id="filter-rating"
                    style={{ fontSize: '0.85rem' }}
                  >
                    <option value="">Cualquier calificación</option>
                    <option value="4.5">4.5+ o superior ⭐⭐⭐⭐⭐</option>
                    <option value="4">4.0+ o superior ⭐⭐⭐⭐</option>
                    <option value="3.5">3.5+ o superior ⭐⭐⭐</option>
                  </select>
                </div>

                {/* Tipo de Contenido / Premium */}
                <div className="mb-6">
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Distinción
                  </label>
                  <button 
                    onClick={() => updateFilter('premium', filters.premium ? '' : 'true')}
                    className={`btn w-full ${filters.premium ? 'btn-gold' : 'btn-outline'}`}
                    style={{ fontSize: '0.8rem', padding: '8px 12px' }}
                  >
                    <Crown size={14} /> {filters.premium ? 'Mostrando solo Premium' : 'Filtrar por Cursos Premium'}
                  </button>
                </div>

                {/* Botones Aplicar / Limpiar */}
                <div className="flex flex-col gap-2 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <button onClick={() => fetchCourses()} className="btn btn-primary btn-sm w-full">
                    Aplicar Filtros
                  </button>
                  <button onClick={clearFilters} className="btn btn-ghost btn-sm w-full text-muted">
                    Limpiar Filtros
                  </button>
                </div>
              </div>
            </aside>
          )}

          {/* Grid Principal de Tarjetas de Curso */}
          <div>
            {/* Header del Total de Resultados */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted font-semibold" style={{ margin: 0 }}>
                {loading ? 'Buscando cursos...' : `${courses.length} ${courses.length === 1 ? 'curso encontrado' : 'cursos encontrados'}`}
              </p>
              <div className="flex items-center gap-2">
                <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>
                  <Award size={12} /> Certificación Disponible en Todos los Cursos
                </span>
              </div>
            </div>

            {loading ? (
              <div className={`grid ${showFilters ? 'grid-3' : 'grid-4'}`}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="skeleton" style={{ height: 165 }} />
                    <div style={{ padding: 'var(--space-5)' }}>
                      <div className="skeleton" style={{ height: 12, width: 80, marginBottom: 8 }} />
                      <div className="skeleton" style={{ height: 20, marginBottom: 8 }} />
                      <div className="skeleton" style={{ height: 14, width: '60%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : courses.length > 0 ? (
              <>
                <div className={`grid ${showFilters ? 'grid-3' : 'grid-4'} stagger-children`}>
                  {courses.map(course => <CourseCard key={course.id} course={course} />)}
                </div>

                {/* Paginación */}
                {pagination.totalPages > 1 && (
                  <div className="pagination mt-8 flex justify-center items-center gap-2">
                    <button disabled={!pagination.hasPrev} onClick={() => updateFilter('page', filters.page - 1)} className="btn btn-outline btn-sm">
                      <ChevronLeft size={16} /> Anterior
                    </button>
                    {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => {
                      const page = i + 1;
                      return (
                        <button 
                          key={page} 
                          className={`btn btn-sm ${page === filters.page ? 'btn-primary' : 'btn-ghost'}`} 
                          onClick={() => updateFilter('page', page)}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button disabled={!pagination.hasNext} onClick={() => updateFilter('page', filters.page + 1)} className="btn btn-outline btn-sm">
                      Siguiente <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="card text-center" style={{ padding: 'var(--space-16)' }}>
                <Search size={48} style={{ color: 'var(--accent-teal)', margin: '0 auto var(--space-4)' }} />
                <h3 style={{ marginBottom: 'var(--space-2)', fontWeight: 700 }}>No se encontraron cursos</h3>
                <p className="text-muted" style={{ maxWidth: 400, margin: '0 auto var(--space-6)' }}>
                  No hallamos coincidencias con los filtros aplicados. Intenta ampliar tus criterios de búsqueda.
                </p>
                <button onClick={clearFilters} className="btn btn-primary">
                  Ver Todos los Cursos
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

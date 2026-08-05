import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import CourseCard from '../../components/common/CourseCard';
import { X, Search, ChevronLeft, ChevronRight, Crown, Award, Sparkles, SlidersHorizontal, LayoutGrid, Star, BookOpen } from 'lucide-react';

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);

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

  const levels = ['principiante', 'intermedio', 'avanzado'];
  const hasActiveFilters = filters.category || filters.level || filters.minRating || filters.premium || filters.search;

  // Skeleton Card Component
  const SkeletonCard = () => (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="skeleton" style={{ height: 165, borderRadius: 0 }} />
      <div style={{ padding: '16px' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="skeleton" style={{ height: 14, width: 70, borderRadius: 'var(--radius-full)' }} />
          <div className="skeleton" style={{ height: 14, width: 55, borderRadius: 'var(--radius-full)' }} />
        </div>
        <div className="skeleton" style={{ height: 20, width: '90%', marginBottom: 10 }} />
        <div className="skeleton" style={{ height: 16, width: '60%', marginBottom: 14 }} />
        <div className="flex items-center gap-2 mb-3">
          <div className="skeleton" style={{ width: 28, height: 28, borderRadius: '50%' }} />
          <div className="skeleton" style={{ height: 14, width: 100 }} />
        </div>
        <div className="flex items-center gap-2 mb-4">
          <div className="skeleton" style={{ height: 13, width: 80 }} />
          <div className="skeleton" style={{ height: 13, width: 90 }} />
        </div>
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
          <div className="flex items-center gap-3">
            <div className="skeleton" style={{ height: 13, width: 75 }} />
            <div className="skeleton" style={{ height: 13, width: 70 }} />
          </div>
        </div>
      </div>
      <div style={{ padding: '0 16px 16px' }}>
        <div className="skeleton" style={{ height: 38, borderRadius: 'var(--radius-md)' }} />
      </div>
    </div>
  );

  return (
    <div className="page animate-fade-in">
      <div className="container">
        {/* Banner Superior del Catálogo Gratuito */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(13,148,136,0.1) 0%, rgba(59,130,246,0.1) 100%)',
          border: '1px solid rgba(13,148,136,0.2)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px 32px',
          marginBottom: 'var(--space-6)',
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
                <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--accent-teal)' }}>{pagination.total || '...'}</span>
                <p className="text-xs text-muted font-semibold" style={{ margin: 0 }}>Cursos Disponibles</p>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de Búsqueda */}
        <div className="card mb-4" style={{ padding: '14px 20px', borderRadius: 'var(--radius-lg)' }}>
          <div className="flex items-center gap-4 flex-wrap">
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

            {/* Selector de Ordenamiento */}
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

        {/* Filtros Horizontales */}
        <div className="mb-4" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Fila 1: Categorías horizontales */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto',
            padding: '4px 0', scrollbarWidth: 'none', msOverflowStyle: 'none'
          }}>
            <span className="text-xs font-semibold text-muted" style={{ whiteSpace: 'nowrap', minWidth: 'fit-content' }}>
              <LayoutGrid size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
              Categoría:
            </span>
            <button
              onClick={() => updateFilter('category', '')}
              className={`btn btn-sm ${!filters.category ? 'btn-primary' : 'btn-ghost'}`}
              style={{ whiteSpace: 'nowrap', fontSize: '0.78rem', padding: '5px 12px', borderRadius: 'var(--radius-full)' }}
            >
              Todas ({pagination.total || '...'})
            </button>
            {categories.map(cat => {
              const isSelected = String(filters.category) === String(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => updateFilter('category', isSelected ? '' : cat.id)}
                  className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ whiteSpace: 'nowrap', fontSize: '0.78rem', padding: '5px 12px', borderRadius: 'var(--radius-full)' }}
                >
                  {cat.nombre} ({cat.total_cursos || 0})
                </button>
              );
            })}
          </div>

          {/* Fila 2: Nivel + Rating + Premium */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="text-xs font-semibold text-muted" style={{ whiteSpace: 'nowrap' }}>
              <SlidersHorizontal size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
              Nivel:
            </span>
            {levels.map(level => {
              const isSelected = filters.level === level;
              return (
                <button
                  key={level}
                  onClick={() => updateFilter('level', isSelected ? '' : level)}
                  className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ whiteSpace: 'nowrap', textTransform: 'capitalize', fontSize: '0.78rem', padding: '5px 12px', borderRadius: 'var(--radius-full)' }}
                >
                  {level}
                </button>
              );
            })}

            <div style={{ width: 1, height: 20, background: 'var(--border-subtle)', margin: '0 4px' }} />

            <span className="text-xs font-semibold text-muted" style={{ whiteSpace: 'nowrap' }}>
              <Star size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
              Calificación:
            </span>
            {[
              { val: '4.5', label: '4.5+' },
              { val: '4', label: '4.0+' },
              { val: '3.5', label: '3.5+' }
            ].map(r => (
              <button
                key={r.val}
                onClick={() => updateFilter('minRating', filters.minRating === r.val ? '' : r.val)}
                className={`btn btn-sm ${filters.minRating === r.val ? 'btn-primary' : 'btn-ghost'}`}
                style={{ whiteSpace: 'nowrap', fontSize: '0.78rem', padding: '5px 12px', borderRadius: 'var(--radius-full)' }}
              >
                {r.label} <Star size={11} fill="var(--accent-gold)" color="var(--accent-gold)" style={{ marginLeft: 2 }} />
              </button>
            ))}

            <div style={{ width: 1, height: 20, background: 'var(--border-subtle)', margin: '0 4px' }} />

            <button
              onClick={() => updateFilter('premium', filters.premium ? '' : 'true')}
              className={`btn btn-sm ${filters.premium ? 'btn-primary' : 'btn-ghost'}`}
              style={{ whiteSpace: 'nowrap', fontSize: '0.78rem', padding: '5px 12px', borderRadius: 'var(--radius-full)' }}
            >
              <Crown size={13} /> Premium
            </button>
          </div>
        </div>

        {/* Etiquetas Removibles (Chips de Filtros Activos) */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mb-5 flex-wrap animate-fade-in" style={{ padding: '4px 0' }}>
            <span className="text-xs text-muted font-semibold">Filtros activos:</span>

            {filters.search && (
              <span className="badge badge-teal" style={{ padding: '6px 12px', fontSize: '0.75rem', gap: 6, cursor: 'pointer' }} onClick={() => removeSingleFilter('search')}>
                Buscar: "{filters.search}" <X size={12} />
              </span>
            )}

            {filters.category && (
              <span className="badge badge-teal" style={{ padding: '6px 12px', fontSize: '0.75rem', gap: 6, cursor: 'pointer' }} onClick={() => removeSingleFilter('category')}>
                Categoría: {categories.find(c => String(c.id) === String(filters.category))?.nombre || 'Seleccionada'} <X size={12} />
              </span>
            )}

            {filters.level && (
              <span className="badge badge-teal" style={{ padding: '6px 12px', fontSize: '0.75rem', gap: 6, textTransform: 'capitalize', cursor: 'pointer' }} onClick={() => removeSingleFilter('level')}>
                Nivel: {filters.level} <X size={12} />
              </span>
            )}

            {filters.minRating && (
              <span className="badge badge-teal" style={{ padding: '6px 12px', fontSize: '0.75rem', gap: 6, cursor: 'pointer' }} onClick={() => removeSingleFilter('minRating')}>
                Calificación: {filters.minRating}+ <X size={12} />
              </span>
            )}

            {filters.premium && (
              <span className="badge badge-gold" style={{ padding: '6px 12px', fontSize: '0.75rem', gap: 6, cursor: 'pointer' }} onClick={() => removeSingleFilter('premium')}>
                Solo Premium <X size={12} />
              </span>
            )}

            <button onClick={clearFilters} className="btn btn-ghost btn-sm text-xs" style={{ color: 'var(--accent-red)', padding: '2px 8px' }}>
              Limpiar todos
            </button>
          </div>
        )}

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

        {/* Grid Principal */}
        {loading ? (
          <div className="grid grid-4 stagger-children">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : courses.length > 0 ? (
          <>
            <div className="grid grid-4 stagger-children">
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
            <BookOpen size={48} style={{ color: 'var(--accent-teal)', margin: '0 auto var(--space-4)' }} />
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
  );
}

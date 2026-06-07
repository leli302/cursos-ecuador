import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import CourseCard from '../../components/common/CourseCard';
import { Filter, X, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    level: searchParams.get('level') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
    sort: searchParams.get('sort') || 'newest',
    premium: searchParams.get('premium') || '',
    page: parseInt(searchParams.get('page')) || 1
  });

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.data));
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
      setCourses(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => { if (v) params.set(k, v); });
    setSearchParams(params);
  };

  const clearFilters = () => {
    const clean = { search: '', category: '', level: '', minPrice: '', maxPrice: '', minRating: '', sort: 'newest', premium: '', page: 1 };
    setFilters(clean);
    setSearchParams({});
  };

  const levels = ['principiante', 'intermedio', 'avanzado', 'todos'];
  const hasActiveFilters = filters.category || filters.level || filters.minPrice || filters.maxPrice || filters.minRating || filters.premium;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Catálogo de Cursos</h1>
          <p className="text-muted mt-2">
            {pagination.total ? `${pagination.total} cursos encontrados` : 'Encuentra tu próximo curso'}
          </p>
        </div>

        {/* Search + Filter Toggle */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <div style={{ flex: '1 1 400px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="form-input"
              style={{ paddingLeft: 48, borderRadius: 'var(--radius-full)' }}
              id="catalog-search"
            />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={`btn ${showFilters ? 'btn-primary' : 'btn-outline'}`}>
            <Filter size={16} /> Filtros
            {hasActiveFilters && <span className="badge badge-teal" style={{ marginLeft: 4, padding: '2px 6px' }}>!</span>}
          </button>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="btn btn-ghost btn-sm"><X size={14} /> Limpiar</button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: showFilters ? '260px 1fr' : '1fr', gap: 'var(--space-6)', transition: 'all 0.3s ease' }}>
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="animate-slide-left">
              <div className="card" style={{ position: 'sticky', top: 90 }}>
                {/* Category */}
                <div className="mb-6">
                  <label className="form-label">Categoría</label>
                  <select className="form-input form-select" value={filters.category} onChange={(e) => updateFilter('category', e.target.value)} id="filter-category">
                    <option value="">Todas</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>

                {/* Level */}
                <div className="mb-6">
                  <label className="form-label">Nivel</label>
                  <div className="flex flex-col gap-2">
                    {levels.map(level => (
                      <button key={level} onClick={() => updateFilter('level', filters.level === level ? '' : level)}
                        className={`btn btn-sm ${filters.level === level ? 'btn-primary' : 'btn-ghost'}`}
                        style={{ justifyContent: 'flex-start', textTransform: 'capitalize' }}>
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="form-label">Precio</label>
                  <div className="flex items-center gap-2">
                    <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => updateFilter('minPrice', e.target.value)} className="form-input" style={{ width: '50%' }} />
                    <span className="text-muted">-</span>
                    <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => updateFilter('maxPrice', e.target.value)} className="form-input" style={{ width: '50%' }} />
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-6">
                  <label className="form-label">Valoración mínima</label>
                  <select className="form-input form-select" value={filters.minRating} onChange={(e) => updateFilter('minRating', e.target.value)} id="filter-rating">
                    <option value="">Cualquiera</option>
                    <option value="4.5">⭐ 4.5+</option>
                    <option value="4">⭐ 4.0+</option>
                    <option value="3.5">⭐ 3.5+</option>
                    <option value="3">⭐ 3.0+</option>
                  </select>
                </div>

                {/* Premium */}
                <div className="mb-6">
                  <button onClick={() => updateFilter('premium', filters.premium ? '' : 'true')}
                    className={`btn w-full ${filters.premium ? 'btn-gold' : 'btn-outline'}`}>
                    👑 Solo Premium
                  </button>
                </div>

                {/* Sort */}
                <div>
                  <label className="form-label">Ordenar por</label>
                  <select className="form-input form-select" value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)} id="filter-sort">
                    <option value="newest">Más recientes</option>
                    <option value="sales">Más vendidos</option>
                    <option value="rating">Mejor valorados</option>
                    <option value="price_asc">Precio: menor a mayor</option>
                    <option value="price_desc">Precio: mayor a menor</option>
                    <option value="name">Nombre A-Z</option>
                  </select>
                </div>
              </div>
            </aside>
          )}

          {/* Course Grid */}
          <div>
            {loading ? (
              <div className="grid grid-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="skeleton" style={{ height: 180 }} />
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

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="pagination">
                    <button disabled={!pagination.hasPrev} onClick={() => updateFilter('page', filters.page - 1)}>
                      <ChevronLeft size={16} />
                    </button>
                    {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => {
                      const page = i + 1;
                      return (
                        <button key={page} className={page === filters.page ? 'active' : ''} onClick={() => updateFilter('page', page)}>
                          {page}
                        </button>
                      );
                    })}
                    <button disabled={!pagination.hasNext} onClick={() => updateFilter('page', filters.page + 1)}>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="card text-center" style={{ padding: 'var(--space-16)' }}>
                <Search size={48} style={{ color: 'var(--text-muted)', margin: '0 auto var(--space-4)' }} />
                <h3 style={{ marginBottom: 'var(--space-2)' }}>No se encontraron cursos</h3>
                <p className="text-muted">Intenta con otros filtros o búsqueda</p>
                <button onClick={clearFilters} className="btn btn-primary mt-4">Limpiar filtros</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const toast = useToast();

  const fetchCategories = async () => {
    const { data } = await api.get('/categories/all');
    setCategories(data.data);
  };

  useEffect(() => { fetchCategories(); }, []);

  return (
    <div className="page"><div className="container">
      <div className="flex justify-between items-center mb-8">
        <h1 className="page-title">Categorías</h1>
        <button className="btn btn-primary"><Plus size={16} /> Nueva Categoría</button>
      </div>
      <div className="grid grid-3 stagger-children">
        {categories.map(c => (
          <div key={c.id} className="card">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg">{c.nombre}</h3>
              <div className="flex gap-1">
                <button className="btn-icon"><Edit size={14} /></button>
                <button className="btn-icon" style={{ color: 'var(--accent-red)' }}><Trash2 size={14} /></button>
              </div>
            </div>
            <p className="text-sm text-muted mb-3">{c.descripcion}</p>
            <div className="flex justify-between items-center">
              <span className="badge badge-teal">{c.total_cursos} cursos</span>
              <span className={`badge ${c.estado ? 'badge-green' : 'badge-red'}`}>{c.estado ? 'Activa' : 'Inactiva'}</span>
            </div>
          </div>
        ))}
      </div>
    </div></div>
  );
}

import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { ShoppingCart } from 'lucide-react';

export default function PurchaseHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/orders').then(({ data }) => { setOrders(data.data); setLoading(false); }).catch(() => setLoading(false)); }, []);

  const statusColors = { pendiente: 'badge-orange', pagado: 'badge-green', rechazado: 'badge-red', cancelado: 'badge-red', reembolsado: 'badge-blue' };

  return (
    <div className="page"><div className="container">
      <h1 className="page-title mb-8">Historial de Compras</h1>
      {orders.length > 0 ? (
        <div className="table-container"><table>
          <thead><tr><th>Código</th><th>Fecha</th><th>Cursos</th><th>Total</th><th>Estado</th></tr></thead>
          <tbody>{orders.map(o => (
            <tr key={o.id}>
              <td><code style={{ color: 'var(--accent-teal)' }}>{o.codigo}</code></td>
              <td className="text-sm">{new Date(o.creado_en).toLocaleDateString('es-EC')}</td>
              <td className="text-sm">{o.items?.map(i => i.nombre).join(', ')}</td>
              <td style={{ fontWeight: 600 }}>${parseFloat(o.total).toFixed(2)}</td>
              <td><span className={`badge ${statusColors[o.estado] || 'badge-blue'}`}>{o.estado}</span></td>
            </tr>
          ))}</tbody>
        </table></div>
      ) : (
        <div className="card text-center p-8"><ShoppingCart size={48} style={{ color: 'var(--text-muted)', margin: '0 auto var(--space-4)' }} /><h3>Sin compras</h3><p className="text-muted">Aún no has realizado compras</p></div>
      )}
    </div></div>
  );
}

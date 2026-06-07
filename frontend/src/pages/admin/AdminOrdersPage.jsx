import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders?limit=50').then(({ data }) => { setOrders(data.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const statusColors = { pendiente: 'badge-orange', pagado: 'badge-green', rechazado: 'badge-red', cancelado: 'badge-red', reembolsado: 'badge-blue' };

  return (
    <div className="page"><div className="container">
      <h1 className="page-title mb-8">Órdenes y Pagos</h1>
      <div className="table-container"><table>
        <thead><tr><th>Código</th><th>Cliente</th><th>Subtotal</th><th>Descuento</th><th>Total</th><th>Estado</th><th>Fecha</th></tr></thead>
        <tbody>{orders.map(o => (
          <tr key={o.id}>
            <td><code className="text-xs" style={{ color: 'var(--accent-teal)' }}>{o.codigo}</code></td>
            <td className="text-sm">{o.usuario_nombre} {o.usuario_apellido}</td>
            <td className="text-sm">${parseFloat(o.subtotal).toFixed(2)}</td>
            <td className="text-sm" style={{ color: parseFloat(o.descuento) > 0 ? 'var(--accent-green)' : 'inherit' }}>{parseFloat(o.descuento) > 0 ? `-$${parseFloat(o.descuento).toFixed(2)}` : '-'}</td>
            <td className="font-semibold">${parseFloat(o.total).toFixed(2)}</td>
            <td><span className={`badge ${statusColors[o.estado] || 'badge-blue'}`}>{o.estado}</span></td>
            <td className="text-xs text-muted">{new Date(o.creado_en).toLocaleDateString('es-EC')}</td>
          </tr>
        ))}</tbody>
      </table></div>
    </div></div>
  );
}

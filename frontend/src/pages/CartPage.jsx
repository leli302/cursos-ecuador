import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ShoppingCart, Trash2, ArrowRight, CreditCard, Crown, Shield } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, clearCart, fetchCart } = useCart();
  const { isPremium } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('tarjeta_simulada');

  const handleCheckout = async () => {
    if (cart.items.length === 0) return;
    setProcessing(true);
    try {
      // 1. Create order
      const { data: orderData } = await api.post('/orders');
      // 2. Process payment
      await api.post('/payments', { orden_id: orderData.order.id, metodo: paymentMethod });
      toast.success('¡Compra exitosa! Ya tienes acceso a tus cursos.');
      await fetchCart();
      navigate('/mi-biblioteca');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al procesar la compra');
    } finally {
      setProcessing(false);
    }
  };

  const handleRemove = async (courseId) => {
    const result = await removeFromCart(courseId);
    if (result.success) toast.success('Curso eliminado del carrito');
  };

  if (cart.items.length === 0) {
    return (
      <div className="page container text-center" style={{ paddingTop: 120 }}>
        <ShoppingCart size={64} style={{ color: 'var(--text-muted)', margin: '0 auto var(--space-6)' }} />
        <h2 style={{ marginBottom: 'var(--space-3)' }}>Tu carrito está vacío</h2>
        <p className="text-muted mb-6">Explora nuestro catálogo y agrega cursos</p>
        <Link to="/catalogo" className="btn btn-primary btn-lg">Explorar Cursos</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title mb-8">Carrito de Compras</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--space-8)', alignItems: 'start' }}>
          {/* Cart Items */}
          <div className="flex flex-col gap-4">
            {cart.items.map(item => (
              <div key={item.id} className="card flex gap-4" style={{ padding: 'var(--space-4)' }}>
                <img src={item.imagen || `https://placehold.co/160x90/142241/4ECDC4?text=Curso&font=roboto`} alt={item.nombre} style={{ width: 160, height: 90, objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 4 }}>{item.nombre}</h3>
                  <p className="text-xs text-muted">{item.instructor_nombre} {item.instructor_apellido}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', fontWeight: 700 }}>${parseFloat(item.precio).toFixed(2)}</span>
                  <button onClick={() => handleRemove(item.curso_id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--accent-red)' }}>
                    <Trash2 size={14} /> Eliminar
                  </button>
                </div>
              </div>
            ))}
            <button onClick={clearCart} className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start' }}>
              <Trash2 size={14} /> Vaciar carrito
            </button>
          </div>

          {/* Summary */}
          <div className="card" style={{ position: 'sticky', top: 90, border: '1px solid rgba(78,205,196,0.2)' }}>
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Resumen de Compra</h3>
            <div className="flex justify-between mb-2 text-sm"><span className="text-muted">Subtotal</span><span>${cart.subtotal}</span></div>
            {parseFloat(cart.discount) > 0 && (
              <div className="flex justify-between mb-2 text-sm"><span className="text-muted flex items-center gap-1"><Crown size={12} style={{ color: 'var(--accent-gold)' }} /> Descuento Premium</span><span style={{ color: 'var(--accent-green)' }}>-${cart.discount}</span></div>
            )}
            <div style={{ borderTop: '1px solid var(--border-subtle)', margin: 'var(--space-3) 0', paddingTop: 'var(--space-3)' }}>
              <div className="flex justify-between"><span style={{ fontWeight: 700 }}>Total</span><span style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', fontWeight: 800 }}>${cart.total}</span></div>
            </div>

            {/* Payment Method */}
            <div className="mt-4 mb-4">
              <label className="form-label">Método de Pago</label>
              <select className="form-input form-select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} id="payment-method">
                <option value="tarjeta_simulada">💳 Tarjeta (Simulado)</option>
                <option value="transferencia_simulada">🏦 Transferencia (Simulado)</option>
              </select>
            </div>

            {paymentMethod === 'tarjeta_simulada' && (
              <div className="mb-4" style={{ padding: 'var(--space-4)', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)' }}>
                <input type="text" className="form-input mb-2" placeholder="4242 4242 4242 4242" style={{ fontSize: 'var(--text-sm)' }} />
                <div className="flex gap-2">
                  <input type="text" className="form-input" placeholder="MM/AA" style={{ fontSize: 'var(--text-sm)' }} />
                  <input type="text" className="form-input" placeholder="CVC" style={{ fontSize: 'var(--text-sm)' }} />
                </div>
                <p className="text-xs text-muted mt-2"><Shield size={10} style={{ display: 'inline' }} /> Pago simulado - no se cobra</p>
              </div>
            )}

            <button onClick={handleCheckout} className="btn btn-primary btn-lg w-full" disabled={processing} id="checkout-btn">
              {processing ? 'Procesando...' : <><CreditCard size={18} /> Confirmar Compra</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

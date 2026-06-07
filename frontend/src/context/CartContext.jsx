import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], subtotal: '0.00', discount: '0.00', total: '0.00', itemCount: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const { data } = await api.get('/cart');
      setCart(data.cart);
    } catch (error) {
      console.error('Error cargando carrito:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart({ items: [], subtotal: '0.00', discount: '0.00', total: '0.00', itemCount: 0 });
    }
  }, [isAuthenticated]);

  const addToCart = async (courseId) => {
    try {
      await api.post('/cart/add', { curso_id: courseId });
      await fetchCart();
      return { success: true, message: 'Curso agregado al carrito' };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || 'Error al agregar' };
    }
  };

  const removeFromCart = async (courseId) => {
    try {
      await api.delete(`/cart/remove/${courseId}`);
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || 'Error al eliminar' };
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart/clear');
      await fetchCart();
    } catch (error) {
      console.error('Error vaciando carrito:', error);
    }
  };

  return (
    <CartContext.Provider value={{
      cart, loading, fetchCart, addToCart, removeFromCart, clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider');
  return context;
};

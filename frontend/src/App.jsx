import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Pages
import HomePage from './pages/public/HomePage';
import CatalogPage from './pages/public/CatalogPage';
import CourseDetailPage from './pages/public/CourseDetailPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import PremiumPage from './pages/public/PremiumPage';
import CartPage from './pages/CartPage';
import StudentDashboard from './pages/student/DashboardPage';
import LibraryPage from './pages/student/LibraryPage';
import ClassroomPage from './pages/student/ClassroomPage';
import CertificatesPage from './pages/student/CertificatesPage';
import PurchaseHistoryPage from './pages/student/PurchaseHistoryPage';
import ProfilePage from './pages/student/ProfilePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminCoursesPage from './pages/admin/AdminCoursesPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';

// Protected Route component
const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <div className="page flex justify-center items-center"><div className="skeleton" style={{width:40,height:40,borderRadius:'50%'}}></div></div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (roles.length > 0 && !roles.some(r => user?.roles?.includes(r))) {
    return <Navigate to="/" />;
  }
  return children;
};

function AppContent() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/curso/:id" element={<CourseDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/premium" element={<PremiumPage />} />

          {/* Carrito */}
          <Route path="/carrito" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />

          {/* Estudiante */}
          <Route path="/mi-panel" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/mi-biblioteca" element={<ProtectedRoute><LibraryPage /></ProtectedRoute>} />
          <Route path="/aula/:id" element={<ProtectedRoute><ClassroomPage /></ProtectedRoute>} />
          <Route path="/mis-certificados" element={<ProtectedRoute><CertificatesPage /></ProtectedRoute>} />
          <Route path="/mis-compras" element={<ProtectedRoute><PurchaseHistoryPage /></ProtectedRoute>} />
          <Route path="/mi-perfil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute roles={['administrador', 'instructor']}><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/admin/cursos" element={<ProtectedRoute roles={['administrador','instructor']}><AdminCoursesPage /></ProtectedRoute>} />
          <Route path="/admin/usuarios" element={<ProtectedRoute roles={['administrador']}><AdminUsersPage /></ProtectedRoute>} />
          <Route path="/admin/categorias" element={<ProtectedRoute roles={['administrador']}><AdminCategoriesPage /></ProtectedRoute>} />
          <Route path="/admin/ordenes" element={<ProtectedRoute roles={['administrador']}><AdminOrdersPage /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={
            <div className="page container text-center" style={{paddingTop:'120px'}}>
              <h1 className="text-5xl font-bold mb-4" style={{fontFamily:'var(--font-heading)'}}>404</h1>
              <p className="text-muted text-lg">Página no encontrada</p>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}

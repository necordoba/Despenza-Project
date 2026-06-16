import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PantryProvider } from './contexts/PantryContext';
import Layout from './components/layout/Layout';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import PantryPage from './pages/PantryPage';
import ShoppingPage from './pages/ShoppingPage';
import ConsumptionPage from './pages/ConsumptionPage';

function ProtectedRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return (
    <PantryProvider>
      <Layout />
    </PantryProvider>
  );
}

function AuthPageGuard() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return <AuthPage />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<AuthPageGuard />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/"         element={<Dashboard />}        />
            <Route path="/despensa" element={<PantryPage />}       />
            <Route path="/compras"  element={<ShoppingPage />}     />
            <Route path="/consumo"  element={<ConsumptionPage />}  />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Package, AlertTriangle, ShoppingCart, TrendingDown, ChevronRight } from 'lucide-react';
import { usePantry } from '../contexts/PantryContext';
import { useAuth } from '../contexts/AuthContext';
import { CATEGORIES, getExpirationStatus, daysUntilExpiration } from '../types';

function StatCard({
  icon: Icon, label, value, color, bg,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: string;
  bg: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 ${bg}`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { products, shopping, loadingProducts } = usePantry();

  const stats = useMemo(() => {
    const expiring = products.filter((p) => {
      const s = getExpirationStatus(p.expirationDate);
      return s === 'critical' || s === 'warning';
    });
    const expired = products.filter((p) => getExpirationStatus(p.expirationDate) === 'expired');
    const lowStock = products.filter((p) => p.quantity <= p.minStock);
    return { expiring, expired, lowStock };
  }, [products]);

  const criticalAlerts = useMemo(() =>
    [...products]
      .filter((p) => {
        const s = getExpirationStatus(p.expirationDate);
        return s === 'expired' || s === 'critical';
      })
      .sort((a, b) => {
        const da = daysUntilExpiration(a.expirationDate) ?? Infinity;
        const db2 = daysUntilExpiration(b.expirationDate) ?? Infinity;
        return da - db2;
      })
      .slice(0, 5),
  [products]);

  if (loadingProducts) {
    return (
      <div className="flex items-center justify-center h-full min-h-64">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const firstName = (user?.user_metadata?.full_name as string | undefined)?.split(' ')[0] ?? 'Usuario';

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Hola, {firstName} 👋</h1>
        <p className="text-gray-500 mt-1">Aquí tienes el resumen de tu despensa</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Package}
          label="Productos totales"
          value={products.length}
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
        <StatCard
          icon={AlertTriangle}
          label="Por vencer pronto"
          value={stats.expiring.length}
          color="text-amber-600"
          bg="bg-amber-50"
        />
        <StatCard
          icon={TrendingDown}
          label="Stock bajo"
          value={stats.lowStock.length}
          color="text-red-600"
          bg="bg-red-50"
        />
        <StatCard
          icon={ShoppingCart}
          label="Lista de compras"
          value={shopping.filter((i) => !i.checked).length}
          color="text-blue-600"
          bg="bg-blue-50"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Alertas de vencimiento</h2>
            <Link to="/despensa" className="text-xs text-emerald-600 hover:underline flex items-center gap-0.5">
              Ver todo <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {criticalAlerts.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <AlertTriangle className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Sin alertas activas</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {criticalAlerts.map((p) => {
                const days = daysUntilExpiration(p.expirationDate);
                const status = getExpirationStatus(p.expirationDate);
                const cat = CATEGORIES[p.category];
                return (
                  <li key={p.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <span className="text-xl">{cat.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                      <p className="text-xs text-gray-400">{cat.label}</p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        status === 'expired'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {status === 'expired'
                        ? 'Vencido'
                        : days === 0
                        ? 'Hoy'
                        : `${days}d`}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Low stock */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Stock bajo</h2>
            <Link to="/compras" className="text-xs text-emerald-600 hover:underline flex items-center gap-0.5">
              Agregar a compras <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {stats.lowStock.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <TrendingDown className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Todo el stock está bien</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {stats.lowStock.slice(0, 5).map((p) => {
                const cat = CATEGORIES[p.category];
                return (
                  <li key={p.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <span className="text-xl">{cat.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                      <p className="text-xs text-gray-400">{cat.label}</p>
                    </div>
                    <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                      {p.quantity} {p.unit}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

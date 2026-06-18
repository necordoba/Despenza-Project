import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Package, AlertTriangle, ShoppingCart, TrendingDown, ChevronRight } from 'lucide-react';
import { usePantry } from '../contexts/PantryContext';
import { useAuth } from '../contexts/AuthContext';
import { CATEGORIES, getExpirationStatus, daysUntilExpiration } from '../types';

function StatCard({
  icon: Icon, label, value, iconColor, iconBg, accent,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  iconColor: string;
  iconBg: string;
  accent: string;
}) {
  return (
    <div
      className="bg-white rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden"
      style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)' }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
        style={{ background: accent }}
      />
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      </div>
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
    const lowStock = products.filter((p) => p.quantity <= p.minStock);
    return { expiring, lowStock };
  }, [products]);

  const criticalAlerts = useMemo(() =>
    [...products]
      .filter((p) => {
        const s = getExpirationStatus(p.expirationDate);
        return s === 'expired' || s === 'critical';
      })
      .sort((a, b) => {
        const da = daysUntilExpiration(a.expirationDate) ?? Infinity;
        const db = daysUntilExpiration(b.expirationDate) ?? Infinity;
        return da - db;
      })
      .slice(0, 5),
  [products]);

  if (loadingProducts) {
    return (
      <div className="flex items-center justify-center h-full min-h-64">
        <div className="w-8 h-8 border-[3px] border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const firstName = (user?.user_metadata?.full_name as string | undefined)?.split(' ')[0] ?? 'Usuario';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-medium text-emerald-600 mb-1">{greeting}</p>
        <h1 className="text-3xl font-extrabold text-gray-900">{firstName} 👋</h1>
        <p className="text-gray-400 mt-1 text-sm">Aquí tienes el resumen de tu despensa</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Package}
          label="Productos totales"
          value={products.length}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          accent="linear-gradient(90deg, #059669, #34d399)"
        />
        <StatCard
          icon={AlertTriangle}
          label="Por vencer pronto"
          value={stats.expiring.length}
          iconColor="text-amber-500"
          iconBg="bg-amber-50"
          accent="linear-gradient(90deg, #f59e0b, #fcd34d)"
        />
        <StatCard
          icon={TrendingDown}
          label="Stock bajo"
          value={stats.lowStock.length}
          iconColor="text-red-500"
          iconBg="bg-red-50"
          accent="linear-gradient(90deg, #ef4444, #fca5a5)"
        />
        <StatCard
          icon={ShoppingCart}
          label="Lista de compras"
          value={shopping.filter((i) => !i.checked).length}
          iconColor="text-blue-500"
          iconBg="bg-blue-50"
          accent="linear-gradient(90deg, #3b82f6, #93c5fd)"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Expiry alerts */}
        <div
          className="bg-white rounded-2xl p-5"
          style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900">Alertas de vencimiento</h2>
            <Link
              to="/despensa"
              className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Ver todo <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {criticalAlerts.length === 0 ? (
            <div className="text-center py-10 text-gray-300">
              <AlertTriangle className="w-10 h-10 mx-auto mb-2" />
              <p className="text-sm text-gray-400 font-medium">Sin alertas activas</p>
            </div>
          ) : (
            <ul className="space-y-1">
              {criticalAlerts.map((p) => {
                const days = daysUntilExpiration(p.expirationDate);
                const status = getExpirationStatus(p.expirationDate);
                const cat = CATEGORIES[p.category];
                return (
                  <li
                    key={p.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <span
                      className="w-9 h-9 text-lg flex items-center justify-center rounded-xl shrink-0"
                      style={{ background: cat.bg }}
                    >
                      {cat.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                      <p className="text-xs text-gray-400">{cat.label}</p>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${
                        status === 'expired'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {status === 'expired' ? 'Vencido' : days === 0 ? 'Hoy' : `${days}d`}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Low stock */}
        <div
          className="bg-white rounded-2xl p-5"
          style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900">Stock bajo</h2>
            <Link
              to="/compras"
              className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Agregar a compras <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {stats.lowStock.length === 0 ? (
            <div className="text-center py-10 text-gray-300">
              <TrendingDown className="w-10 h-10 mx-auto mb-2" />
              <p className="text-sm text-gray-400 font-medium">Todo el stock está bien</p>
            </div>
          ) : (
            <ul className="space-y-1">
              {stats.lowStock.slice(0, 5).map((p) => {
                const cat = CATEGORIES[p.category];
                return (
                  <li
                    key={p.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <span
                      className="w-9 h-9 text-lg flex items-center justify-center rounded-xl shrink-0"
                      style={{ background: cat.bg }}
                    >
                      {cat.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                      <p className="text-xs text-gray-400">{cat.label}</p>
                    </div>
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full shrink-0">
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

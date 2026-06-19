import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Package, AlertTriangle, ShoppingCart, TrendingDown, ChevronRight } from 'lucide-react';
import { usePantry } from '../contexts/PantryContext';
import { useAuth } from '../contexts/AuthContext';
import { CATEGORIES, getExpirationStatus, daysUntilExpiration } from '../types';

function StatCard({
  icon: Icon, label, value, gradient, shadow,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  gradient: string;
  shadow: string;
}) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden"
      style={{ background: gradient, boxShadow: shadow }}
    >
      <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-3xl font-black text-white leading-none">{value}</p>
        <p className="text-sm text-white/70 mt-1.5 font-medium">{label}</p>
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
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-600 mb-1 uppercase tracking-wide">{greeting}</p>
          <h1 className="text-3xl font-extrabold text-gray-900">{firstName} 👋</h1>
          <p className="text-gray-400 mt-1 text-sm">Aquí tienes el resumen de tu despensa</p>
        </div>
        <div
          className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{ background: '#e8f5e9', color: '#2e7d32' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {products.length} productos activos
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Package}
          label="Productos totales"
          value={products.length}
          gradient="linear-gradient(135deg, #059669 0%, #10b981 100%)"
          shadow="0 8px 24px rgba(5,150,105,0.35)"
        />
        <StatCard
          icon={AlertTriangle}
          label="Por vencer pronto"
          value={stats.expiring.length}
          gradient="linear-gradient(135deg, #d97706 0%, #f59e0b 100%)"
          shadow="0 8px 24px rgba(217,119,6,0.35)"
        />
        <StatCard
          icon={TrendingDown}
          label="Stock bajo"
          value={stats.lowStock.length}
          gradient="linear-gradient(135deg, #dc2626 0%, #ef4444 100%)"
          shadow="0 8px 24px rgba(220,38,38,0.30)"
        />
        <StatCard
          icon={ShoppingCart}
          label="Lista de compras"
          value={shopping.filter((i) => !i.checked).length}
          gradient="linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)"
          shadow="0 8px 24px rgba(37,99,235,0.30)"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Expiry alerts */}
        <div
          className="bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
              </div>
              <h2 className="font-bold text-gray-900 text-sm">Alertas de vencimiento</h2>
            </div>
            <Link
              to="/despensa"
              className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Ver todo <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {criticalAlerts.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm text-gray-400 font-medium">Sin alertas activas</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {criticalAlerts.map((p) => {
                const days = daysUntilExpiration(p.expirationDate);
                const status = getExpirationStatus(p.expirationDate);
                const cat = CATEGORIES[p.category];
                const isExpired = status === 'expired';
                return (
                  <li
                    key={p.id}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/60 transition-colors"
                  >
                    <div
                      className="w-1 h-8 rounded-full shrink-0"
                      style={{ background: isExpired ? '#ef4444' : '#f59e0b' }}
                    />
                    <span
                      className="w-8 h-8 text-base flex items-center justify-center rounded-xl shrink-0"
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
                        isExpired ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {isExpired ? 'Vencido' : days === 0 ? 'Hoy' : `${days}d`}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Low stock */}
        <div
          className="bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                <TrendingDown className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <h2 className="font-bold text-gray-900 text-sm">Stock bajo</h2>
            </div>
            <Link
              to="/compras"
              className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Agregar a compras <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {stats.lowStock.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <TrendingDown className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm text-gray-400 font-medium">Todo el stock está bien</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {stats.lowStock.slice(0, 5).map((p) => {
                const cat = CATEGORIES[p.category];
                const pct = p.minStock > 0 ? Math.min(100, (p.quantity / p.minStock) * 100) : 0;
                return (
                  <li
                    key={p.id}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/60 transition-colors"
                  >
                    <div className="w-1 h-8 rounded-full shrink-0 bg-red-400" />
                    <span
                      className="w-8 h-8 text-base flex items-center justify-center rounded-xl shrink-0"
                      style={{ background: cat.bg }}
                    >
                      {cat.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-red-400 transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 shrink-0">{p.quantity}/{p.minStock} {p.unit}</span>
                      </div>
                    </div>
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

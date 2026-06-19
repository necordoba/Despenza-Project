import { useMemo } from 'react';
import { BarChart2, RotateCcw, FlameKindling } from 'lucide-react';
import { usePantry } from '../contexts/PantryContext';
import { CATEGORIES } from '../types';

export default function ConsumptionPage() {
  const { products, resetUsage } = usePantry();

  const usedProducts = useMemo(() =>
    [...products]
      .filter(p => p.usedQuantity > 0)
      .sort((a, b) => b.usedQuantity - a.usedQuantity),
    [products]
  );

  const totalItems = usedProducts.length;
  const topProduct = usedProducts[0];

  return (
    <div className="px-6 pt-8 pb-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Consumo</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Registro de lo que has usado de tu despensa
        </p>
      </div>

      {/* Summary cards */}
      {usedProducts.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 p-4" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center mb-3">
              <BarChart2 className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            <p className="text-sm text-gray-500 mt-0.5">
              Producto{totalItems !== 1 ? 's' : ''} consumido{totalItems !== 1 ? 's' : ''}
            </p>
          </div>

          {topProduct && (
            <div className="bg-white rounded-xl border border-gray-100 p-4" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
              <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center mb-3">
                <FlameKindling className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 truncate">{topProduct.name}</p>
              <p className="text-sm text-gray-500 mt-0.5">
                Más consumido · {topProduct.usedQuantity} {topProduct.unit}
              </p>
            </div>
          )}
        </div>
      )}

      {/* List */}
      {usedProducts.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <BarChart2 className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-lg font-semibold text-gray-500">Sin consumo registrado</p>
          <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">
            Cada vez que reduces el stock de un producto, se registra aquí
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {usedProducts.map((p, i) => {
            const cat = CATEGORIES[p.category];
            const maxUsage = usedProducts[0].usedQuantity;
            const barPct = Math.round((p.usedQuantity / maxUsage) * 100);
            const rankColors = ['#f59e0b', '#94a3b8', '#cd7c4c'];
            const rankBgs   = ['#fef3c7', '#f1f5f9', '#fdf0e8'];
            const isTop3 = i < 3;
            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-4 group"
                style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)' }}
              >
                {/* Rank badge */}
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-black"
                  style={isTop3
                    ? { background: rankBgs[i], color: rankColors[i] }
                    : { background: '#f8fafc', color: '#cbd5e1' }
                  }
                >
                  {i + 1}
                </div>

                {/* Emoji */}
                <span
                  className="w-10 h-10 text-xl flex items-center justify-center rounded-xl shrink-0"
                  style={{ background: cat.bg }}
                >
                  {cat.emoji}
                </span>

                {/* Info + bar */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[15px] text-gray-900 truncate">{p.name}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${barPct}%`,
                          background: i === 0
                            ? 'linear-gradient(90deg, #059669, #10b981)'
                            : 'linear-gradient(90deg, #6ee7b7, #a7f3d0)',
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">{barPct}%</span>
                  </div>
                </div>

                {/* Usage amount */}
                <div className="text-right shrink-0">
                  <p className="text-lg font-black text-emerald-600 leading-none">{p.usedQuantity}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{p.unit}</p>
                </div>

                {/* Reset button */}
                <button
                  onClick={() => resetUsage(p.id)}
                  title="Reiniciar contador"
                  className="p-2 rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

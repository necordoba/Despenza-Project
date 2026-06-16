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
        <div className="text-center py-24 text-gray-400">
          <BarChart2 className="w-14 h-14 mx-auto mb-3 opacity-20" />
          <p className="text-lg font-medium text-gray-500">Sin consumo registrado</p>
          <p className="text-sm mt-1">
            Cada vez que reduces el stock de un producto, se registra aquí
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {usedProducts.map((p, i) => {
            const cat = CATEGORIES[p.category];
            return (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center gap-4"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}
              >
                {/* Rank */}
                <span className="text-xs font-bold text-gray-300 w-5 text-center shrink-0">
                  {i + 1}
                </span>

                {/* Emoji */}
                <span
                  className="w-10 h-10 text-xl flex items-center justify-center rounded-xl shrink-0"
                  style={{ background: cat.bg }}
                >
                  {cat.emoji}
                </span>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[15px] text-gray-900 truncate">{p.name}</p>
                  <span
                    className="inline-block text-[12px] px-2 py-0.5 rounded-full font-medium mt-0.5"
                    style={{ background: cat.bg, color: cat.color }}
                  >
                    {cat.label}
                  </span>
                </div>

                {/* Usage amount */}
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-emerald-600">{p.usedQuantity}</p>
                  <p className="text-xs text-gray-400">{p.unit}</p>
                </div>

                {/* Reset button */}
                <button
                  onClick={() => resetUsage(p.id)}
                  title="Reiniciar contador"
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-300 hover:text-gray-500 transition-colors shrink-0"
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

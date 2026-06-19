import { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, ShoppingCart, RefreshCw, X } from 'lucide-react';
import { usePantry } from '../contexts/PantryContext';
import type { Unit } from '../types';
import { UNITS } from '../types';

export default function ShoppingPage() {
  const { shopping, addShoppingItem, toggleShoppingItem, deleteShoppingItem, clearCheckedItems, generateShoppingList } = usePantry();

  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState<Unit>('unidades');
  const [loading, setLoading] = useState(false);

  const pending = shopping.filter((i) => !i.checked);
  const checked = shopping.filter((i) => i.checked);

  async function handleAdd(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    await addShoppingItem({ name: name.trim(), quantity, unit });
    setName('');
    setQuantity(1);
    setUnit('unidades');
    setLoading(false);
    setShowAdd(false);
  }

  const total = shopping.length;
  const pct = total === 0 ? 0 : Math.round((checked.length / total) * 100);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lista de compras</h1>
          <p className="text-gray-500 text-sm mt-0.5">{pending.length} pendiente{pending.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={generateShoppingList}
            title="Genera la lista con los productos consumidos este mes"
            className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reponer consumo
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
            style={{ boxShadow: '0 4px 12px rgba(5,150,105,0.3)' }}
          >
            <Plus className="w-4 h-4" />
            Agregar
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="bg-white rounded-2xl p-4 mb-5" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Progreso de compra</span>
            <span className="text-sm font-bold text-emerald-600">{checked.length}/{total}</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: pct === 100
                  ? 'linear-gradient(90deg, #059669, #10b981)'
                  : 'linear-gradient(90deg, #10b981, #34d399)',
              }}
            />
          </div>
          {pct === 100 && (
            <p className="text-xs text-emerald-600 font-semibold mt-2">¡Lista completa!</p>
          )}
        </div>
      )}

      {/* Add form inline */}
      {showAdd && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
          <form onSubmit={handleAdd} className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-800">Nuevo ítem</p>
              <button type="button" onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del producto"
              required
              autoFocus
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="flex gap-2">
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min={1}
                className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as Unit)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
              <button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Agregar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Empty state */}
      {shopping.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <ShoppingCart className="w-14 h-14 mx-auto mb-3 opacity-25" />
          <p className="text-lg font-medium text-gray-500">Lista vacía</p>
          <p className="text-sm mt-1 max-w-xs mx-auto">
            Usa <span className="font-medium text-emerald-600">Reponer consumo</span> para generar automáticamente la lista con los productos que usaste este mes.
          </p>
        </div>
      )}

      {/* Pending items */}
      {pending.length > 0 && (
        <div className="bg-white rounded-2xl overflow-hidden mb-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)' }}>
          <div className="px-5 py-3.5 border-b border-gray-50 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <p className="text-sm font-semibold text-gray-700">Pendientes · {pending.length}</p>
          </div>
          <ul className="divide-y divide-gray-50">
            {pending.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 transition-colors group"
              >
                <button
                  onClick={() => toggleShoppingItem(item.id, true)}
                  className="w-5 h-5 rounded-full border-2 border-gray-200 hover:border-emerald-500 transition-colors shrink-0 flex items-center justify-center group-hover:border-emerald-400"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.quantity} {item.unit}</p>
                </div>
                <button
                  onClick={() => deleteShoppingItem(item.id)}
                  className="p-1.5 rounded-lg text-gray-200 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Checked items */}
      {checked.length > 0 && (
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)' }}>
          <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <p className="text-sm font-semibold text-gray-400">Comprados · {checked.length}</p>
            </div>
            <button
              onClick={clearCheckedItems}
              className="text-xs text-red-400 hover:text-red-600 font-semibold transition-colors"
            >
              Limpiar todo
            </button>
          </div>
          <ul className="divide-y divide-gray-50">
            {checked.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 transition-colors group"
              >
                <button
                  onClick={() => toggleShoppingItem(item.id, false)}
                  className="shrink-0 text-emerald-500 hover:text-emerald-600 transition-colors"
                >
                  <CheckCircle2 className="w-5 h-5" />
                </button>
                <div className="flex-1 min-w-0 opacity-50">
                  <p className="text-sm font-medium text-gray-600 line-through">{item.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.quantity} {item.unit}</p>
                </div>
                <button
                  onClick={() => deleteShoppingItem(item.id)}
                  className="p-1.5 rounded-lg text-gray-200 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

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
          >
            <Plus className="w-4 h-4" />
            Agregar
          </button>
        </div>
      </div>

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
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
          <div className="px-4 py-3 border-b border-gray-50">
            <p className="text-sm font-semibold text-gray-700">Pendientes</p>
          </div>
          <ul>
            {pending.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
              >
                <button
                  onClick={() => toggleShoppingItem(item.id, true)}
                  className="text-gray-300 hover:text-emerald-600 transition-colors shrink-0"
                >
                  <Circle className="w-5 h-5" />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.quantity} {item.unit}</p>
                </div>
                <button
                  onClick={() => deleteShoppingItem(item.id)}
                  className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Checked items */}
      {checked.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-400">Comprados ({checked.length})</p>
            <button
              onClick={clearCheckedItems}
              className="text-xs text-red-500 hover:text-red-700 font-medium"
            >
              Limpiar
            </button>
          </div>
          <ul>
            {checked.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 opacity-60"
              >
                <button
                  onClick={() => toggleShoppingItem(item.id, false)}
                  className="text-emerald-500 shrink-0"
                >
                  <CheckCircle2 className="w-5 h-5" />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-500 line-through">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.quantity} {item.unit}</p>
                </div>
                <button
                  onClick={() => deleteShoppingItem(item.id)}
                  className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

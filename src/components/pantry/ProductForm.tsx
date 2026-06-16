import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { usePantry } from '../../contexts/PantryContext';
import type { Product, Category, Unit } from '../../types';
import { CATEGORIES, UNITS } from '../../types';

interface Props {
  product?: Product;
  onClose: () => void;
}

const defaultForm = {
  name:           '',
  category:       'otros' as Category,
  quantity:       1,
  unit:           'unidades' as Unit,
  minStock:       1,
  expirationDate: '',
  notes:          '',
};

export default function ProductForm({ product, onClose }: Props) {
  const { addProduct, updateProduct } = usePantry();
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name:           product.name,
        category:       product.category,
        quantity:       product.quantity,
        unit:           product.unit,
        minStock:       product.minStock,
        expirationDate: product.expirationDate ?? '',
        notes:          product.notes ?? '',
      });
    }
  }, [product]);

  function set<K extends keyof typeof form>(key: K, val: typeof form[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        name:           form.name.trim(),
        category:       form.category,
        quantity:       Number(form.quantity),
        unit:           form.unit,
        minStock:       Number(form.minStock),
        expirationDate: form.expirationDate || undefined,
        notes:          form.notes.trim() || undefined,
      };
      if (product) {
        await updateProduct(product.id, data);
      } else {
        await addProduct(data);
      }
      onClose();
    } finally {
      setLoading(false);
    }
  }

  const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent';
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 text-lg">
            {product ? 'Editar producto' : 'Agregar producto'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className={labelCls}>Nombre del producto *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              required
              placeholder="Ej: Leche entera"
              className={inputCls}
            />
          </div>

          {/* Category */}
          <div>
            <label className={labelCls}>Categoría *</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {(Object.entries(CATEGORIES) as [Category, typeof CATEGORIES[Category]][]).map(([key, cat]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => set('category', key)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-xs font-medium transition-all ${
                    form.category === key
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <span className="text-lg">{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Cantidad *</label>
              <input
                type="number"
                value={form.quantity}
                onChange={(e) => set('quantity', Number(e.target.value))}
                required
                min={0}
                step="0.1"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Unidad *</label>
              <select
                value={form.unit}
                onChange={(e) => set('unit', e.target.value as Unit)}
                className={inputCls}
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Min Stock */}
          <div>
            <label className={labelCls}>Stock mínimo (alerta de reposición)</label>
            <input
              type="number"
              value={form.minStock}
              onChange={(e) => set('minStock', Number(e.target.value))}
              min={0}
              step="0.1"
              className={inputCls}
            />
            <p className="text-xs text-gray-400 mt-1">
              Te avisaremos cuando la cantidad baje de este número.
            </p>
          </div>

          {/* Expiration */}
          <div>
            <label className={labelCls}>Fecha de vencimiento</label>
            <input
              type="date"
              value={form.expirationDate}
              onChange={(e) => set('expirationDate', e.target.value)}
              className={inputCls}
            />
          </div>

          {/* Notes */}
          <div>
            <label className={labelCls}>Notas (opcional)</label>
            <textarea
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              rows={2}
              placeholder="Ej: Marca preferida, ubicación en la despensa..."
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              {loading ? 'Guardando...' : product ? 'Actualizar' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

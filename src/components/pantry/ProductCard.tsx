import { useState } from 'react';
import { Pencil, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import type { Product } from '../../types';
import { CATEGORIES, getExpirationStatus, daysUntilExpiration } from '../../types';
import { usePantry } from '../../contexts/PantryContext';

interface Props {
  product: Product;
  onEdit: (p: Product) => void;
}

export default function ProductCard({ product, onEdit }: Props) {
  const { updateProduct, deleteProduct, addShoppingItem } = usePantry();
  const [deleting, setDeleting] = useState(false);
  const [adjusting, setAdjusting] = useState(false);

  const cat = CATEGORIES[product.category];
  const expStatus = getExpirationStatus(product.expirationDate);
  const days = daysUntilExpiration(product.expirationDate);
  const isLowStock = product.quantity <= product.minStock;

  const expBadge = {
    expired:  { text: 'Vencido',         cls: 'bg-red-100 text-red-700'     },
    critical: { text: days === 0 ? 'Vence hoy' : `Vence en ${days}d`, cls: 'bg-red-100 text-red-700'     },
    warning:  { text: `Vence en ${days}d`, cls: 'bg-amber-100 text-amber-700' },
    ok:       { text: `Vence en ${days}d`, cls: 'bg-green-100 text-green-700' },
    none:     null,
  }[expStatus];

  async function adjust(delta: number) {
    const newQty = Math.max(0, product.quantity + delta);
    const actualReduction = product.quantity - newQty; // > 0 only when stock goes down
    setAdjusting(true);
    await updateProduct(product.id, {
      quantity:     newQty,
      usedQuantity: product.usedQuantity + actualReduction,
    });
    setAdjusting(false);
  }

  async function handleDelete() {
    if (!confirm(`¿Eliminar "${product.name}"?`)) return;
    setDeleting(true);
    await deleteProduct(product.id);
  }

  async function addToShopping() {
    await addShoppingItem({
      name:      product.name,
      quantity:  Math.max(1, product.minStock - product.quantity + 1),
      unit:      product.unit,
      productId: product.id,
    });
  }

  return (
    <div
      className={`bg-white rounded-xl border transition-shadow p-4 flex flex-col gap-3 ${
        expStatus === 'expired' || expStatus === 'critical'
          ? 'border-red-200'
          : isLowStock
          ? 'border-amber-200'
          : 'border-gray-100'
      }`}
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="text-2xl w-11 h-11 flex items-center justify-center rounded-xl shrink-0"
            style={{ background: cat.bg }}
          >
            {cat.emoji}
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-[15px] leading-tight truncate">{product.name}</p>
            <span
              className="inline-block text-[12px] px-2 py-0.5 rounded-full font-medium mt-1"
              style={{ background: cat.bg, color: cat.color }}
            >
              {cat.label}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(product)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
        <button
          onClick={() => adjust(-1)}
          disabled={adjusting || product.quantity === 0}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:bg-gray-100 disabled:opacity-40 transition-colors"
        >
          <Minus className="w-3 h-3" />
        </button>
        <div className="text-center">
          <span className={`text-lg font-bold ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
            {product.quantity}
          </span>
          <span className="text-xs text-gray-400 ml-1">{product.unit}</span>
        </div>
        <button
          onClick={() => adjust(1)}
          disabled={adjusting}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:bg-gray-100 disabled:opacity-40 transition-colors"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        {isLowStock && (
          <span className="text-xs bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full font-medium">
            Stock bajo
          </span>
        )}
        {expBadge && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${expBadge.cls}`}>
            {expBadge.text}
          </span>
        )}
      </div>

      {/* Notes */}
      {product.notes && (
        <p className="text-xs text-gray-400 truncate">{product.notes}</p>
      )}

      {/* Add to shopping */}
      {isLowStock && (
        <button
          onClick={addToShopping}
          className="flex items-center justify-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-xl py-1.5 transition-colors font-medium"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Agregar a compras
        </button>
      )}
    </div>
  );
}

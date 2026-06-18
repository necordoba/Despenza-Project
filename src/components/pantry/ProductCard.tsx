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
    expired:  { text: 'Vencido',                                  cls: 'bg-red-100 text-red-700 border-red-200'      },
    critical: { text: days === 0 ? 'Vence hoy' : `${days}d`,     cls: 'bg-red-100 text-red-700 border-red-200'      },
    warning:  { text: `Vence en ${days}d`,                        cls: 'bg-amber-100 text-amber-700 border-amber-200' },
    ok:       { text: `Vence en ${days}d`,                        cls: 'bg-green-100 text-green-700 border-green-200' },
    none:     null,
  }[expStatus];

  const borderCls =
    expStatus === 'expired' || expStatus === 'critical'
      ? '0 0 0 1.5px #fca5a5'
      : isLowStock
      ? '0 0 0 1.5px #fde68a'
      : '0 0 0 1px rgba(0,0,0,0.07)';

  async function adjust(delta: number) {
    const newQty = Math.max(0, product.quantity + delta);
    const actualReduction = product.quantity - newQty;
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
      className="bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5"
      style={{ boxShadow: `0 2px 8px rgba(0,0,0,0.06), ${borderCls}` }}
    >
      {/* Category header strip */}
      <div className="px-4 pt-4 pb-3 flex items-start gap-3" style={{ background: cat.bg }}>
        <span className="text-3xl leading-none mt-0.5 shrink-0">{cat.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-[15px] leading-snug truncate">{product.name}</p>
          <span className="text-xs font-semibold" style={{ color: cat.color }}>{cat.label}</span>
        </div>
        <div className="flex items-center gap-0.5 shrink-0 -mr-1">
          <button
            onClick={() => onEdit(product)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-white/70 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50/80 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 pt-3 pb-4 flex flex-col gap-3 flex-1">
        {/* Quantity controls */}
        <div className="flex items-center bg-gray-50 rounded-xl p-1 gap-1">
          <button
            onClick={() => adjust(-1)}
            disabled={adjusting || product.quantity === 0}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white text-red-400 hover:bg-red-50 hover:text-red-600 shadow-sm transition-all disabled:opacity-30 disabled:shadow-none"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="flex-1 text-center">
            <span className={`text-xl font-extrabold ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
              {product.quantity}
            </span>
            <span className="text-xs text-gray-400 ml-1">{product.unit}</span>
          </div>
          <button
            onClick={() => adjust(1)}
            disabled={adjusting}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white text-emerald-600 hover:bg-emerald-50 shadow-sm transition-all disabled:opacity-30 disabled:shadow-none"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Status badges */}
        {(isLowStock || expBadge) && (
          <div className="flex flex-wrap gap-1.5">
            {isLowStock && (
              <span className="text-xs bg-red-50 text-red-600 border border-red-200 px-2.5 py-0.5 rounded-full font-semibold">
                Stock bajo
              </span>
            )}
            {expBadge && (
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${expBadge.cls}`}>
                {expBadge.text}
              </span>
            )}
          </div>
        )}

        {/* Notes */}
        {product.notes && (
          <p className="text-xs text-gray-400 truncate">{product.notes}</p>
        )}

        {/* Add to shopping */}
        {isLowStock && (
          <button
            onClick={addToShopping}
            className="mt-auto flex items-center justify-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl py-2 transition-colors font-semibold"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Agregar a compras
          </button>
        )}
      </div>
    </div>
  );
}

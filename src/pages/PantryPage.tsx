import { useState, useMemo } from 'react';
import { Plus, Search, SlidersHorizontal, Package, Download } from 'lucide-react';
import { usePantry } from '../contexts/PantryContext';
import type { Product, Category } from '../types';
import { CATEGORIES, getExpirationStatus } from '../types';
import ProductCard from '../components/pantry/ProductCard';
import ProductForm from '../components/pantry/ProductForm';
import { SEED_PRODUCTS } from '../data/seedProducts';

type Filter = 'todos' | 'bajo' | 'vencidos' | 'proximos';

export default function PantryPage() {
  const { products, loadingProducts, addProduct } = usePantry();
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | undefined>();
  const [importing, setImporting] = useState(false);

  async function handleImport() {
    if (!confirm(`¿Importar ${SEED_PRODUCTS.length} productos del inventario inicial? Esto no borrará lo que ya tienes.`)) return;
    setImporting(true);
    for (const p of SEED_PRODUCTS) {
      await addProduct(p);
    }
    setImporting(false);
  }
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'todas'>('todas');
  const [filter, setFilter] = useState<Filter>('todos');

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedCategory !== 'todas' && p.category !== selectedCategory) return false;
      if (filter === 'bajo' && p.quantity > p.minStock) return false;
      if (filter === 'vencidos' && getExpirationStatus(p.expirationDate) !== 'expired') return false;
      if (filter === 'proximos') {
        const s = getExpirationStatus(p.expirationDate);
        if (s !== 'warning' && s !== 'critical') return false;
      }
      return true;
    });
  }, [products, search, selectedCategory, filter]);

  function handleEdit(p: Product) {
    setEditProduct(p);
    setShowForm(true);
  }

  function handleClose() {
    setShowForm(false);
    setEditProduct(undefined);
  }

  const filterButtons: { key: Filter; label: string }[] = [
    { key: 'todos',    label: 'Todos'          },
    { key: 'bajo',     label: 'Stock bajo'     },
    { key: 'proximos', label: 'Por vencer'     },
    { key: 'vencidos', label: 'Vencidos'       },
  ];

  return (
    <div className="px-6 pt-8 pb-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Despensa</h1>
          <p className="text-gray-500 text-sm mt-0.5">{products.length} producto{products.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Agregar producto
        </button>
        <button
          onClick={handleImport}
          disabled={importing}
          title="Importar inventario inicial del PDF"
          className="flex items-center gap-2 border border-emerald-300 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          <Download className="w-4 h-4" />
          {importing ? 'Importando...' : 'Importar plantilla'}
        </button>
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 space-y-3">
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-400 shrink-0" />
          {filterButtons.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === key
                  ? 'bg-[#16a34a] text-white'
                  : 'bg-[#f1f5f9] text-[#64748b] hover:bg-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Category chips — horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
          <button
            onClick={() => setSelectedCategory('todas')}
            className={`shrink-0 px-3 py-1.25 rounded-full text-xs font-medium transition-colors border ${
              selectedCategory === 'todas'
                ? 'bg-gray-800 text-white border-gray-800'
                : 'bg-[#f1f5f9] text-[#64748b] border-[#e2e8f0] hover:bg-slate-200'
            }`}
          >
            Todas
          </button>
          {(Object.entries(CATEGORIES) as [Category, typeof CATEGORIES[Category]][]).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`shrink-0 flex items-center gap-1 px-3 py-1.25 rounded-full text-xs font-medium transition-colors border ${
                selectedCategory === key
                  ? 'text-white border-transparent'
                  : 'bg-[#f1f5f9] text-[#64748b] border-[#e2e8f0] hover:bg-slate-200'
              }`}
              style={selectedCategory === key ? { backgroundColor: cat.color } : {}}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loadingProducts ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Package className="w-14 h-14 mx-auto mb-3 opacity-25" />
          <p className="text-lg font-medium text-gray-500">
            {products.length === 0 ? 'Tu despensa está vacía' : 'No se encontraron productos'}
          </p>
          <p className="text-sm mt-1">
            {products.length === 0
              ? 'Agrega tu primer producto haciendo clic en "Agregar producto"'
              : 'Prueba con otra búsqueda o filtro'}
          </p>
          {products.length === 0 && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              Agregar primer producto
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} onEdit={handleEdit} />
          ))}
        </div>
      )}

      {showForm && <ProductForm product={editProduct} onClose={handleClose} />}
    </div>
  );
}

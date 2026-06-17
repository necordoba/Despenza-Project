import { useState, useMemo, useRef } from 'react';
import { Plus, Search, SlidersHorizontal, Package, Upload, FileDown, Trash2 } from 'lucide-react';
import { usePantry } from '../contexts/PantryContext';
import type { Product, Category, Unit } from '../types';
import { CATEGORIES, UNITS, getExpirationStatus } from '../types';
import ProductCard from '../components/pantry/ProductCard';
import ProductForm from '../components/pantry/ProductForm';

type Filter = 'todos' | 'bajo' | 'vencidos' | 'proximos';

const VALID_CATEGORIES = Object.keys(CATEGORIES) as Category[];
const CSV_TEMPLATE = `nombre,categoria,cantidad,unidad,stock_minimo,vencimiento,notas
Arroz,granos,5000,g,2000,,
Leche,lacteos,2,l,1,2025-12-31,Entera
Acetaminofén,medicina,2,unidades,1,,`;

function downloadTemplate() {
  const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'plantilla_despensa.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function PantryPage() {
  const { products, loadingProducts, addProduct, clearAllProducts } = usePantry();
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | undefined>();
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ ok: number; errors: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleCsvFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!fileInputRef.current) return;
    fileInputRef.current.value = '';
    if (!file) return;

    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    const rows = lines.slice(1);

    if (rows.length === 0) {
      setImportResult({ ok: 0, errors: ['El archivo está vacío o solo tiene encabezados.'] });
      return;
    }

    setImporting(true);
    let ok = 0;
    const errors: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      const cols = rows[i].split(',').map(c => c.trim());
      const [nombre, categoria, cantidad, unidad, stockMinimo, vencimiento, ...notasParts] = cols;
      const lineNum = i + 2;

      if (!nombre) { errors.push(`Línea ${lineNum}: nombre vacío.`); continue; }
      if (!VALID_CATEGORIES.includes(categoria as Category)) {
        errors.push(`Línea ${lineNum}: categoría "${categoria}" inválida.`); continue;
      }
      if (!UNITS.includes(unidad as Unit)) {
        errors.push(`Línea ${lineNum}: unidad "${unidad}" inválida.`); continue;
      }
      const qty = parseFloat(cantidad);
      const min = parseFloat(stockMinimo);
      if (isNaN(qty) || isNaN(min)) {
        errors.push(`Línea ${lineNum}: cantidad o stock mínimo no es un número.`); continue;
      }

      await addProduct({
        name: nombre,
        category: categoria as Category,
        quantity: qty,
        unit: unidad as Unit,
        minStock: min,
        usedQuantity: 0,
        expirationDate: vencimiento || undefined,
        notes: notasParts.join(',') || undefined,
      });
      ok++;
    }

    setImporting(false);
    setImportResult({ ok, errors });
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
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Despensa</h1>
          <p className="text-gray-500 text-sm mt-0.5">{products.length} producto{products.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={async () => {
              if (!confirm(`¿Eliminar los ${products.length} productos? Esta acción no se puede deshacer.`)) return;
              await clearAllProducts();
            }}
            disabled={products.length === 0}
            className="flex items-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Vaciar despensa
          </button>
          <button
            onClick={downloadTemplate}
            title="Descargar plantilla CSV"
            className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <FileDown className="w-4 h-4" />
            Plantilla CSV
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="flex items-center gap-2 border border-emerald-300 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <Upload className="w-4 h-4" />
            {importing ? 'Importando...' : 'Importar CSV'}
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Agregar producto
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleCsvFile}
      />

      {/* Import result banner */}
      {importResult && (
        <div className={`rounded-xl px-4 py-3 mb-4 text-sm ${importResult.errors.length === 0 ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-amber-50 border border-amber-200 text-amber-800'}`}>
          <p className="font-semibold mb-1">
            {importResult.ok} producto{importResult.ok !== 1 ? 's' : ''} importado{importResult.ok !== 1 ? 's' : ''} correctamente.
          </p>
          {importResult.errors.map((e, i) => <p key={i} className="text-xs">{e}</p>)}
          <button onClick={() => setImportResult(null)} className="text-xs underline mt-1">Cerrar</button>
        </div>
      )}

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

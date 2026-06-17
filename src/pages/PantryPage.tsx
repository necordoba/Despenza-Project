import { useState, useMemo, useRef } from 'react';
import { Plus, Search, SlidersHorizontal, Package, Upload, FileDown, Trash2, Info } from 'lucide-react';
import * as XLSX from 'xlsx';
import { usePantry } from '../contexts/PantryContext';
import type { Product, Category, Unit } from '../types';
import { CATEGORIES, UNITS, getExpirationStatus } from '../types';
import ProductCard from '../components/pantry/ProductCard';
import ProductForm from '../components/pantry/ProductForm';

type Filter = 'todos' | 'bajo' | 'vencidos' | 'proximos';

const VALID_CATEGORIES = Object.keys(CATEGORIES) as Category[];

function downloadTemplate() {
  const wb = XLSX.utils.book_new();
  const wsData = [
    ['nombre', 'categoria', 'cantidad', 'unidad', 'stock_minimo', 'vencimiento', 'notas'],
    ['Arroz', 'granos', 5000, 'g', 2000, '', ''],
    ['Leche', 'lacteos', 2, 'l', 1, '2025-12-31', 'Entera'],
    ['Acetaminofén', 'medicina', 2, 'unidades', 1, '', ''],
  ];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  ws['!cols'] = [{ wch: 20 }, { wch: 14 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 14 }, { wch: 24 }];
  XLSX.utils.book_append_sheet(wb, ws, 'Plantilla');
  XLSX.writeFile(wb, 'plantilla_despensa.xlsx');
}

export default function PantryPage() {
  const { products, loadingProducts, addProduct, clearAllProducts } = usePantry();
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | undefined>();
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ ok: number; errors: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!fileInputRef.current) return;
    fileInputRef.current.value = '';
    if (!file) return;

    setImporting(true);
    let ok = 0;
    const errors: string[] = [];

    try {
      // Cada elemento es un objeto { columna: valor } keyed por encabezado normalizado
      let records: Record<string, string>[];
      const isExcel = /\.(xlsx|xls)$/i.test(file.name);

      if (isExcel) {
        const buffer = await file.arrayBuffer();
        const wb = XLSX.read(buffer, { type: 'array', cellDates: true });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: '' });
        records = raw.map(row => {
          const out: Record<string, string> = {};
          for (const [k, v] of Object.entries(row)) {
            const key = k.toLowerCase().trim().replace(/\s+/g, '_').replace(/[áa]/g, 'a').replace(/[éê]/g, 'e').replace(/[íi]/g, 'i').replace(/[óo]/g, 'o').replace(/[úu]/g, 'u');
            out[key] = v instanceof Date ? v.toISOString().split('T')[0] : String(v ?? '').trim();
          }
          return out;
        });
      } else {
        let text = await file.text();
        text = text.replace(/^﻿/, ''); // strip BOM
        const lines = text.split(/\r?\n/).filter(l => l.trim());
        if (lines.length < 2) {
          setImportResult({ ok: 0, errors: ['El archivo está vacío o solo tiene encabezados.'] });
          setImporting(false);
          return;
        }
        const header = lines[0];
        const sep = header.includes(';') ? ';' : ',';
        const headers = header.split(sep).map(h =>
          h.toLowerCase().trim().replace(/\s+/g, '_')
            .replace(/[á]/g, 'a').replace(/[é]/g, 'e').replace(/[í]/g, 'i').replace(/[ó]/g, 'o').replace(/[ú]/g, 'u')
        );
        records = lines.slice(1).map(line => {
          const vals = line.split(sep).map(c => c.trim());
          const out: Record<string, string> = {};
          headers.forEach((h, i) => { out[h] = vals[i] ?? ''; });
          return out;
        }).filter(r => Object.values(r).some(v => v !== ''));
      }

      if (records.length === 0) {
        setImportResult({ ok: 0, errors: ['El archivo está vacío o solo tiene encabezados.'] });
        setImporting(false);
        return;
      }

      // Verificar que existan las columnas mínimas requeridas
      const firstRow = records[0];
      const missingCols: string[] = [];
      if (!('nombre' in firstRow)) missingCols.push('nombre');
      if (!('categoria' in firstRow)) missingCols.push('categoria');
      if (!('cantidad' in firstRow)) missingCols.push('cantidad');
      if (!('unidad' in firstRow)) missingCols.push('unidad');
      if (missingCols.length > 0) {
        setImportResult({
          ok: 0,
          errors: [
            `El archivo no tiene las columnas requeridas: ${missingCols.join(', ')}.`,
            `Columnas encontradas: ${Object.keys(firstRow).join(', ')}.`,
            'Descarga la plantilla Excel para ver el formato correcto.',
          ],
        });
        setImporting(false);
        return;
      }

      for (let i = 0; i < records.length; i++) {
        const r = records[i];
        const lineNum = i + 2;
        const nombre = r['nombre'] ?? '';
        const categoriaRaw = r['categoria'] ?? '';
        const cantidad = r['cantidad'] ?? '';
        const unidadRaw = r['unidad'] ?? '';
        const stockMinimo = r['stock_minimo'] ?? '';
        const vencimiento = r['vencimiento'] ?? '';
        const notas = r['notas'] ?? '';

        const categoria = categoriaRaw.toLowerCase() as Category;
        const unidad = unidadRaw.toLowerCase() as Unit;

        if (!nombre) { errors.push(`Fila ${lineNum}: nombre vacío.`); continue; }
        if (!VALID_CATEGORIES.includes(categoria)) {
          errors.push(`Fila ${lineNum}: categoría "${categoriaRaw}" inválida. Válidas: ${VALID_CATEGORIES.join(', ')}.`); continue;
        }
        if (!UNITS.includes(unidad)) {
          errors.push(`Fila ${lineNum}: unidad "${unidadRaw}" inválida. Válidas: ${UNITS.join(', ')}.`); continue;
        }
        const qty = cantidad ? parseFloat(cantidad) : 0;
        if (isNaN(qty)) {
          errors.push(`Fila ${lineNum}: cantidad "${cantidad}" no es un número.`); continue;
        }
        const min = stockMinimo ? parseFloat(stockMinimo) : 0;
        if (isNaN(min)) {
          errors.push(`Fila ${lineNum}: stock_minimo "${stockMinimo}" no es un número.`); continue;
        }

        await addProduct({
          name: nombre,
          category: categoria,
          quantity: qty,
          unit: unidad,
          minStock: min,
          usedQuantity: 0,
          expirationDate: vencimiento || undefined,
          notes: notas || undefined,
        });
        ok++;
      }
    } catch (err) {
      errors.push(`Error inesperado al leer el archivo: ${err instanceof Error ? err.message : String(err)}`);
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
            title="Descargar plantilla Excel (.xlsx)"
            className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <FileDown className="w-4 h-4" />
            Plantilla Excel
          </button>
          <div className="relative group">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="flex items-center gap-2 border border-emerald-300 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              <Upload className="w-4 h-4" />
              {importing ? 'Importando...' : 'Importar archivo'}
              <Info className="w-3.5 h-3.5 opacity-50" />
            </button>
            <div className="absolute right-0 top-full mt-2 w-72 bg-gray-900 text-white text-xs rounded-xl p-3 hidden group-hover:block z-20 shadow-lg pointer-events-none">
              <p className="font-semibold mb-1">Formato requerido</p>
              <p className="text-gray-300 mb-2">El archivo debe tener estas columnas (en cualquier orden):</p>
              <p className="font-mono bg-gray-800 rounded px-2 py-1 text-gray-200 mb-2">nombre · categoria · cantidad · unidad</p>
              <p className="text-gray-400">Usa <span className="text-emerald-400 font-semibold">Plantilla Excel</span> para descargar el formato correcto. Se aceptan archivos .xlsx, .xls y .csv.</p>
            </div>
          </div>
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
        accept=".csv,.xlsx,.xls"
        className="hidden"
        onChange={handleImportFile}
      />

      {/* Import result banner */}
      {importResult && (
        <div className={`rounded-xl px-4 py-3 mb-4 text-sm ${importResult.errors.length === 0 ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-amber-50 border border-amber-200 text-amber-800'}`}>
          <p className="font-semibold mb-1">
            {importResult.ok} producto{importResult.ok !== 1 ? 's' : ''} importado{importResult.ok !== 1 ? 's' : ''} correctamente.
          </p>
          {importResult.errors.map((e, i) => <p key={i} className="text-xs mt-0.5">{e}</p>)}
          {importResult.ok === 0 && importResult.errors.length > 0 && (
            <div className="mt-3 pt-3 border-t border-amber-200 flex items-center gap-3">
              <p className="text-xs text-amber-700">¿Tu archivo tiene un formato diferente?</p>
              <button
                onClick={downloadTemplate}
                className="flex items-center gap-1.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              >
                <FileDown className="w-3.5 h-3.5" />
                Descargar plantilla Excel
              </button>
            </div>
          )}
          <button onClick={() => setImportResult(null)} className="text-xs underline mt-2 opacity-70">Cerrar</button>
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

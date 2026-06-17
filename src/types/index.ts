export type Category =
  | 'lacteos'
  | 'carnes'
  | 'frutas'
  | 'verduras'
  | 'granos'
  | 'enlatados'
  | 'bebidas'
  | 'condimentos'
  | 'panaderia'
  | 'congelados'
  | 'limpieza'
  | 'higiene'
  | 'medicina'
  | 'hogar'
  | 'suplementos'
  | 'emergencia'
  | 'otros';

export const CATEGORIES: Record<Category, { label: string; color: string; bg: string; emoji: string }> = {
  lacteos:     { label: 'Lácteos',      color: '#0369a1', bg: '#e0f2fe', emoji: '🥛' },
  carnes:      { label: 'Carnes',       color: '#b91c1c', bg: '#fee2e2', emoji: '🥩' },
  frutas:      { label: 'Frutas',       color: '#d97706', bg: '#fef3c7', emoji: '🍎' },
  verduras:    { label: 'Verduras',     color: '#15803d', bg: '#dcfce7', emoji: '🥦' },
  granos:      { label: 'Granos',       color: '#92400e', bg: '#fef3c7', emoji: '🌾' },
  enlatados:   { label: 'Enlatados',   color: '#475569', bg: '#f1f5f9', emoji: '🥫' },
  bebidas:     { label: 'Bebidas',      color: '#7c3aed', bg: '#ede9fe', emoji: '🧃' },
  condimentos: { label: 'Condimentos', color: '#b45309', bg: '#fef3c7', emoji: '🧂' },
  panaderia:   { label: 'Panadería',   color: '#a16207', bg: '#fefce8', emoji: '🍞' },
  congelados:  { label: 'Congelados',  color: '#0891b2', bg: '#ecfeff', emoji: '🧊' },
  limpieza:    { label: 'Limpieza',    color: '#0d9488', bg: '#ccfbf1', emoji: '🧹' },
  higiene:     { label: 'Higiene',     color: '#db2777', bg: '#fce7f3', emoji: '🧴' },
  medicina:    { label: 'Medicina',    color: '#dc2626', bg: '#fff1f2', emoji: '💊' },
  hogar:       { label: 'Hogar',       color: '#4f46e5', bg: '#eef2ff', emoji: '🔧' },
  suplementos: { label: 'Suplementos', color: '#059669', bg: '#d1fae5', emoji: '💪' },
  emergencia:  { label: 'Emergencia',  color: '#ea580c', bg: '#fff7ed', emoji: '🎒' },
  otros:       { label: 'Otros',       color: '#64748b', bg: '#f8fafc', emoji: '📦' },
};

export type Unit = 'unidades' | 'kg' | 'g' | 'l' | 'ml' | 'paquetes' | 'latas' | 'botellas' | 'cajas' | 'tarros';

export const UNITS: Unit[] = ['unidades', 'kg', 'g', 'l', 'ml', 'paquetes', 'latas', 'botellas', 'cajas', 'tarros'];

export interface Product {
  id: string;
  userId: string;
  name: string;
  category: Category;
  quantity: number;
  unit: Unit;
  minStock: number;
  usedQuantity: number;
  expirationDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingItem {
  id: string;
  userId: string;
  productId?: string;
  name: string;
  quantity: number;
  unit: Unit;
  checked: boolean;
  createdAt: string;
}

export type ExpirationStatus = 'expired' | 'critical' | 'warning' | 'ok' | 'none';

export function getExpirationStatus(dateStr?: string): ExpirationStatus {
  if (!dateStr) return 'none';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expDate = new Date(dateStr + 'T00:00:00');
  const diffDays = Math.floor((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0)  return 'expired';
  if (diffDays <= 3) return 'critical';
  if (diffDays <= 7) return 'warning';
  return 'ok';
}

export function daysUntilExpiration(dateStr?: string): number | null {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expDate = new Date(dateStr + 'T00:00:00');
  return Math.floor((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

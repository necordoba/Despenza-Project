import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../supabase/config';
import { useAuth } from './AuthContext';
import type { Product, ShoppingItem, Unit } from '../types';
import type { Category } from '../types';

interface PantryContextType {
  products: Product[];
  shopping: ShoppingItem[];
  loadingProducts: boolean;
  addProduct: (data: Omit<Product, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  clearAllProducts: () => Promise<void>;
  resetUsage: (id: string) => Promise<void>;
  addShoppingItem: (data: { name: string; quantity: number; unit: Unit; productId?: string }) => Promise<void>;
  toggleShoppingItem: (id: string, checked: boolean) => Promise<void>;
  deleteShoppingItem: (id: string) => Promise<void>;
  clearCheckedItems: () => Promise<void>;
  generateShoppingList: () => Promise<void>;
}

const PantryContext = createContext<PantryContextType | null>(null);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToProduct(r: any): Product {
  return {
    id:             r.id,
    userId:         r.user_id,
    name:           r.name,
    category:       r.category as Category,
    quantity:       r.quantity,
    unit:           r.unit as Unit,
    minStock:       r.min_stock,
    usedQuantity:   r.used_quantity ?? 0,
    expirationDate: r.expiration_date ?? undefined,
    notes:          r.notes ?? undefined,
    createdAt:      r.created_at,
    updatedAt:      r.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToShopping(r: any): ShoppingItem {
  return {
    id:        r.id,
    userId:    r.user_id,
    productId: r.product_id ?? undefined,
    name:      r.name,
    quantity:  r.quantity,
    unit:      r.unit as Unit,
    checked:   r.checked,
    createdAt: r.created_at,
  };
}

export function PantryProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [shopping, setShopping] = useState<ShoppingItem[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Refs so callbacks always see the latest state without being recreated
  const productsRef = useRef<Product[]>([]);
  const shoppingRef = useRef<ShoppingItem[]>([]);
  productsRef.current = products;
  shoppingRef.current = shopping;

  useEffect(() => {
    if (!user) {
      setProducts([]);
      setShopping([]);
      setLoadingProducts(false);
      return;
    }

    setLoadingProducts(true);

    async function fetchAll() {
      const [{ data: prods }, { data: shop }] = await Promise.all([
        supabase.from('products').select('*').eq('user_id', user!.id).order('created_at'),
        supabase.from('shopping').select('*').eq('user_id', user!.id).order('created_at'),
      ]);
      setProducts((prods ?? []).map(rowToProduct));
      setShopping((shop ?? []).map(rowToShopping));
      setLoadingProducts(false);
    }

    fetchAll();

    const prodSub = supabase
      .channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products', filter: `user_id=eq.${user.id}` },
        () => { fetchAll(); })
      .subscribe();

    const shopSub = supabase
      .channel('shopping-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shopping', filter: `user_id=eq.${user.id}` },
        () => { fetchAll(); })
      .subscribe();

    return () => {
      supabase.removeChannel(prodSub);
      supabase.removeChannel(shopSub);
    };
  }, [user]);

  const addProduct = useCallback(
    async (data: Omit<Product, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
      if (!user) return;
      await supabase.from('products').insert({
        user_id:         user.id,
        name:            data.name,
        category:        data.category,
        quantity:        data.quantity,
        unit:            data.unit,
        min_stock:       data.minStock,
        used_quantity:   0,
        expiration_date: data.expirationDate ?? null,
        notes:           data.notes ?? null,
      });
    },
    [user]
  );

  const updateProduct = useCallback(async (id: string, data: Partial<Product>) => {
    // Base payload — fields that always exist in the DB
    const base = {
      ...(data.name            !== undefined && { name:            data.name }),
      ...(data.category        !== undefined && { category:        data.category }),
      ...(data.quantity        !== undefined && { quantity:        data.quantity }),
      ...(data.unit            !== undefined && { unit:            data.unit }),
      ...(data.minStock        !== undefined && { min_stock:       data.minStock }),
      ...(data.expirationDate  !== undefined && { expiration_date: data.expirationDate ?? null }),
      ...(data.notes           !== undefined && { notes:           data.notes || null }),
      updated_at: new Date().toISOString(),
    };

    const payload = data.usedQuantity !== undefined
      ? { ...base, used_quantity: data.usedQuantity }
      : base;

    const { error } = await supabase.from('products').update(payload).eq('id', id);

    if (error) {
      // code 42703 = "column does not exist" — column migration not yet run
      // Fall back to updating without the usage column so stock still works
      if (error.code === '42703') {
        console.warn('used_quantity column missing — run the migration SQL. Updating stock without usage tracking.');
        await supabase.from('products').update(base).eq('id', id);
      } else {
        console.error('updateProduct error:', error.message);
        return;
      }
    }

    // Update local state immediately so Consumo tab reflects the change right away
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    await supabase.from('products').delete().eq('id', id);
  }, []);

  const clearAllProducts = useCallback(async () => {
    if (!user) return;
    await supabase.from('products').delete().eq('user_id', user.id);
  }, [user]);

  // Reset the usage counter for a single product
  const resetUsage = useCallback(async (id: string) => {
    await supabase.from('products').update({
      used_quantity: 0,
      updated_at: new Date().toISOString(),
    }).eq('id', id);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, usedQuantity: 0 } : p));
  }, []);

  const addShoppingItem = useCallback(
    async (data: { name: string; quantity: number; unit: Unit; productId?: string }) => {
      if (!user) return;
      await supabase.from('shopping').insert({
        user_id:    user.id,
        product_id: data.productId ?? null,
        name:       data.name,
        quantity:   data.quantity,
        unit:       data.unit,
        checked:    false,
      });
    },
    [user]
  );

  const toggleShoppingItem = useCallback(async (id: string, checked: boolean) => {
    await supabase.from('shopping').update({ checked }).eq('id', id);

    // When marking as purchased: restore stock AND reset consumption counter
    if (checked) {
      const item = shoppingRef.current.find(s => s.id === id);
      if (item?.productId) {
        const product = productsRef.current.find(p => p.id === item.productId);
        if (product) {
          const { error } = await supabase.from('products').update({
            quantity:      product.quantity + item.quantity,
            used_quantity: 0,
            updated_at:    new Date().toISOString(),
          }).eq('id', item.productId);

          if (error?.code === '42703') {
            await supabase.from('products').update({
              quantity:   product.quantity + item.quantity,
              updated_at: new Date().toISOString(),
            }).eq('id', item.productId);
          }
        }
      }
    }
  }, []);

  const deleteShoppingItem = useCallback(async (id: string) => {
    await supabase.from('shopping').delete().eq('id', id);
  }, []);

  const clearCheckedItems = useCallback(async () => {
    if (!user) return;
    await supabase.from('shopping').delete().eq('user_id', user.id).eq('checked', true);
  }, [user]);

  const generateShoppingList = useCallback(async () => {
    if (!user) return;
    // Build shopping list from consumed products: buy back exactly what was used
    const consumed = productsRef.current.filter((p) => p.usedQuantity > 0);
    for (const p of consumed) {
      const alreadyIn = shoppingRef.current.some((s) => s.productId === p.id && !s.checked);
      if (!alreadyIn) {
        await supabase.from('shopping').insert({
          user_id:    user.id,
          product_id: p.id,
          name:       p.name,
          quantity:   p.usedQuantity,
          unit:       p.unit,
          checked:    false,
        });
      }
    }
  }, [user]);

  return (
    <PantryContext.Provider value={{
      products, shopping, loadingProducts,
      addProduct, updateProduct, deleteProduct, clearAllProducts, resetUsage,
      addShoppingItem, toggleShoppingItem, deleteShoppingItem,
      clearCheckedItems, generateShoppingList,
    }}>
      {children}
    </PantryContext.Provider>
  );
}

export function usePantry() {
  const ctx = useContext(PantryContext);
  if (!ctx) throw new Error('usePantry must be used within PantryProvider');
  return ctx;
}

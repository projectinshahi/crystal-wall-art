import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id?: string;
  product_id: string;
  title: string;
  image: string | null;
  size: string;
  thickness: string;
  mounting_method: string;
  orientation: string;
  price: number;
  quantity: number;
  variant_id?: string;
}

function cartItemKey(
  item: Pick<CartItem, 'product_id' | 'size' | 'thickness' | 'mounting_method' | 'orientation' | 'variant_id'>
) {
  return `${item.product_id}|${item.size}|${item.thickness}|${item.mounting_method}|${item.orientation}|${item.variant_id ?? ''}`;
}

function deduplicateItems(items: CartItem[]): CartItem[] {
  const map = new Map<string, CartItem>();

  for (const item of items) {
    const key = cartItemKey(item);
    if (map.has(key)) {
      map.get(key)!.quantity += item.quantity;
    } else {
      map.set(key, { ...item });
    }
  }

  return Array.from(map.values());
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;

  addItem: (item: CartItem) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  setOpen: (open: boolean) => void;

  getTotal: () => number;
  getItemCount: () => number;
  getItemKey: (item: CartItem) => string;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        console.log("item is ", item);
        
        const normalizedItem: CartItem = {
          ...item,
          price: Number(item.price),
          quantity: Number(item.quantity),
        };

        console.log("normalizedItem",normalizedItem);
        
        const key = cartItemKey(normalizedItem);
        const items = get().items;
        console.log("items",items);
        
        console.log("key",key);
        
        const existing = items.find(i => {
          console.log("cartItemKey(i)",cartItemKey(i));
          return cartItemKey(i) === key
      });

        if (existing) {
          console.log("existing data",items.map(i =>
              cartItemKey(i) === key
                ? { ...i, quantity: i.quantity + normalizedItem.quantity }
                : i
            ));
          
          set({
            items: items.map(i =>
              cartItemKey(i) === key
                ? { ...i, quantity: i.quantity + normalizedItem.quantity }
                : i
            ),
            isOpen: true,
          });
        } else {
          console.log("new data",[...items, normalizedItem]);
          
          set({
            items: [...items, normalizedItem],
            isOpen: true,
          });
        }
      },

      updateQuantity: (key, quantity) => {
        if (quantity <= 0) {
          get().removeItem(key);
          return;
        }

        set({
          items: get().items.map(i =>
            cartItemKey(i) === key ? { ...i, quantity } : i
          ),
        });
      },

      removeItem: (key) => {
        set({
          items: get().items.filter(i => cartItemKey(i) !== key),
        });
      },

      clearCart: () => set({ items: [] }),

      setOpen: (open) => set({ isOpen: open }),

      getTotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      getItemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      getItemKey: (item) => cartItemKey(item),
    }),
    {
      name: 'crystal-cart',
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        items: state.items,
      }),

      version: 3, // ✅ bumped again to force migration on all clients

      migrate: (persistedState: any) => {
        if (!persistedState) return { items: [] };

        const items = (persistedState.items ?? []).map((i: any) => ({
          ...i,
          price: Number(i.price),
          quantity: Number(i.quantity),
        }));

        return { items: deduplicateItems(items) };
      },

      // ✅ Deduplicate on every hydration from localStorage
      // This runs even when version matches — catches any future corruption
      merge: (persistedState: any, currentState) => {
        const items = deduplicateItems(
          (persistedState?.items ?? []).map((i: any) => ({
            ...i,
            price: Number(i.price),
            quantity: Number(i.quantity),
          }))
        );

        return { ...currentState, items };
      },
    }
  )
);
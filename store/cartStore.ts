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
  item: Pick<CartItem, 'product_id' | 'size' | 'thickness' | 'mounting_method' | 'orientation' | 'price' | 'quantity' | 'variant_id'>
) {
  return `${item.product_id}|${item.size}|${item.thickness}|${item.mounting_method}|${item.orientation}|${item.price}|${item.quantity}|${item.variant_id ?? ''}`;
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
        // ✅ Normalize data once
        const normalizedItem: CartItem = {
          ...item,
          price: Number(item.price),
          quantity: Number(item.quantity),
        };

        console.log("normalizedItem",normalizedItem);
        

        const key = cartItemKey(normalizedItem);
        const items = get().items;

        const existing = items.find(i => cartItemKey(i) === key);

        console.log("existing",existing);
        

        if (existing) {
          set({
            items: items.map(i =>
              cartItemKey(i) === key
                ? { ...i, quantity: i.quantity + normalizedItem.quantity }
                : i
            ),
            isOpen: true,
          });
        } else {
          set({
            items: [...items, normalizedItem],
            isOpen: true,
          });
        }
      },

      updateQuantity: (key, quantity) => {
        console.log("key", key);
        console.log("quantity", quantity);

        if (quantity <= 0) {
          get().removeItem(key);
          return;
        }
        const res = get().items.map(i => {
          console.log("cartitem", cartItemKey(i));


          cartItemKey(i) === key
            ? { ...i, quantity }
            : i
        })
        console.log("updated", res);


        set({
          items: get().items.map(i =>
            cartItemKey(i) === key
              ? { ...i, quantity }
              : i
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
        get().items.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        ),

      getItemCount: () =>
        get().items.reduce(
          (sum, i) => sum + i.quantity,
          0
        ),

      getItemKey: (item) => cartItemKey(item),
    }),
    {
      name: 'crystal-cart',
      storage: createJSONStorage(() => localStorage),

      // ✅ Only persist what matters
      partialize: (state) => ({
        items: state.items,
      }),

      // ✅ Future-proofing
      version: 1,
      migrate: (persistedState: any, version) => {
        if (!persistedState) return { items: [] };

        // Fix old string-based carts
        if (version === 0) {
          return {
            items: persistedState.items.map((i: any) => ({
              ...i,
              price: Number(i.price),
              quantity: Number(i.quantity),
            })),
          };
        }

        return persistedState;
      },
    }
  )
);
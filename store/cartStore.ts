import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
    id: string;
    title: string;
    image: string | null;
    size: string;
    thickness: string;
    mountingMethod: string;
    orientation: string;
    price: number | string;
    quantity: number | string;
}

function cartItemKey(item: Pick<CartItem, 'id' | 'size' | 'thickness' | 'mountingMethod' | 'orientation'>) {
    return `${item.id}|${item.size}|${item.thickness}|${item.mountingMethod}|${item.orientation}`;
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
                const key = cartItemKey(item);
                const items = get().items;
                const existing = items.find(i => cartItemKey(i) === key);
                if (existing) {
                    set({
                        items: items.map(i =>
                            cartItemKey(i) === key ? { ...i, quantity: parseInt(i.quantity as string) + parseInt(item.quantity as string) } : i
                        ),
                        isOpen: true,
                    });
                } else {
                    set({ items: [...items, item], isOpen: true });
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
                set({ items: get().items.filter(i => cartItemKey(i) !== key) });
            },

            clearCart: () => set({ items: [] }),
            setOpen: (open) => set({ isOpen: open }),

            getTotal: () => get().items.reduce((sum, i) => sum + parseInt(i.price as string) * parseInt(i.quantity as string), 0),
            getItemCount: () => get().items.reduce((sum, i) => sum + parseInt(i.quantity as string), 0),
            getItemKey: (item) => cartItemKey(item),
        }),
        {
            name: 'crystal-cart',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ items: state.items }),
        }
    )
);

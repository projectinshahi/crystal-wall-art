import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
    productId: string;
    title: string;
    image: string | null;
    size: string;
    thickness: string;
    mountingMethod: string;
    orientation: string;
    price: number;
    quantity: number;
    variantId?: string;
}

function cartItemKey(
    item: Pick<CartItem, 'productId' | 'size' | 'thickness' | 'mountingMethod' | 'orientation' | 'price' | 'quantity' | 'variantId'>
) {
    return `${item.productId}|${item.size}|${item.thickness}|${item.mountingMethod}|${item.orientation}|${item.price}|${item.quantity}|${item.variantId ?? ''}`;
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

                const key = cartItemKey(normalizedItem);
                const items = get().items;

                const existing = items.find(i => cartItemKey(i) === key);

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
                if (quantity <= 0) {
                    get().removeItem(key);
                    return;
                }

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
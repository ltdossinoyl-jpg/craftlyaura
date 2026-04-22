"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

interface CartItem extends Product {
    quantity: number;
}

interface CartStoreType {
    items: CartItem[];
    isCartPopupOpen: boolean;
    isCheckoutDrawerOpen: boolean;
    lastAddedItem: Product | null;
    cartTotal: number;

    addItem: (product: Product) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, newQuantity: number) => void;
    closeCartPopup: () => void;
    openCheckoutDrawer: () => void;
    closeCheckoutDrawer: () => void;
}

const getCartItemId = (product: Product) => product.cartItemId || product.id;

export const useCartStore = create<CartStoreType>()(
    persist(
        (set, get) => ({
            items: [],
            isCartPopupOpen: false,
            isCheckoutDrawerOpen: false,
            lastAddedItem: null,

            get cartTotal() {
                return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
            },

            addItem: (product: Product) => {
                const cId = getCartItemId(product);
                set((state) => {
                    const existing = state.items.find((item) => (item.cartItemId || item.id) === cId);
                    if (existing) {
                        return {
                            items: state.items.map((item) =>
                                (item.cartItemId || item.id) === cId
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item
                            ),
                            lastAddedItem: product,
                            isCartPopupOpen: true,
                        };
                    }
                    return {
                        items: [...state.items, { ...product, quantity: 1, cartItemId: cId }],
                        lastAddedItem: product,
                        isCartPopupOpen: true,
                    };
                });
            },

            removeItem: (id: string) => {
                set((state) => ({
                    items: state.items.filter((item) => (item.cartItemId || item.id) !== id),
                }));
            },

            updateQuantity: (id: string, newQuantity: number) => {
                if (newQuantity < 1) return;
                set((state) => ({
                    items: state.items.map((item) =>
                        (item.cartItemId || item.id) === id ? { ...item, quantity: newQuantity } : item
                    ),
                }));
            },

            closeCartPopup: () => set({ isCartPopupOpen: false }),
            openCheckoutDrawer: () => set({ isCheckoutDrawerOpen: true }),
            closeCheckoutDrawer: () => set({ isCheckoutDrawerOpen: false }),
        }),
        {
            name: 'atlas_cart_zustand', // Storage name
        }
    )
);

// Keep the old API signature identical so all other files keep working!
export const useCart = () => {
    // We bind it inside a hook wrapper so we can still mock the context signature.
    const store = useCartStore();
    return {
        items: store.items,
        addItem: store.addItem,
        removeItem: store.removeItem,
        updateQuantity: store.updateQuantity,
        cartTotal: store.items.reduce((total, item) => total + item.price * item.quantity, 0), // Calculate dynamically to bypass getter limitations
        isCartPopupOpen: store.isCartPopupOpen,
        lastAddedItem: store.lastAddedItem,
        closeCartPopup: store.closeCartPopup,
        isCheckoutDrawerOpen: store.isCheckoutDrawerOpen,
        openCheckoutDrawer: store.openCheckoutDrawer,
        closeCheckoutDrawer: store.closeCheckoutDrawer,
    };
};

// Dummy provider so `layout.tsx` doesn't break
export function CartProvider({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

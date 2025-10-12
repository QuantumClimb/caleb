import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem, Cart } from '../types';

interface CartStore extends Cart {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getItemById: (productId: string) => CartItem | undefined;
}

const TAX_RATE = 0.08; // 8% tax
const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 5.99;

const calculateTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = subtotal * TAX_RATE;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + tax + shipping;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      subtotal: 0,
      tax: 0,
      shipping: 0,

      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(item => item.product.id === product.id);
          
          let newItems: CartItem[];
          if (existingItem) {
            newItems = state.items.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            newItems = [...state.items, { id: product.id, product, quantity }];
          }

          const totals = calculateTotals(newItems);
          return {
            ...state,
            items: newItems,
            ...totals,
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => {
          const newItems = state.items.filter(item => item.product.id !== productId);
          const totals = calculateTotals(newItems);
          return {
            ...state,
            items: newItems,
            ...totals,
          };
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        set((state) => {
          if (quantity <= 0) {
            // Remove item if quantity is 0 or negative
            const newItems = state.items.filter(item => item.product.id !== productId);
            const totals = calculateTotals(newItems);
            return {
              ...state,
              items: newItems,
              ...totals,
            };
          }

          const newItems = state.items.map(item =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          );
          const totals = calculateTotals(newItems);
          return {
            ...state,
            items: newItems,
            ...totals,
          };
        });
      },

      clearCart: () => {
        set({
          items: [],
          total: 0,
          subtotal: 0,
          tax: 0,
          shipping: 0,
        });
      },

      getItemCount: () => {
        const state = get();
        return state.items.reduce((count, item) => count + item.quantity, 0);
      },

      getItemById: (productId: string) => {
        const state = get();
        return state.items.find(item => item.product.id === productId);
      },
    }),
    {
      name: 'caleb-cart',
      partialize: (state) => ({
        items: state.items,
        total: state.total,
        subtotal: state.subtotal,
        tax: state.tax,
        shipping: state.shipping,
      }),
    }
  )
); 
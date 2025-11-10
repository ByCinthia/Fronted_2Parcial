/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";

export type Product = {
  id: string;
  name: string;
  price: number;
  image?: string;
  qty?: number;
};

type CartContextValue = {
  items: Product[];
  add: (p: Product) => void;
  remove: (id: string) => void;
  clear: () => void;
  total: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>(() => {
    try {
      const raw = localStorage.getItem("cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const add = (p: Product) => {
    setItems((prev) => {
      const found = prev.find((x) => x.id === p.id);
      const addQty = p.qty && p.qty > 0 ? p.qty : 1;
      if (found) {
        return prev.map((x) =>
          x.id === p.id ? { ...x, qty: (x.qty || 0) + addQty } : x
        );
      }
      return [...prev, { ...p, qty: addQty }];
    });
  };

  const remove = (id: string) => setItems((prev) => prev.filter((x) => x.id !== id));
  const clear = () => setItems([]);
  const total = items.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0);

  return <CartContext.Provider value={{ items, add, remove, clear, total }}>{children}</CartContext.Provider>;
}
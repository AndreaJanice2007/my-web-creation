import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { CartLine } from "./pricing";
import { validQty } from "./pricing";

type Ctx = {
  lines: CartLine[];
  count: number;
  add: (l: Omit<CartLine, "key">) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};
const CartCtx = createContext<Ctx | null>(null);
const KEY = "pos-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  useEffect(() => {
    try { setLines(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch { /* ignore */ }
  }, []);
  const save = (next: CartLine[]) => { setLines(next); localStorage.setItem(KEY, JSON.stringify(next)); };

  const value: Ctx = {
    lines,
    count: lines.reduce((s, l) => s + l.qty, 0),
    add: (l) => {
      const key = JSON.stringify([l.slug, l.variantId, l.flavour, [...l.addons].sort(), l.message, l.giftNote]);
      const existing = lines.find((x) => x.key === key);
      if (existing) {
        const q = existing.qty + l.qty;
        if (validQty(l.slug, q)) save(lines.map((x) => (x.key === key ? { ...x, qty: q } : x)));
      } else save([...lines, { ...l, key }]);
    },
    setQty: (key, qty) => {
      const line = lines.find((x) => x.key === key);
      if (line && validQty(line.slug, qty)) save(lines.map((x) => (x.key === key ? { ...x, qty } : x)));
    },
    remove: (key) => save(lines.filter((x) => x.key !== key)),
    clear: () => save([]),
  };
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export const useCart = () => {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart outside provider");
  return c;
};

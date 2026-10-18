import type { CartLine } from "./pricing";

export const STATUSES = ["Pending", "Confirmed", "Preparing", "Ready for Pickup", "Out for Delivery", "Delivered", "Cancelled"] as const;

export type Order = {
  number: string;
  createdAt: string;
  name: string;
  phone: string;
  email?: string;
  method: "pickup" | "delivery";
  address?: string;
  pin?: string;
  date: string;
  slot: string;
  notes?: string;
  payment: string;
  paymentStatus: "Unpaid" | "Awaiting verification" | "Paid";
  status: (typeof STATUSES)[number];
  lines: CartLine[];
  subtotal: number;
  delivery: number;
  total: number;
};

// Phase 1: orders are kept on this device only. Moves to Lovable Cloud in phase 2.
const KEY = "pos-orders-v1";
export const loadOrders = (): Order[] => {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
};
export const saveOrder = (o: Order) => localStorage.setItem(KEY, JSON.stringify([o, ...loadOrders()]));
export const findOrder = (num: string, phone: string) =>
  loadOrders().find((o) => o.number.toUpperCase() === num.trim().toUpperCase() && o.phone.replace(/\D/g, "").endsWith(phone.replace(/\D/g, "").slice(-10)));
export const newOrderNumber = () => "POS-" + Date.now().toString(36).toUpperCase().slice(-6);

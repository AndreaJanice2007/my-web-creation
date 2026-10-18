// Sample business settings — placeholders to be replaced by the bakery owner.
export const business = {
  name: "Pinch of Salt",
  tagline: "A Little Sweetness, Baked with Love.",
  announcement: "Freshly baked happiness, made to order ✨",
  phone: "+91 90000 00000",
  whatsapp: "919000000000",
  email: "hello@pinchofsalt.example",
  pickupAddress: "Sample address: 12 Baker's Lane, Indiranagar, Bengaluru 560038",
  hours: "Tue–Sun, 10:00 am – 8:00 pm",
  serviceArea: "Sample service area: select Bengaluru PIN codes",
};

export const deliveryZones: { pins: string[]; name: string; fee: number }[] = [
  { name: "Zone A (nearby)", pins: ["560038", "560008", "560075"], fee: 4900 },
  { name: "Zone B", pins: ["560001", "560025", "560034", "560071"], fee: 9900 },
];

export const rules = {
  minOrder: 30000, // ₹300
  freeDeliveryOver: 150000, // ₹1,500
  codMaxOrder: 200000,
  leadDays: 1,
  bookingWindowDays: 30,
  blackoutDates: ["2026-12-25"],
  slots: ["10:00–12:00", "12:00–14:00", "14:00–16:00", "16:00–18:00", "18:00–20:00"],
};

export type PaymentMethod = "online" | "cod" | "pickup" | "bank" | "whatsapp";
export const paymentMethods: { id: PaymentMethod; label: string; note: string; enabled: boolean }[] = [
  { id: "online", label: "UPI, Cards, Net banking & Wallets", note: "Secure online payment — coming soon (test mode not yet connected).", enabled: false },
  { id: "cod", label: "Pay on delivery", note: "Cash or UPI to our delivery partner. Orders up to ₹2,000.", enabled: true },
  { id: "pickup", label: "Pay at pickup", note: "Pay when you collect your order.", enabled: true },
  { id: "bank", label: "Bank transfer", note: "We'll share verified bank details on WhatsApp. Awaiting verification until confirmed.", enabled: true },
  { id: "whatsapp", label: "Coordinate on WhatsApp", note: "Send your order to us and we'll arrange payment with you.", enabled: true },
];

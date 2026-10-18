import { describe, it, expect } from "vitest";
import { linePrice, totals, deliveryFee, validQty } from "./pricing";

const line = (slug: string, variantId: string, qty: number, addons: string[] = []) => ({ key: "k", slug, variantId, qty, addons });

describe("pricing", () => {
  it("prices a 500 g chocolate truffle cake at ₹799", () => {
    expect(linePrice(line("chocolate-truffle-cake", "500g", 1))).toBe(79900);
  });
  it("adds candles (₹49) to the cake price", () => {
    expect(linePrice(line("chocolate-truffle-cake", "500g", 1, ["candles"]))).toBe(84800);
  });
  it("free delivery over ₹1,500", () => {
    expect(deliveryFee("560038", 150000)).toBe(0);
  });
  it("rejects unserviceable PIN codes", () => {
    expect(deliveryFee("110001", 50000)).toBeNull();
  });
  it("enforces ₹300 minimum order", () => {
    expect(totals([line("classic-fudge-brownie", "1", 2)], "pickup").meetsMinimum).toBe(false);
  });
  it("rejects cake quantity above 3", () => {
    expect(validQty("chocolate-truffle-cake", 4)).toBe(false);
  });
});

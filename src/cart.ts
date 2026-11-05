import type { Cart } from "./types.ts";
import { expect, test } from "./test.ts";

export const cart: Cart = {
  lines: [
    { name: "Canvas tote", price: 24, qty: 1 },
    { name: "Enamel mug", price: 9, qty: 2 },
  ],
};

/** The cart's sum before any coupon. */
export function subtotal(cart: Cart): number {
  return cart.lines.reduce((sum, line) => sum + line.price * line.qty, 0);
}

test("the subtotal counts every line", () => {
  expect(subtotal(cart)).toBe(42);
});

test("quantities multiply", () => {
  expect(subtotal({ lines: [{ name: "Mug", price: 9, qty: 3 }] })).toBe(27);
});

test("an empty cart costs nothing", () => {
  expect(subtotal({ lines: [] })).toBe(0);
});

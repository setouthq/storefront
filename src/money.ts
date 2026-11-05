import { expect, test } from "./test.ts";

/** Dollars the way the page shows them: two places, a true minus sign. */
export function money(amount: number): string {
  const sign = amount < 0 ? "−" : "";
  return `${sign}$${Math.abs(amount).toFixed(2)}`;
}

test("whole dollars get two places", () => {
  expect(money(24)).toBe("$24.00");
});

test("cents stay", () => {
  expect(money(9.5)).toBe("$9.50");
});

test("nothing is $0.00", () => {
  expect(money(0)).toBe("$0.00");
});

test("a discount reads with a minus sign", () => {
  expect(money(-50)).toBe("−$50.00");
});

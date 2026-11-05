import type { Cart, Coupon } from "../types.ts";
import { expect, test } from "../test.ts";
import { cart, subtotal } from "../cart.ts";
import { money } from "../money.ts";

test("a coupon larger than the cart", () => {
  expect(total(cart, { code: "SPRING50", amount: 50 })).toBe(0);
});

/** What the customer pays: the cart less the coupon. */
export function total(cart: Cart, coupon?: Coupon): number {
  const sum = subtotal(cart);
  const off = coupon ? coupon.amount : 0;
  return sum - off;
}

/** The checkout page, as the server sends it. */
export function checkoutPage(cart: Cart, coupon?: Coupon): string {
  const lines = cart.lines
    .map(
      (line) =>
        `<li><span>${line.name} · ${line.qty}</span><span>${money(line.price * line.qty)}</span></li>`,
    )
    .join("");
  const discount = coupon
    ? `<li class="coupon"><span>Coupon ${coupon.code}</span><span>${money(-coupon.amount)}</span></li>`
    : "";
  const due = money(total(cart, coupon));
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Checkout · storefront</title>
<style>
  :root { color-scheme: light dark; font-family: system-ui, sans-serif; }
  body { margin: 0 auto; padding: 32px 24px; max-width: 420px; }
  h1 { font-weight: 300; font-size: 32px; margin: 0 0 24px; }
  ul { list-style: none; margin: 0; padding: 0; }
  li { display: flex; justify-content: space-between; padding: 8px 0; }
  .coupon { opacity: 0.7; }
  .total { font-weight: 600; border-top: 1px solid; margin-top: 8px; padding-top: 12px; }
  button { margin-top: 24px; font: inherit; padding: 8px 16px; }
</style>
</head>
<body>
<h1>Checkout</h1>
<ul>
  ${lines}
  ${discount}
  <li class="total"><span>Total</span><span>${due}</span></li>
</ul>
<button type="button">Pay ${due} ›</button>
</body>
</html>
`;
}

test("no coupon, no discount", () => {
  expect(total(cart)).toBe(42);
});

test("a coupon comes off the total", () => {
  expect(total(cart, { code: "TEN", amount: 10 })).toBe(32);
});

test("a coupon the size of the cart leaves nothing to pay", () => {
  expect(total(cart, { code: "ALL", amount: 42 })).toBe(0);
});

test("the page names each line", () => {
  expect(checkoutPage(cart).includes("Canvas tote · 1")).toBe(true);
});

test("the page shows the coupon", () => {
  const page = checkoutPage(cart, { code: "TEN", amount: 10 });
  expect(page.includes("Coupon TEN")).toBe(true);
});

test("the page shows what to pay", () => {
  expect(
    checkoutPage(cart).includes("<span>Total</span><span>$42.00</span>"),
  ).toBe(true);
});

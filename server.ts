import { readFileSync } from "node:fs";
import { createServer } from "node:http";

import { cart } from "./src/cart.ts";
import { checkoutPage } from "./src/routes/checkout.ts";

const { name, version } = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8"),
) as { name: string; version: string };
const port = Number(process.env.PORT ?? 3000);
const coupon = { code: "SPRING50", amount: 50 };

createServer((request, response) => {
  const started = performance.now();
  const path = new URL(request.url ?? "/", "http://localhost").pathname;
  const found = path === "/" || path === "/checkout";
  response.writeHead(found ? 200 : 404, {
    "content-type": found ? "text/html; charset=utf-8" : "text/plain",
  });
  response.end(found ? checkoutPage(cart, coupon) : "Not found\n");
  const ms = Math.round(performance.now() - started);
  console.log(`${request.method} ${path} ${response.statusCode} · ${ms} ms`);
}).listen(port, () => {
  console.log(`${name}@${version} · ready on http://localhost:${port}`);
});

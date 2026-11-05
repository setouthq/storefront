import { tests } from "./src/test.ts";
import "./src/money.ts";
import "./src/cart.ts";
import "./src/routes/checkout.ts";

/** Where a failure happened: the first line outside the test kit. */
function where(error: unknown): string {
  const stack = error instanceof Error ? (error.stack ?? "") : "";
  for (const frame of stack.split("\n").slice(1)) {
    const at = /([^/\\\s(]+\.ts):(\d+):\d+\)?$/.exec(frame.trim());
    if (at && at[1] !== "test.ts") return `${at[1]}:${at[2]}`;
  }
  return "";
}

const failed: string[] = [];
for (const { name, run } of tests) {
  try {
    run();
  } catch (error) {
    failed.push(`✗ ${name} ${where(error)}`);
  }
}
const passed = tests.length - failed.length;
console.log(
  failed.length > 0
    ? `${passed} passed · ${failed.length} failed`
    : `${passed} passed`,
);
for (const line of failed) console.log(line);
process.exitCode = failed.length > 0 ? 1 : 0;

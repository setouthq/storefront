/** The shop's own small test kit: `test` collects, `expect` checks, and
 * test.ts at the top runs them all. */
export const tests: { name: string; run: () => void }[] = [];

export function test(name: string, run: () => void): void {
  tests.push({ name, run });
}

export function expect(actual: unknown) {
  return {
    toBe(expected: unknown): void {
      if (!Object.is(actual, expected)) {
        throw new Error(`expected ${String(expected)}, got ${String(actual)}`);
      }
    },
  };
}

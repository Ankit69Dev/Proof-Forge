
export type DemoMode = "correct" | "buggy";

export type TestResult = {
  input: number;
  expected: boolean;
  actual: boolean;
  passed: boolean;
};

export type VerificationReport = {
  status: "VERIFIED" | "FAILED";
  passed: number;
  total: number;
  results: TestResult[];
  evidence: string;
  implementation: string;
};

function correctIsPrime(n: number): boolean {
  if (!Number.isInteger(n) || n < 2) {
    return false;
  }

  if (n <= 3) {
    return true;
  }

  if (n % 2 === 0 || n % 3 === 0) {
    return false;
  }

  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) {
      return false;
    }
  }

  return true;
}

// Intentionally incorrect: treats every number above 1 as prime.
function buggyIsPrime(n: number): boolean {
  return n > 1;
}

const testCases: { input: number; expected: boolean }[] = [
  { input: 2, expected: true },
  { input: 3, expected: true },
  { input: 4, expected: false },
  { input: 9, expected: false },
  { input: 25, expected: false },
  { input: 29, expected: true },
  { input: 1, expected: false },
  { input: 2.5, expected: false },
];

export function verifyPrimeTask(
  mode: DemoMode
): VerificationReport {
  const implementation =
    mode === "correct" ? correctIsPrime : buggyIsPrime;

  const results: TestResult[] = testCases.map(
    ({ input, expected }) => {
      const actual = implementation(input);

      return {
        input,
        expected,
        actual,
        passed: actual === expected,
      };
    }
  );

  const passed = results.filter((result) => result.passed).length;
  const total = results.length;
  const verified = passed === total;

  return {
    status: verified ? "VERIFIED" : "FAILED",
    passed,
    total,
    results,
    evidence: verified
      ? `All ${total} predefined tests passed.`
      : `${total - passed} of ${total} tests failed. The implementation does not satisfy every test case.`,
    implementation:
      mode === "correct"
        ? "Correct 6k ± 1 implementation"
        : "Intentionally faulty demonstration implementation",
  };
}

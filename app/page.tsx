
"use client";

import { useState } from "react";
import {
  verifyPrimeTask,
  type DemoMode,
  type VerificationReport,
} from "../lib/verifier";

const PRIME_TASK =
  "Implement a TypeScript function isPrime(n: number): boolean. Return false for values less than 2 and non-integers. Use the 6k ± 1 optimization. Explain the algorithm briefly.";

const EXAMPLES = [
  {
    label: "Prime checker",
    task: PRIME_TASK,
  },
  {
    label: "Sorting algorithm",
    task: "Write a TypeScript function that sorts an array of integers in ascending order. Explain its time complexity.",
  },
  {
    label: "Email validator",
    task: "Write a TypeScript function that validates an email address and returns a boolean. Include basic edge cases and explain its limitations.",
  },
];

function SummaryCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
        {value}
      </p>
      <p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p>
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
        active
          ? "bg-violet-500 text-white"
          : "border border-slate-700 text-slate-300 hover:border-slate-500"
      }`}
    >
      {children}
    </button>
  );
}

export default function Home() {
  const [task, setTask] = useState("");
  const [mode, setMode] = useState<DemoMode>("correct");
  const [report, setReport] = useState<VerificationReport | null>(null);
  const [gemmaResponse, setGemmaResponse] = useState("");
  const [gemmaLoading, setGemmaLoading] = useState(false);
  const [gemmaError, setGemmaError] = useState("");

  async function askGemma() {
    const trimmedTask = task.trim();

    if (!trimmedTask) {
      setGemmaError("Enter a coding task before asking Gemma.");
      return;
    }

    setGemmaLoading(true);
    setGemmaError("");
    setGemmaResponse("");

    try {
      const response = await fetch("/api/gemma", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: trimmedTask,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gemma request failed.");
      }

      setGemmaResponse(
        typeof data.response === "string"
          ? data.response
          : "Gemma returned an unexpected response."
      );
    } catch (error) {
      setGemmaError(
        error instanceof Error
          ? error.message
          : "Something went wrong while contacting Gemma."
      );
    } finally {
      setGemmaLoading(false);
    }
  }

  function runVerification() {
    setReport(verifyPrimeTask(mode));
  }

  const passRate = report
    ? Math.round((report.passed / report.total) * 100)
    : null;

  return (
    <main className="min-h-screen bg-[#080d18] text-slate-100">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        
<header className="mb-8 flex items-center justify-center border-b border-white/10 pb-6">
  <h1
    className="text-4xl font-semibold tracking-wide text-white"
    style={{
      fontFamily: "'Brush Script MT', 'Segoe Script', cursive",
    }}
  >
    ProofForge
  </h1>
</header>


        <section className="py-9">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-400">
            AI output meets evidence
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Don&apos;t just trust the code.
            <span className="block text-slate-400">
              Put it to the test.
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Give Gemma a coding task, inspect its response, and explore how
            deterministic tests can distinguish a working implementation
            from a faulty one.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Generation engine"
            value="Gemma"
            detail="Custom prompts sent through your server API"
          />
          <SummaryCard
            label="Demo test suite"
            value="8 tests"
            detail="Prime-checker edge cases and composite numbers"
          />
          <SummaryCard
            label="Verification"
            value={report ? `${report.passed}/${report.total}` : "Ready"}
            detail={
              report
                ? `${passRate}% of demo tests passed`
                : "Run the separate demonstration suite"
            }
          />
          <SummaryCard
            label="Latest demo result"
            value={report ? report.status : "—"}
            detail={
              report
                ? report.evidence
                : "No verification report generated yet"
            }
          />
        </section>

        <section className="mt-8 grid items-start gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">
                  01 / Task input
                </p>
                <h2 className="mt-2 text-xl font-semibold text-white">
                  What should Gemma build?
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Write your own coding request or start with an example.
                </p>
              </div>
              <span className="rounded-lg border border-slate-700 px-2.5 py-1.5 text-xs text-slate-400">
                Editable
              </span>
            </div>

            <label
              htmlFor="coding-task"
              className="mt-6 block text-sm font-medium text-slate-300"
            >
              Coding task
            </label>

            <textarea
              id="coding-task"
              value={task}
              onChange={(event) => setTask(event.target.value)}
              placeholder="Example: Write a TypeScript function that finds duplicate values in an array..."
              rows={7}
              maxLength={10000}
              className="mt-2 w-full resize-y rounded-xl border border-slate-700 bg-[#080d18] p-4 text-sm leading-6 text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/10"
            />

            <div className="mt-2 flex justify-between text-xs text-slate-500">
              <span>Be specific about inputs and expected behavior.</span>
              <span>{task.length}/10000</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {EXAMPLES.map((example) => (
                <button
                  key={example.label}
                  type="button"
                  onClick={() => {
                    setTask(example.task);
                    setGemmaError("");
                  }}
                  className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 transition hover:border-violet-400 hover:text-white"
                >
                  + {example.label}
                </button>
              ))}
            </div>

            {gemmaError && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300"
              >
                {gemmaError}
              </div>
            )}

            <button
              type="button"
              onClick={askGemma}
              disabled={gemmaLoading || !task.trim()}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {gemmaLoading ? (
                <>
                  <span className="animate-spin">◌</span>
                  Asking Gemma...
                </>
              ) : (
                <>✦ Ask Gemma</>
              )}
            </button>

            <p className="mt-3 text-xs leading-5 text-slate-500">
              The response is generated by the model. It is not automatically
              executed or verified.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">
              02 / Model response
            </p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">
                Gemma output
              </h2>
              <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-400">
                AI generated
              </span>
            </div>

            <div
              aria-live="polite"
              className="mt-5 min-h-[300px] overflow-auto rounded-xl border border-slate-800 bg-[#080d18] p-4"
            >
              {gemmaLoading ? (
                <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
                  <p className="mt-4 text-sm text-slate-300">
                    Gemma is working on your task...
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Waiting for the model response
                  </p>
                </div>
              ) : gemmaResponse ? (
                <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-6 text-slate-300 sm:text-sm">
                  {gemmaResponse}
                </pre>
              ) : (
                <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-xl text-violet-300">
                    &lt;/&gt;
                  </div>
                  <p className="mt-4 text-sm font-medium text-slate-300">
                    Your response will appear here
                  </p>
                  <p className="mt-2 max-w-xs text-xs leading-5 text-slate-500">
                    Enter a coding task and select Ask Gemma to generate a
                    solution.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
              <span className="text-amber-300">ⓘ</span>
              <p className="text-xs leading-5 text-slate-400">
                Model output is a proposal, not proof of correctness. Review
                the code before using it.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">
                03 / Independent test demonstration
              </p>
              <h2 className="mt-2 text-xl font-semibold text-white">
                Prime-checker verification lab
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                This built-in demo runs known test cases against a controlled
                implementation. It is separate from Gemma&apos;s response and
                does not verify arbitrary custom tasks yet.
              </p>
            </div>

            <button
              type="button"
              onClick={runVerification}
              className="shrink-0 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Run demo verification →
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-sm text-slate-400">
              Select implementation:
            </span>
            <ModeButton
              active={mode === "correct"}
              onClick={() => {
                setMode("correct");
                setReport(null);
              }}
            >
              ✓ Correct implementation
            </ModeButton>
            <ModeButton
              active={mode === "buggy"}
              onClick={() => {
                setMode("buggy");
                setReport(null);
              }}
            >
              ⚠ Buggy implementation
            </ModeButton>
          </div>

          {report ? (
            <>
              <div
                className={`mt-6 rounded-xl border p-4 ${
                  report.status === "VERIFIED"
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-rose-500/30 bg-rose-500/5"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-400">
                      Verification status
                    </p>
                    <p
                      className={`mt-1 text-2xl font-bold ${
                        report.status === "VERIFIED"
                          ? "text-emerald-300"
                          : "text-rose-300"
                      }`}
                    >
                      {report.status}
                    </p>
                  </div>
                  <p className="text-sm text-slate-300">
                    {report.passed} / {report.total} tests passed
                  </p>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full rounded-full transition-all ${
                      report.status === "VERIFIED"
                        ? "bg-emerald-400"
                        : "bg-rose-400"
                    }`}
                    style={{
                      width: `${(report.passed / report.total) * 100}%`,
                    }}
                  />
                </div>

                <p className="mt-3 text-sm text-slate-300">
                  {report.evidence}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {report.implementation}
                </p>
              </div>

              <div className="mt-5 overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full min-w-[540px] text-left text-sm">
                  <thead className="bg-slate-800/70 text-xs uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-4 py-3">Input</th>
                      <th className="px-4 py-3">Expected</th>
                      <th className="px-4 py-3">Actual</th>
                      <th className="px-4 py-3">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.results.map((result, index) => (
                      <tr
                        key={`${result.input}-${index}`}
                        className="border-t border-slate-800"
                      >
                        <td className="px-4 py-3 font-mono text-slate-200">
                          {result.input}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-300">
                          {String(result.expected)}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-300">
                          {String(result.actual)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                              result.passed
                                ? "bg-emerald-500/10 text-emerald-300"
                                : "bg-rose-500/10 text-rose-300"
                            }`}
                          >
                            {result.passed ? "PASS" : "FAIL"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-slate-700 p-8 text-center">
              <p className="text-sm font-medium text-slate-300">
                Verification report not generated
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Choose an implementation and run the demo to see objective
                pass/fail evidence.
              </p>
            </div>
          )}
        </section>

        <footer className="mt-10 flex flex-col justify-between gap-2 border-t border-slate-800 pt-5 text-xs text-slate-500 sm:flex-row">
          <p>ProofForge Lite · Gemma-powered coding prototype</p>
          <p>Generated code is not executed by this demo.</p>
        </footer>
      </div>
    </main>
  );
}

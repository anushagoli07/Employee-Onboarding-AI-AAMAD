import type {
  ResearchInputs,
  ResearchResult,
  RunStatusResponse,
} from "../types/workflow";

/** In-memory stub store keyed by runId */
const runs = new Map<
  string,
  { inputs: ResearchInputs; startedAt: number; progress: number }
>();

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildMockResult(runId: string, inputs: ResearchInputs): ResearchResult {
  const focus = inputs.focusAreas
    ? inputs.focusAreas.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return {
    runId,
    summary: `Critical research on "${inputs.topic}" (${inputs.depth} depth) completed. ${
      focus.length ? `Focus areas: ${focus.join(", ")}.` : ""
    }`,
    keyFindings: [
      `Market and technical landscape for ${inputs.topic} shows accelerating adoption.`,
      `Depth level "${inputs.depth}" informed scope of agent coordination patterns.`,
      inputs.notes
        ? `Operator notes incorporated: ${inputs.notes.slice(0, 120)}${inputs.notes.length > 120 ? "…" : ""}`
        : "No additional operator context was provided.",
    ],
    sources: [
      {
        title: "AAMAD MRD — Research Dimensions",
        url: "https://github.com/aamad/aamad/blob/main/project-context/1.define/MRD.md",
      },
      {
        title: "CrewAI Documentation",
        url: "https://docs.crewai.com/",
      },
    ],
    completedAt: new Date().toISOString(),
  };
}

/**
 * Stub: enqueue a research run. Replace with POST /api/research/runs in integration.
 */
export async function startRun(
  inputs: ResearchInputs,
): Promise<{ runId: string }> {
  await delay(300);
  const runId = crypto.randomUUID();
  runs.set(runId, { inputs, startedAt: Date.now(), progress: 0 });
  return { runId };
}

/**
 * Stub: poll run status with simulated progress (~2s to done).
 */
export async function getRunStatus(runId: string): Promise<RunStatusResponse> {
  await delay(200);
  const record = runs.get(runId);
  if (!record) {
    throw new Error(`Unknown run: ${runId}`);
  }

  const elapsed = Date.now() - record.startedAt;
  const duration = 2000;
  const progress = Math.min(100, Math.round((elapsed / duration) * 100));
  record.progress = progress;

  if (progress < 100) {
    return { runId, status: "running", progress };
  }

  return {
    runId,
    status: "done",
    progress: 100,
    result: buildMockResult(runId, record.inputs),
  };
}

/** Test helper — not used in production UI */
export function _clearStubRuns(): void {
  runs.clear();
}

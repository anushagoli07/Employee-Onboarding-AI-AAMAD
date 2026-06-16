export type ResearchDepth = "quick" | "standard" | "deep";

export interface ResearchInputs {
  topic: string;
  depth: ResearchDepth;
  focusAreas: string;
  notes: string;
}

export interface ResearchResult {
  runId: string;
  summary: string;
  keyFindings: string[];
  sources: { title: string; url: string }[];
  completedAt: string;
}

export interface HistoryEntry {
  runId: string;
  topic: string;
  depth: ResearchDepth;
  completedAt: string;
  result: ResearchResult;
}

export type RunStatus = "running" | "done";

export interface RunStatusResponse {
  runId: string;
  status: RunStatus;
  progress?: number;
  result?: ResearchResult;
}

export const EMPTY_INPUTS: ResearchInputs = {
  topic: "",
  depth: "standard",
  focusAreas: "",
  notes: "",
};

export const MAX_HISTORY = 20;

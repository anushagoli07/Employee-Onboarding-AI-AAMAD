import type { ResearchResult } from "../types/workflow";

export type WorkflowState = "idle" | "running" | "done";

export type WorkflowEvent =
  | { type: "START"; runId: string }
  | { type: "COMPLETE"; result: ResearchResult }
  | { type: "RESET" }
  | { type: "VIEW_HISTORY"; result: ResearchResult };

export interface WorkflowContext {
  state: WorkflowState;
  runId: string | null;
  result: ResearchResult | null;
}

export const initialWorkflowContext: WorkflowContext = {
  state: "idle",
  runId: null,
  result: null,
};

export function workflowTransition(
  ctx: WorkflowContext,
  event: WorkflowEvent,
): WorkflowContext {
  switch (ctx.state) {
    case "idle":
      if (event.type === "START") {
        return { state: "running", runId: event.runId, result: null };
      }
      if (event.type === "VIEW_HISTORY") {
        return {
          state: "done",
          runId: event.result.runId,
          result: event.result,
        };
      }
      return ctx;

    case "running":
      if (event.type === "COMPLETE") {
        return { state: "done", runId: event.result.runId, result: event.result };
      }
      if (event.type === "RESET") {
        return initialWorkflowContext;
      }
      return ctx;

    case "done":
      if (event.type === "RESET") {
        return initialWorkflowContext;
      }
      if (event.type === "VIEW_HISTORY") {
        return {
          state: "done",
          runId: event.result.runId,
          result: event.result,
        };
      }
      return ctx;

    default:
      return ctx;
  }
}

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { workflowTransition, initialWorkflowContext } from "../fsm/workflowFsm";
import type { WorkflowEvent } from "../fsm/workflowFsm";
import { getRunStatus, startRun } from "../services/researchRunService";
import type {
  HistoryEntry,
  ResearchInputs,
  ResearchResult,
} from "../types/workflow";
import { EMPTY_INPUTS, MAX_HISTORY } from "../types/workflow";
import { validateInputs } from "../utils/validation";

const HISTORY_KEY = "crw-history-v1";
const POLL_MS = 400;

function loadHistory(): HistoryEntry[] {
  try {
    const raw = sessionStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]): void {
  sessionStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
}

export function useResearchWorkflow() {
  const [inputs, setInputs] = useState<ResearchInputs>(EMPTY_INPUTS);
  const [errors, setErrors] = useState<Partial<Record<keyof ResearchInputs, string>>>(
    {},
  );
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const [ctx, dispatch] = useReducer(
    (state: typeof initialWorkflowContext, event: WorkflowEvent) =>
      workflowTransition(state, event),
    initialWorkflowContext,
  );

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const appendHistory = useCallback((result: ResearchResult, depth: ResearchInputs["depth"], topic: string) => {
    setHistory((prev) => {
      const entry: HistoryEntry = {
        runId: result.runId,
        topic,
        depth,
        completedAt: result.completedAt,
        result,
      };
      const next = [entry, ...prev.filter((h) => h.runId !== result.runId)].slice(
        0,
        MAX_HISTORY,
      );
      saveHistory(next);
      return next;
    });
  }, []);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  useEffect(() => () => stopPolling(), [stopPolling]);

  useEffect(() => {
    if (ctx.state !== "running" || !ctx.runId) {
      stopPolling();
      return;
    }

    const runId = ctx.runId;
    const snapshotTopic = inputs.topic;
    const snapshotDepth = inputs.depth;

    const poll = async () => {
      try {
        const status = await getRunStatus(runId);
        if (status.progress !== undefined) setProgress(status.progress);
        if (status.status === "done" && status.result) {
          stopPolling();
          dispatch({ type: "COMPLETE", result: status.result });
          appendHistory(status.result, snapshotDepth, snapshotTopic);
          setProgress(100);
        }
      } catch {
        setServiceError("Could not fetch run status. Try starting a new research run.");
        stopPolling();
      }
    };

    void poll();
    pollRef.current = setInterval(() => void poll(), POLL_MS);

    return stopPolling;
  }, [ctx.state, ctx.runId, inputs.topic, inputs.depth, appendHistory, stopPolling]);

  const handleStart = useCallback(async () => {
    const validation = validateInputs(inputs);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setServiceError(null);
    setProgress(0);

    try {
      const { runId } = await startRun(inputs);
      dispatch({ type: "START", runId });
    } catch {
      setServiceError("Could not start research run.");
    }
  }, [inputs]);

  const handleReset = useCallback(() => {
    stopPolling();
    setServiceError(null);
    setProgress(0);
    setErrors({});
    dispatch({ type: "RESET" });
  }, [stopPolling]);

  const handleViewHistory = useCallback((entry: HistoryEntry) => {
    dispatch({ type: "VIEW_HISTORY", result: entry.result });
  }, []);

  const inputsDisabled = ctx.state !== "idle";

  return {
    inputs,
    setInputs,
    errors,
    ctx,
    progress,
    serviceError,
    history,
    inputsDisabled,
    handleStart,
    handleReset,
    handleViewHistory,
  };
}

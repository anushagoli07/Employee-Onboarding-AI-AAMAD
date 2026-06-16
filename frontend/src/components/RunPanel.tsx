import type { WorkflowState } from "../fsm/workflowFsm";

interface RunPanelProps {
  state: WorkflowState;
  progress: number;
  serviceError: string | null;
  onStart: () => void;
  onReset: () => void;
}

const STATE_LABELS: Record<WorkflowState, string> = {
  idle: "Ready",
  running: "Running",
  done: "Complete",
};

export function RunPanel({
  state,
  progress,
  serviceError,
  onStart,
  onReset,
}: RunPanelProps) {
  return (
    <section className="panel" aria-labelledby="run-heading">
      <h2 id="run-heading">Run</h2>

      <div className="run-status" aria-live="polite">
        <span className={`badge badge-${state}`}>{STATE_LABELS[state]}</span>
        {state === "running" && (
          <div className="progress-wrap">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
            <span className="progress-label">{progress}%</span>
          </div>
        )}
      </div>

      {serviceError && (
        <p className="banner error" role="alert">
          {serviceError}
        </p>
      )}

      <div className="actions">
        {state === "idle" && (
          <button type="button" className="btn primary" onClick={onStart}>
            Start research
          </button>
        )}
        {state === "done" && (
          <button type="button" className="btn secondary" onClick={onReset}>
            New research
          </button>
        )}
        {state === "running" && (
          <button type="button" className="btn secondary" disabled>
            Research in progress…
          </button>
        )}
      </div>
    </section>
  );
}

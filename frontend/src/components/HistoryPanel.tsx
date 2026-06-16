import type { HistoryEntry } from "../types/workflow";

interface HistoryPanelProps {
  entries: HistoryEntry[];
  onView: (entry: HistoryEntry) => void;
}

export function HistoryPanel({ entries, onView }: HistoryPanelProps) {
  return (
    <section className="panel" aria-labelledby="history-heading">
      <h2 id="history-heading">History</h2>
      {entries.length === 0 ? (
        <p className="muted">Completed runs appear here (session storage, max 20).</p>
      ) : (
        <ul className="history-list">
          {entries.map((entry) => (
            <li key={entry.runId} className="history-item">
              <div>
                <strong>{entry.topic}</strong>
                <span className="meta">
                  {entry.depth} · {new Date(entry.completedAt).toLocaleString()}
                </span>
              </div>
              <button
                type="button"
                className="btn link"
                onClick={() => onView(entry)}
              >
                View
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

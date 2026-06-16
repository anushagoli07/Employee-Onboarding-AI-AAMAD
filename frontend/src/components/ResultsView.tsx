import type { ResearchResult } from "../types/workflow";

interface ResultsViewProps {
  result: ResearchResult | null;
  visible: boolean;
}

export function ResultsView({ result, visible }: ResultsViewProps) {
  if (!visible || !result) return null;

  return (
    <section className="panel" aria-labelledby="results-heading">
      <h2 id="results-heading">Results</h2>
      <p className="meta">
        Run <code>{result.runId.slice(0, 8)}…</code> ·{" "}
        {new Date(result.completedAt).toLocaleString()}
      </p>
      <p className="summary">{result.summary}</p>

      <h3>Key findings</h3>
      <ul className="findings">
        {result.keyFindings.map((finding) => (
          <li key={finding}>{finding}</li>
        ))}
      </ul>

      <h3>Sources</h3>
      <ul className="sources">
        {result.sources.map((source) => (
          <li key={source.url}>
            <a href={source.url} target="_blank" rel="noreferrer">
              {source.title}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

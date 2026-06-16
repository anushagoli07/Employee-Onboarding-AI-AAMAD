import type { ResearchInputs } from "../types/workflow";

interface InputsFormProps {
  value: ResearchInputs;
  onChange: (next: ResearchInputs) => void;
  errors: Partial<Record<keyof ResearchInputs, string>>;
  disabled: boolean;
}

export function InputsForm({ value, onChange, errors, disabled }: InputsFormProps) {
  const set = <K extends keyof ResearchInputs>(key: K, field: ResearchInputs[K]) => {
    onChange({ ...value, [key]: field });
  };

  return (
    <section className="panel" aria-labelledby="inputs-heading">
      <h2 id="inputs-heading">Inputs</h2>
      <div className="field">
        <label htmlFor="topic">Research topic</label>
        <input
          id="topic"
          type="text"
          value={value.topic}
          disabled={disabled}
          onChange={(e) => set("topic", e.target.value)}
          placeholder="e.g. Multi-agent orchestration market trends"
        />
        {errors.topic && <p className="error">{errors.topic}</p>}
      </div>

      <div className="field">
        <label htmlFor="depth">Research depth</label>
        <select
          id="depth"
          value={value.depth}
          disabled={disabled}
          onChange={(e) =>
            set("depth", e.target.value as ResearchInputs["depth"])
          }
        >
          <option value="quick">Quick</option>
          <option value="standard">Standard</option>
          <option value="deep">Deep</option>
        </select>
        {errors.depth && <p className="error">{errors.depth}</p>}
      </div>

      <div className="field">
        <label htmlFor="focusAreas">Focus areas (optional)</label>
        <input
          id="focusAreas"
          type="text"
          value={value.focusAreas}
          disabled={disabled}
          onChange={(e) => set("focusAreas", e.target.value)}
          placeholder="market, technical, UX"
        />
        {errors.focusAreas && <p className="error">{errors.focusAreas}</p>}
      </div>

      <div className="field">
        <label htmlFor="notes">Additional context (optional)</label>
        <textarea
          id="notes"
          rows={3}
          value={value.notes}
          disabled={disabled}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Constraints, audience, or hypotheses…"
        />
        {errors.notes && <p className="error">{errors.notes}</p>}
      </div>
    </section>
  );
}

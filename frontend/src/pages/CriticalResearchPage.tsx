import { InputsForm } from "../components/InputsForm";
import { RunPanel } from "../components/RunPanel";
import { ResultsView } from "../components/ResultsView";
import { HistoryPanel } from "../components/HistoryPanel";
import { useResearchWorkflow } from "../hooks/useResearchWorkflow";

export function CriticalResearchPage() {
  const {
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
  } = useResearchWorkflow();

  return (
    <div className="page">
      <header className="page-header">
        <h1>Critical Research Workflow</h1>
        <p className="subtitle">
          Configure inputs, run research, and review findings — stub services
          until backend integration.
        </p>
      </header>

      <div className="grid-two">
        <InputsForm
          value={inputs}
          onChange={setInputs}
          errors={errors}
          disabled={inputsDisabled}
        />
        <RunPanel
          state={ctx.state}
          progress={progress}
          serviceError={serviceError}
          onStart={() => void handleStart()}
          onReset={handleReset}
        />
      </div>

      <ResultsView result={ctx.result} visible={ctx.state === "done"} />

      <HistoryPanel entries={history} onView={handleViewHistory} />
    </div>
  );
}

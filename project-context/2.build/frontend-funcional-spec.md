# Frontend Functional Specification — Critical Research Workflow

**Feature ID**: `CRW-001`  
**Version**: 0.1.0  
**Author**: @frontend.eng  
**Implementation**: `frontend/` (Vite + React + TypeScript)  
**Status**: MVP scaffold — stub services only (no live backend)

---

## Purpose

Provide a single-page UI for launching and reviewing **critical research** runs: capture inputs, transition through a lightweight run lifecycle (`idle` → `running` → `done`), display structured results, and retain a client-side history of completed runs.

This spec extends the AAMAD Reference MVP research narrative (MRD deep-research dimensions) as a dedicated workflow surface, separate from the chat assistant SAD path.

---

## Scope

| In scope (v0.1) | Out of scope |
| :-------------- | :----------- |
| Single-route React app | Multi-route navigation |
| Inputs form validation | Server persistence |
| FSM-driven Run panel | Real CrewAI/backend wire-up |
| Stub `startRun` / `getRunStatus` | Authentication |
| Results + in-memory History | Export / share |

---

## 1. Inputs

### 1.1 Fields

| Field ID | Label | Type | Required | Validation |
| :------- | :---- | :--- | :------- | :--------- |
| `topic` | Research topic | text | Yes | 3–500 chars, trimmed |
| `depth` | Research depth | select | Yes | `quick` \| `standard` \| `deep` |
| `focusAreas` | Focus areas | text | No | Comma-separated, max 200 chars |
| `notes` | Additional context | textarea | No | Max 2000 chars |

### 1.2 Behavior

- Inputs editable only in **`idle`** FSM state.
- Submit blocked when validation fails; inline errors under each field.
- On successful **Start run**, snapshot inputs bound to `runId` for Results/History.

### 1.3 UI mapping

- Component: `InputsForm.tsx`
- Props: `value`, `onChange`, `errors`, `disabled` (true when `running` or `done` until reset)

---

## 2. Run

### 2.1 Lifecycle (FSM)

```
        START              POLL_COMPLETE
  idle ──────► running ──────────────► done
   ▲                                      │
   └──────────────── RESET ──────────────┘
```

| State | User-visible | Inputs | Actions enabled |
| :---- | :----------- | :----- | :-------------- |
| `idle` | Ready to start | Editable | Start run |
| `running` | Progress indicator | Disabled | — (poll status) |
| `done` | Results available | Disabled | New run (reset) |

### 2.2 Events

| Event | Trigger | Effect |
| :---- | :------ | :----- |
| `START` | User clicks "Start research" | Call `startRun(inputs)` → `runId`; enter `running` |
| `TICK` | Poll `getRunStatus(runId)` | If `status === 'done'`, attach result → `done` |
| `RESET` | User clicks "New research" | Clear active run; return `idle` |

### 2.3 Service contract (stub)

```typescript
startRun(inputs: ResearchInputs): Promise<{ runId: string }>

getRunStatus(runId: string): Promise<{
  runId: string
  status: 'running' | 'done'
  progress?: number  // 0–100 while running
  result?: ResearchResult
}>
```

**Stub behavior**: `startRun` delays ~300ms; `getRunStatus` simulates progress over ~2s then returns mock `ResearchResult`.

### 2.4 UI mapping

- Component: `RunPanel.tsx`
- Shows state badge, progress bar when `running`, error banner on service failure

---

## 3. Results

### 3.1 Data shape

```typescript
interface ResearchResult {
  runId: string
  summary: string
  keyFindings: string[]
  sources: { title: string; url: string }[]
  completedAt: string  // ISO 8601
}
```

### 3.2 Behavior

- Visible when FSM state is **`done`**.
- Renders summary, bulleted findings, source links (stub URLs).
- Empty state hidden until first completed run.

### 3.3 UI mapping

- Component: `ResultsView.tsx`

---

## 4. History

### 4.1 Behavior

- Append entry on transition to **`done`** (client-side array, newest first).
- Each row: topic, depth, completed timestamp, link action "View" (loads that run into Results without re-running).
- Max 20 entries; oldest dropped (FIFO).
- Persisted in `sessionStorage` key `crw-history-v1` (optional enhancement — MVP uses in-memory + sessionStorage).

### 4.2 History entry

```typescript
interface HistoryEntry {
  runId: string
  topic: string
  depth: ResearchDepth
  completedAt: string
  result: ResearchResult
}
```

### 4.3 UI mapping

- Component: `HistoryPanel.tsx`

---

## Page composition (single route `/`)

```
┌─────────────────────────────────────────┐
│  Critical Research Workflow             │
├─────────────────┬───────────────────────┤
│  Inputs         │  Run (status + CTA)   │
├─────────────────┴───────────────────────┤
│  Results (when done)                    │
├─────────────────────────────────────────┤
│  History                                  │
└─────────────────────────────────────────┘
```

Route: `CriticalResearchPage.tsx` mounted at `/` via `App.tsx`.

---

## Error handling

| Condition | UX |
| :-------- | :--- |
| Validation error | Inline field messages |
| `startRun` rejects | Banner: "Could not start research run" |
| `getRunStatus` fails while running | Banner + offer Reset |
| Unknown FSM event | Ignored (no transition) |

---

## Accessibility

- Form labels associated with inputs (`htmlFor` / `id`).
- `aria-live="polite"` on run status region.
- Primary actions are `<button type="button">` with disabled state when inappropriate.

---

## Traceability

| Spec section | Source | Code |
| :----------- | :----- | :--- |
| Inputs | MRD research dimensions | `InputsForm.tsx` |
| Run / FSM | User request | `workflowFsm.ts`, `useResearchWorkflow.ts` |
| Results | MRD output format | `ResultsView.tsx` |
| History | PRD F-102 stub pattern | `HistoryPanel.tsx` |
| Services | frontend-eng stub policy | `researchRunService.ts` |

---

## Spec Sync Checklist

Update this checklist after **each commit** that touches `frontend/` or this spec. Mark `[x]` when verified; add commit SHA in Notes.

| # | Check | Commit | Notes |
| :- | :---- | :----- | :---- |
| 1 | FSM states remain exactly `idle` \| `running` \| `done` | — | Initial scaffold |
| 2 | `Inputs` fields match §1.1 (ids, types, validation) | — | |
| 3 | `Run` §2.1 transitions implemented in `workflowFsm.ts` | — | |
| 4 | `startRun` / `getRunStatus` signatures match §2.3 | — | Stub only |
| 5 | `Results` renders `ResearchResult` shape §3.1 | — | |
| 6 | `History` appends on `done`; max 20 entries §4.1 | — | |
| 7 | Single route `/` only; no extra routers | — | |
| 8 | Inputs disabled when not `idle` §1.2 | — | |
| 9 | `frontend.md` Audit updated | — | |
| 10 | `npm run build` passes in `frontend/` | — | Verified 2026-06-15 |

### Post-commit workflow

1. Run `npm run build` in `frontend/`.
2. Walk §1–§4 against running dev server (`npm run dev`).
3. Update table above: set Check to `[x]`, fill Commit column with short SHA.
4. If behavior diverges from spec, update **either** spec **or** code in the same commit (never leave drift).

---

## Sources

- `project-context/1.define/MRD.md` — research workflow context
- `project-context/1.define/PRD.md` — MVP UI patterns
- `project-context/1.define/sad.md` — deferred backend integration
- `.cursor/agents/frontend-eng.md` — stub services, no backend wire-up

---

## Assumptions

1. "Critical Research Workflow" is a **frontend scaffold** for future CrewAI research crew integration.
2. Stub services simulate latency; @integration.eng will replace with real API later.
3. Vite + React chosen for lightweight single-route MVP (SAD Next.js chat app may coexist in future `apps/` split).

---

## Open Questions

1. Should History persist across browser restarts (localStorage vs sessionStorage)?
2. When backend exists, poll interval for `getRunStatus` (default 500ms in hook)?
3. Merge this workflow into main Next.js app or keep standalone `frontend/` package?

---

## Audit

| Timestamp | Persona | Action |
| :-------- | :------ | :----- |
| 2026-06-15T20:00:00Z | @frontend.eng | Created `frontend-funcional-spec.md` CRW-001 |
| 2026-06-15T20:00:00Z | @frontend.eng | Scaffolded React/TS app with FSM + stub services |

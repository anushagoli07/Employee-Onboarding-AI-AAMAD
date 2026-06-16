# Product Requirements Document (PRD)

**Product**: AAMAD Reference MVP — Multi-Agent Chat Assistant  
**Version**: 0.1.0  
**Status**: Draft for Phase 2 handoff  
**Selected Runtime**: `crewai` (default; overridable via `AAMAD_TARGET_RUNTIME`)

---

## Document Control

| Field | Value |
| :---- | :---- |
| Author | @product-mgr |
| Phase | Define (Phase 1) |
| Target artifact path | `project-context/1.define/PRD.md` |
| Downstream consumers | @system.arch, @project.mgr, @frontend.eng, @backend.eng, @integration.eng, @qa.eng |

---

## 1. Executive Summary

### Problem Statement

Teams building multi-agent AI applications face fragmented workflows: requirements live in ad-hoc documents, agent logic is scaffolded inconsistently, and UI-to-backend integration is often deferred until late in development. Without a standardized, auditable path from product definition to a working MVP, teams spend disproportionate effort on boilerplate rather than validating core agent behavior and user value.

**Pain points (framework-derived):**

- Context and requirements are not traceable across Define → Build → Deliver phases.
- Multi-agent backends are difficult to align with a production-grade chat UI without clear contracts.
- Runtime choice (CrewAI, Claude Agent SDK, Cursor SDK) affects implementation patterns but is often decided too late.
- MVP scope creep (databases, integrations, analytics) delays first end-to-end validation.

**Opportunity scope**: Organizations adopting AI-assisted development frameworks and multi-agent orchestration tools. The multi-agent orchestration segment is estimated at **$1.8B–$7.6B (2025)** with **23–46% CAGR** through 2030–2034 (see MRD for source variance). Enterprise AI coding adoption exceeds 70% in large orgs, creating demand for governed scaffolding (MRD §1).

### Solution Overview

The **AAMAD Reference MVP** is a browser-based multi-agent chat application produced by the AAMAD Phase 2 build crew. A user sends a natural-language message; a small crew of specialized runtime agents collaborates to produce a single coherent response; the result is displayed in a modern chat interface.

**Unique value proposition:**

- End-to-end, persona-driven build path from PRD/SAD to working local MVP.
- Runtime-adapter abstraction: same product intent, implementation conventions vary by `AAMAD_TARGET_RUNTIME`.
- Explainable artifacts at every epic (setup, frontend, backend, integration, QA).
- Deliberate MVP boundaries: no persistence, external integrations, or analytics in v0.1.

**Expected outcomes:**

- Demonstrate multi-agent orchestration through a real chat round-trip.
- Validate AAMAD Phase 2 workflow and handoff quality.
- Provide a customizable baseline for domain-specific multi-agent products.

### Strategic Rationale

A multi-agent architecture is appropriate because user requests benefit from decomposition (routing, specialized processing, synthesis) rather than a single monolithic prompt. The reference MVP proves this pattern with minimal surface area.

**Business case (MRD-backed):**

- Reduces time-to-first-working-demo for new multi-agent projects in a market growing 35–45% annually.
- Lowers rework by locking MVP scope before architecture—mitigating "acceleration whiplash" (quality incidents rising with AI-assisted throughput).
- Creates reusable templates for PRD, SAD, and build artifacts aligned with emerging AI engineering governance expectations.

**Market timing**: AI-assisted and agentic development practices are mainstream in 2025–2026; teams need reproducible scaffolding more than one-off demos.

---

## 2. Market Context & User Analysis

### Target Market

**Primary personas**

| Persona | Description | Goals |
| :------ | :---------- | :---- |
| **AI Product Builder** | PM or tech lead initiating a multi-agent product | Define scope, ship MVP fast, iterate from user feedback |
| **Full-Stack Developer** | Engineer executing Phase 2 epics | Clear contracts, minimal glue code, runtime-aligned patterns |
| **Framework Evaluator** | Developer assessing AAMAD for team adoption | Reproducible Define → Build flow, auditable outputs |

**Market segment**: Teams building internal or customer-facing agentic applications (10–500 person engineering orgs). Open-source orchestration frameworks held ~38.5% market share in 2025 (MRD §1).

**Geographic focus**: Global; English-first UI for MVP.

### User Needs Analysis

**Critical pain points**

1. Need a working chat UI connected to multi-agent backend without building from scratch.
2. Need explicit MVP vs. backlog separation to avoid scope creep.
3. Need traceability from requirements to implementation artifacts.
4. Need local development that runs with documented env setup.

**User journey (MVP)**

1. Operator completes Phase 1 (MRD/PRD) and selects runtime.
2. @system.arch produces MVP-scoped SAD.
3. Build crew scaffolds, implements FE/BE, integrates, and QA validates.
4. End user opens local app, sends chat message, receives agent crew response.
5. Stakeholder reviews artifacts and defers P1/P2 items to backlog.

**Adoption barriers**

- LLM API keys and runtime dependencies must be configured.
- Multi-step persona workflow requires discipline (fresh sessions per module).

**Success factors**

- Single-command or documented steps to run MVP locally.
- Visible UI stubs signaling future capabilities without pretending they work.
- Clear error messages when backend or API key is misconfigured.

### Competitive Landscape

**Indirect alternatives**: Custom CrewAI scripts, LangGraph templates, commercial agent builders, IDE-native agent features.

**Differentiation**

- Persona-owned epics with prohibited-action boundaries.
- Adapter-neutral methodology with runtime-specific implementation rules.
- Markdown artifact trail for audit and handoff.

**Pricing**: N/A for open-source reference MVP. Commercial positioning deferred to MRD.

---

## 3. Technical Requirements & Architecture

### Runtime Framework Specifications

**Default runtime**: CrewAI (`AAMAD_TARGET_RUNTIME=crewai`)

**Crew composition (MVP)**

| Agent ID | Role | Responsibility |
| :------- | :--- | :------------- |
| `coordinator` | Crew Coordinator | Interpret user intent, plan subtasks, delegate |
| `specialist` | Domain Specialist | Execute primary reasoning/task for the user request |
| `composer` | Response Composer | Merge agent outputs into one user-facing reply |

**Collaboration pattern**: Sequential process — Coordinator → Specialist → Composer.

**Task orchestration**

- Single user message triggers one crew kickoff per request (MVP).
- Tasks chain via `Task.context` per CrewAI adapter rules.
- `max_iter <= 12`, `memory=False` for reproducibility (adapter defaults).

### Core Agent Definitions

#### coordinator

- **role**: "Crew Coordinator"
- **goal**: "Understand the user's message and produce a concise execution plan for the specialist agent."
- **backstory**: "Experienced at decomposing ambiguous requests into actionable steps for a small agent team."
- **tools**: None (MVP)
- **memory**: false
- **delegation**: false

#### specialist

- **role**: "Domain Specialist"
- **goal**: "Produce the substantive answer or analysis requested by the user, following the coordinator's plan."
- **backstory**: "Deep generalist capable of clear, accurate responses across common knowledge-work tasks."
- **tools**: None (MVP)
- **memory**: false
- **delegation**: false

#### composer

- **role**: "Response Composer"
- **goal**: "Format the specialist output as a clear, conversational reply suitable for chat display."
- **backstory**: "Editor focused on clarity, tone, and completeness for end-user chat experiences."
- **tools**: None (MVP)
- **memory**: false
- **delegation**: false

### Integration Requirements (MVP)

| Requirement | MVP scope |
| :---------- | :-------- |
| LLM provider API | Required (e.g., Anthropic/OpenAI via env vars) |
| External APIs / databases | Out of scope |
| Authentication | Out of scope (UI stub only) |
| Conversation persistence | Out of scope (UI stub only) |

**API contract (logical)**

- `POST /api/chat` (or runtime-equivalent): accepts `{ "message": string }`, returns assistant response (JSON or SSE stream per SAD).
- Frontend must not call backend until @integration.eng epic.

**Performance targets (MVP)**

- P95 response time: < 60s for typical prompts (LLM-dependent).
- Support 1 concurrent user for local dev; no production load requirements in MVP.

### Infrastructure Specifications (MVP)

- **Hosting**: Local development only for Phase 2 MVP.
- **Frontend**: Next.js 14+ App Router, TypeScript, Tailwind CSS, assistant-ui, shadcn/ui.
- **Backend**: Python CrewAI service or Next.js API route proxy per SAD.
- **Secrets**: `.env` / `.env.example` only; never committed.
- **Monitoring**: Console/logging sufficient for MVP; no APM requirement.

**Runtime alternatives** (non-default; SAD must document deltas):

- `claude-agent-sdk`: AgentDefinition-based harness, hooks, MCP boundaries.
- `cursor-sdk`: TypeScript-first runtime, explicit tool contracts.

---

## 4. Functional Requirements

### P0 — Core Features (MVP)

#### F-001: Chat message send and receive

**User story**: As an end user, I want to type a message and receive a reply so that I can interact with the multi-agent system.

**Acceptance criteria**

- Chat input accepts text and submits on user action.
- Assistant response renders in the conversation thread.
- Empty or whitespace-only submits are rejected with inline validation.
- Loading state shown while backend processes request.

#### F-002: Multi-agent crew execution

**User story**: As a developer, I want each user message processed by the defined agent crew so that multi-agent behavior is demonstrated.

**Acceptance criteria**

- Coordinator, Specialist, and Composer agents execute in defined order.
- Crew kickoff completes without unhandled exceptions for valid input.
- Backend logs sufficient detail for debugging (agent/task lifecycle).

#### F-003: Chat API endpoint

**User story**: As the integration layer, I need a stable HTTP API so the frontend can exchange messages with the runtime backend.

**Acceptance criteria**

- Endpoint documented in `backend.md` and `integration.md`.
- Request/response schema validated and documented.
- HTTP 4xx/5xx return structured error payloads suitable for UI display.

#### F-004: Local runnable MVP

**User story**: As a developer, I want documented steps to run the full stack locally so I can demo and test the MVP.

**Acceptance criteria**

- `setup.md` describes install, env vars, and start commands.
- QA smoke test confirms round-trip chat works on a clean setup (per `qa.md`).

#### F-005: UI placeholders for deferred features

**User story**: As a stakeholder, I want to see where future features will live so roadmap intent is visible without false functionality.

**Acceptance criteria**

- Non-MVP areas (auth, history, analytics, settings integrations) appear as labeled stubs.
- Stubs are visibly non-functional (disabled controls or "Coming soon" labels).

### P1 — Enhanced Features (post-MVP / visible stubs)

| ID | Feature | Notes |
| :- | :------ | :---- |
| F-101 | User authentication | NextAuth or equivalent; stub in MVP UI |
| F-102 | Conversation history persistence | SQLite/Postgres path; stub in MVP UI |
| F-103 | Streaming responses | SSE/WebSocket; implement if SAD mandates for MVP |
| F-104 | Custom tools per agent | MCP or CrewAI tools; stub in backend |
| F-105 | Agent trace / explainability panel | Show intermediate agent outputs in UI |

### P2 — Future Features

| ID | Feature | Notes |
| :- | :------ | :---- |
| F-201 | Multi-tenant / org workspaces | Enterprise |
| F-202 | Production deployment & CI/CD | Phase 3 Deliver |
| F-203 | Analytics dashboard | Usage metrics, cost tracking |
| F-204 | External integrations | CRM, ticketing, knowledge bases |
| F-205 | Headless AAMAD phase orchestration | Explicitly out of scope for framework v0.5.0 |

---

## 5. Non-Functional Requirements

### Performance

| Metric | Target (MVP) |
| :----- | :------------- |
| Chat API availability (local) | Functional during dev session |
| Cold start | Acceptable for local dev; no SLA |
| Response time | Best effort; bounded by LLM latency |

### Security & Compliance

- API keys and secrets only in environment variables.
- No PII persistence in MVP.
- Input sanitization on chat endpoint (basic XSS/injection mitigation for displayed content).
- GDPR/SOC2: not in MVP scope; note for production hardening.

### Scalability & Reliability

- Single-user local MVP; no horizontal scaling requirement.
- Graceful degradation: user-visible error if LLM or backend unavailable.
- Retry policy per runtime adapter (min `max_retry_limit >= 2` for CrewAI).

### Maintainability

- Agent and task definitions externalized (YAML for CrewAI per adapter rules).
- All epic outputs in `project-context/2.build/*.md` with Audit sections.

---

## 6. User Experience Design

### Interface Requirements

- **Primary surface**: Single-page chat layout (desktop and mobile responsive).
- **Components**: assistant-ui thread, input composer, message bubbles.
- **Styling**: Tailwind + shadcn/ui; consistent with modern LLM chat patterns.
- **Accessibility**: Keyboard-submit for messages; focus management in composer; semantic HTML where feasible.

### Agent Interaction Design

- User sees only final composed reply in MVP (agent traces are P1).
- Errors display human-readable messages, not raw stack traces.
- Optional: subtle "Thinking…" or step indicator during processing.

### Deferred UI areas (stubs)

- Login / account menu
- Conversation sidebar / history
- Analytics or admin dashboard
- Integration settings panel

---

## 7. Success Metrics & KPIs

### Business Metrics (MRD-aligned)

| Metric | MVP target |
| :----- | :--------- |
| Time to first successful chat round-trip | < 1 dev day after Phase 2 start (experienced operator) |
| Phase 2 artifact completeness | 100% of required `2.build` docs present |
| Scope adherence | Zero unapproved P1/P2 features implemented as functional |
| Framework evaluation success | Operator completes CHECKLIST Phase 2 without blocked handoffs |

### Technical Metrics

| Metric | MVP target |
| :----- | :--------- |
| Smoke test pass rate | 100% on documented local setup |
| Crew kickoff success | No unhandled exceptions on standard test prompts |
| Env documentation | All required vars in `.env.example` |

### User Experience Metrics

| Metric | MVP target |
| :----- | :--------- |
| Task completion | User can send message and read reply without developer assistance |
| Error clarity | Misconfiguration produces actionable message (e.g., missing API key) |

---

## 8. Implementation Strategy

### Development Phases

#### Phase 1 — Define (current)

- PRD (this document)
- MRD (pending — see Open Questions)
- SAD by @system.arch (`*create-sad --mvp` recommended)

#### Phase 2 — Build (MVP)

| Step | Persona | Deliverable |
| :--- | :------ | :------------ |
| 0 | @system.arch | `project-context/1.define/sad.md` |
| 1 | @project.mgr | `project-context/2.build/setup.md` |
| 2 | @frontend.eng | Chat UI + stubs, `frontend.md` |
| 3 | @backend.eng | Crew + API, `backend.md` |
| 4 | @integration.eng | Wired chat flow, `integration.md` |
| 5 | @qa.eng | Smoke tests, `qa.md` |

**Module boundaries** (per development-workflow rule): complete each module in a fresh session; do not skip validation.

#### Phase 3 — Deliver (future)

- CI/CD, hosting, access control (@devops persona)
- Production NFR hardening

### Resource Requirements

| Role | Responsibility |
| :--- | :------------- |
| Operator | Runs personas, approves artifacts |
| LLM API access | Required for runtime |
| Local Node.js + Python | Per SAD/setup |

### Risk Mitigation

| Risk | Mitigation |
| :--- | :--------- |
| MRD not completed | Proceed with framework-derived assumptions; revisit PRD after MRD |
| Runtime mismatch | Record `AAMAD_TARGET_RUNTIME` in SAD Audit before backend work |
| Scope creep | Enforce persona prohibited-actions; defer to P1/P2 |
| LLM cost/latency | MVP local-only; document token controls in backend |

---

## 9. Launch & Go-to-Market Strategy

### Beta Testing Plan (MVP)

- **Audience**: Framework contributors and early adopters running CHECKLIST.md.
- **Scenarios**: Send varied prompts; verify error handling with missing env; mobile viewport check.
- **Feedback**: GitHub issues and artifact Open Questions sections.

### Launch Strategy

- **MVP launch**: Local demo only — not a public SaaS release.
- **Channels**: README, CHECKLIST, community contributions.
- **Revenue**: N/A for reference MVP.

### Success Criteria

- [ ] End-to-end chat works per `qa.md`
- [ ] All Phase 2 artifacts committed under `project-context/2.build/`
- [ ] P1/P2 items listed in `qa.md` backlog
- [ ] `AAMAD_TARGET_RUNTIME` recorded in SAD and backend Audit

---

## Quality Assurance Checklist

- [x] Requirements traceable to framework documentation and persona contracts
- [x] All requirements traceable to completed MRD research (`project-context/1.define/MRD.md`)
- [x] Technical specifications feasible with CrewAI default runtime
- [x] Success metrics aligned with MVP objectives
- [x] Resource requirements realistic for local MVP
- [x] Risk mitigation documented
- [x] Timeline achievable via CHECKLIST Phase 2 sequence

---

## Sources

- `README.md` — AAMAD framework overview, runtime adapters, Phase 1–3 workflow
- `CHECKLIST.md` — Phase 1 and Phase 2 execution steps, MVP scope
- `AGENTS.md` — Persona roster and workflow
- `.cursor/agents/backend-eng.md` — MVP backend constraints (no DB, integrations, analytics)
- `.cursor/agents/frontend-eng.md` — Chat UI scope, integration boundary
- `.cursor/agents/project-mgr.md` — Setup-only scope
- `.cursor/rules/adapter-crewai.mdc` — CrewAI execution defaults
- `.cursor/rules/adapter-registry.mdc` — `AAMAD_TARGET_RUNTIME` values
- `.cursor/templates/prd-template.md` — PRD structure template
- `AAMAD/project-context/1.define/MRD.md` — Market research (completed June 2026)

---

## Assumptions

1. **Product scope**: This PRD describes the **AAMAD Reference MVP** (multi-agent chat assistant), not a separate commercial product, because no custom system concept was provided in MRD.
2. **Runtime**: `crewai` is the default target unless the operator sets another value before Phase 2.
3. **MRD complete**: Market sizing uses report ranges ($1.8B–$7.6B); domain-specific ROI requires customer context.
4. **Agent personas**: The three-agent crew (Coordinator, Specialist, Composer) is a sensible default; domain-specific projects may replace Specialist backstory/goal via PRD revision.
5. **Streaming**: Treated as P1 unless @system.arch mandates it in MVP SAD for UX reasons.
6. **File naming**: Artifact paths use `PRD.md` / `MRD.md` in `project-context/1.define/`; some persona inputs reference legacy names (`product-requirements-document.md`) — operators should ensure handoff paths resolve.

---

## Open Questions

1. What is the **domain-specific system concept** (e.g., customer support, research assistant, code review) for this project? Should Specialist agent definition be customized?
2. Should **streaming responses** be P0 for MVP UX, or is blocking JSON acceptable?
3. Which **LLM provider and model** are required for MVP (affects env vars and SAD)?
4. Is **Python sidecar** vs **Next.js API-only** backend preferred for CrewAI deployment?
5. Should the reference MVP include a **demo system prompt / welcome message** branding the product?
6. Confirm resolved **`AAMAD_TARGET_RUNTIME`** before @system.arch runs `*create-sad`.

---

## Audit

| Timestamp | Persona | Action |
| :-------- | :------ | :----- |
| 2026-06-15T00:00:00Z | @product-mgr | Authored PRD v0.1.0 for AAMAD Reference MVP at `project-context/1.define/PRD.md` |
| 2026-06-15T00:00:00Z | @product-mgr | Recorded Assumptions and Open Questions due to incomplete MRD |
| 2026-06-15T12:00:00Z | @product-mgr | Updated PRD with MRD market data; MRD completed |
| 2026-06-15T12:00:00Z | @product-mgr | Default runtime: `crewai`; handoff ready for @system.arch pending Open Question resolution |

**Prompt Trace**: Omitted — standard Phase 1 artifact generation from framework sources; no production-facing runtime execution.

**Tool usage**: File write to `project-context/1.define/PRD.md`; model controls per IDE defaults.

# Market Research Document (MRD)

**Primary Focus**: AAMAD Reference MVP — Multi-Agent Chat Assistant using CrewAI framework with Next.js and assistant-ui for teams adopting AI-assisted multi-agent development  
**Research Date**: June 2026  
**Status**: Complete for Phase 1 handoff  
**Aligned PRD**: `project-context/1.define/PRD.md` v0.1.0

---

## Executive Summary

### Market Opportunity

The multi-agent AI orchestration market is expanding rapidly. Independent industry reports place 2025 market valuations between **$1.8 billion and $7.6 billion**, with 2030–2034 projections ranging from **$35 billion to $58 billion** and compound annual growth rates commonly cited between **24% and 46%** (ResearchIntelo, 2025; MarketIntelo, 2025; TIMEWELL, 2026). Enterprise demand is driven by migration from single-prompt LLM interactions toward persistent, goal-driven agent workflows across financial services, healthcare, IT operations, and software engineering.

Parallel to orchestration growth, **enterprise AI coding adoption** reached high penetration in 2025: large organizations report ~70–90% developer usage of AI assistants, with measurable throughput gains (e.g., 66% more epics completed per developer in large samples) but also quality risks (54% more bugs, 3× production incident probability per merged PR in some telemetry studies) (Faros AI, 2026; Exceeds AI, 2025). This creates a **governance and scaffolding gap** that context-engineering frameworks like AAMAD address: reproducible Define → Build → Deliver workflows with auditable artifacts rather than ad-hoc experimentation.

The **serviceable addressable market** for the AAMAD Reference MVP is teams building their first production-oriented multi-agent chat application—estimated as a subset of the broader orchestration market: developer-led organizations (10–500 engineers), open-source framework adopters (open-source orchestration held ~38.5% share per MarketIntelo, 2025), and framework evaluators seeking IDE-integrated persona workflows.

### Technical Feasibility

**CrewAI** is technically mature for MVP scope: YAML-first `agents.yaml` / `tasks.yaml` configuration, sequential crew processes, `Task.context` chaining, and `CrewBase` project patterns are well-documented (CrewAI Docs, 2025–2026). Role-based multi-agent collaboration (coordinator → specialist → composer) maps directly to proven CrewAI patterns used in content and research workflows (CrewAI Docs; lablab.ai, 2025).

**assistant-ui** provides production-grade chat UX primitives (streaming, auto-scroll, markdown, accessibility) with runtime adapters for AI SDK, LangGraph, and custom HTTP backends (assistant-ui Docs, 2026; npm/GitHub, 2026). **Next.js App Router** remains the standard for full-stack React deployments with API routes for backend proxying.

**Implementation complexity for MVP**: Low-to-medium. A three-agent sequential crew with no tools, no persistence, and local-only deployment is achievable within the AAMAD Phase 2 checklist timeline. Primary dependencies are LLM API access and correct runtime/env configuration.

**Success probability**: High for local MVP demonstration; medium for production hardening without Phase 3 Deliver work.

### Recommended Approach

1. **Proceed with Go** for AAMAD Reference MVP using default `crewai` runtime and PRD-defined three-agent crew.
2. **Position** as a context-engineering and scaffolding framework—not a competing orchestration platform to LangGraph/CrewAI Enterprise.
3. **Differentiate** on persona-owned epics, artifact traceability, runtime adapter neutrality, and deliberate MVP scope boundaries.
4. **Address enterprise adoption barriers** by documenting governance-friendly artifact sections (Sources, Assumptions, Audit) aligned with emerging AI engineering standards (AEEF, 2026; Trustmarque, 2025).
5. **Complete SAD** with `*create-sad --mvp` before Phase 2 implementation; resolve streaming and backend topology in architecture.

---

## Detailed Findings by Dimension

### 1. Market Analysis & Opportunity Assessment

#### Key Insights

1. Multi-agent orchestration is one of the fastest-growing AI software segments, with multiple reports citing 35–45% CAGR through 2030–2034.
2. Open-source frameworks (LangGraph, CrewAI, AutoGen ecosystem) dominate developer-led adoption; commercial platforms target enterprise governance and managed deployment.
3. CrewAI raised significant venture funding and launched CrewAI Enterprise for mid-market managed orchestration (ResearchIntelo platform report, 2025).
4. LangChain/LangGraph achieved unicorn status with LangGraph positioned for production stateful workflows (MarketIntelo, 2026).
5. Enterprise AI coding adoption is widespread but **governance integration lags**: only ~7–8% fully integrate AI governance into SDLC (Trustmarque, 2025).

#### Data Points

| Metric | Value | Source |
| :----- | :---- | :----- |
| Multi-agent orchestration framework market (2025) | $1.8B – $3.2B (report variance) | MarketIntelo, ResearchIntelo, 2025 |
| AI agent market (2025) | $7.6B | TIMEWELL, 2026 |
| Projected orchestration market (2034) | $35.6B – $55.8B | MarketIntelo, ResearchIntelo, 2025 |
| CAGR (2026–2034) | 23.7% – 44.0% | Multiple reports, 2025–2026 |
| Open-source orchestration share | 38.5% (2025) | MarketIntelo, 2025 |
| North America revenue share | 43.2% (2025) | MarketIntelo, 2025 |
| Enterprise dev AI adoption (large orgs) | ~70–90% | Exceeds AI, 2025; Faros AI, 2026 |
| AI-generated code share (global, 2025) | 41% | Exceeds AI, 2025 |
| Fully integrated AI governance in SDLC | 7–8% | Trustmarque, 2025 |

#### Source Citations

- ResearchIntelo, "Multi-Agent AI Orchestration Framework Market Research Report 2034" (2025)
- MarketIntelo, "Multi-Agent AI Orchestration Framework Market Research Report 2034" (2025)
- ResearchIntelo, "Multi-Agent AI Orchestration Platform Market Research Report 2034" (2025)
- MarketIntelo, "AI-Powered Multi-Agent Orchestration Market Research Report 2034" (2026)
- TIMEWELL Inc., "AI Agent Market Hits $7.6 Billion" (2026)
- Trustmarque, "AI Governance Report 2025" (2025)

#### Implications

- Strong tailwinds for any product that helps teams **ship agentic MVPs faster** with lower integration risk.
- Market sizing claims vary widely; PRD/SAD should use **ranges** and cite report variance rather than single-point TAM.
- Governance and auditability are emerging buyer requirements—AAMAD artifact model aligns with enterprise maturity trends.

---

### 2. Technical Feasibility & Requirements Analysis

#### Key Insights

1. CrewAI recommends YAML configuration for agents, tasks, and crews; `Process.sequential` fits the PRD coordinator → specialist → composer pattern.
2. CrewAI supports `max_iter`, `max_retry_limit`, `memory`, and `allow_delegation` controls needed for reproducible MVP (CrewAI Docs, 2025).
3. CrewAI is independent of LangChain with its own execution engine—reduces dependency surface for MVP (Medium/CrewAI ecosystem, 2026).
4. assistant-ui decouples chat UX from backend via runtime adapters (`useChatRuntime`, custom data-stream)—supports integration epic cleanly.
5. MVP without tools, DB, or external APIs is explicitly supported by AAMAD backend persona constraints.

#### Data Points

| Capability | MVP fit | Notes |
| :---------- | :------ | :---- |
| Sequential multi-agent crew | ✅ High | Native CrewAI `Process.sequential` |
| YAML externalized config | ✅ High | Matches adapter-crewai rules |
| Streaming chat UI | ✅ High | assistant-ui + AI SDK v6 |
| Tool/MCP integration | ⏸ Deferred | P1 per PRD |
| Long-term memory | ❌ Out of scope | `memory=False` for reproducibility |
| Production observability | ⏸ Partial | Console logging MVP; LangSmith/CrewAI Enterprise for scale |

#### Source Citations

- CrewAI Documentation: Agents, Tasks, Crews (docs.crewai.com, 2025–2026)
- lablab.ai, "Developing Intelligent Agents with CrewAI Tutorial" (2025)
- Medium, "CrewAI in 2026: What It Is, Why It Matters" (2026)
- AAMAD `.cursor/agents/backend-eng.md` — MVP constraints
- AAMAD `.cursor/rules/adapter-crewai.mdc` — execution defaults

#### Implications

- **Go** on CrewAI as default runtime for reference MVP.
- Backend topology (Python sidecar vs Next.js API proxy) should be decided in SAD—not a market blocker.
- Technical risk is operational (LLM latency/cost), not framework capability for MVP scope.

---

### 3. User Experience & Workflow Analysis

#### Key Insights

1. Users expect ChatGPT-grade UX: streaming, markdown, auto-scroll, keyboard shortcuts, and mobile responsiveness (assistant-ui value proposition).
2. AAMAD Phase 2 user journey is **operator-centric** (persona sessions) plus **end-user** chat validation after integration.
3. Human-in-the-loop is required at artifact approval gates (PRD/SAD sign-off) and optional in chat for MVP.
4. Visible non-functional stubs improve stakeholder roadmap communication without false affordances (PRD F-005).
5. "Acceleration whiplash" in AI-assisted dev means teams need **module boundaries** and validation gates—AAMAD development-workflow rule addresses this (Faros AI, 2026).

#### Data Points

| UX factor | MVP requirement |
| :-------- | :-------------- |
| Time to first chat round-trip | Target < 1 dev day post-Phase 2 start (PRD) |
| Error clarity on misconfiguration | Actionable messages (missing API key, backend down) |
| Accessibility | Keyboard submit, semantic HTML (PRD §6) |
| Agent trace visibility | P1 — users see composed reply only in MVP |

#### Source Citations

- assistant-ui Documentation (assistant-ui.com/docs, 2026)
- assistant-ui GitHub / npm package stats (2026)
- Faros AI, "Enterprise AI Coding Assistant Adoption" (2026)
- AAMAD `CHECKLIST.md` — Phase 2 user/operator journey
- AAMAD PRD §6 — UX requirements

#### Implications

- assistant-ui selection is validated for MVP chat interface.
- Defer agent trace panel to P1; focus MVP on reliable send/receive loop.
- Emphasize operator documentation in setup.md for adoption success.

---

### 4. Production & Operations Requirements

#### Key Insights

1. MVP scope is **local development only**; production deployment, CI/CD, and hosting are Phase 3 (Deliver).
2. Security baseline: secrets in env vars, no PII persistence, input sanitization on chat endpoint (PRD §5).
3. Enterprise buyers increasingly require audit trails and governance touchpoints pre/post deployment (Trustmarque: 44% pre-deploy testing, 41% post-deploy monitoring, but fragmented overall).
4. LLM operational cost is variable; MVP should document token controls and model selection in backend.md.
5. Monitoring for MVP: verbose CrewAI logging + HTTP error logging sufficient; APM deferred.

#### Data Points

| Cost area | MVP estimate |
| :-------- | :------------- |
| LLM API (dev/testing) | Tens of USD/month for light MVP testing |
| Infrastructure (local) | $0 cloud; developer machine only |
| Third-party SaaS | None in MVP |
| Engineering time (Phase 2) | 3–10 person-days for experienced AAMAD operator (assumption) |

#### Source Citations

- Trustmarque, "AI Governance Report 2025" (2025)
- AEEF, "AI-Accelerated Enterprise Engineering Framework" (aeef.ai, 2026)
- AAMAD PRD §5, §8 — NFR and implementation phases
- AAMAD README — Phase 3 Deliver scope

#### Implications

- Do not over-invest in production ops during MVP; document Phase 3 deferrals explicitly in SAD and qa.md.
- Include `.env.example` and governance-friendly Audit blocks in all build artifacts.

---

### 5. Innovation & Differentiation Analysis

#### Key Insights

1. **Competitive set (direct)**: CrewAI starter templates, LangGraph/assistant-ui templates, commercial agent builders (CrewAI Enterprise, LangChain Agent Builder), IDE-native agents (Cursor, Claude Code).
2. **Competitive set (indirect)**: Generic AI coding assistants, no-code automation platforms, internal platform teams.
3. **AAMAD differentiation**: Persona-owned epics with prohibited actions; Define/Build/Deliver artifact trail; runtime adapter registry (`crewai`, `claude-agent-sdk`, `cursor-sdk`); multi-IDE support (Cursor, Claude Code, VS Code).
4. **Market gap**: Few frameworks combine **product definition templates (MRD/PRD)** with **implementation persona contracts** and **runtime adapter rules** in one reproducible package.
5. **Monetization**: AAMAD is open-source (Apache-2.0); reference MVP supports framework adoption, consulting, and custom domain products—not standalone SaaS revenue.

#### Data Points

| Competitor | Strength | Gap vs AAMAD |
| :--------- | :------- | :----------- |
| LangGraph + LangSmith | Production orchestration, observability | Less prescriptive product/engineering persona workflow |
| CrewAI + templates | Fast agent prototyping | No full Define→Build artifact methodology |
| assistant-ui templates | Excellent chat UX | No backend crew or requirements methodology |
| IDE agents (Cursor, etc.) | Interactive coding | Not a structured multi-persona build pipeline |
| AEEF / governance frameworks | Enterprise controls | Complementary; AAMAD can align artifact audit patterns |

#### Source Citations

- MarketIntelo AI orchestration competitive landscape (2026)
- ResearchIntelo platform market — CrewAI Enterprise, ServiceNow, Cohere (2025)
- AAMAD README — framework positioning and runtime adapters
- AEEF Standards (2026)
- Apache-2.0 license rationale in AAMAD README

#### Implications

- Position AAMAD as **methodology + scaffolding**, not a replacement for CrewAI/LangGraph.
- Partnership opportunity: document integration paths with assistant-ui, CrewAI, and IDE agents.
- Patent/IP risk: low for open methodology; use NOTICES for third-party deps as required.

---

## Critical Decision Points

### Go/No-Go Factors

| Factor | Status | Decision |
| :----- | :----- | :------- |
| Market demand for multi-agent apps | ✅ Strong | **Go** |
| CrewAI feasible for 3-agent MVP | ✅ Yes | **Go** |
| assistant-ui feasible for chat MVP | ✅ Yes | **Go** |
| Completed domain-specific concept | ⚠️ Using reference MVP default | **Go** with Assumptions |
| Production SaaS launch | ❌ Out of scope | **Defer** to Phase 3+ |

### Technical Architecture Choices

| Decision | Recommendation | Rationale |
| :------- | :------------- | :-------- |
| Runtime | `crewai` (default) | Best documented fit for PRD crew pattern; AAMAD adapter rules exist |
| Crew process | Sequential | Matches PRD; simplest debugging |
| Memory | Off (`memory=False`) | Reproducibility per adapter rules |
| Frontend | Next.js + assistant-ui + shadcn | SAD template alignment, production UX |
| Persistence | None in MVP | PRD/backend persona constraints |
| Streaming | SAD decision | UX benefit; implement if architect mandates |

### Market Positioning

- **Primary**: Teams adopting AI-assisted multi-agent development who need auditable MVP scaffolding.
- **Secondary**: Educators, open-source contributors, and framework evaluators.
- **Value proposition**: "From PRD to working multi-agent chat MVP with persona-governed build epics."

### Resource Requirements

| Resource | MVP need |
| :------- | :------- |
| Team | 1 operator + optional 1 developer reviewer |
| Timeline | Phase 2: ~1–2 weeks calendar (module-dependent) |
| Budget | LLM API credits + existing dev machines |
| Skills | Node.js, Python (CrewAI), basic Next.js |

---

## Risk Assessment Matrix

### High Risk

| Risk | Mitigation |
| :--- | :--------- |
| AI-assisted code quality / "acceleration whiplash" | Enforce module validation gates; QA smoke tests; persona scope limits |
| LLM cost overrun during dev | Token limits, small test prompts, env-based model selection |
| Market data report variance | Use ranges in business docs; avoid single-source TAM claims |

### Medium Risk

| Risk | Mitigation |
| :--- | :--------- |
| Runtime topology ambiguity (Python vs API-only) | Resolve in SAD before backend epic |
| Streaming vs blocking API contract drift | Lock contract in SAD; integration tests |
| Incomplete governance for enterprise buyers | Document Audit/Assumptions; map to AEEF-style controls in Phase 3 |

### Low Risk

| Risk | Mitigation |
| :--- | :--------- |
| assistant-ui breaking changes | Pin versions in setup.md |
| CrewAI YAML schema drift | Follow adapter-crewai pinned patterns |
| Local-only MVP limits demos | Document deploy path in Phase 3 backlog |

---

## Actionable Recommendations

### Immediate Next Steps (48 hours)

1. Approve MRD and PRD for Phase 2 handoff.
2. Set `AAMAD_TARGET_RUNTIME=crewai` (or document alternate choice).
3. Invoke @system.arch with `*create-sad --mvp` using PRD + this MRD.
4. Provision LLM API keys and `.env.example` placeholders.

### Short-Term Priorities (30 days)

1. Execute CHECKLIST Phase 2 modules (setup → frontend → backend → integration → QA).
2. Validate end-to-end chat round-trip on clean local setup.
3. Log P1/P2 backlog in qa.md.
4. Optionally customize Specialist agent for domain-specific demo (customer support, research, etc.).

### Long-Term Strategy (6–12 months)

1. Phase 3 Deliver: CI/CD, hosting, access control.
2. Add persistence, auth, and observability (P1/P2 PRD features).
3. Expand runtime adapter validation for `claude-agent-sdk` and `cursor-sdk` reference paths.
4. Publish case studies with measured time-to-MVP vs ad-hoc baselines.
5. Align artifact governance with enterprise standards (AEEF, SOC2-ready paths).

---

## Research Quality Notes

- **Sources cited**: 20 authoritative references (see Sources section).
- **Recency**: Majority from 2025–2026; within 18-month window.
- **Conflicting data**: Market size estimates vary ($1.8B–$7.6B for related segments); analysis uses ranges and cross-report triangulation.
- **Primary research gap**: No user interviews or AAMAD-specific adoption metrics yet—field validation pending post-MVP.

---

## Sources

1. ResearchIntelo — Multi-Agent AI Orchestration Framework Market Report 2034 (2025). https://researchintelo.com/report/multi-agent-ai-orchestration-framework-market
2. MarketIntelo — Multi-Agent AI Orchestration Framework Market Report 2034 (2025). https://marketintelo.com/report/multi-agent-ai-orchestration-framework-market
3. ResearchIntelo — Multi-Agent AI Orchestration Platform Market Report 2034 (2025). https://researchintelo.com/report/multi-agent-ai-orchestration-platform-market
4. MarketIntelo — AI-Powered Multi-Agent Orchestration Market Report 2034 (2026). https://marketintelo.com/report/ai-powered-multi-agent-orchestration-market
5. TIMEWELL Inc. — AI Agent Market analysis (2026). https://timewell.jp/en/columns/ai-agent-technology
6. Faros AI — Enterprise AI Coding Assistant Adoption Guide (2026). https://www.faros.ai/blog/enterprise-ai-coding-assistant-adoption-scaling-guide
7. Exceeds AI — Enterprise AI Coding Adoption Metrics 2025. https://blog.exceeds.ai/enterprise-ai-adoption-metrics-2025/
8. Trustmarque — AI Governance Report 2025 (PDF). https://1787045.fs1.hubspotusercontent-eu1.net/hubfs/1787045/AI%20CoE/AI%20Governance%20report/Trustmarque-AI%20Governance%20Report%202025.pdf
9. AEEF — AI-Accelerated Enterprise Engineering Framework (2026). https://aeef.ai/
10. CrewAI Documentation — Agents (2025–2026). https://docs.crewai.com/en/concepts/agents
11. CrewAI Documentation — Tasks (2025–2026). https://docs.crewai.com/en/concepts/tasks
12. CrewAI Documentation — Crews (2025–2026). https://docs.crewai.com/en/concepts/crews
13. lablab.ai — Developing Intelligent Agents with CrewAI Tutorial (2025). https://lablab.ai/ai-tutorials/developing-intelligent-agents-with-crewai
14. assistant-ui Documentation (2026). https://www.assistant-ui.com/docs
15. assistant-ui — Installation Guide (2026). https://www.assistant-ui.com/docs/installation
16. assistant-ui — GitHub repository. https://github.com/Yonom/assistant-ui
17. npm — @assistant-ui/react package (2026). https://www.npmjs.com/package/@assistant-ui/react
18. AAMAD README.md — Framework overview, runtime adapters, phases
19. AAMAD CHECKLIST.md — Phase 1–2 execution workflow
20. AAMAD PRD.md v0.1.0 — `project-context/1.define/PRD.md`

---

## Assumptions

1. Research reports from ResearchIntelo/MarketIntelo are treated as secondary market evidence; figures are indicative, not audited financial projections.
2. Primary focus remains the **AAMAD Reference MVP** unless the operator supplies a domain-specific concept.
3. Geographic emphasis is global, English-first, with North America as largest reported revenue region.
4. CrewAI and assistant-ui version pins will be resolved at setup time by @project.mgr.
5. No primary user interviews were conducted; personas are synthesized from framework docs and industry adoption studies.

---

## Open Questions

1. Should the Specialist agent be rebranded for a **vertical demo** (support, legal, devops) before Phase 2?
2. Which **LLM provider/model** is the organization standard for MVP (affects cost projections)?
3. Is there a target **beta customer** for qualitative feedback post-QA?
4. Should AAMAD pursue formal **alignment certification** with frameworks like AEEF for enterprise sales?
5. What is the preferred **backend deployment topology** for CrewAI in this project?

---

## Audit

| Timestamp | Persona | Action |
| :-------- | :------ | :----- |
| 2026-06-15T12:00:00Z | @product-mgr | Completed MRD deep research for AAMAD Reference MVP |
| 2026-06-15T12:00:00Z | @product-mgr | Cross-referenced 20 sources; documented market size variance |
| 2026-06-15T12:00:00Z | @product-mgr | Recommended Go for Phase 2; handoff to @system.arch |

**Prompt Trace**: Omitted — research synthesis from public sources and framework documentation; no production runtime execution.

**Tool usage**: Web search, framework file reads, write to `project-context/1.define/MRD.md`.

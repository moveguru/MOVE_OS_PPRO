# Assistant Output 01 — Codex Blueprint Archive

This file preserves the working Codex blueprint discussed before the repo separation correction. It is included here as archive/context only. The demo repo should remain lean; the heavy multi-agent research framework belongs in `moveguru/move_os_codex`.

## Codex Blueprint — MoveGuru / Master Surveyor DoD PCS Platform

Codex is the right tool for this phase if used as a repo-aware build orchestrator, not just a chatbot. The intended use is to inspect the repo, preserve the existing demo, create schema/service stubs, generate build tickets, and avoid speculative integrations.

## 0. Mission

Convert the existing MoveGuru / Master Surveyor prototype from a front-end, transferee-facing AI scanner into an enterprise-ready PCS logistics platform.

The current software already includes:

- React/TypeScript mobile web prototype
- Tactical HUD scanner UI
- Master Surveyor voice/text interrogation persona
- pre-move digital twin manifest
- estimated weight, CWT, and carton count logic
- simulated GSA 500A-2026 tariff logic
- ISWM waste-diversion prompts
- avoided CO2 / cost calculations
- mission dashboard
- local browser state
- future roadmap for QR smart assets, chain-of-custody, Virtual QA, MilMove/DPS/PPA integration, and analytics-platform readiness

Known strategic pivot:

The product must move from “service-member prep app” to a Defense Logistics + Quality Control Engine:

1. Formal pre-move survey record
2. Enterprise ISWM / waste intelligence reporting
3. Auditable custody / evidence layer
4. Operational labor and material validation
5. QA / claims / proof-of-service support
6. Integration-ready data model for MilMove/DPS/PPA/analytics systems

Primary rule:

Do not build generic features. Every feature must map to one of:

- product decision
- schema object
- official workflow
- evidence packet
- export/integration path
- demo requirement
- compliance/security posture

## 1. Intended workspace structure

```text
/moveguru-codex-workspace/
  /repo/
    [current exported codebase here]

  /docs/
    CODEX_BLUEPRINT.md
    PRODUCT_BASELINE.md
    STRATEGIC_BRIEF.md
    RESEARCH_GAPS.md
    DECISION_MATRIX.md
    SOURCE_RULES.md

  /research/
    /official/
    /milmove/
    /dtr/
    /iswm/
    /ppa/
    /moving-industry/
    /security/
    /competitors/

  /schemas/
    canonical-entities.md
    moveguru-schema.v0.json
    survey-record.schema.json
    asset.schema.json
    evidence-object.schema.json
    waste-event.schema.json
    custody-event.schema.json
    qa-event.schema.json
    export-package.schema.json

  /agent-outputs/
    source-verifier.md
    regulatory-analyst.md
    milmove-api-architect.md
    moving-systems-analyst.md
    iswm-analyst.md
    security-architect.md
    product-architect.md
    red-team.md

  /build-plan/
    P0-demo.md
    P1-pilot.md
    P2-enterprise.md
```

## 2. Product baseline

MoveGuru / Master Surveyor is a mobile-optimized React/TypeScript web application for the pre-move survey phase of a DoD PCS move.

Current features:

- Tactical HUD scanner UI
- Browser camera / WebRTC capture
- Master Surveyor AI persona
- voice/text interrogation mode
- item classification
- condition clarification
- estimated weight in pounds
- CWT / hundredweight calculation
- carton / packing estimate
- rank-based allowance dashboard
- ISWM waste-diversion prompts
- avoided CO2 and avoided tariff/cost estimate
- mission dashboard
- local state manifest

Current limitations:

- mostly front-end prototype
- simulated or partially integrated AI engine
- local state only
- no durable backend
- no formal schema
- no evidence store
- no role-based access
- no offline sync
- no official MilMove/DPS/PPA integration
- no validated post-GHC/PPA rate model
- no proof that AI survey is legally or contractually binding
- no confirmed ISWM/QRP credit pathway
- no confirmed Palantir/Advana schema

Required enterprise capabilities:

1. Formal pre-move survey record
2. AI-interrogated digital twin
3. ISWM / Waste Intelligence Layer
4. sticker-binding / QR smart asset architecture
5. evidence object store
6. custody/event ledger
7. Virtual QA dashboard
8. claims evidence packet
9. proof-of-service / payment validation packet
10. MilMove/DPS/PPA export layer
11. analytics-ready canonical data model

## 3. Master Codex Orchestrator Prompt

```text
You are the Codex Orchestrator for the MoveGuru / Master Surveyor DoD PCS platform.

Your job is to inspect the current codebase, create a structured project space, split work into parallel agent/worktree tasks, and refactor the prototype into an enterprise-ready architecture.

Do not immediately rewrite the UI.
Do not invent DoD facts.
Do not hard-code uncertain assumptions.
Do not assume AI survey output is official.
Do not assume QR stickers replace mover stickers.
Do not assume Palantir access.
Do not assume blockchain is required.
Do not treat ISWM as a side feature.

First perform a repo audit.

Then create:
1. CURRENT_CODE_AUDIT.md
2. DECISION_MATRIX.md
3. SCHEMA_GAP_REPORT.md
4. ARCHITECTURE_TARGET.md
5. BUILD_TICKETS.md
6. P0_DEMO_PLAN.md

Every finding must be tagged:
- CONFIRMED_IN_CODE
- CONFIRMED_IN_DOCS
- UNVERIFIED
- ASSUMPTION
- BLOCKER
- BUILDABLE_NOW

Every build recommendation must map to:
- existing file/component
- new module/service/schema
- product reason
- unresolved research dependency
- acceptance criteria
```

## 4. Codex Agent / Worktree Team

Codex should run these as parallel workstreams where supported.

### Agent 1 — Repo Auditor

Inspect current codebase. Identify framework, routing, state management, scanner/HUD components, Master Surveyor persona logic, manifest state, weight/CWT/carton calculations, ISWM calculations, dashboard components, hard-coded sample data, and missing backend/storage/auth/export layers.

Output: `agent-outputs/repo-auditor.md`

### Agent 2 — Schema Architect

Design the canonical MoveGuru data model.

Required entities:

1. Move
2. Shipment
3. ServiceMemberProfile
4. SurveyRecord
5. SurveyQuestion
6. Asset
7. Container
8. MoverStickerBinding
9. EvidenceObject
10. CustodyEvent
11. WorkEvent
12. WasteEvent
13. QAEvent
14. ClaimEvent
15. RateModel
16. ServiceItem
17. ExportPackage
18. AuditLogEntry

Required outputs:

- `schemas/moveguru-schema.v0.json`
- `schemas/survey-record.schema.json`
- `schemas/asset.schema.json`
- `schemas/evidence-object.schema.json`
- `schemas/waste-event.schema.json`
- `schemas/custody-event.schema.json`
- `schemas/qa-event.schema.json`
- `schemas/export-package.schema.json`
- `src/types/moveguru.ts`

Rules:

- Mark uncertain external fields as provisional.
- Do not claim MilMove compatibility unless mapped.
- Include sourceSystemMapping fields for future MilMove/DPS/PPA mapping.
- Include confidence fields where values are AI-estimated.

### Agent 3 — Architecture Refactor Agent

Design and implement modular architecture without breaking the current demo.

Target modules:

- Survey Engine
- Asset Registry
- Evidence Store Adapter
- Weight & Carton Engine
- Rate Engine
- ISWM / Waste Intelligence Engine
- Sticker Binding Service
- Custody Event Ledger
- QA Event Service
- Export Package Builder
- Role-Based Dashboard Layer

Rules: preserve UI, avoid breaking demo, prefer adapter/stub services before full backend.

### Agent 4 — Research Gap Controller

Create research-to-code decision matrix. Every unresolved fact must map to a product decision.

Required decisions:

1. Can AI pre-move survey be official or advisory only?
2. Can TSP/PPA accept third-party survey data?
3. What post-GHC/PPA rate model applies?
4. Can PCS diversion count toward ISWM/QRP?
5. What fields are required for DD Form 619 / 619-1 / QA discrepancies?
6. What MilMove entities map to MoveGuru entities?
7. Can QR labels replace, augment, or bind to mover stickers?
8. What cybersecurity/auth posture applies?
9. What export format should be prioritized?
10. What PPA/SAM.gov opportunity is real and current?

### Agent 5 — Sticker / QR Binding Agent

Do not assume MoveGuru replaces mover stickers.

Design:

1. Advisory Mode — no labels, digital manifest only
2. Binding Mode — OCR/manual binding to existing mover sticker number
3. Companion QR Mode — MoveGuru QR added to high-value or exception assets

### Agent 6 — ISWM / Waste Intelligence Agent

Expand ISWM into compliance-ready Waste Intelligence Layer.

Use fields:

- `metricType: COST_AVOIDANCE | ISWM_REPORTING | QRP_CANDIDATE | SUSTAINABILITY_ESTIMATE`
- `confidence: LOW | MEDIUM | HIGH`
- `proofType: RECEIPT | PHOTO | WEIGHT_TICKET | DONATION_RECORD | USER_ATTESTATION | NONE`

### Agent 7 — Evidence / QA Packet Agent

Design evidence and Virtual QA packet model: condition photos, videos, timestamps, GPS/location metadata, actor identity, asset/sticker link, hash, chain-of-custody event, QA escalation, service member statement, TSP response, exportable packet.

Language rule: evidence packet / audit-ready / QA review support. Do not claim legal admissibility.

### Agent 8 — MilMove / Export Adapter Agent

Prepare export builders: survey JSON, manifest CSV, evidence ZIP metadata, PDF survey summary, waste report, QA exception packet, proof-of-service support packet.

External calls must be stubbed.

### Agent 9 — Security / Auth Architecture Agent

Define security posture for PII/CUI risk, personal device use, role-based access, offline capture, encrypted media, audit logs, identity providers, export redaction, hash-only evidence.

Modes:

1. Demo Mode
2. Pilot Mode
3. Gov-Ready Mode

### Agent 10 — Red Team Agent

Attack assumptions from PPA, PPSO/PPPO, TO, QA inspector, TSP, mover/packer, warehouse, service member, cybersecurity reviewer, and procurement officer.

Output format:

`| Objection | Who raises it | Why it matters | Required mitigation | Build impact | Research needed |`

## 5. Required Decision Matrix

| Product Decision | Unknown | Why It Matters | If True | If False | Module Affected | Schema Affected | Priority |
|---|---|---|---|---|---|---|---|
| AI survey as official record | Can PPA/TSP accept third-party AI survey? | Controls claim language and workflow | Add signature/certification workflow | Position as advisory pre-validation | Survey Engine | SurveyRecord | P0 |
| Sticker strategy | Will packers scan MoveGuru QR? | Controls field adoption | Build QR workflow | Build OCR/manual sticker binding | Sticker Binding | MoverStickerBinding | P0 |
| Rate engine | What post-GHC model applies? | Controls CWT/tariff accuracy | Build current PPA rate adapter | Keep estimator as planning-only | Rate Engine | RateModel | P0 |
| ISWM credit | Can PCS diversion count toward installation/QRP? | Controls compliance positioning | Build ISWM report | Build cost-avoidance report | Waste Intelligence | WasteEvent | P0 |
| QA evidence | Can virtual QA evidence support formal review? | Controls escalation workflow | Build QA packet | Build advisory evidence packet | QA Service | QAEvent/EvidenceObject | P1 |
| MilMove/DPS mapping | What objects/fields map? | Controls integration adapter | Build adapter | Build generic export package | Export Layer | ExportPackage | P1 |
| Security posture | Is app handling CUI/PII? | Controls deployment | Gov-ready auth/storage | Demo/pilot only | Security | AuditLog/UserRole | P0 |

## 6. Canonical TypeScript baseline

```ts
export type ConfidenceLevel = "LOW" | "MEDIUM" | "HIGH";
export type SourceStatus = "USER_ENTERED" | "AI_ESTIMATED" | "TSP_VERIFIED" | "QA_VERIFIED" | "SYSTEM_IMPORTED";
export type VerificationStatus = "DRAFT" | "ADVISORY" | "SUBMITTED" | "ACCEPTED" | "REJECTED" | "DISPUTED";

export type UserRole =
  | "SERVICE_MEMBER"
  | "TO"
  | "QA_INSPECTOR"
  | "TSP_DISPATCHER"
  | "PACKER"
  | "DRIVER"
  | "WAREHOUSE"
  | "PPA_ADMIN"
  | "SYSTEM";

export interface ActorRef {
  actorId?: string;
  role: UserRole;
  organization?: string;
}
```

Codex should extend this into Move, Shipment, SurveyRecord, Asset, Container, StickerBinding, EvidenceObject, CustodyEvent, WorkEvent, WasteEvent, QAEvent, ClaimEvent, RateModel, ServiceItem, ExportPackage, and AuditLogEntry.

## P0 Build Rule

First make Codex produce:

1. audit
2. schema
3. service stubs
4. export packets
5. build tickets

Do not allow Codex to jump straight into UI redesign or speculative integrations.

# MoveOS PPRO — Personal Property Readiness Operations

## Purpose

This folder captures the MoveOS PPRO architecture, source-control plan, and PPA/DoD opportunity alignment without overwriting the existing AI Studio application source at the repository root.

PPRO means **Personal Property Readiness Operations**.

MoveOS PPRO is an estimate-aware, agentic visual survey validation and readiness operations layer for household goods movement. It is designed to help service members, homeowners, transportation officers, QA inspectors, claims stakeholders, installation readiness teams, and future PPA oversight systems work from a shared structured record.

## Product Boundary

MoveOS PPRO is not a mover, broker, prime contractor, official estimator, claims adjudicator, or contract manager.

MoveOS PPRO can calculate advisory weight, cube, CWT, tariff, waste, readiness, and capacity signals, but those values must carry validation status, authority status, source assumptions, confidence, human-validation state, and authorized-review state.

## Operating Thesis

AI observes. Humans validate. Stakeholders review. The system records, routes, escalates, and exports.

## Immediate Build Chain

```text
Live HUD
→ visual observation
→ human validation
→ advisory impact
→ waste/readiness recommendation
→ QC / escalation capture
→ claims-ready evidence
→ export package
→ stakeholder dashboard
```

## Why This Folder Exists

The current repository already contains the runnable AI Studio app at the root. This `project-control/ppro/` folder is the structured control layer for converting that prototype into a disciplined PPA/DoD-ready architecture.

## Next Integration Rule

Do not replace working app files until the source map is complete. First add types, validation states, authority states, export package builders, and dashboard modules around the existing scanner/HUD flow.
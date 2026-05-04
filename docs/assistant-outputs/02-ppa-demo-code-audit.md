# Assistant Output 02 — PPA Demo / Code Audit / Codex Capabilities

## Bottom line

The uploaded `move-os-v3.0.zip` and Drive `move-os-v3.0` folder represent the thin-client demo software. The app is a Vite + React + TypeScript prototype with Gemini Live hook, tactical HUD, localStorage manifest, current `InventoryItem` model, hard-coded tariff/waste logic, and no enterprise backend/schema/export layer yet.

## PPA Industry Day / demo opportunity

The official notice provided by the user establishes a concrete PPA Industry Day opportunity.

Key requirements:

- PPA is hosting a focused Industry Day regarding IT software solutions for military household goods moves.
- Software solutions include full platforms or capabilities capable of integrating with a government-owned system.
- Specific interest areas:
  - In Transit Visibility
  - counseling services
  - claims processing and adjudication
  - mobile applications
- Written submissions: maximum 10 pages, 11-point font.
- Demonstrations: may be requested in the registration submission.
- Registration window: April 24, 2026 through May 8, 2026.
- Government will share time/date/schedule and demonstration limits after registration closes.
- Notice is not an RFP and does not promise a future RFP.

## MoveGuru positioning

Do not position the product as “a moving app.” Position it as:

> AI-guided pre-move survey, waste intelligence, and digital evidence platform for PPA personal property modernization.

## Demo request angle

```text
MoveGuru / Master Surveyor is a working prototype for AI-guided pre-move survey, digital manifest generation, waste-diversion reporting, and evidence packet creation for military household goods moves.

We request the opportunity to demonstrate how the current prototype captures household goods via a mobile HUD scanner, uses an AI surveyor to validate item details, estimates weight/CWT/carton requirements, flags ISWM diversion opportunities, and generates structured move records that can support PPA modernization, QA review, TSP planning, and future system integration.
```

## What the demo should show

| Demo module | Why PPA may care |
|---|---|
| AI HUD scanner | mobile field capture |
| Master Surveyor interrogation | better survey accuracy |
| weight / CWT / carton estimate | planning and capacity validation |
| ISWM diversion report | waste reduction + cost avoidance |
| digital manifest export | system integration path |
| sticker-binding concept | works with existing mover labels |
| evidence packet | QA / claims support |
| export package | avoids “cool app, no system value” problem |

## Code audit summary

| Area | Current state |
|---|---|
| Framework | Vite + React + TypeScript |
| AI | `@google/genai`, Gemini Live hook |
| Main state | `App.tsx` local React state + localStorage |
| Core type | `InventoryItem` |
| Scanner flow | camera via WebRTC |
| AI persona | `useGeminiLive.ts` system instruction + function tools |
| Item logging | Gemini function call → `InventoryItem` |
| Waste/tariff | two separate services with hard-coded estimates |
| Dashboard | shows inventory, carbon saved, tariff credits |
| Backend | none |
| Enterprise schema | none |
| Export package | none |
| Sticker/QR binding | none |
| Evidence store | none |
| QA packet | none |

## Key code gaps Codex should address first

1. Duplicate/inconsistent savings logic between `TariffLogic.ts` and `wasteDiversionLogic.ts`.
2. Narrow `InventoryItem` type.
3. No source/confidence tagging.
4. No export layer.
5. No separation between compliance and estimate.

## Correct Codex use

Use Codex as a repo-aware build orchestrator. Do not treat it as just another chat agent. Codex should start with audit-only, then schema/service stubs, then export packages, then demo polish.

## Repo separation rule

The heavy research control package belongs in `moveguru/move_os_codex`.

The demo app implementation belongs in `moveguru/MOVE_OS_PPRO`.

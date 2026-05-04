# Assistant Output 04 — Drive Correction / Demo Repo Separation

## Correction

The earlier Codex folder reference was incomplete because Google Drive source folders were not checked first.

## Found on Google Drive

### MoveOS

Folder: `MoveOS`

Relevant files include:

- `Move Guru Military Rfi.pdf`
- `Improving Oversight and Efficiency in DOD Relocations_ GAO Findings vs. MoveGuru.AI Solutions.docx`
- `GAO-25-107771 Highlights...pdf`
- `MEMORANDUM-DIRECTING-IMMEDIATE-MODIFICATIONS-TO-THE-PERSONAL-PROPERTY-PROGRAM.pdf`
- PCS / GAO / DoD relocation PDFs

### MOVEGURU.ai

Folder: `MOVEGURU.ai`

Relevant files include:

- `MoveGuru.AI as a Playbook-as-a-Service Platform - Architecture Rollout Plan.docx`
- `HHG Survey Forms.pdf`
- `Peter Wayne Heldreth - Your Moveguru Pitch.pptx`
- project/resume/business docs

## Actual thin-client source folder

The real app source is in Google Drive:

```text
MoveOS / move-os-v3.0
```

It contains:

```text
App.tsx
types.ts
package.json
package-lock.json
vite.config.ts
tsconfig.json
index.html
index.tsx
index.css
.env.local
metadata.json
components/
hooks/
services/
src/
migrated_prompt_history/
```

## Correct repo separation

### Repo 1 — planning/control only

```text
moveguru/move_os_codex
```

Purpose:

- Codex instructions
- research agents
- decision matrix
- schema strategy
- PPA research
- build tickets

Do not use this as the working app repo.

### Repo 2 — demo app working repo

```text
moveguru/MOVE_OS_PPRO
```

Purpose:

- thin-client code from Drive `move-os-v3.0`
- PPA demo build
- no heavy research agent context
- minimal build plan
- demo-focused README
- environment setup
- deployed preview path

## Demo repo should not include

Do not include all the Codex research-agent material in the demo repo. It will bloat the working directory and confuse the build.

The demo repo should only say:

```text
This app is the MoveGuru / Master Surveyor PPA demo thin client.

Research/control context lives in:
moveguru/move_os_codex

This repo’s job:
- run the app
- preserve the current HUD scanner demo
- add export/demo functionality
- prepare a PPA demo walkthrough
```

## Clean demo repo prompt

```text
You are working in the MoveGuru / Master Surveyor demo app repo.

This repo is NOT the research-control repo.

Do not import the full Codex research-agent framework here.
Do not rewrite the app.
Do not overbuild backend architecture.
Do not add speculative integrations.

Your job:
1. Confirm the Vite/React/TypeScript app runs.
2. Preserve the tactical HUD scanner demo.
3. Identify current app files and flow.
4. Add minimal demo-readiness docs.
5. Add a lightweight export/demo layer only if safe.
```

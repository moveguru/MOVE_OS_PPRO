# MOVE_OS_PPRO Repository Control Package

This folder is the working handoff package for the `moveguru/MOVE_OS_PPRO` demo repository.

## Purpose

This repo is the **thin-client demo working repo**, not the heavy Codex/research-control repo.

Use it to:

- preserve and run the AI Studio / Vite / React / TypeScript app;
- prepare the PPA Industry Day demo;
- add demo-safe exports and documentation;
- keep PPA-facing claims bounded and evidence-aware;
- avoid polluting the app with heavy research-agent scaffolding.

## Repo separation

| Repo / Folder | Purpose |
|---|---|
| `moveguru/MOVE_OS_PPRO` | Working demo app repo |
| `moveguru/move_os_codex` | Heavy Codex planning / multi-agent research / schema-control repo |
| Google Drive `MoveOS / move-os-v3.0` | Source-of-truth thin-client app export |
| Google Drive `MoveOS` | DoD/PPA/GAO/RFI source context |
| Google Drive `MOVEGURU.ai` | Company/product architecture and older strategic materials |

## Rule

Do not import the full Codex research-agent framework into this demo repo. Only bring over research that has become a specific demo requirement, source note, or build ticket.

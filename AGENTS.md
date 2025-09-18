# AGENTS.md

This document is the operating contract for AI agents and contributors working in this repository. It encodes *what to change*, *how to change it*, and *what to never do*. Follow it strictly.

## Mission

Deliver precise, minimal changes to the Portal and its subpackages using **Bun** and **latest TypeScript**. Prefer clarity through code. Avoid ceremony.

## Repository Map

* `packages/metaport/` — core bridge logic.
* `packages/core/` — lower-level reusable functions.
* `config/[NETWORK_NAME]/` — Metaport configuration folders (e.g., `config/mainnet`, `config/testnet`).

## Tooling & Runtime

* **Package manager:** `bun` (always).
* **Language:** TypeScript (**latest standard**).
* **Formatting:** obey `.prettierrc`.
* **Logs:** never ship console logs in production code.

## Required Commands

### Initial Setup

```bash
bun i
bun build:mainnet
```

### Development (Portal)

```bash
bun run build:dev
bun dev
```

> Always invoke scripts via **bun** (e.g., `bun run <script>`).

## Change Policy (Do / Do Not)

### Do

* Keep changes **minimal and purposeful**.
* Fix **the exact problem** or implement **the exact feature**—nothing extra.
* Keep code **simple**; prefer straightforward logic.
* **Deduplicate**: move repeated logic into helper functions in appropriate modules.
* Maintain repo-wide conventions from existing files.
* For any **new file**, add the **license header** in the *same format* used across the codebase.

### Do Not

* Do **not** add scripts or harnesses to test your changes.
* Do **not** write long descriptions after changes—focus on writing code.
* Do **not** generate any extra documentation; the code should be self-explanatory.
* Do **not** add in-line comments.
* Do **not** leave commented-out code.
* Do **not** include `console.log` or other ad‑hoc logging in production paths.
* Do **not** leave unused imports or dead code.
* Do **not** duplicate logic - extract helpers instead.

## TypeScript Guidance

* Target the **latest TS** features supported by the toolchain.
* Leverage strict typing; prefer explicit, minimal public surfaces.
* Avoid defensive coding; handle only the cases required by the feature/bugfix scope.
* Keep modules small and composable. Prefer function purity where feasible.

## Metaport Configuration

* All Metaport configs live in `config/[NETWORK_NAME]/`.
* If a change affects configuration, adjust only the relevant network folder(s). Avoid cross-network edits unless strictly necessary.

## Definition of Done (Checklist)

* Implemented only the scoped fix/feature.
* No commented-out code; no console logs in production code.
* No unused imports; no dead code.
* Repeated logic extracted to helpers.
* New files include the correct license header (match existing files exactly).
* Code formatted per `.prettierrc` and builds cleanly with Bun.
* Type checking passes using the project’s TS config.
* Metaport configs updated only where required (if applicable).

## Commit Hygiene

* Use a short, imperative commit title focused on the change scope.
* Keep commit content narrowly scoped. No multi-feature commits.

## Operating Notes for AI Agents

* Prefer edits that modify the **fewest** lines/files to achieve the goal.
* Respect existing boundaries between `packages/core` and `packages/metaport`.
* If logic is shared by multiple areas, introduce or extend a **helper** in the most appropriate location rather than duplicating code.
* When unsure where to place a helper, default to `packages/core` for low-level primitives; `packages/metaport` for bridge-specific orchestration.
* Never create additional documentation or test scaffolding unless explicitly requested in the task.

***

**You are done when the feature/fix is in place, the build runs with Bun, type checks pass, formatting matches `.prettierrc`, and the codebase remains lean and duplication-free.**

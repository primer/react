---
name: modular-ds-testing
description: 'Use when: writing tests for, or validating, any Primer React component built on the spectrum of abstraction model — including new components, new base components or compound hooks, and changes to existing ones. Covers what to test at each API type, testing tools and conventions, and the validation command sequence to run before reporting a change complete.'
---

# Modular DS — Testing and Validation

## What to test at each API type

- **Utilities / compound hook** — unit test the hook in isolation: ARIA attribute generation, focus management, keyboard interaction, lifecycle (open/close/reopen), and dev-mode warnings (see `modular-ds-utilities` and `modular-ds-accessibility-contract`).
- **Base components** — test that they render the correct structure, wire ARIA via context correctly, and enforce any structural constraints (e.g. a title must be a descendant of a dialog).
- **Presentational components** — test compound component rendering, context wiring between sub-components, and `data-component` selectors.
- **Config components** — test that props correctly compose into the presentational parts' children and that the public API surface behaves as documented.

Only test the API types the component actually ships. A component with no config API has nothing to test at that level, and adding one so the tests look symmetrical is the failure this model exists to avoid.

## Tools and conventions

- Use Vitest and `@testing-library/react`. Follow existing test patterns in the repo rather than introducing new testing conventions.
- Prefer testing through the accessible API (roles, labels, keyboard interaction) over implementation details like class names or internal state.
- When an accessibility pattern includes optional semantic tradeoffs, cover both the chosen default and the opt-in behavior — in tests, stories, or docs metadata — so the tradeoff is visible rather than implicit.
- Changing the public export surface means updating any matching export snapshots or tests in the same change.
- Check whether stories already exercise the accessibility-relevant states (open/closed, selected/unselected, error states) — these are often a faster path to a good test than writing scenarios from scratch.

## Changing an existing component

Reshaping an existing component to fit this model is a non-breaking refactor by default, so existing tests should pass unmodified — a test that has to change is a signal the public API moved, not a test that needs updating.

Behavior that was previously implicit, untested, or only verified manually is exactly what regresses silently during a refactor. Where practical, pin the current accessible behavior (roles, states, focus management, keyboard interaction) in a test before changing the code that implements it, even if that behavior isn't fully correct yet, then correct and extend from there.

## Validation order

Run validation in this order and fix any failures before reporting completion:

1. `npx prettier --write <changed-files>`
2. `npx eslint --fix <changed-files>`
3. `npx stylelint -q --rd --fix <changed-css-files>`
4. `npm run test:type-check` (plain `tsc --noEmit`; the bare `type-check` script also runs `turbo run type-check` across sibling workspaces)
5. `npm test -- --run --reporter=verbose <test-files>` — `--run` matters: the `test` script is plain `vitest`, which watches rather than exits when run in an interactive terminal.

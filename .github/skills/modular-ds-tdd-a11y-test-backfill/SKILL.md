---
name: modular-ds-tdd-a11y-test-backfill
description: 'Use when: adding or backfilling automated accessibility tests for a Primer React component, especially while decomposing an existing component or extracting a base component or compound hook. Covers a test-first strategy for ARIA behavior, what to test at each API type in the spectrum model, and which tools and patterns to use.'
---

# Modular DS — TDD & Accessibility Test Backfill

Decomposing a component (see `modular-ds-decompose-existing-component`) or extracting a new base component often surfaces accessibility behavior that was previously implicit, untested, or only verified manually. Treat test backfill as part of the work, not an afterthought — write or update tests before or alongside the refactor so behavior changes are caught immediately, not discovered later in review.

## Test-first strategy

Where practical, write the test for a piece of behavior before extracting or changing the code that implements it:

1. **Capture current behavior first.** Before refactoring an existing component, write tests that pin down its current accessible behavior (roles, states, focus management, keyboard interaction) even if that behavior isn't fully correct yet. This gives you a safety net for the refactor itself.
2. **Then correct and extend.** Once the refactor is underway, update or add tests for the corrected/extended behavior, using the accessibility responsibility matrix (`modular-ds-accessibility-contract`) to identify what should be tested at each API type.
3. **Don't skip tests because "it worked before."** A monolithic component's implicit accessibility behavior is exactly the kind of thing that regresses silently during decomposition — this is the highest-value place to add coverage.

## What to test at each API type

- **Utilities / compound hook** — unit test the hook in isolation: ARIA attribute generation, focus management, keyboard interaction, lifecycle (open/close/reopen), and dev-mode warnings (see `modular-ds-utilities` and `modular-ds-accessibility-contract`).
- **Base components** — test that they render the correct structure, wire ARIA via context correctly, and enforce any structural constraints (e.g. a title must be a descendant of a dialog).
- **Presentational components** — test compound component rendering, context wiring between sub-components, and `data-component` selectors.
- **Config components** — test that props correctly compose into the presentational parts' children and that the public API surface behaves as documented.

## Tools and conventions

- Use Vitest and `@testing-library/react`. Follow existing test patterns in the repo rather than introducing new testing conventions.
- Prefer testing through the accessible API (roles, labels, keyboard interaction) over implementation details like class names or internal state.
- When backfilling tests for an existing component, check whether stories already exercise the accessibility-relevant states (open/closed, selected/unselected, error states) — these are often a faster path to a good test than writing scenarios from scratch.

## Validation order

Run validation in this order and fix any failures before reporting completion:

1. `npx prettier --write <changed-files>`
2. `npx eslint --fix <changed-files>`
3. `npx stylelint -q --rd --fix <changed-css-files>`
4. `npm run type-check`
5. `npm test -- --reporter=verbose <test-files>`

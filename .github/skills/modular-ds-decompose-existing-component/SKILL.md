---
name: modular-ds-decompose-existing-component
description: 'Use when: breaking an existing monolithic Primer React component down into the spectrum of abstraction model (config, presentational, base, utility) without changing its public API. Covers auditing existing behavior and ARIA patterns, extracting base components and utilities, refactoring presentational parts, and validating backwards compatibility.'
---

# Modular DS — Decomposing an Existing Component

This skill is for taking an existing, monolithic Primer component and restructuring its internals across the spectrum of abstraction model, while keeping its public API stable. This is a non-breaking refactor unless explicitly scoped otherwise.

Read `modular-ds-spectrum-model` first if you haven't already — the steps below assume familiarity with config, presentational, base, and utility components.

## Step 0: Audit the existing component

Read the existing component and identify:

- What behaviors does it contain? → candidate for a compound behavior hook and/or generic utilities (see `modular-ds-utilities`)
- What accessibility/ARIA patterns does it implement? → candidate for the compound hook and a base component
- What styled sub-components exist? → candidate presentational parts, which should end up wrapping a base component
- What is the current public API surface? → this must be preserved as the config-level (or existing) entry point

## Step 1: Extract utilities and the compound hook

Pull the component's behavior and ARIA logic into a compound behavior hook (`use<Component>`) that returns prop-getters. Pull out any generic, component-agnostic behaviors (e.g. scroll locking, focus trapping, filtering, selection state) as **utilities** in `packages/react/src/hooks/` — check for existing ones first, don't duplicate — and compose them inside the compound hook rather than leaving them entangled with component-specific logic.

## Step 2: Build the base component

Create the unstyled component(s) that wrap the compound hook, wiring ARIA via context. Not every existing sub-part needs its own base component — see `modular-ds-base-components` for how to decide which do.

## Step 3: Refactor the presentational parts

Rewrite the existing styled sub-components to use the base component instead of implementing behavior directly. This is usually where most of the surgical work happens — the presentational parts should become a thin, styled wrapper over the base component rather than owning ARIA or lifecycle logic themselves.

## Step 4: Preserve or create the config-level API

If the existing component already has a props-based API, preserve it as a config component that now composes the presentational parts internally. The public API should remain identical — consumers should not need to change any code as a result of this refactor.

## Step 5: Validate backwards compatibility

- Existing tests should still pass — the public API hasn't changed.
- Existing stories should still render correctly.
- Follow the standard validation and test-backfill steps in `modular-ds-tdd-a11y-test-backfill`, paying particular attention to accessibility behavior that was previously implicit or untested.

## Open decisions to surface

When decomposing an existing component, explicitly surface these to the user rather than assuming an answer:

1. **Naming across API types.** A component may surface at several API types (a hook, a base component, presentational parts, a config wrapper). Whether these share one name imported from different entry points, or take distinct names, may not be decided yet for this component — surface it, don't assume.
2. **Entry point strategy.** Check whether the repo's current convention is separate entry points (e.g. `/foundations`, `/hooks`) or an `unstable_` prefix on a single entry point, and follow whichever the component's area already uses.
3. **`data-component` at the presentational level.** Keep `data-component` attributes during the refactor unless explicitly told otherwise — they serve stable identity across refactors, a different concern from styling via `className`.

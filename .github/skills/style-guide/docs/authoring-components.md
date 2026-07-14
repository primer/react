# Authoring components

Use these guidelines when authoring components.

<!-- prettier-ignore-start -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Overview](#overview)
- [Guidelines](#guidelines)
  - [Prefer building components across a spectrum of abstraction](#prefer-building-components-across-a-spectrum-of-abstraction)
    - [Config components](#config-components)
    - [Presentational components](#presentational-components)
    - [Base components](#base-components)
    - [Utilities](#utilities)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
<!-- prettier-ignore-end -->

## Overview

React components are authored in `packages/react`. When adding a component, you
will add the following files:

- `packages/react/src/<ComponentName>/index.ts`
- `packages/react/src/<ComponentName>/<ComponentName>.tsx`
- `packages/react/src/<ComponentName>/<ComponentName>.module.css`
- `packages/react/src/<ComponentName>/<ComponentName>.test.tsx`
- `packages/react/src/<ComponentName>/<ComponentName>.stories.tsx`
- `packages/react/src/<ComponentName>/<ComponentName>.features.stories.tsx`
- `packages/react/src/<ComponentName>/<ComponentName>.docs.json`

## Guidelines

### Prefer building components across a spectrum of abstraction

When authoring Primer components, prefer starting with flexible presentational
components and companion behavior hooks. As opinions or defaults become
established, create config components that compose those presentational
components and hooks instead of duplicating their behavior. This keeps common
patterns easy to adopt while still giving consumers a clear path when they need
to customize appearance, content, semantics, or behavior.

Use the following API types when designing component APIs:

| API type                  | Use for                                                                             |
| ------------------------- | ----------------------------------------------------------------------------------- |
| Config components         | Ready-made, props-based components for stable product patterns and common use-cases |
| Presentational components | Styled pieces that consumers compose directly, often with companion behavior hooks  |
| Base components           | Unstyled primitives, often for accessibility structure or low-level behavior        |
| Utilities                 | Hooks, state management, behaviors, and functions used to build components          |

#### Config components

Config components are "all-in-one" APIs that let consumers describe intent
through props or data rather than composing markup directly. They should provide
opinionated defaults for structure, behavior, accessibility, styling, and
interactions so teams can implement established patterns quickly and correctly.

Use config components when Primer understands the pattern well and expects many
teams to reuse it. Keep the supported customization surface explicit through
props, slots, render props, or configuration. Do not make config components
support every variation; if consumers need to change structure, semantics, or
behavior beyond the config API, they should be able to drop down to
presentational components and behavior hooks.

#### Presentational components

Presentational components are styled pieces that consumers compose directly.
They should let consumers control layout, ordering, conditional rendering, and
content while Primer still owns the styling, accessibility expectations, data
attributes, and component contracts for each piece.

Prefer presentational components and behavior hooks for emerging patterns or
flexible APIs where a single high-level config API has not stabilized. Build
config components over time by composing those components and hooks after common
use-cases and defaults become clear.

Do not add slots by default. Prefer normal React composition first, and only
introduce slots when a parent component must identify a specific child part or
the requested API explicitly needs child extraction. Do not reorder
consumer-authored children in flexible presentational components just to enforce
a preferred structure; document the recommended structure or add a dev warning
instead.

#### Base components

Base components are unstyled primitives used to build higher-level components.
Use them for accessibility primitives and low-level behaviors that need full
markup and style control. Accessibility primitives for established patterns,
such as ARIA Authoring Practices Guide patterns, should be consolidated and
reused rather than reimplemented across components. Before adding custom
behavior to a component, look for an existing base component, hook, utility, or
behavior that can provide the foundation.

Prefer existing base primitives over recreating native elements and their reset
styles. For example, use shared button primitives such as `ButtonBase` when a
new component needs Primer-owned button semantics, interaction behavior, and
reset styling instead of hand-rolling a button with custom reset CSS.

#### Utilities

Utilities include hooks, functions, behaviors, and other reusable logic. Provide
utilities for established patterns so teams can build accessible experiences on
solid foundations. Examples include hooks such as `useMergedRefs`,
`useOnEscapePress`, and `useTimeout`, or lower-level packages such as
`@primer/behaviors`.

### Server-side rendering

All components should be able to be rendered on the server. This means that the
component must not access any JavaScript APIs that are only available in a
browser.

In addition, authors should consider how components will be hydrated as a result
of being server-side rendered. In particular, components should not cause layout
shifts as a result of being hydrated. Instead components should progressively
enhance as JavaScript is loaded on the page.

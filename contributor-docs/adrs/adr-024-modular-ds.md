# Modular Design System

📆 Date: 2026-05-17

## Status

| Stage          | State       |
| -------------- | ----------- |
| Status         | Proposed ⚠️ |
| Implementation | Pending ⚠️  |

## Context

There is a proposal for enabling better pattern creation via modular building
blocks in: https://github.com/github/core-ux/issues/2238. In this proposal, it
details several layers that Primer could be structured into:

- Layer 3: Ready-made, props-based components that are ready to use
- Layer 2: Parts, presentiontational-style components that one combines with hooks to
  create components
- Layer 1: Foundations, unstyled primitives to allow for full markup and style
  control
- Layer 0: Hooks, state management, and other logic that can be used to build components

We took this proposal into a Modular design System Workshop:
https://github.com/github/primer/discussions/6703. In this workshop, we
identified several scenarios that team run into challenges when building with
Primer:

- It can be difficult to extend or add new functionality to a component
- It can be difficult to customize the appearance, content, or semantics of a
  component
- It can be difficult to build new experiences using established patterns (like accessibility primitives)

These challenges lead to custom implementations, forks, or overrides of Primer
components that reuslt in adoption challenges and ecosystem fragmentation.

As a result, we applied the layer model to several situations in a
[FigJam](https://www.figma.com/board/mgApQG7vL3imdUIhgyhG2n/Modular-DS-Workshop?node-id=84-152&t=dBKm8jx1UsKRXyzu-1). From this work, we pulled out insights about this model that we want to adopt in Primer today.

## Decision

From the Modular Design System workshop, we identified several key areas that we
want to focus on in order to improve Primer:

- Embrace layer 2 from the layer model, offering parts for our components that
  can be combined with hooks for improved flexibility
- Provide low-level components and hooks to make it easier to build
  quality, accessible experience
- Create a model for upstreaming work where people build on top of Primer

### Embracing layer 2

### Low-level components and hooks

### Model for upstreaming work

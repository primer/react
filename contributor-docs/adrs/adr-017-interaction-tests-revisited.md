# Interaction testing (revisited)

## Status

| Stage    | Status |
| -------- | ------ |
| Approved | 🚧     |
| Adopted  | 🚧     |

## Context

> **Note**
> This ADR supercedes [`ADR 009`](./adr-009-interaction-tests.md)

We author tests using a combination of Jest and Playwright. Typically, Jest is
used for unit and integration tests and Playwright is used for Visual Regression
Tests against our Storybook.

In `ADR 009`, we proposed using Storybook's [`play`
functions](https://storybook.js.org/docs/react/writing-stories/play-function) as
the recommended way to author tests that require tests based on user
interactions. In this ADR, we would like to revisit this decision.

## Decision

For tests involving interaction, use Playwright to visit a storybook story and
interact with the component directly. This will allow for easy integration with
Visual Regression Testing and our automated accessibility testing (through axe).
In order to perform interactions, use [actions from
Playwright](https://playwright.dev/docs/input).

### Impact

The impact of this decision is minimal as we only have one example of
interaction stories, `UnderlineNav.interactions.stories.tsx`, and it has
corresponding tests in Playwright.

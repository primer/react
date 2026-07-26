# Alignment

## From: `@primer/react`

The authoritative legacy mapping is the experimental `IssueLabel` export. It supports `variant`, `fillColor`, polymorphic `as`, and inferred anchor/button/span usage, with color variants and custom fill colors. The experimental implementation uses overloads to type interactive links and buttons and supplies legacy CSS-module styling.

## To: `@primer/react-tailwind`

Tailwind promotes `IssueLabel` as a stable component with the same core variant, fill-color, and polymorphic APIs. It uses Tailwind utilities and Primer tokens, and adds explicit interactive state styling for links and buttons. The current implementation defaults to an anchor when `href` is present and otherwise a span; `onClick` alone does not infer a button, so actions should specify `as="button"`. The component is otherwise presentational and does not use Base UI.

## Migration notes

- Import the stable Tailwind `IssueLabel` instead of the experimental legacy entry point.
- Add `as="button"` for click actions without `href`.
- Remove `sx`, styled-system props, and CSS-module selectors.

# LabelGroup

`LabelGroup` lays out a collection of `Label` items and collapses overflow behind a toggle when they exceed the available width.

Import: `import {LabelGroup} from '@primer/react-tailwind/LabelGroup'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Usage

```tsx
import {LabelGroup} from '@primer/react-tailwind/LabelGroup'
;<LabelGroup aria-label="Labels">…</LabelGroup>
```

## API notes

`ul` and `ol` roots receive list-item wrappers. With `overflowStyle="overlay"`, the toggle opens hidden children in an anchored dialog; `inline` reveals them in the group and provides a Show less control.

## Composition

Place `Label`, `Token`, or other label-like children directly in the group. The component preserves their order, creates semantic list items for list roots, and composes existing `Button`, `IconButton`, and `AnchoredOverlay` primitives for its overflow controls.

## Accessibility

Give a meaningful group an accessible label, particularly when it summarizes filters or metadata. Auto truncation progressively enhances after hydration through `ResizeObserver`; untruncated children remain available without JavaScript. Inline expansion moves focus to the first revealed focusable child (or Show less), and returns focus to the disclosure on collapse. Overlay expansion uses a modal dialog named “All N labels” and restores focus through Base UI on dismissal.

## Tailwind extension

Pass `className` to extend the component with Tailwind utilities. The root exposes stable `data-component="LabelGroup"`, `data-list`, and `data-overflow="inline"` attributes. Truncated item wrappers expose `data-index` and hidden wrappers expose `data-hidden`.

Renders an [`<ul>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `as`: `React.ElementType` — Default `'ul'`. Customize the element type of the rendered container.
- `overflowStyle`: `"inline" | "overlay"` — Default `'overlay'`. How hidden children are shown.
- `visibleChildCount`: `number | "auto"` — How many children to show. `'auto'` truncates children to fit the available width.

## Differences from `@primer/react`

- `visibleChildCount="auto"` uses `ResizeObserver` rather than the legacy `IntersectionObserver`. This produces deterministic counts on resize and avoids relying on clipping intersection behavior.
- The overlay uses the modern anchored dialog primitive, so positioning and focus restoration are supplied by Base UI rather than legacy `AnchoredOverlay` APIs.
- The default root is `ul`, matching upstream. Use `as` for non-list roots.
- Interactive-token fixture pixels are owned by the shared `Token` implementation; the remaining 3.16% visual-matrix difference is localized to that component’s current token styling rather than LabelGroup geometry or overflow behavior.
- `sx` and styled-system props are unsupported; use `className`.

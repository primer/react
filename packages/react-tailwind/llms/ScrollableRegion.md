# ScrollableRegion

`ScrollableRegion` owns horizontal or vertical overflow and becomes a labelled, focusable region when its content overflows.

Import: `import {ScrollableRegion} from '@primer/react-tailwind/ScrollableRegion'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Import and usage

```tsx
import {ScrollableRegion} from '@primer/react-tailwind/ScrollableRegion'
;<ScrollableRegion aria-label="Generated command">
  <code>git checkout feature/long-branch-name</code>
</ScrollableRegion>
```

Always provide exactly one of `aria-label` or `aria-labelledby`. When overflow is present, the root has `role="region"` and `tabIndex={0}`, so keyboard users can focus it and use the browser's native scrolling keys. The label and region semantics are omitted when there is no overflow, unless the region is focused; in that case they remain until focus leaves.

## API notes

One of the two accessible-name props is required, although neither is required independently.

Place the region in a bounded layout when page scrolling must remain independent. Use responsive width or height utilities in `className`; the component supports native horizontal and vertical scrolling without a direction prop.

## Visual affordances

The component intentionally does not add masks, shadows, or custom scrollbar styling. This matches `@primer/react`; consumers can add responsive presentation through `className` without replacing the component's overflow or focus behavior.

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `aria-label`: `string`
- `aria-labelledby`: `string`

## Differences from `@primer/react`

- Existing children, native scrolling props, accessible-name props, and scroll usage can generally be retained.
- A focused scroll region retains its name and tab stop until focus leaves if its content stops overflowing.
- Replace CSS-module selectors with Tailwind utilities or `className` styles.
- The Tailwind package does not support legacy CSS-module selectors or styled-system APIs.

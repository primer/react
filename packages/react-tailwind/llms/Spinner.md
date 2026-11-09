# Spinner

`Spinner` communicates that work is in progress with an animated indicator and an optional screen-reader announcement.

Import: `import {Spinner} from '@primer/react-tailwind/Spinner'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Import and usage

```tsx
import {Spinner} from '@primer/react-tailwind/Spinner'
;<Spinner size="small" srText="Loading results" />
```

The component renders a `span` and forwards standard HTML attributes and `className`.

## API notes

The default size is `medium`. `delay="short"` waits 300 ms; `delay="long"` or `delay={true}` waits 1000 ms. A number specifies milliseconds.

## Composition

Place the spinner beside the content whose pending state it represents. Use a custom `srText` when the operation is specific, and do not add a second visible loading label unless it adds useful context.

## Accessibility

The default root has `role="status"` and includes visually hidden `srText`. Provide an accessible label when the surrounding content does not explain what is loading. Setting `srText={null}` is appropriate only when another accessible status already describes the operation.

## Animation and reduced motion

The indicator uses `animate-spin`; `motion-reduce:animate-none` disables the rotation for users who request reduced motion. Spinner instances synchronize their animation phase as they appear, and a delayed spinner is not mounted until its delay completes.

## Theming and Tailwind

Import `@primer/react-tailwind/styles.css` once, or compile the package classes with Tailwind v4 and `@source` the package `dist` directory. Use `className` to extend layout or sizing with Tailwind utilities; do not combine compiled `styles.css` with host-generated package utilities.

### Data attributes

The root exposes `data-component="Spinner"`. Size and delay are represented by classes rather than additional state attributes.

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `delay`: `number | "long" | "short" | boolean` — Default `false`. Waits before showing the spinner, so a fast response never flashes one.
- `size`: `"large" | "medium" | "small" | null`
- `srText`: `string | null` — Default `'Loading'`. Text announced to assistive technology while loading. Set to null when a nearby live region already announces it.

## Differences from `@primer/react`

- Keep `size`, `srText`, and delay usage, but recheck selectors targeting the legacy SVG root.
- Respect the new root status semantics when composing surrounding live regions.
- Remove `sx`, styled-system props, and legacy animation overrides.

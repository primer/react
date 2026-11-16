# SkeletonBox

`SkeletonBox` reserves space for content that is loading, using a shimmer placeholder that can be delayed until a request has taken long enough to show.

Import: `import {SkeletonBox} from '@primer/react-tailwind/SkeletonBox'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Import and usage

```tsx
import {SkeletonBox} from '@primer/react-tailwind/SkeletonBox'
;<SkeletonBox width="240px" height="48px" />
```

Use it in a loading composition with dimensions that match the eventual content. `as` changes the semantic element without changing the placeholder behavior.

## API notes

`delay="short"` waits 300 ms, `delay="long"` waits 1000 ms, and a number specifies milliseconds. Without a delay, the placeholder appears immediately.

## Composition

Compose `SkeletonBox` directly for media and custom shapes, or use `SkeletonText` and `SkeletonAvatar` for common content patterns. Match dimensions and placement to the final content to avoid layout shift.

## Accessibility

The placeholder is decorative: it renders no role and no `aria-busy` (GitHub accessibility policy prohibits `aria-busy`, and legacy Primer never set it). Provide loading context separately, for example visually hidden “Loading” text, and announce completion through a persistent live region such as `AriaStatus` when the update matters. Passing `aria-label` or `aria-labelledby` opts into `role="img"`; use that only for a single placeholder, never once per repeated line. Do not use placeholder geometry as the only label for a control.

## Animation and reduced motion

The shimmer uses `primer-skeleton-shimmer` under `motion-safe`; it is not animated when motion is reduced. A delayed box is not mounted until its timer completes.

## Theming and Tailwind

The default background uses the `--skeletonLoader-bgColor` Primer token. Import the package styles or compile Tailwind v4 with the package `dist` in `@source`. Override dimensions with props and visual details with `className`; preserve contrast when changing the skeleton color.

### Data attributes

The root exposes `data-component="SkeletonBox"`. Dimensions and delay are represented by inline styles and mounting state.

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `as`: `React.ElementType` — Default `'div'`. Element to render.
- `data-component`: `string` — Overrides the marker used to identify this element in tests and styling.
- `delay`: `number | "long" | "short"` — Waits before showing the placeholder, so a fast response never flashes one. Accepts a named delay or milliseconds.
- `height`: `Height<string | number>` — Height of the placeholder.
- `width`: `Width<string | number>` — Width of the placeholder.

## Differences from `@primer/react`

- Keep Suspense, data fetching, and loading transitions in the application.
- Compose SkeletonText and SkeletonAvatar directly for richer placeholder layouts.
- Use `as` only for a simple presentational element choice.
- Named placeholders use image semantics by default so their accessible name is valid. An explicit `role` takes precedence.
- Replace `sx` and styled-system props with `className`.

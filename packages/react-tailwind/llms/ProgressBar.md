# ProgressBar

`ProgressBar` displays determinate progress as a single segment or as a composed set of `ProgressBar.Item` segments.

Import: `import {ProgressBar} from '@primer/react-tailwind/ProgressBar'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Import and usage

```tsx
import {ProgressBar} from '@primer/react-tailwind/ProgressBar'
;<ProgressBar progress={66} aria-label="Upload test.png" />
```

For multiple segments, pass items as children:

```tsx
<ProgressBar aria-label="Project completion">
  <ProgressBar.Item progress={40} variant="accent" />
  <ProgressBar.Item progress={26} variant="success" />
</ProgressBar>
```

## API notes

The track defaults to `size="medium"`, and a single segment defaults to `variant="success"`. Pass either `progress` or `ProgressBar.Item` children, not both.

`ProgressBar.Item` accepts `progress`, `variant`, `fillColor`, and `animated`, plus standard `span` attributes. Its progress is also clamped to 0–100.

## Composition

Use one `ProgressBar` for a single task. Use `ProgressBar.Item` children when the track needs to communicate distinct categories or phases. Give the root an accessible name with `aria-label` or `aria-labelledby`.

## Accessibility

Each item is a `progressbar` with `aria-valuemin="0"`, `aria-valuemax="100"`, and `aria-valuenow` derived from `progress`. The root forwards its accessible name, description, and value attributes to a single item; provide those attributes on each item for composed segments. Root value attributes are ignored when items are present. If conditional children contain only `false`, `null`, or `undefined` values (including in arrays or fragments), the root renders a single segment at 0% unless `progress` or an accessible value is supplied. An explicit `aria-valuenow` or `aria-valuetext` can describe a value that differs from the visual fill, such as an empty state drawn at full width.

## Animation and reduced motion

`animated` applies Primer's one-second progress shimmer when the user has not requested reduced motion. The item remains static under `prefers-reduced-motion: reduce`.

## Theming and Tailwind

Use the package compiled CSS or Tailwind v4 with the package `dist` path in `@source`. `className` can extend the track and item, while the component's semantic color utilities use Primer theme tokens. For a custom fill, pass a CSS color or variable such as `fillColor="var(--my-progress-color)"` to the root's single segment or to `ProgressBar.Item`; it overrides `variant`. Do not load compiled and host-generated package utilities together.

### Data attributes

The track exposes `data-component="ProgressBar"` and each segment exposes `data-component="ProgressBar.Item"`. Size, inline state, variant, and progress are represented through classes and ARIA values rather than extra state attributes.

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `animated`: `boolean` — Animates the bar to suggest indeterminate progress.
- `fillColor`: `BackgroundColor` — Custom fill color for the single segment, such as a CSS color or `var(--my-progress-color)`.
- `inline`: `boolean | null`
- `progress`: `number` — Percentage complete, from 0 to 100.
- `size`: `"large" | "medium" | "small" | null`
- `variant`: `"accent" | "attention" | "danger" | "done" | "neutral" | "severe" | "sponsors" | "success" | null` — Color of the single segment.

## ProgressBar.Item

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `animated`: `boolean | null`
- `fillColor`: `BackgroundColor` — Custom fill color, such as a CSS color or `var(--my-progress-color)`. Overrides the variant color.
- `progress`: `number` — Percentage of the bar this segment fills, from 0 to 100.
- `variant`: `"accent" | "attention" | "danger" | "done" | "neutral" | "severe" | "sponsors" | "success" | null`

## Differences from `@primer/react`

- Rename `barSize` to `size`; the middle size is `medium` rather than upstream's `default`. Map a semantic `bg` such as `danger.emphasis` to `variant="danger"`, or use `fillColor` for a custom color such as `var(--my-progress-color)`.
- Convert string percentages to finite numbers before passing `progress` and keep values in the supported numeric range. Do not spread the legacy `bg` or `barSize` props onto the track.
- The single-segment shorthand forwards accessible value and name attributes to its progressbar. Pass an explicit `aria-valuenow` or `aria-valuetext` to either the shorthand or an item when its announced value intentionally differs from the visual width.
- Root value attributes apply only to the single segment, not to grouped items. When conditional children contain only empty values, a single 0% fallback segment receives the root's accessible value and name.
- Do not pass children alongside `progress`; remove `sx` and styled-system props.

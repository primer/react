# ProgressBar

`ProgressBar` displays determinate progress as a single segment or as a composed set of `ProgressBar.Item` segments.

Import: `import {ProgressBar} from '@primer/react-tailwind/ProgressBar'`

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `animated`: `boolean` — Animates the bar to suggest indeterminate progress.
- `inline`: `boolean | null`
- `progress`: `number` — Percentage complete, from 0 to 100.
- `size`: `"large" | "medium" | "small" | null`
- `variant`: `"accent" | "attention" | "danger" | "done" | "neutral" | "severe" | "sponsors" | "success" | null` — Color of the single segment.

## ProgressBar.Item

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `animated`: `boolean | null`
- `progress`: `number` — Percentage of the bar this segment fills, from 0 to 100.
- `variant`: `"accent" | "attention" | "danger" | "done" | "neutral" | "severe" | "sponsors" | "success" | null`

## Differences from `@primer/react`

- Rename `barSize` to `size` and `bg` to `variant`. The middle size is `medium` rather than upstream's `default`, matching the size vocabulary used across the package.

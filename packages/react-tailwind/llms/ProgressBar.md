# ProgressBar

`ProgressBar` displays determinate progress as a single segment or as a composed set of `ProgressBar.Item` segments.

Import: `import {ProgressBar} from '@primer/react-tailwind/ProgressBar'`

Renders a `<span>` and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `animated`: `boolean`
- `inline`: `boolean | null`
- `progress`: `number`
- `size`: `"large" | "medium" | "small" | null`
- `variant`: `"accent" | "attention" | "danger" | "done" | "neutral" | "severe" | "sponsors" | "success" | null`

## Item props

- `animated`: `boolean | null`
- `progress`: `number`
- `variant`: `"accent" | "attention" | "danger" | "done" | "neutral" | "severe" | "sponsors" | "success" | null`

## Differences from `@primer/react`

- Rename `barSize` to `size` and `bg` to `variant`. The middle size is `medium` rather than upstream's `default`, matching the size vocabulary used across the package.

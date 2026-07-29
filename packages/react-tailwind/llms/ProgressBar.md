# ProgressBar

`ProgressBar` displays determinate progress as a single segment or as a composed set of `ProgressBar.Item` segments.

Import: `import {ProgressBar} from '@primer/react-tailwind/ProgressBar'`

## Props

- `animated`: `boolean`
- `progress`: `number`
- `variant`: `VariantProps<typeof itemVariants>['variant']`

## ProgressBarItem props

- `progress`: `number`

## Differences from `@primer/react`

- Rename `barSize` to `size` and `bg` to `variant`. The middle size is `medium` rather than upstream's `default`, matching the size vocabulary used across the package.


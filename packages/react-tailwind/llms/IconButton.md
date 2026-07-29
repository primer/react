# IconButton

`IconButton` is a button whose only content is an icon. `aria-label` is required, because the control has no visible text.

Import: `import {IconButton} from '@primer/react-tailwind/IconButton'`

## Props

- `aria-label`: `string`
- `icon`: `React.ElementType`

## Differences from `@primer/react`

- Supply an accessible name with `aria-label`; use native `title` only as supplemental text.


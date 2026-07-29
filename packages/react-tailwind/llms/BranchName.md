# BranchName

`BranchName` renders a Git ref name in Primer's monospace branch treatment. It is presentational; pass `href` to make it navigable.

Import: `import {BranchName} from '@primer/react-tailwind/BranchName'`

Renders an `<a>` and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `as`: `React.ElementType` — Default `'a'`.

## Differences from `@primer/react`

- Compose Tooltip, live announcements, and selection controls around BranchName instead of expecting BranchName props for them.

# BranchName

`BranchName` renders a Git ref name in Primer's monospace branch treatment. It is presentational; pass `href` to make it navigable.

Import: `import {BranchName} from '@primer/react-tailwind/BranchName'`

Renders an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `as`: `React.ElementType` — Default `'a'`. Element to render. Use a non-anchor element when the branch name does not link anywhere.

## Differences from `@primer/react`

- Compose Tooltip, live announcements, and selection controls around BranchName instead of expecting BranchName props for them.
- Use `as` only for simple presentational element replacement, not interactive trigger composition.
- Use `className` rather than `sx` or styled-system props.
- Clipboard announcement behavior remains an explicit consumer or LiveRegion concern.

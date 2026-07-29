# Label

`Label` marks an item with a short piece of metadata, such as a status or category. It is presentational and does not label form fields; use `FormControl.Label` for that.

Import: `import {Label} from '@primer/react-tailwind/Label'`

## Props

- `as`: `React.ElementType` — Default `'span'`.
- `size`: `"large" | "small" | null`
- `variant`: `"accent" | "attention" | "danger" | "default" | "done" | "primary" | "secondary" | "severe" | "sponsors" | "success" | null`

## Differences from `@primer/react`

- Existing `variant`, `size`, and semantic `as` usage can be retained.

# Label

`Label` marks an item with a short piece of metadata, such as a status or category. It is presentational and does not label form fields; use `FormControl.Label` for that.

Import: `import {Label} from '@primer/react-tailwind/Label'`

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `as`: `React.ElementType` — Default `'span'`. Element to render.
- `size`: `"large" | "small" | null`
- `variant`: `"accent" | "attention" | "danger" | "default" | "done" | "primary" | "secondary" | "severe" | "sponsors" | "success" | null`

## Differences from `@primer/react`

- Existing `variant`, `size`, and `as` usage can be retained.

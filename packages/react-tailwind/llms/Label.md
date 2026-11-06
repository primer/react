# Label

`Label` marks an item with a short piece of metadata, such as a status or category. It is presentational and does not label form fields; use `FormControl.Label` for that.

Import: `import {Label} from '@primer/react-tailwind/Label'`

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `as`: `As` — Default `'span'`. Element to render. Its props and ref follow the selected element.
- `className`: `string`
- `size`: `"large" | "small" | null`
- `variant`: `"accent" | "attention" | "danger" | "default" | "done" | "primary" | "secondary" | "severe" | "sponsors" | "success" | null`

## Differences from `@primer/react`

- Existing `variant`, `size`, and `as` usage can be retained; element-specific props and refs follow the element selected by `as`.
- Use `FormControl.Label` to label a form field.
- Replace `sx`, styled-system props, and selectors targeting `data-size` or `data-variant`.

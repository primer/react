# Details

`Details` is a native disclosure element with a styled summary.

Import: `import {Details} from '@primer/react-tailwind/Details'`

Renders a [`<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Details.Summary

Renders a [`<summary>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/summary#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Differences from `@primer/react`

- Remove `useDetails`; use the native `open` attribute/event behavior or normal React state around Details when needed.

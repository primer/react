# ScrollableRegion

`ScrollableRegion` owns horizontal or vertical overflow and becomes a labelled, focusable region when its content overflows.

Import: `import {ScrollableRegion} from '@primer/react-tailwind/ScrollableRegion'`

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `aria-label`: `string`
- `aria-labelledby`: `string`

## Differences from `@primer/react`

- Existing children, native scrolling props, accessible-name props, and scroll usage can generally be retained.
- Replace CSS-module selectors with Tailwind utilities or `className` styles.
- The Tailwind package does not support legacy CSS-module selectors or styled-system APIs.

# SubNav

`SubNav` is a horizontal secondary navigation bar composed from `SubNav.Links` and `SubNav.Link`.

Import: `import {SubNav} from '@primer/react-tailwind/SubNav'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Import and usage

```tsx
import {SubNav} from '@primer/react-tailwind/SubNav'
;<SubNav aria-label="Project sections">
  <SubNav.Links>
    <SubNav.Link href="#overview" selected>
      Overview
    </SubNav.Link>
  </SubNav.Links>
</SubNav>
```

Use exactly one selected link for the current section. The root is a navigation landmark, so provide an accessible name and give actions their own names.

Renders a [`<nav>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `actions`: `React.ReactNode` — Controls shown at the end of the bar, beside the links.
- `align`: `"right"` — Aligns the links to the end of the bar.
- `full`: `boolean` — Stretches the bar to fill the width of its container.
- `label`: `string` — Accessible name for the navigation region.

## SubNav.Link

Renders an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `as`: `React.ElementType` — Default `'a'`. Element to render. Use a non-anchor element when the link is handled by a router.
- `selected`: `boolean` — Marks the link as the current page.

## SubNav.Links

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Differences from `@primer/react`

- Existing navigation composition and state ownership can be retained.
- Recheck custom selectors for borders, selected state, and item spacing.
- Remove `sx` and styled-system props.

# Header

`Header` is a compact horizontal header primitive. Use `Header.Item` for layout participants and `Header.Link` for consistently styled navigation.

Import: `import {Header} from '@primer/react-tailwind/Header'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Import and usage

```tsx
import {Header} from '@primer/react-tailwind/Header'
;<Header>
  <Header.Item full>
    <Header.Link href="/">Repository</Header.Link>
  </Header.Item>
</Header>
```

Use one `full` item to absorb available space. Links retain native keyboard behavior, so provide specific link names and use buttons for actions.

Renders a [`<header>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/header#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `as`: `React.ElementType` — Default `'header'`. Element to render.

## Header.Item

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `full`: `boolean` — Lets the item grow to fill the remaining space, pushing later items to the end.

## Header.Link

Renders an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `as`: `React.ElementType` — Default `'a'`. Element to render. Use a non-anchor element when the item does not link anywhere.

## Differences from `@primer/react`

- Existing Header subcomponent composition can generally be retained.
- Recheck custom class selectors and responsive overrides.
- Remove `sx` and styled-system props.

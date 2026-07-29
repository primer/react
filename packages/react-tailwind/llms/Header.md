# Header

`Header` is a compact horizontal header primitive. Use `Header.Item` for layout participants and `Header.Link` for consistently styled navigation.

Import: `import {Header} from '@primer/react-tailwind/Header'`

## Props

- `as`: `React.ElementType` — Default `'header'`. Element to render.

## Item props

- `full`: `boolean` — Lets the item grow to fill the remaining space, pushing later items to the end.

## Link props

- `as`: `React.ElementType` — Default `'header'`. Element to render. Use a non-anchor element when the item does not link anywhere.

## Differences from `@primer/react`

- Existing Header subcomponent composition can generally be retained.

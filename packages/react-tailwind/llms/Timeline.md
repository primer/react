# Timeline

`Timeline` is a presentational compound activity stream built from `Item`, `Badge`, `Body`, `Actions`, `Avatar`, and `Break` parts.

Import: `import {Timeline} from '@primer/react-tailwind/Timeline'`

Renders an `<ol>` and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `clipSidebar`: `"both" | "end" | "start" | boolean`

## Item props

- `condensed`: `boolean`

## Badge props

- `variant`: `"accent" | "attention" | "closed" | "danger" | "done" | "open" | "severe" | "sponsors" | "success"`

## Differences from `@primer/react`

- Compose local Avatar, StateLabel, links, and actions inside Timeline parts.

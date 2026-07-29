# Timeline

`Timeline` is a presentational compound activity stream built from `Item`, `Badge`, `Body`, `Actions`, `Avatar`, and `Break` parts.

Import: `import {Timeline} from '@primer/react-tailwind/Timeline'`

Renders an `<ol>` and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `clipSidebar`: `"both" | "end" | "start" | boolean` — Trims the connecting line at the start, the end, or both, where the timeline meets other content.

## Item props

- `condensed`: `boolean` — Reduces the item's vertical spacing, for a minor event in the timeline.

## Badge props

- `variant`: `"accent" | "attention" | "closed" | "danger" | "done" | "open" | "severe" | "sponsors" | "success"` — Colour of the badge, conveying what kind of event it marks.

## Differences from `@primer/react`

- Compose local Avatar, StateLabel, links, and actions inside Timeline parts.

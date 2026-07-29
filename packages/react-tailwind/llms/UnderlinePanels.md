# UnderlinePanels

`UnderlinePanels` is a tab-and-panel composition with an underlined tab list.

Import: `import {UnderlinePanels} from '@primer/react-tailwind/UnderlinePanels'`

## Props

- `loadingCounters`: `boolean` — Default `false`. Shows placeholders in place of tab counters while their values load.

## Tab props

- `counter`: `React.ReactNode` — Number shown after the tab's label.
- `icon`: `React.ElementType` — Icon component shown before the tab's label.
- `leadingVisual`: `React.ReactNode` — Visual shown before the tab's label, as an alternative to `icon`.

## Differences from `@primer/react`

- Use the documented value/default-value callback contract for tab selection.

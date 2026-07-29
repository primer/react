# Portal

`Portal` renders children outside their React parent's DOM subtree while preserving React context.

Import: `import {Portal} from '@primer/react-tailwind/Portal'`

Renders a `<div>` and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `container`: `PortalContainerRef | PortalContainer | null`
- `onMount`: `(() => void)`

## Differences from `@primer/react`

- Replace `containerName` with a DOM `container` or ref.

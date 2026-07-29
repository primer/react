# Portal

`Portal` renders children outside their React parent's DOM subtree while preserving React context.

Import: `import {Portal} from '@primer/react-tailwind/Portal'`

## Props

- `container`: `PortalContainer | PortalContainerRef | null`
- `onMount`: `() => void`

## Differences from `@primer/react`

- Replace `containerName` with a DOM `container` or ref.


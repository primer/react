# Portal

`Portal` renders children outside their React parent's DOM subtree while preserving React context.

Import: `import {Portal} from '@primer/react-tailwind/Portal'`

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `container`: `PortalContainerRef | PortalContainer | null` — Where the children are rendered. Defaults to the shared portal root.
- `onMount`: `(() => void)` — Called once the children have been rendered into the container.

## Differences from `@primer/react`

- Replace `containerName` with a DOM `container` or ref.

# VisuallyHidden

`VisuallyHidden` hides content visually while keeping it available to screen readers. Use it for context that is obvious visually but missing from the accessible name.

Import: `import {VisuallyHidden} from '@primer/react-tailwind/VisuallyHidden'`

Renders a `<span>` and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Differences from `@primer/react`

- Existing `focusable` usage can be retained.

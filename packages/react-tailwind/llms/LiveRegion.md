# LiveRegion

`Announce`, `AriaStatus`, and `AriaAlert` announce asynchronous changes without moving focus. They share one live-region implementation; `AriaStatus` and `AriaAlert` fix the politeness.

Import: `import {Announce, AriaAlert, AriaStatus} from '@primer/react-tailwind/LiveRegion'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Usage

```tsx
import {Announce, AriaAlert, AriaStatus} from '@primer/react-tailwind'

<AriaStatus>3 results loaded</AriaStatus>
<AriaAlert>Could not save changes</AriaAlert>
<Announce>Upload complete</Announce>
```

`AriaStatus` is polite and `AriaAlert` is assertive. Keep messages concise and do not combine a live-region announcement with unexpected focus movement.

## Announce

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `announceOnShow`: `boolean` — Default `true`. Announces the content when the region first becomes visible, rather than only on later changes.
- `as`: `React.ElementType` — Default `'div'`. Element to render.
- `data-component`: `string` — Default `'Announce'`. Overrides the marker used to identify this element in tests and styling.
- `delayMs`: `number` — Delay before announcing, which lets rapidly changing content settle first.
- `hidden`: `boolean` — Default `false`. Hides the region visually while it keeps announcing to assistive technology.
- `politeness`: `Politeness` — Default `'polite'`. Whether the announcement waits for a pause or interrupts immediately.

## AriaAlert

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `announceOnShow`: `boolean` — Default `true`. Announces the content when the region first becomes visible, rather than only on later changes.
- `as`: `React.ElementType` — Element to render.
- `data-component`: `string` — Default `'AriaAlert'`. Overrides the marker used to identify this element in tests and styling.
- `delayMs`: `number` — Delay before announcing, which lets rapidly changing content settle first.
- `hidden`: `boolean` — Hides the region visually while it keeps announcing to assistive technology.

## AriaStatus

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `announceOnShow`: `boolean` — Default `false`. Announces the content when the region first becomes visible, rather than only on later changes.
- `as`: `React.ElementType` — Element to render.
- `data-component`: `string` — Default `'AriaStatus'`. Overrides the marker used to identify this element in tests and styling.
- `delayMs`: `number` — Delay before announcing, which lets rapidly changing content settle first.
- `hidden`: `boolean` — Hides the region visually while it keeps announcing to assistive technology.

## Differences from `@primer/react`

- Select `AriaStatus` for polite status updates and `AriaAlert` for urgent messages; do not duplicate the text in multiple regions.
- Use `announceOnShow` and `delayMs` only for the documented Announce activation behavior.
- Keep visual hiding separate from removing important content from the accessibility tree.
- `sx` and styled-system props are unsupported; use `className`.

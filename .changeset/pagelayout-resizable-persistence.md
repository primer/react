---
'@primer/react': minor
---

Add `currentWidth` and `onResizeEnd` props to PageLayout.Pane for controlled resizable width

The `PageLayout.Pane` component now supports controlled width:

- `onResizeEnd` — callback fired when a resize operation ends (pointer release or keyboard key up). Replaces localStorage persistence. Requires `currentWidth`.
- `currentWidth` — sets the current displayed width in pixels (`number | undefined`). Pass `undefined` when the persisted value hasn't loaded yet. Requires `onResizeEnd`.

Both props must be provided together (enforced by TypeScript). `resizable` remains a plain `boolean` prop.

These props are only meaningful when `resizable={true}` — without it, no drag handle renders so `onResizeEnd` never fires.

**New export:**

- `defaultPaneWidth` — Record of preset width values: `{small: 256, medium: 296, large: 320}`

**Example usage:**

```tsx
import {PageLayout, defaultPaneWidth} from '@primer/react'

// Default behavior (unchanged) — localStorage persistence
<PageLayout.Pane resizable />

// Controlled width with custom persistence
const [width, setWidth] = useState(defaultPaneWidth.medium)
<PageLayout.Pane
  resizable
  currentWidth={width}
  onResizeEnd={(newWidth) => {
    setWidth(newWidth)
    myStorage.save('pane-width', newWidth)
  }}
/>

// Async load — pass undefined until value is fetched
<PageLayout.Pane
  resizable
  currentWidth={savedWidth ?? undefined}
  onResizeEnd={handleResizeEnd}
/>
```

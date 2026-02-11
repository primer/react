---
'@primer/react': minor
---

Add `currentWidth` and `onResizeEnd` props to PageLayout.Pane for controlled resizable width

The `PageLayout.Pane` component now supports controlled width when `resizable` is `true`:

- `currentWidth` — sets the current displayed width in pixels, overriding the `width` prop's default
- `onResizeEnd` — callback fired when a resize operation ends (pointer release or keyboard key up). When provided, it takes precedence over localStorage persistence.

These props are only available when `resizable={true}` (enforced by TypeScript).

**New types exported:**

- `PaneWidth` — Type for preset width names: `'small' | 'medium' | 'large'`
- `PaneWidthValue` — Union type for width prop: `PaneWidth | CustomWidthOptions`

**New values exported:**

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

// Controlled width without persistence
<PageLayout.Pane
  resizable
  currentWidth={width}
  onResizeEnd={setWidth}
/>
```

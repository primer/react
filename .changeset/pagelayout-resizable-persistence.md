---
'@primer/react': minor
---

Add custom persistence options to PageLayout.Pane's `resizable` prop and number support for `width`

The `resizable` prop now accepts additional configuration options:

- `true` - Enable resizing with default localStorage persistence (existing behavior)
- `false` - Disable resizing (existing behavior)
- `{persist: false}` - Enable resizing without any persistence (avoids hydration mismatches)
- `{save: fn}` - Enable resizing with custom persistence (e.g., server-side, IndexedDB)

The `width` prop now accepts numbers in addition to named sizes and custom objects:

- `'small' | 'medium' | 'large'` - Preset width names (existing behavior)
- `number` - Explicit pixel width (uses `minWidth` prop and viewport-based max) **NEW**
- `{min, default, max}` - Custom width configuration (existing behavior)

**New types exported:**

- `NoPersistConfig` - Type for `{persist: false}` configuration
- `CustomPersistConfig` - Type for `{save: fn}` configuration
- `SaveOptions` - Options passed to custom save function (`{widthStorageKey: string}`)
- `ResizableConfig` - Union type for all resizable configurations
- `PaneWidth` - Type for preset width names (`'small' | 'medium' | 'large'`)
- `PaneWidthValue` - Union type for all width values (`PaneWidth | number | CustomWidthOptions`)

**New values exported:**

- `defaultPaneWidth` - Record of preset width values (`{small: 256, medium: 296, large: 320}`)

**Example usage:**

```tsx
// No persistence - useful for SSR to avoid hydration mismatches
<PageLayout.Pane resizable={{persist: false}} />

// Custom persistence - save to your own storage
<PageLayout.Pane
  resizable={{
    save: (width, {widthStorageKey}) => {
      // Save to server, IndexedDB, sessionStorage, etc.
      myStorage.set(widthStorageKey, width)
    }
  }}
/>

// Number width - uses minWidth prop and viewport-based max constraints
const [savedWidth, setSavedWidth] = useState(defaultPaneWidth.medium)
<PageLayout.Pane
  width={savedWidth}
  resizable={{
    save: (width) => setSavedWidth(width)
  }}
/>

// Using defaultPaneWidth for custom width configurations
import {defaultPaneWidth} from '@primer/react'

const widthConfig = {
  min: '256px',
  default: `${defaultPaneWidth.medium}px`,
  max: '600px'
}
<PageLayout.Pane width={widthConfig} resizable={{persist: false}} />
```

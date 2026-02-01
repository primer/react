---
'@primer/react': minor
---

Add custom persistence options to PageLayout.Pane's `resizable` prop with controlled width support

The `resizable` prop now accepts additional configuration options:

- `true` - Enable resizing with default localStorage persistence (existing behavior)
- `false` - Disable resizing (existing behavior)
- `{persist: false}` - Enable resizing without any persistence (avoids hydration mismatches)
- `{persist: 'localStorage'}` - Enable resizing with explicit localStorage persistence
- `{persist: fn}` - Enable resizing with custom persistence function (e.g., server-side, IndexedDB)
- `{width: number, persist: ...}` - Controlled width mode: provide current width and persistence handler

**Key Features:**

1. **Flexible persistence**: Choose between no persistence, localStorage, or custom persistence function
2. **Controlled width support**: Separate current width from default constraints using `resizable.width`
3. **SSR-friendly**: No persistence mode avoids hydration mismatches in server-rendered apps

**New types exported:**

- `PersistFunction` - Type for custom persistence function: `(width: number, options: SaveOptions) => void | Promise<void>`
- `SaveOptions` - Options passed to custom persist function: `{widthStorageKey: string}`
- `PersistConfig` - Configuration object: `{width?: number, persist: false | 'localStorage' | PersistFunction}`
- `ResizableConfig` - Union type for all resizable configurations: `boolean | PersistConfig`
- `PaneWidth` - Type for preset width names: `'small' | 'medium' | 'large'`
- `PaneWidthValue` - Union type for width prop: `PaneWidth | CustomWidthOptions`

**New values exported:**

- `defaultPaneWidth` - Record of preset width values: `{small: 256, medium: 296, large: 320}`

**Example usage:**

```tsx
// No persistence - useful for SSR to avoid hydration mismatches
<PageLayout.Pane resizable={{persist: false}} />

// Explicit localStorage persistence
<PageLayout.Pane resizable={{persist: 'localStorage'}} />

// Custom persistence function - save to your own storage
<PageLayout.Pane
  resizable={{
    persist: (width, {widthStorageKey}) => {
      // Save to server, IndexedDB, sessionStorage, etc.
      myStorage.set(widthStorageKey, width)
    }
  }}
/>

// Controlled width - separate current value from constraints
const [currentWidth, setCurrentWidth] = useState(defaultPaneWidth.medium)
<PageLayout.Pane
  width={{min: '256px', default: '296px', max: '600px'}}
  resizable={{
    width: currentWidth,
    persist: (width) => {
      setCurrentWidth(width)
      localStorage.setItem('my-pane-width', width.toString())
    }
  }}
/>

// Using named size for constraints with controlled current width
const [currentWidth, setCurrentWidth] = useState(defaultPaneWidth.medium)
<PageLayout.Pane
  width="medium"
  resizable={{
    width: currentWidth,
    persist: (width) => setCurrentWidth(width)
  }}
/>

// Using defaultPaneWidth for initialization
import {defaultPaneWidth} from '@primer/react'

const [currentWidth, setCurrentWidth] = useState(defaultPaneWidth.large)
<PageLayout.Pane
  width="large"
  resizable={{
    width: currentWidth,
    persist: false
  }}
/>
```

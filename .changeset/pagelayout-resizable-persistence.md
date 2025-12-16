---
'@primer/react': minor
---

Add custom persistence options to PageLayout.Pane's `resizable` prop

The `resizable` prop now accepts additional configuration options:

- `true` - Enable resizing with default localStorage persistence (existing behavior)
- `false` - Disable resizing (existing behavior)
- `{persist: false}` - Enable resizing without any persistence (avoids hydration mismatches)
- `{save: fn}` - Enable resizing with custom persistence (e.g., server-side, IndexedDB)

**New types exported:**
- `NoPersistConfig` - Type for `{persist: false}` configuration
- `CustomPersistConfig` - Type for `{save: fn}` configuration  
- `SaveOptions` - Options passed to custom save function (`{widthStorageKey: string}`)
- `ResizableConfig` - Union type for all resizable configurations

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
```

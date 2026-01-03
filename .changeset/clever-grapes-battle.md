---
'@primer/react': major
---

**BREAKING CHANGES**: Streamline PageLayout.Pane resizable API

This is a major refactoring of the `PageLayout.Pane` resizable API to follow standard React patterns and eliminate hydration issues.

### Breaking Changes

#### Props Renamed/Changed

| Old Prop | New Prop | Description |
|----------|----------|-------------|
| `width` (named size or CustomWidthOptions) | `defaultWidth` (number or named size) | Default width of the pane |
| N/A | `width` (number) | Controlled current width |
| N/A | `onWidthChange` (callback) | Called when width changes |
| N/A | `maxWidth` (number) | Maximum allowed width |
| `resizable` (boolean or PersistConfig) | `resizable` (boolean) | Enable/disable resizing |
| `widthStorageKey` | Removed | Use `useLocalStoragePaneWidth` hook instead |

#### API Changes

**Before:**
```tsx
// With localStorage persistence
<PageLayout.Pane width="medium" resizable widthStorageKey="my-pane" />

// With custom constraints
<PageLayout.Pane 
  width={{min: '256px', default: '296px', max: '600px'}}
  resizable 
/>

// Without persistence
<PageLayout.Pane resizable={{persist: false}} />

// With custom persistence
<PageLayout.Pane 
  resizable={{
    width: currentWidth,
    persist: (width) => { /* custom save */ }
  }} 
/>
```

**After:**
```tsx
// Simple resizable (no persistence)
<PageLayout.Pane resizable defaultWidth="medium" />

// With localStorage persistence (using hook)
const [width, setWidth] = useLocalStoragePaneWidth('my-pane', {
  defaultWidth: defaultPaneWidth.medium
})
<PageLayout.Pane 
  resizable 
  width={width} 
  onWidthChange={setWidth} 
/>

// With custom constraints
<PageLayout.Pane 
  resizable
  defaultWidth={296}
  minWidth={256}
  maxWidth={600}
/>

// With custom persistence (controlled)
const [width, setWidth] = useState(defaultPaneWidth.medium)
<PageLayout.Pane 
  resizable
  width={width}
  onWidthChange={(w) => {
    setWidth(w)
    // Custom persistence logic
  }}
/>
```

### New Exports

- **`useLocalStoragePaneWidth(key, options)`** - Hook for localStorage persistence (SSR-safe)
- **`defaultPaneWidth`** - Object with preset width values: `{small: 256, medium: 296, large: 320}`

### Migration Guide

1. **Simple resizable pane** - No changes needed if not using persistence:
   ```tsx
   // Before & After
   <PageLayout.Pane resizable />
   ```

2. **With localStorage** - Use the new hook:
   ```tsx
   // Before
   <PageLayout.Pane resizable widthStorageKey="my-pane" />
   
   // After
   const [width, setWidth] = useLocalStoragePaneWidth('my-pane', {
     defaultWidth: defaultPaneWidth.medium
   })
   <PageLayout.Pane resizable width={width} onWidthChange={setWidth} />
   ```

3. **With custom constraints** - Use separate props:
   ```tsx
   // Before
   <PageLayout.Pane 
     width={{min: '256px', default: '296px', max: '600px'}}
   />
   
   // After
   <PageLayout.Pane 
     defaultWidth={296}
     minWidth={256}
     maxWidth={600}
   />
   ```

4. **With custom persistence** - Use controlled pattern:
   ```tsx
   // Before
   <PageLayout.Pane 
     resizable={{
       width: currentWidth,
       persist: (w) => setCurrentWidth(w)
     }}
   />
   
   // After
   <PageLayout.Pane 
     resizable
     width={currentWidth}
     onWidthChange={setCurrentWidth}
   />
   ```

### Benefits

- **Standard React patterns** - Follows controlled/uncontrolled component conventions
- **SSR-safe by default** - No hydration mismatches
- **Simpler API** - Separate concerns into separate props
- **Better TypeScript support** - No complex union types
- **More flexible** - Easy to compose with other state management

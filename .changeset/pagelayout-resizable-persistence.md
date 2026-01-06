---
'@primer/react': minor
---

Refine `PageLayout.Pane` resizable persistence API based on design review feedback

The `resizable` prop now has a refined API with clearer configuration types and better type safety:

**New Configuration Types:**

- `{persist: false}` - Enable resizing without persistence (SSR-safe, width not allowed)
- `{persist: 'localStorage', widthStorageKey: string, width: number | undefined}` - localStorage persistence with required widthStorageKey and width
- `{persist: fn, width: number | undefined}` - Custom persistence with required width

**Key Changes:**

1. **`width` required for persistence configs**: When using localStorage or custom persistence, `width` is now required (can be `undefined` to use default). This ensures intentional state management.

2. **`widthStorageKey` in config for localStorage**: The storage key is now part of the localStorage config object, making it explicit and avoiding accidental collisions.

3. **Custom persist functions simplified**: Custom persist functions no longer receive `widthStorageKey` - consumers manage their own storage keys and mechanisms.

4. **Backwards compatibility maintained**: `resizable={true}` with `widthStorageKey` prop still works but is deprecated.

**Deprecations:**

- `widthStorageKey` prop is deprecated - use `resizable={{persist: 'localStorage', widthStorageKey: '...', width}}` instead
- `resizable={true}` is implicitly deprecated - use the explicit config forms instead

**New Exported Types:**

- `NoPersistConfig` - Type for `{persist: false}`
- `LocalStoragePersistConfig` - Type for localStorage configuration
- `CustomPersistConfig` - Type for custom persistence configuration

**Migration Examples:**

```tsx
// Before: Default localStorage (deprecated)
<PageLayout.Pane resizable={true} widthStorageKey="my-pane" />

// After: Explicit localStorage with widthStorageKey in config
<PageLayout.Pane resizable={{persist: 'localStorage', widthStorageKey: 'my-pane', width: undefined}} />

// Before: Custom persist with widthStorageKey passed
<PageLayout.Pane
  resizable={{
    persist: (width, {widthStorageKey}) => {
      myStorage.set(widthStorageKey, width)
    }
  }}
  widthStorageKey="my-pane"
/>

// After: Custom persist manages its own storage key
<PageLayout.Pane
  resizable={{
    persist: (width) => myStorage.set('my-pane', width),
    width: currentWidth
  }}
/>

// SSR-safe resizing without persistence (no change needed)
<PageLayout.Pane resizable={{persist: false}} />

// Controlled width with custom persistence
const [currentWidth, setCurrentWidth] = useState(defaultPaneWidth.medium)
<PageLayout.Pane
  resizable={{
    persist: (width) => setCurrentWidth(width),
    width: currentWidth
  }}
/>
```

**Rationale:**

1. **Explicit is better**: Requiring `width` for persistence configs makes state management intentional
2. **Clearer storage key management**: localStorage configs own their storage key; custom persisters manage their own
3. **Better SSR support**: `{persist: false}` makes it clear there's no persistence to worry about
4. **Type safety**: Separate config types provide better IntelliSense and type checking

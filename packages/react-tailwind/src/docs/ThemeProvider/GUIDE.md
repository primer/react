# ThemeProvider and useTheme

`ThemeProvider` and `useTheme` configure a subtree's appearance and expose its configured and resolved color modes.

## Imports and setup

Import both APIs from the package root. There is no supported `ThemeProvider` or `useTheme` component subpath.

```tsx
import '@primer/react-tailwind/styles.css'
import {BaseStyles, ThemeProvider, useTheme} from '@primer/react-tailwind'

function ThemeImage({daySrc, nightSrc, alt}: {daySrc: string; nightSrc: string; alt: string}) {
  const {resolvedColorMode} = useTheme()
  return <img src={resolvedColorMode === 'dark' ? nightSrc : daySrc} alt={alt} />
}

export function App() {
  return (
    <ThemeProvider colorMode="auto" dayScheme="light" nightScheme="dark">
      <BaseStyles>
        <ThemeImage daySrc="/day-image.svg" nightSrc="/night-image.svg" alt="Repository activity" />
      </BaseStyles>
    </ThemeProvider>
  )
}
```

`useTheme` requires a `ThemeProvider` ancestor and throws `useTheme must be used within a ThemeProvider` otherwise. `BaseStyles` supplies typography and a portal root, not a theme context. `contextOnly` supplies context without a wrapper or color-scheme attributes; an appropriate DOM ancestor must still own the theme attributes for CSS.

## Configured versus resolved mode

`colorMode` and `setColorMode` accept `'day'`, `'night'`, `'light'`, `'dark'`, and `'auto'`. `colorMode` retains the configured value, including legacy aliases and `'auto'`. `resolvedColorMode` always returns `'light'` or `'dark'`, never `'day'`, `'night'`, or `'auto'`.

| Configured `colorMode` | Tailwind `resolvedColorMode`                           |
| ---------------------- | ------------------------------------------------------ |
| `'day'` or `'light'`   | `'light'`                                              |
| `'night'` or `'dark'`  | `'dark'`                                               |
| `'auto'`               | `'light'` or `'dark'`, following the system preference |

Use `resolvedColorMode` for mode-dependent images, icons, and other content. Comparing `colorMode` directly with `'night'` does not cover `'dark'` or an automatic dark preference. On the server, `'auto'` has a light snapshot; the client follows `prefers-color-scheme` after hydration. Verify theme-dependent content during hydration rather than assuming the server knows the system preference.

A root provider defaults to `defaultColorMode="day"`, `defaultDayScheme="light"`, and `defaultNightScheme="dark"`. Nested uncontrolled providers initialize from their parent's values when available. Use explicit controlled props when a nested provider must follow subsequent owner updates.

The built-in high-contrast schemes are named `light_high_contrast` and `dark_high_contrast`. Their CSS filenames use hyphens, but the hyphenated names are not built-in scheme identifiers. Scheme strings are passed through unchanged; a custom scheme requires matching theme CSS.

## Differences from `@primer/react`

Legacy consumers using `'day'`/`'night'` configuration see those same values in `resolvedColorMode`; legacy automatic mode also resolves to `'day'`/`'night'`. Explicit legacy `'light'`/`'dark'` configuration already preserves those values. Tailwind normalizes all configurations to `'light'`/`'dark'` in the resolved field, even when the configured field still contains `'day'`/`'night'`.

Keep existing accepted configuration or persisted preference values if needed, but update resolved-value comparisons.

```tsx
// Before: legacy useTheme, with day/night configuration.
import {useTheme} from '@primer/react'

function LegacyThemeImage({daySrc, nightSrc, alt}: {daySrc: string; nightSrc: string; alt: string}) {
  const {resolvedColorMode} = useTheme()
  return <img src={resolvedColorMode === 'night' ? nightSrc : daySrc} alt={alt} />
}
```

```tsx
// After: the resolved value is canonical even if colorMode="night" is retained.
import {useTheme} from '@primer/react-tailwind'

function ThemeImage({daySrc, nightSrc, alt}: {daySrc: string; nightSrc: string; alt: string}) {
  const {resolvedColorMode} = useTheme()
  return <img src={resolvedColorMode === 'dark' ? nightSrc : daySrc} alt={alt} />
}
```

Replace resolved `'day'` comparisons with `'light'` and resolved `'night'` comparisons with `'dark'`. Do not cast the new hook to a legacy theme-context type to retain the old comparisons: they would select the wrong asset at runtime.

The new context does not expose the legacy JavaScript `theme`, `colorScheme`, or `resolvedColorScheme` fields. Prefer semantic CSS tokens for styles. When content depends on a particular scheme, derive the active scheme from the resolved mode:

```tsx
const {resolvedColorMode, dayScheme, nightScheme} = useTheme()
const activeScheme = resolvedColorMode === 'dark' ? nightScheme : dayScheme
```

Scheme names and modes are distinct. For example, `colorMode="day"` with `dayScheme="dark"` still reports `resolvedColorMode="light"` but applies the dark scheme. The DOM's `data-color-mode` is chosen for CSS and is not a substitute for the hook's resolved mode.

## Updating the context

`useTheme` exposes `setColorMode`, `setDayScheme`, and `setNightScheme`. Pass the next value directly; these setters do not accept React state-updater functions.

For uncontrolled providers, the setters update local state. For controlled props, they call `onColorModeChange`, `onDaySchemeChange`, or `onNightSchemeChange`; the owner must update the corresponding prop. Color-mode callbacks receive the requested value, not a normalized resolved value.

```tsx
const {resolvedColorMode, setColorMode} = useTheme()
setColorMode(resolvedColorMode === 'dark' ? 'day' : 'night')
```

Call setters from application events, not unconditionally during render.

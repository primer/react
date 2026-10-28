# AppearancePlayground

Experimental, demo-only appearance controls for an app using Primer React:

```tsx
import {BaseStyles, ThemeProvider} from '@primer/react'
import {AppearancePlayground} from '@primer/react/experimental'

export function Demo() {
  return (
    <ThemeProvider>
      <BaseStyles>
        <AppearancePlayground>
          <App />
        </AppearancePlayground>
      </BaseStyles>
    </ThemeProvider>
  )
}
```

Keep your existing Primer setup if you already have providers and base styles.
The wrapper owns its state and includes the compact toolbar, searchable theme
sheet, themed content surface and a separate themed portal root. It accepts
children and normal div attributes, including `className`, `style` and `id`.
Controls and the theme sheet retain the host app's appearance.

- **Theme:** 17 built-in choices, including Primer, Shopify, Linear (Dark), Stripe,
  Glass UI and Windows 95. Primer follows the host app's current theme.
- **Density:** five spacing/control-size steps.
- **Seriousness:** Friendly social, Relaxed, Default, Professional and Bank security.
  These coordinate density, local font stacks, type weights and corner radii.
  Theme colors do not change; this has no security functionality.

Selecting Seriousness also selects its recommended density. Density can override
spacing afterward. Default restores theme typography/radii and Default density.
Changing themes preserves Seriousness and Density. State is local to each
mounted wrapper and is not persisted.

## Boundaries

This is not a production theme system or an official implementation of the brand
design systems. It changes scoped CSS variables, not component structure. Custom
styles and app layouts may need their own token mappings. Portals created through
Primer's inherited portal context are themed; explicit container overrides and
third-party/body portals are not automatically captured. Nested playgrounds are
not supported. Sibling instances are independent.

Use the wrapper outside transformed or clipping app containers. Its styles
include an inline style element, which a restrictive Content Security Policy may
block. No persistence, controlled-state API or remote theme loading is provided.
No brand fonts are downloaded. The bundled Windows 95 font and redistribution
notices ship with the package; palette provenance remains in the colocated JSON
snapshots. Glass UI is a flat/translucent approximation, not optical refraction.

Only the wrapper and its props are exported from `@primer/react/experimental`.
Its provider, controls, palette data and scope helpers remain implementation
details. The existing Storybook demos reuse those implementation details rather
than maintaining a second implementation.

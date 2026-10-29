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

- **Theme:** 20 built-in choices, including Primer, Shopify, Linear (Dark), Stripe,
  Noodles, New York Times, Glass UI, Windows 95 and MS DOS. Primer follows the host app's current theme.
  MS DOS adapts noted.computer's Turbo blue style with cyan text, yellow accents,
  green actions, square controls and hard shadows. Transparent actions keep cyan
  text; filled cyan and green actions retain dark text for contrast. Its locally bundled IBM VGA
  font is by VileR, licensed CC BY-SA-4.0 with attribution and license included.
  New York Times is an original newspaper-inspired preset with local serif fonts,
  white paper, dark ink, fine rules and square controls, not official NYT assets.
  Noodles pairs pale navigation and rounded white panels with neutral selection
  and larger system-font reading text. It is an original demo adaptation, with
  no reference app code, fonts, assets or private content bundled.
- **Density:** five spacing/control-size steps.
- **Seriousness:** Friendly social, Relaxed, Default, Professional and Bank security.
  These coordinate local font stacks, type weights, corner radii and gentler spacing.
  Friendly social adds purple/pink colors and soft shadows; Bank security uses
  neutral surfaces, square corners and raised OS-style buttons. Semantic status
  and danger colors remain distinguishable. Both extremes adapt to light/dark mode;
  the middle three presets retain theme colors. This has no security functionality.

Selecting Seriousness recommends Spacious at Friendly social, Compact at Bank
security, and Default at the three middle stops, rather than the two-step density
extremes. Density can still select the full five-step range afterward.
Default restores theme colors, typography/radii and Default density.
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
No brand fonts are downloaded at runtime. The bundled Windows 95 and IBM VGA fonts
and their redistribution notices ship with the package; palette provenance remains in the colocated JSON
snapshots. Glass UI is a flat/translucent approximation, not optical refraction.

Only the wrapper and its props are exported from `@primer/react/experimental`.
Its provider, controls, palette data and scope helpers remain implementation
details. The existing Storybook demos reuse those implementation details rather
than maintaining a second implementation.

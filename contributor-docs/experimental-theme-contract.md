# Experimental theme identities

`defineTheme` and `primerTheme` are available from `@primer/react/experimental`.
Pass the result to `ThemeProvider` from `@primer/react/next` (or the legacy root
provider). Identity is separate from `colorMode`: a product can use the same
identity in light, dark, or automatic mode.

```tsx
import {defineTheme, primerTheme} from '@primer/react/experimental'
import {ThemeProvider} from '@primer/react/next'

const productTheme = defineTheme({
  name: 'workspace',
  extends: primerTheme,
  typography: {
    fontFamily: {
      body: 'system-ui, sans-serif',
      heading: 'system-ui, sans-serif',
      monospace: 'ui-monospace, monospace',
    },
  },
  radii: {small: '4px', medium: '8px', large: '12px'},
  colorSchemes: {
    dark: {
      tokens: {
        'bgColor.default': '#101217',
        'bgColor.muted': '#191d24',
        'fgColor.default': '#e6edf3',
        'borderColor.default': '#707c8c',
        'control.bgColor.rest': '#222833',
        'control.bgColor.hover': '#2b3340',
        'control.bgColor.active': '#343e4d',
      },
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={productTheme} colorMode="auto">
      <Workspace />
    </ThemeProvider>
  )
}
```

## Inputs and defaults

Define an identity once, outside render. `extends` defaults to `primerTheme`;
font families, radii, and individual scheme tokens merge with that explicit
base. Results are copied and frozen, so later mutation of the input cannot
change an identity. Missing light inputs retain Primer light colors, not the
dark palette.

`ThemeColorToken` is generated from the installed Primer primitives schema:
`bgColor.*`, `fgColor.*`, `borderColor.*`, `control.*`, `focus.outlineColor`, and
the explicit `button.primary.*` color roles. Names use the primitives' dotted
paths, not a separate product palette vocabulary. Unknown keys and malformed
values throw, including at runtime for JavaScript callers. Colors currently
accept opaque six-digit hex values only. Fonts accept literal CSS font stacks,
not CSS variables or rules; products own font assets and loading. Radii accept
nonnegative `px` or `rem` lengths, or `0`.

Only `dayScheme="light"` and `nightScheme="dark"` are currently supported when
an identity is active. Other scheme names throw rather than silently displaying
an incomplete theme. Providers without an identity retain their existing scheme
support, attributes, markup, and legacy JavaScript theme behavior.

The input contract is the typed definition, not the emitted CSS variable map.
Primer owns component mappings and may evolve them independently of those
inputs. This API is experimental; do not copy its internal output into product
styles.

## Coverage and state policy

The provider re-declares semantic defaults, component token references, and
typography shorthands at the **same scope** as the overrides. This is important:
an inherited CSS variable that was resolved at `:root` does not recompute when a
descendant changes one of its dependencies.

The generated mapping comes from primitives' published token metadata and CSS,
limited to semantic inputs and component tokens consumed by React CSS modules.
Regenerate it after a primitives update or when adding component token consumers:

```sh
node packages/react/script/theme-contract.mjs
npx prettier --write packages/react/src/internal/theme/themeTokens.ts
```

Covered surfaces include BaseStyles/Text body fonts, Heading variants, monospace
content using the font tokens, Button/IconButton default, primary and invisible
states, ActionList navigation/menu rows, token-based controls, and portaled
ActionMenu overlays. Shared small/medium/large radii flow to components using
those primitives. Overlay backgrounds and borders map centrally to the default
surface and border. Full/circular radii remain unchanged.

State roles are intentional inputs. Changing a background does not invent its
hover, selected, or disabled colors. Default buttons use `control.*`; invisible
buttons and list rows use `control.transparent.*`. Primary buttons expose
`button.primary.*` because one accent or success color cannot specify every
primary state. Unspecified roles keep their Primer defaults. Danger, status,
focus, and primary roles must be evaluated independently. Primary disabled
color, border, and icon treatments are independent inputs too.

### Component exceptions

Some identities need one component to differ from the shared roles, such as a
selected tab underline in an orange accent. Each scheme accepts an optional
`components` map for these cases:

```ts
defineTheme({
  name: 'noodles',
  colorSchemes: {
    dark: {
      tokens: {'bgColor.default': '#292828'},
      components: {'underlineNav.borderColor.active': '#e78a4e'},
    },
  },
})
```

`ThemeComponentToken` is generated from an allowlist of primitives component
tokens that React CSS actually reads: `button.default.*`, `button.invisible.*`,
`button.danger.*`, `overlay.bgColor`, `underlineNav.*`, `counter.*`, and
`tooltip.*`. Keys outside the allowlist throw, and values follow the same
color rules as `tokens`. Component values are emitted after shared roles at the
same scope, so they win, including over the central overlay mapping. They merge
with the base identity like `tokens`.

Prefer shared roles. Add a component exception only when a shared role would
change unrelated components, and check its contrast pairs yourself. Widening the
allowlist is a deliberate change to `componentPattern` in
`packages/react/script/theme-contract.mjs`, because every key becomes supported
input. CSS selectors and component internals are not part of this contract.

Spacing, control sizes, and type-size scales remain Primer defaults. Choose
existing size/variant props for density. Product layout and document composition
remain local CSS. Navigation's active indicator remains Primer appearance
policy, including `aria-current`; this contract does not disable it.

This does not guarantee all components are fully themeable. Hardcoded colors,
legacy styled-components JavaScript values, product-authored CSS, independent
third-party portals, component-local variables, and component-specific radii
outside the shared radius tokens are not remapped. Consumers using a literal
font or color instead of a semantic token must opt into the appropriate token.

## Boundaries, portals, SSR, and CSP

A nested provider inherits the current identity unless it receives an explicit
`theme`. An explicit identity starts from its own definition/base, not the outer
identity. Use `theme={primerTheme}` to reset to Primer inside a custom identity.
An explicit identity also defaults to `dayScheme="light"` and
`nightScheme="dark"` instead of inheriting an outer provider's scheme names.
Explicit scheme props still take precedence and must use these supported names.
Providers without an explicit identity keep inheriting schemes as before.
Changing only color mode switches schemes without changing identity.
`contextOnly` still emits no DOM/styles: descendants receive the identity, but
ordinary DOM needs a non-context-only provider boundary to apply it.

Primer `Portal` preserves the nearest identity and color-mode context in a
scoped wrapper at the destination. The default destination stays outside
overflow-clipped layout. Explicit `containerName`, `PortalContext`, and registered
destinations keep their existing precedence; the destination does not replace
the source identity. No portal registration is needed at individual menu uses.
Without an identity, Portal markup and behavior are unchanged.

Styles are emitted during server rendering, with stable scope IDs and CSS media
queries for automatic dark mode. There is no effect-time stylesheet installation
or browser-only token resolution. Portals retain their existing SSR/hydration
deferral. Use `themeNonce` on the provider for a CSP-authorized scoped style
element; the nonce propagates to nested providers and portals. This does not
remove existing component inline styles or replace the host application's CSP
configuration. Values are validated before CSS serialization.

## Contrast and verification

Theme definition is **not** automatic accessibility certification. Check actual
foreground/background pairs in each scheme and enabled state. Normal text needs
4.5:1, large text 3:1, and required non-text indicators/focus treatments need
3:1 against adjacent colors. Include muted text, links, primary rest/hover/active,
selected navigation, control boundaries, and focus indicators. Recheck after
changing tokens or loading different fonts.

The Noodles fixture compares default dark against Noodles dark with the same
components, density, layout, and interactions. Focused tests measure rendered
state colors, borders, radii, fonts, nesting, portals, switching, hydration, and
representative contrast pairs. This is coverage evidence, not a claim that all
possible product palettes or every component combination pass WCAG.

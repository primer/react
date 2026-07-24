# `@primer/react-tailwind`

Primer components implemented with Tailwind CSS and Base UI. This package has no
runtime dependency on `@primer/react`; it is a separate implementation with its
own exported types and behavior, not an exact legacy compatibility layer.

## Installation

```bash
npm install @primer/react-tailwind
```

React 18 or 19 and `react-dom` are peer dependencies. The package includes its
compiled CSS and does not require Tailwind tooling at runtime.

## Compiled CSS

Import the compiled component, theme, and utility styles once at your application
entry point:

```tsx
import '@primer/react-tailwind/styles.css'
import {Button, ThemeProvider} from '@primer/react-tailwind'
```

`base.css`, `theme.css`, and `tailwind.css` are also available as CSS subpath
exports. `base.css` is an optional Primer primitives/theme stylesheet; it does
not include Tailwind Preflight. Do not combine `styles.css` with host-generated
package utilities, or the component rules will be duplicated.

## Tailwind v4

For applications that compile package classes themselves, install Tailwind v4
and use Primer's Tailwind configuration. Adjust the `@source` path to the
location of your stylesheet:

```css
@layer theme, base, components, utilities;

@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/utilities.css' layer(utilities);
@import '@primer/react-tailwind/theme.css';
@import '@primer/tailwind-config';

@source '../node_modules/@primer/react-tailwind/dist';
```

The package's `tailwind.css` subpath is a convenience entry point containing
Primer theme CSS, `@primer/tailwind-config`, and a package source directive.
Combine it with Tailwind's own entry point:

```css
@import 'tailwindcss';
@import '@primer/react-tailwind/tailwind.css';
@source '../node_modules/@primer/react-tailwind/dist';
```

Use either compiled `styles.css` or host-generated utilities, not both. For
granular host configuration, `@primer/tailwind-config` also provides modules
such as `color`, `size`, `typography`, `shadow`, `radius`, `border`, `easing`,
and `z-index`.

## Themes

`ThemeProvider` emits the `data-color-mode`, `data-light-theme`, and
`data-dark-theme` attributes used by the compiled themes:

```tsx
import {ThemeProvider} from '@primer/react-tailwind'

// Explicit light or dark
<ThemeProvider colorMode="light" dayScheme="light">{app}</ThemeProvider>
<ThemeProvider colorMode="dark" nightScheme="dark">{app}</ThemeProvider>

// Follow prefers-color-scheme
<ThemeProvider colorMode="auto">{app}</ThemeProvider>

// High contrast is a scheme, not a separate colorMode
<ThemeProvider
  colorMode="auto"
  dayScheme="light-high-contrast"
  nightScheme="dark-high-contrast"
>
  {app}
</ThemeProvider>
```

`colorMode` accepts `light`, `dark`, `day`, `night`, or `auto`. Use
`defaultColorMode`, `defaultDayScheme`, and `defaultNightScheme` for
uncontrolled state, or the corresponding controlled props with
`onColorModeChange`, `onDaySchemeChange`, and `onNightSchemeChange`. Use
`contextOnly` when the context is needed without adding the provider wrapper.

## Imports

The package root exports the public API, including foundation APIs:

```tsx
import {BaseStyles, Button, Dialog, ThemeProvider, useTheme} from '@primer/react-tailwind'
```

Component subpaths are available for individual component bundles:

```tsx
import {Button} from '@primer/react-tailwind/Button'
import {Dialog} from '@primer/react-tailwind/Dialog'
import {Select} from '@primer/react-tailwind/Select'
```

CSS subpaths include `styles.css`, `theme.css`, `tailwind.css`, and `base.css`.
`api-inventory.json` contains the machine-readable included/excluded API list.

## Composition and state

Compound components follow Base UI's `Root`/`Trigger`/`Content` style. State
roots generally support Base UI's controlled and uncontrolled conventions:
`open`/`defaultOpen`, `value`/`defaultValue`, or
`checked`/`defaultChecked`, together with the component's `on*Change` callback.
When controlled, update the value in the callback; the exported component types
are the source of truth for each component's exact props and event signature.

Base UI's `render` prop composes behavior onto an existing element rather than
nesting interactive elements:

```tsx
<Dialog.Trigger render={<Button variant="primary">Open</Button>} />
<Dialog.Close render={<Button>Close</Button>} />
```

### Overlay

```tsx
<Dialog.Root>
  <Dialog.Trigger render={<Button>Open dialog</Button>} />
  <Dialog.Content>
    <Dialog.Title>Example dialog</Dialog.Title>
    <Dialog.Description>Dialog content.</Dialog.Description>
    <Dialog.Close render={<Button>Done</Button>} />
  </Dialog.Content>
</Dialog.Root>
```

`Popover`, `Tooltip`, `ActionMenu`, `Autocomplete`, `SelectPanel`, and
`AnchoredOverlay` use the same composable approach. Overlay content portals by
default where supported; use the component's `portal={false}` option when
appropriate.

### Forms

```tsx
<FormControl name="email">
  <FormControl.Label>Email</FormControl.Label>
  <FormControl.Control render={<TextInput type="email" />} />
  <FormControl.Caption>We will not share your address.</FormControl.Caption>
</FormControl>
```

`Checkbox`, `Radio`, `Select`, `Textarea`, `ToggleSwitch`, and other form
components accept native form attributes and Base UI state props.

### Navigation

```tsx
<NavList aria-label="Repositories">
  <NavList.List>
    <NavList.Item href="/overview" aria-current="page">
      Overview
    </NavList.Item>
    <NavList.Item href="/settings">Settings</NavList.Item>
  </NavList.List>
</NavList>
```

`Tabs`, `UnderlineNav`, `UnderlinePanels`, `PageHeader`, `Breadcrumbs`,
`Pagination`, `TreeView`, and related layout/navigation components are also
available as compound APIs.

## API coverage

Included API families are foundation, display/content, forms, selection, layout,
navigation, data, overlays, accessibility, and support utilities. Examples
include `Button`, `Banner`, `Card`, `FormControl`, `Select`, `ActionList`,
`ActionMenu`, `Stack`, `PageLayout`, `DataTable`, `Dialog`, `Popover`,
`Announce`, `Portal`, `FeatureFlags`, and `ScrollableRegion`.

Selected newer/V2 or upstream experimental APIs are promoted under stable names
in this package (for example `Tabs`, `UnderlinePanels`, `FilteredActionList`,
and `Tooltip`); use the names exported here rather than draft or `*2` names.
Not every upstream API is included, and deprecated APIs are intentionally
omitted.

The package does not implement `sx` or Primer system/styled-system props. Use
Tailwind `className` utilities, CSS, and standard HTML/Base UI props instead.

## Accessibility and SSR

Base UI supplies interaction, focus, keyboard, and ARIA behavior for the
primitives it provides. Consumers must still provide accessible names and
semantic structure: label form controls, give dialogs and popovers titles where
required, use meaningful button/link content, and provide navigation labels and
`aria-current` state.

The components can be rendered in SSR applications. `ThemeProvider` uses a
deterministic server snapshot and resolves `colorMode="auto"` from
`prefers-color-scheme` in the browser. In React Server Components applications,
render interactive components and hooks from a client boundary.

## Local development

From the repository root:

```bash
npm run build --workspace @primer/react-tailwind
npm run test --workspace @primer/react-tailwind
npm run type-check --workspace @primer/react-tailwind
npm run check:exports --workspace @primer/react-tailwind
npm run check:inventory --workspace @primer/react-tailwind
npm run check:packed-consumer --workspace @primer/react-tailwind
npm run lint:npm --workspace @primer/react-tailwind
```

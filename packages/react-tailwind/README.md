# `@primer/react-tailwind`

Primer components implemented with Tailwind CSS and Base UI. This package has no runtime dependency on `@primer/react`; it is a separate implementation with its own exported types and behavior, not an exact legacy compatibility layer.

See [Architecture](./ARCHITECTURE.md) for the package layers, behavior and CSS ownership, public API policy, React 19 and React Compiler build, differences from the styled-components implementation, and production validation boundaries.

## Installation

```bash
npm install @primer/react-tailwind
```

React 19 and `react-dom` are peer dependencies. The package includes compiled CSS for its components and does not require Tailwind tooling at runtime.

## Compiled CSS

Import the compiled component and theme styles once at your application entry point:

```tsx
import '@primer/react-tailwind/styles.css'
import {Button, ThemeProvider} from '@primer/react-tailwind'
```

`styles.css` includes the utilities used by the package's components, not arbitrary utility classes in your application. A class such as `max-w-[28rem]`, `gap-5`, or `py-12` may have no effect unless your app compiles it. In a compiled-only app, use ordinary CSS or package layout components for app-owned layout:

```tsx
import './signup.css'
;<main className="signup-layout">{children}</main>
```

```css
.signup-layout {
  display: grid;
  gap: 1.25rem;
  width: min(100%, 28rem);
  margin-inline: auto;
  padding-block: 3rem;
}
```

`base.css`, `components.css`, `theme.css`, and `tailwind.css` are also available as CSS subpath exports. `base.css` is an optional small global normalization stylesheet for box sizing, body margin, and table border collapsing; it does not include Tailwind Preflight. `components.css` contains the package's non-utility component rules and keyframes. Do not combine `styles.css` with host-generated package utilities, or the component rules will be duplicated.

## Tailwind v4

To use Tailwind utilities in application code, install Tailwind v4 and compile both the app's classes and the package's classes with Primer's Tailwind configuration. For a stylesheet at `src/index.css`:

```css
@layer theme, base, components, utilities;

@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/utilities.css' layer(utilities);
@import '@primer/react-tailwind/theme.css';
@import '@primer/tailwind-config';
@import '@primer/react-tailwind/components.css';

@source '../node_modules/@primer/react-tailwind/dist';
@source './';
```

Adjust the `@source` paths to your stylesheet, installed package, and app source locations; Tailwind must scan every directory containing the classes you use. A host-generated app can then use, for example, `<main className="mx-auto grid max-w-[28rem] gap-5 py-12">`. Import the generated stylesheet instead of `@primer/react-tailwind/styles.css`.

The package's `tailwind.css` subpath is a convenience entry point containing Primer theme CSS, `@primer/tailwind-config`, and a package source directive. Combine it with Tailwind's own entry point:

```css
@import 'tailwindcss';
@import '@primer/react-tailwind/tailwind.css';
```

Use either compiled `styles.css` or host-generated utilities, not both. For granular host configuration, `@primer/tailwind-config` also provides modules such as `color`, `size`, `typography`, `shadow`, `radius`, `border`, `easing`, and `z-index`.

**Legacy Primer CSS:** Both modes use unprefixed utility names. Legacy `@primer/css` utilities such as `px-6`, `py-8`, and `border` use `!important` and can override package styles with different values. CSS layer ordering alone does not isolate them, and this package does not yet provide a prefixed build. Verify stylesheet isolation before using the package alongside legacy Primer CSS.

## Themes

`ThemeProvider` emits the `data-color-mode`, `data-light-theme`, and `data-dark-theme` attributes used by the compiled themes:

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

`colorMode` accepts `light`, `dark`, `day`, `night`, or `auto`. Use `defaultColorMode`, `defaultDayScheme`, and `defaultNightScheme` for uncontrolled state, or the corresponding controlled props with `onColorModeChange`, `onDaySchemeChange`, and `onNightSchemeChange`. Use `contextOnly` when the context is needed without adding the provider wrapper.

`useTheme()` requires a `ThemeProvider`; unlike `@primer/react`, it does not return a default context outside one. Its `resolvedColorMode` is always `light` or `dark`, and the active scheme can be derived from the configured schemes:

```tsx
const {colorMode, resolvedColorMode, dayScheme, nightScheme} = useTheme()
const colorScheme = resolvedColorMode === 'dark' ? nightScheme : dayScheme
const legacyResolvedColorMode = colorMode === 'auto' ? (resolvedColorMode === 'dark' ? 'night' : 'day') : colorMode
```

The theme setters accept direct values, not React state updater functions. A `contextOnly` provider avoids an extra DOM wrapper but does not reproduce the legacy no-provider context's undefined values and no-op setters.

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

CSS subpaths include `styles.css`, `theme.css`, `tailwind.css`, and `base.css`. `api-inventory.json` contains the machine-readable included/excluded API list.

## Composition and state

Compound components follow Base UI's `Root`/`Trigger`/`Content` style. State roots generally support Base UI's controlled and uncontrolled conventions: `open`/`defaultOpen`, `value`/`defaultValue`, or `checked`/`defaultChecked`, together with the component's `on*Change` callback. When controlled, update the value in the callback; the exported component types are the source of truth for each component's exact props and event signature.

Base UI's `render` prop composes behavior onto an existing element rather than nesting interactive elements:

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

`Popover`, `Tooltip`, `ActionMenu`, `Autocomplete`, `SelectPanel`, and `AnchoredOverlay` use the same composable approach. Portal behavior is component-specific: menu-based primitives always use the Base UI portal required by their positioner, while components that support inline rendering expose `portal={false}`.

### Forms

```tsx
<form onSubmit={handleSubmit}>
  <FormControl name="email">
    <FormControl.Label>Email</FormControl.Label>
    <FormControl.Control render={<TextInput type="email" />} />
    <FormControl.Caption>We will not share your address.</FormControl.Caption>
  </FormControl>
  <Button type="submit" variant="primary">
    Create account
  </Button>
</form>
```

`Button` defaults to `type="button"`; use `type="submit"` for a form submission action. `Checkbox`, `Radio`, `Select`, `Textarea`, `ToggleSwitch`, and other form components accept native form attributes and Base UI state props.

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

`Tabs`, `UnderlineNav`, `UnderlinePanels`, `PageHeader`, `Breadcrumbs`, `Pagination`, `TreeView`, and related layout/navigation components are also available as compound APIs.

## API coverage

Included API families are foundation, display/content, forms, selection, layout, navigation, data, overlays, accessibility, and support utilities. Examples include `Button`, `Banner`, `Card`, `FormControl`, `Select`, `ActionList`, `ActionMenu`, `Stack`, `PageLayout`, `DataTable`, `Dialog`, `Popover`, `Announce`, `Portal`, `FeatureFlags`, and `ScrollableRegion`.

Selected newer/V2 or upstream experimental APIs are promoted under stable names in this package (for example `Tabs`, `UnderlinePanels`, `FilteredActionList`, and `Tooltip`); use the names exported here rather than draft or `*2` names. Not every upstream API is included, and deprecated APIs are intentionally omitted.

The package does not implement `sx` or Primer system/styled-system props. Use CSS, standard HTML/Base UI props, and—when your app compiles them—Tailwind `className` utilities instead.

## Using this package with AI tools

[`AGENTS.md`](./AGENTS.md) documents the conventions an agent needs to generate correct code against this package, including what replaces `sx`, when to use `render` versus `as`, and which upstream names changed.

`llms.txt` is a generated, machine-readable version of that guidance plus an index of every component, its intent, and its differences from `@primer/react`. Consumers can read it from the installed package:

```tsx
import guidance from '@primer/react-tailwind/llms.txt'
```

Because guidance written for `@primer/react` is often wrong here, point AI tooling at these files rather than at general Primer React documentation.

## Accessibility and SSR

Base UI supplies interaction, focus, keyboard, and ARIA behavior for the primitives it provides. Consumers must still provide accessible names and semantic structure: label form controls, give dialogs and popovers titles where required, use meaningful button/link content, and provide navigation labels and `aria-current` state.

The components can be rendered in SSR applications. `ThemeProvider` uses a deterministic server snapshot and resolves `colorMode="auto"` from `prefers-color-scheme` in the browser. In React Server Components applications, render interactive components and hooks from a client boundary.

## Local development

From the repository root:

```bash
npm run build --workspace @primer/react-tailwind
npm run test --workspace @primer/react-tailwind
npm run type-check --workspace @primer/react-tailwind
npm run check:exports --workspace @primer/react-tailwind
npm run check:inventory --workspace @primer/react-tailwind
npm run check:packed-consumer --workspace @primer/react-tailwind
npm run check:docs-json --workspace @primer/react-tailwind
npm run check:llms --workspace @primer/react-tailwind
npm run lint:tailwind --workspace @primer/react-tailwind
npm run lint:npm --workspace @primer/react-tailwind
```

### Generated API documentation

Component `*.docs.json` files are generated from the source types. Storybook API references and the `llms/` component files use that metadata; keep behavior and migration guidance in the component README and alignment notes rather than editing generated files.

After changing component types or guidance, rebuild the doc generator and refresh both outputs:

```bash
npm run build --workspace @primer/doc-gen
npm run build:docs-json --workspace @primer/react-tailwind
npm run build:llms --workspace @primer/react-tailwind
```

Use `check:docs-json` and `check:llms` to verify the generated files are current.

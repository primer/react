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

`base.css`, `components.css`, `theme.css`, and `tailwind.css` are also available as CSS subpath exports. Use the granular theme, component, and base styles only when intentionally composing a custom package stylesheet; do not add them alongside `styles.css`. `base.css` is an optional small global normalization stylesheet for box sizing, body margin, and table border collapsing; it does not include Tailwind Preflight. `components.css` contains the package's non-utility component rules and keyframes.

**Stacking tokens:** The current package CSS references Primer's `--zIndex-*` variables but does not define them. Hosts must supply these variables in every CSS setup. With a directly installed `@primer/primitives` 11.5.0 or later, include its `dist/css/functional/size/z-index.css` stylesheet. Earlier supported primitive versions do not contain that file, so those hosts need equivalent compatible variables from their existing theme. Without them, the overlay z-index utilities compute to `auto`.

## Tailwind v4

Package-owned utilities use the `primer:` prefix in source (placed first, before variants, for example `primer:md:px-4`), so the package's default compiled `styles.css` emits only prefixed utilities and never your app's unprefixed classes. Hosts that do not compile the package should import that precompiled stylesheet once.

To add host-owned Tailwind v4 utilities without compiling the package, include `styles.css` once in the host's Tailwind entry and compile only the application's unprefixed utilities around it. For a stylesheet at `src/index.css`:

```css
@layer theme, base, components, utilities;

@import '@primer/react-tailwind/styles.css';
@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/utilities.css' layer(utilities);
@import '@primer/tailwind-config';

@source './';
```

Adjust the `@source` path to your app source locations; Tailwind must scan every directory containing the classes you use. Do not scan the package's `dist`: its utilities are already compiled and prefixed in `styles.css`. Your app can then use unprefixed classes, for example `<main className="mx-auto grid max-w-[28rem] gap-5 py-12">`. Caller `className` values are never prefixed, and the package's class merging lets them replace conflicting package utilities in the rendered class list.

If a custom host Tailwind build imports package layers such as `theme.css` or `components.css` directly, that build owns those layers and must not also import `styles.css`. Direct granular imports are building blocks for an intentional custom package compilation, not additions to the precompiled setup.

The package's `tailwind.css` subpath is an optional, standalone Tailwind entry point for generating the package's own prefixed styles as a separate stylesheet. Do not import it into the same Tailwind stylesheet as your app's unprefixed utilities: a Tailwind build has one prefix, so the two would conflict. Use either compiled `styles.css` or a separately generated package stylesheet, not both. For granular host configuration, `@primer/tailwind-config` also provides modules such as `color`, `size`, `typography`, `shadow`, `radius`, `border`, `easing`, and `z-index`.

For that optional mode, create a separate entry such as `src/primer-components.css`:

```css
@import '@primer/react-tailwind/tailwind.css';
```

Compile this entry independently from your application's Tailwind entry and load both generated stylesheets. Do not add another `@import 'tailwindcss'` to the package entry; it already supplies Tailwind's theme and utilities. The packed-consumer validation compiles this entry against the supported Tailwind versions.

Load your application's utility stylesheet after the package stylesheet. Both use the `utilities` layer, so source order can decide equal-specificity rules that remain together, such as a package radius and a caller's partial-corner override. Class merging removes recognized full conflicts, not every combination of related properties.

**Legacy Primer CSS:** Package-owned utilities are prefixed in the built stylesheet, but the packed-consumer validation does not load legacy `@primer/css`. Prefix-based coexistence therefore remains unverified, not an isolation guarantee. Host-authored unprefixed utilities can still match legacy selectors, and shared `--tw-*` custom properties can interact across stylesheets. Verify computed styles in your host before relying on the combination.

#### Hosts that still load legacy Primer CSS

Legacy `@primer/css` utilities such as `.p-0`, `.py-2`, and `.px-6` are unlayered `!important` declarations. They beat every normal declaration, whatever its layer, specificity, or stylesheet order: the package's layered utilities and an unlayered CSS-module rule such as `padding: 0` both lose. Legacy utilities also use physical properties, so a later `.py-2` overrides the top and bottom of an earlier `.p-0` on the same element.

Whenever application code adds an unprefixed class name that legacy CSS also defines, the legacy rule decides the value and can block normal overrides.

To resolve a collision:

- **Replace a conflicting package utility.** Pass the replacement utility in `className`: package components merge prefixed defaults and unprefixed caller classes with `tailwind-merge`, so a full conflict removes the package default from the rendered class list.
- **Use an important utility in a layer.** For important declarations the cascade reverses: an important declaration inside any cascade layer beats unlayered `!important`. An unprefixed utility with the important modifier (a trailing `!` on the class name) from your app's own layered Tailwind build therefore wins over legacy `.py-2`. The compiled `styles.css` contains only the package's own prefixed classes, so this requires your app's build.
- **Do not rely on layer order or specificity** for normal declarations, including CSS modules, while a colliding legacy class is present.

For example, the button styling used by `IconButton` contributes `primer:rounded-md`. A partial override such as `rounded-s-none` does not fully conflict with that radius, but a full replacement such as `rounded-none` makes `tailwind-merge` remove `primer:rounded-md` from the rendered class list. A CSS module can then set the desired corners:

```tsx
<IconButton aria-label="Add" icon={PlusIcon} className={`rounded-none ${styles.squareStart}`} />
```

```css
.squareStart {
  border-radius: var(--borderRadius-medium);
  border-start-start-radius: 0;
  border-end-start-radius: 0;
}
```

The package's compiled stylesheet contains only the package-owned prefixed radius utilities, not the caller-owned unprefixed `rounded-none`. The host Tailwind setup above must scan and compile that caller class. This class-merging behavior does not verify coexistence with legacy CSS; test the result in the host.

These are per-site mitigations, not isolation. Audit computed styles where package components sit inside legacy layouts, and retest whenever legacy CSS is loaded on the page.

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
  dayScheme="light_high_contrast"
  nightScheme="dark_high_contrast"
>
  {app}
</ThemeProvider>
```

The built-in high-contrast scheme names use underscores, even though their CSS filenames use hyphens. Scheme strings are passed through unchanged; custom names require matching theme CSS.

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

Two narrow foundation subpaths expose flat, server-component-safe named exports. They currently cover only portal routing; Base UI still owns portal mounting, focus, dismissal, and positioning for every pattern.

```tsx
import {BasePortalProvider, type PortalContainer} from '@primer/react-tailwind/base'
import {usePortalContainer, usePortalRoot} from '@primer/react-tailwind/behaviors'
```

- `BasePortalProvider` is the same component as `Portal.Provider`. It renders no element and sets the default container for `Portal` and every Primer floating part beneath it. Use the flat export where a namespace member cannot be referenced, such as a React Server Component layout.
- `usePortalContainer(container?)` returns the `container` to pass to a Base UI `Portal` part that the app composes directly, so it routes like Primer's floating components: an explicit container (including `null`), then the nearest provider (including `null`), then the default root. It returns `undefined` inside a Primer floating layer, letting Base UI keep nested content in that layer, and before the default root is known during SSR and hydration. Refs are returned unresolved.
- `usePortalRoot()` returns the default root, ignoring providers: the nearest `BaseStyles`, then the first `[data-portal-root]`, then `document.body`; `null` during SSR and hydration. Pass it to a nested provider to replace an inherited container with the default root.
- `PortalContainer` is an element, shadow root, ref to either, or `null` (wait for a container). Named registries are not supported.

`BasePortalProvider` and both hooks are client modules. There is no `@primer/react-tailwind/base` portal component: use `Portal`, or a Base UI `Portal` part with `usePortalContainer`.

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

`Popover`, `Tooltip`, `ActionMenu`, `Autocomplete`, `SelectPanel`, and `AnchoredOverlay` use the same composable approach. Portal behavior is component-specific: menu-based primitives always use the Base UI portal required by their positioner, while components that support inline rendering expose `portal={false}`. Wrap a subtree in `<Portal.Provider container={element}>` to set the default portal destination for every Primer portal and floating part inside it, including tooltips that `IconButton` and `SegmentedControl` create internally. The provider renders no element. An explicit `container` prop or `portal={false}` still takes precedence. Nested floating layers use their owning portal unless a nearer provider is supplied.

When a `Dialog`, `ConfirmationDialog`, or dialog-presented `SelectPanel` is opened from a Primer floating layer, its backdrop and viewport use the popover layer so they can appear above the parent; top-level dialogs use the modal layer. This relies on the stacking tokens above and the normal nested portal order, not a global overlay-stack manager. An explicit container, a nearer portal provider, inline rendering, custom z-index, clipping, or an ancestor stacking context may change the result. Check pointer hit testing, nested overlays, backdrop, focus containment, Escape, and return focus in the host. A larger viewport z-index alone does not necessarily lift its backdrop or a popover opened inside it.

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

```js
import {readFile} from 'node:fs/promises'
import {createRequire} from 'node:module'

const require = createRequire(import.meta.url)
const guidance = await readFile(require.resolve('@primer/react-tailwind/llms.txt'), 'utf8')
const button = await readFile(require.resolve('@primer/react-tailwind/llms/Button.md'), 'utf8')
```

Because guidance written for `@primer/react` is often wrong here, point AI tooling at these files rather than at general Primer React documentation.

These are text-file exports, not JavaScript imports: no bundler text loader is needed. The package also exports `AGENTS.md` and `api-inventory.schema.json` explicitly. Each component guide contains usage examples and authored composition, state, accessibility, and styling guidance where documented, alongside generated props and migration notes. The guides are generated from the same component README and alignment notes used by people; there is no separate per-component agent specification to maintain.

The generator discovers public component directories from their entry points, not from existing documentation, and fails if a README, alignment notes, API metadata, or fenced usage example is missing. `check:llms` also rejects missing or stale generated guides.

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

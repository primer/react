# Working with `@primer/react-tailwind`

Guidance for coding agents and LLMs generating code that uses this package.

`@primer/react-tailwind` implements the Primer design system with Tailwind CSS and Base UI. It is a separate implementation from `@primer/react`, not a compatibility layer. Guidance written for `@primer/react` is frequently wrong here.

## Setup

Render the app inside `ThemeProvider` and `BaseStyles`, and import the stylesheet once at the entry point.

```tsx
import '@primer/react-tailwind/styles.css'
import {BaseStyles, ThemeProvider} from '@primer/react-tailwind'
;<ThemeProvider colorMode="auto">
  <BaseStyles>{app}</BaseStyles>
</ThemeProvider>
```

Import components from the root or from a component subpath. Both resolve to the same implementation.

```tsx
import {Button} from '@primer/react-tailwind'
import {Button} from '@primer/react-tailwind/Button'
```

## Rules

- Style with `className`. There is no `sx` prop and no styled-system props such as `m`, `p`, `bg`, or `color`. Reaching for `sx` is the most common mistake when adapting `@primer/react` code.
- Use Primer semantic Tailwind utilities such as `text-default`, `bg-muted`, and `border-default` rather than raw palette values such as `text-gray-500`. Colors must resolve through Primer tokens so themes and high-contrast schemes keep working.
- Change the rendered element with `render` on Base UI-backed components such as `Button`, `Dialog`, and `Tooltip`, and with `as` on presentational components such as `Text`, `Stack`, `Card`, and `PageLayout`. Check the component's props before choosing.
- React 19 is the only supported peer. The package is compiled with React Compiler; do not add manual `memo`, `useMemo`, or `useCallback` wrappers around package components for performance alone.
- Components forward their root ref and unrecognized DOM props to their root element. Prefer passing standard DOM props directly instead of wrapping components in extra elements.
- There is no `Box` component. Use a plain element with `className`, or `Stack` for layout.

## Composition

Compound components expose Base UI-style parts, commonly `Root`, `Trigger`, `Portal`, `Positioner`, `Popup` or `Content`, `Title`, `Description`, and `Close`. Use the documented parts rather than recreating behavior with generic elements, because the parts carry the focus, dismissal, and ARIA wiring.

```tsx
<Dialog>
  <Dialog.Trigger render={<Button>Open</Button>} />
  <Dialog.Content>
    <Dialog.Title>Title</Dialog.Title>
  </Dialog.Content>
</Dialog>
```

Do not nest interactive elements. To make a component navigate, pass an anchor through `render` instead of placing an `<a>` inside a button.

## Choosing a component

- Action in the current view: `Button`. Navigation: `Link`, or `LinkButton` for button styling. Icon-only: `IconButton` with a required `aria-label`.
- Choosing from a known list: `ActionMenu` for commands, `SelectPanel` for a filterable picker, `Select` for a short native list, `Autocomplete` for free text with suggestions.
- Status and metadata: `Label` for general metadata, `StateLabel` for issue and pull request state, `CounterLabel` for counts.
- Messaging: `Banner` for page-level status, `Dialog` when the message must block the task, `FormControl` validation for a single field.
- Announcing asynchronous changes: `Announce`, or `AriaStatus` and `AriaAlert` for a fixed politeness. There is no component named `LiveRegion`.

## Names that changed from `@primer/react`

Experimental and versioned components are promoted to their stable names. Use `Dialog`, not `DialogV2`. Use `Tooltip`, not `TooltipV2`. Use `SelectPanel`, not `SelectPanel2`. Use `Breadcrumbs`, not `Breadcrumb`.

Deprecated APIs are not included. Use `NavList` instead of `SideNav`, `TextInput` with `Token` composition instead of `TextInputWithTokens`, and Octicons with your own styling instead of `CircleBadge`.

## Accessibility

Every interactive control needs an accessible name. `IconButton` requires `aria-label`. Associate form controls with `FormControl`, or with a native label, rather than placing text beside an input. Announce asynchronous updates with `Announce` or `AriaStatus` instead of moving focus.

## Verifying generated code

If a prop is uncertain, read the shipped TypeScript declarations rather than assuming the `@primer/react` signature. Each component directory also ships `README.mdx` for usage and `ALIGNMENT.md` for differences from the legacy component.

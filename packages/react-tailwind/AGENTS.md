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

Portal routing for host-composed Base UI parts lives in two narrow foundation subpaths with flat exports: `BasePortalProvider` (the same component as `Portal.Provider`) from `@primer/react-tailwind/base`, and `usePortalContainer` and `usePortalRoot` from `@primer/react-tailwind/behaviors`. Pass `usePortalContainer()` to a Base UI `Portal` part's `container`; do not reimplement portal mounting, focus, or dismissal. These subpaths contain nothing else.

The compiled `styles.css` styles package components; it does not generate arbitrary app-owned Tailwind classes. With this setup, use ordinary CSS or package layout components such as `Stack` for application layout. To use Tailwind utilities in app code, run a separate Tailwind v4 build with Primer's config and unprefixed class names that scans only app sources; keep importing `styles.css` for components. See the package README.

Package-owned utilities use the `primer:` prefix (first, before variants); caller `className` stays unprefixed and is merged over both prefixed and unprefixed package utilities. Compiled `styles.css` is the default and emits only package utilities. App utilities are unprefixed in the host's own Tailwind build, which must not scan the package `dist`. The optional `tailwind.css` is a standalone entry for a separate stylesheet and must not be imported into the same Tailwind stylesheet as app utilities (one prefix per build). The prefix is an unvalidated migration candidate: shared `--tw-*` properties may still interact with legacy `@primer/css`, so verify isolation in the host.

## Rules

- Style with CSS classes via `className`; Tailwind utilities work only when your app compiles them. There is no `sx` prop and no styled-system props such as `m`, `p`, `bg`, or `color`. Reaching for `sx` is the most common mistake when adapting `@primer/react` code.
- When using a host Tailwind build, use Primer semantic utilities such as `text-default`, `bg-muted`, and `border-default` rather than raw palette values such as `text-gray-500`. Colors must resolve through Primer tokens so themes and high-contrast schemes keep working.
- Not every default Tailwind utility exists. The Primer type scale replaces the default one, so `text-base` and `text-lg` generate nothing; use `text-body-medium`, `text-body-large`, or a title size. There are no `ring-*` or `bg-border-*` color utilities either. When no utility exists, use the token directly, as in `bg-[var(--borderColor-muted)]`.
- In a host Tailwind build, focus treatment is `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus`.
- Change the rendered element with `render` on Base UI-backed components such as `Button`, `Dialog`, and `Tooltip`, and with `as` on presentational components such as `Text`, `Stack`, `Card`, and `PageLayout`. Check the component's props before choosing.
- React 19 is the only supported peer. The package is compiled with React Compiler; do not add manual `memo`, `useMemo`, or `useCallback` wrappers around package components for performance alone.
- Most components forward their root ref and unrecognized DOM props to their root element; check the component's shipped `llms/` guide for exceptions. `TextInput` applies `className` to its visual wrapper, while its ref, native input props, and `style` apply to the underlying `<input>`. Component-owned style properties, such as geometry custom properties like `--dialog-width`, are layered over a caller's `style`, so do not assume caller `style` always wins. Prefer passing standard DOM props directly instead of wrapping components in extra elements.
- There is no `Box` component. Use a plain element with `className`, or `Stack` for layout.
- `Button` defaults to `type="button"`; set `type="submit"` on a form submission action.

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

Compound components that identify a child by role also accept an element prop of the same name. Use the child form by default; use the prop when your own component wraps a part, because the parent cannot recognize a wrapper by type. The prop wins over a matching child, so do not supply both.

```tsx
// A wrapper the parent cannot recognize, handed to the region directly.
<PageLayout sidebar={<RepoSidebar />}>
  <PageLayout.Content>{children}</PageLayout.Content>
</PageLayout>
```

The regions are `header`, `sidebar`, and `footer` on `PageLayout`; `icon`, `image`, `heading`, `description`, `metadata`, and `action` on `Card`; `label`, `caption`, `validation`, and `leadingVisual` on `FormControl`; `heading` on `NavList` and `ActionList.Group`; `leadingVisual`, `trailingVisual`, `description`, and `trailingAction` on `NavList.Item`, `ActionList.Item`, and `ActionList.LinkItem`; `trailingAction` on `ActionList.GroupHeading`; and `leadingVisual`, `trailingVisual`, and `subtree` on `TreeView.Item`.

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

If a prop is uncertain, read the shipped TypeScript declarations rather than assuming the `@primer/react` signature. The package ships `dist` (including declarations) and the `llms/` component guides; component `README.mdx` and `ALIGNMENT.md` files live in the repository source and are not shipped, and their guidance is summarized in the `llms/` guides.

Start with `llms.txt`, then load the linked guide for the component you need. The guides include authored usage examples, composition, state and styling guidance where documented, generated prop references, and migration notes. This shared `AGENTS.md` applies to every component; do not create a second independently maintained set of agent instructions.

Read these exports as files, not JavaScript modules. In a Node.js script inside the consuming application:

```js
import {readFile} from 'node:fs/promises'
import {createRequire} from 'node:module'

const require = createRequire(import.meta.url)
const index = await readFile(require.resolve('@primer/react-tailwind/llms.txt'), 'utf8')
const button = await readFile(require.resolve('@primer/react-tailwind/llms/Button.md'), 'utf8')
```

`@primer/react-tailwind/AGENTS.md` and `@primer/react-tailwind/api-inventory.schema.json` are also explicit file exports. Read the installed version, rather than assuming the documentation on the repository's default branch matches it. No CLI, raw-text bundler loader, or Tailwind compiler is required to retrieve guidance.

## Customization boundaries

Start with documented variants and semantic tokens, then use `className` on the documented component or part. When structure must change, compose public parts with `render`, `as`, or region props as supported. `ButtonBase` is a styled lower-level button, not an unstyled replacement for Base UI.

Use the component guide's documented data attributes when styling state or parts. Other DOM structure, generated utility names, and internal helpers are not supported extension APIs. A class-merging result does not prove that a CSS declaration wins in the host's cascade; verify the result with the actual stylesheets, states, and viewports.

Use `Portal.Provider` or a floating part's `container` to choose a portal destination. A custom destination outside a themed subtree does not automatically inherit that subtree's CSS custom properties. Retain the required theme styles and verify nested overlays, clipping, focus, dismissal, and return focus in the host.

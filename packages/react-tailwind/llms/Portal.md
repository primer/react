# Portal

`Portal` renders children outside their React parent's DOM subtree while preserving React context.

Import: `import {Portal} from '@primer/react-tailwind/Portal'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Usage

```tsx
import {Portal} from '@primer/react-tailwind'
;<Portal container={containerRef}>Content rendered outside its parent.</Portal>
```

Portal changes DOM placement, not reading order or focus behavior. Give its contents an appropriate role, accessible name, focus management, and dismissal behavior.

`container` accepts an element or ref, not a registered name. When migrating from `containerName`, resolve the named target in your application and pass it as `container`; remove `containerName` instead of spreading it onto the portal's div. Without a `container`, the nearest `BaseStyles` portal root is used, followed by the first `[data-portal-root]` in the document and then `document.body`.

## Routing a subtree

`Portal.Provider` sets the default container for `Portal` and every Primer floating part beneath it without rendering an element. An explicit `container` (including `null`) wins, then the nearest provider (including `null`, which waits), then the default root. In a React Server Component, import the same component as the flat `BasePortalProvider` export:

```tsx
import {BasePortalProvider} from '@primer/react-tailwind/base'
;<BasePortalProvider container={hostRegionRef}>{children}</BasePortalProvider>
```

When the app composes a Base UI `Portal` part directly, pass `usePortalContainer()` from `@primer/react-tailwind/behaviors` as its `container` so it follows the same routing and stays inside an enclosing Primer floating layer. Base UI still mounts the portal and owns focus and dismissal.

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `container`: `PortalContainer` — Where the children are rendered. Defaults to the shared portal root.
- `onMount`: `(() => void)` — Called once the children have been rendered into the container.

## Portal.Provider

- `children`: `React.ReactNode`
- `container`: `PortalContainer` — Default destination for `Portal` and every Primer floating part beneath it, including tooltips that controls such as `IconButton` render internally. `undefined` inherits the outer default; `null` makes portals wait for a container instead of falling back to the document. Explicit `container` props and `portal={false}` still win.

## Differences from `@primer/react`

- Replace `containerName` with a DOM `container` or ref. Named lookup is not provided; resolve names in the application and remove the old prop instead of forwarding it to the DOM.
- **Host portal scope:** the package does not consume legacy `PortalContext` or its named registry. The github-ui host reported an issue-viewer portal escaping a hidden/inert child view and routed 28 legacy Portal imports through its adapter to preserve that scope. Resolve the named root in the host and pass it to `Portal.Provider container`. It is DOM-free and applies to `Portal` and every Primer floating part beneath it, including tooltips generated inside `IconButton`, `IconLinkButton`, `SegmentedControl`, ActionList, NavList, and TreeView. `BaseStyles` is not a neutral replacement: it renders a typography/color root and marks it as a default portal target.
- **`Portal.Provider` contract:** resolution order is an explicit `container` prop, then the nearest `Portal.Provider`, then the nearest `BaseStyles`, then `[data-portal-root]`, then `document.body`. `portal={false}` still renders in place. `container={undefined}` is transparent and inherits the outer default. `container={null}` makes portals wait without falling back to the document. Element and ref containers are both accepted, and portals follow the container when it changes. Content nested in a Primer floating layer stays in that layer's Base UI portal unless a provider is rendered inside the layer. Named-registry lookup stays in the host, as do focus, dismissal, native-dialog observation, and top-layer behavior. The provider changes routing only; it does not make tooltip dismissal win over an ancestor Escape capture handler.
- **Parity gap — cross-portal focus-trap ownership:** Base UI floating and modal layers do not coordinate with legacy `@primer/behaviors` focus traps. The github-ui host reported a body-portaled `Dialog` opened from a legacy SidePanel being pulled back to the trigger by the panel's trap; it coordinates nested overlay ownership and suspends and resumes the legacy trap in its adapter. Chromium host tests cover one and two nested panels, StrictMode, Tab wrapping, and Escape with focus restoration. In an AnchoredOverlay case, Base UI 1.8's `FloatingPortal` temporarily sets its descendants to `tabindex="-1"` (marked with `data-tabindex`) on focusout before the legacy trap sees focus leave, so the trap can find no tabbable fallback. The host's provisional adapter remembers the last focused descendant and restores it only in that case, leaving pointer outside-dismissal intact; 42 AnchoredOverlay tests and the nested-panel cases pass. This depends on Base UI internals and is not cross-browser or assistive-technology validation. Primer has no supported contract for cross-portal focus-trap or overlay-ownership integration; until one exists, migrate a legacy trap container and the overlays it opens together, or have the host suspend the outer trap while a Base UI layer owns focus.
- **Inheritance reset gap:** `container={undefined}` intentionally inherits; it does not clear an outer provider. There is currently no reset or disable-inheritance option that resumes automatic default-root lookup. `container={null}` is not a reset: it waits for a container. To replace an inherited target, pass the desired host element or ref explicitly to a nested provider; `usePortalRoot()` from `@primer/react-tailwind/behaviors` returns the package default root for that purpose. This differs from a nested legacy `PortalContext value={{}}`, which replaces the outer named registry. The github-ui adapter explicitly resolves its default legacy root for that case and reports a passing internal IconButton tooltip regression; no current production empty-scope callsite was reported. A public automatic-reset contract remains an API gap, not a behavior added to this evaluation build.
- **Flat foundation exports:** `BasePortalProvider` from `@primer/react-tailwind/base` is the same component as `Portal.Provider`, exported flat for server components. Host-composed Base UI `Portal` parts can follow the same routing by passing `usePortalContainer()` from `@primer/react-tailwind/behaviors` as their `container`. Primer does not add an unstyled portal component: Base UI owns pattern portals, and `Portal` remains the standalone styled utility.
- Add `[data-portal-root]` to a root when a shared default is desired.
- Remove `sx` and styled-system props; move styling to the portaled content.

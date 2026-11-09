# Breadcrumbs

`Breadcrumbs` communicates the current location within a hierarchy.

Import: `import {Breadcrumbs} from '@primer/react-tailwind/Breadcrumbs'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Import and usage

```tsx
import {Breadcrumbs} from '@primer/react-tailwind/Breadcrumbs'
;<Breadcrumbs>
  <Breadcrumbs.Item href="/projects">Projects</Breadcrumbs.Item>
  <Breadcrumbs.Item href="#" selected>
    Components
  </Breadcrumbs.Item>
</Breadcrumbs>
```

Use one final selected item for the current location. `overflow="menu"` lets the component own collapsed ancestors while preserving native link behavior.

By default, breadcrumb items and the overflow button have a minimum size of 28 CSS pixels. Custom sizing and adjacent controls should also preserve adequately sized or spaced pointer targets, including when the root font size is reduced. Overflow responds when the button's size changes.

`Breadcrumbs.Item` infers the props and ref of the element selected by `as`, so router-specific props can be passed directly. The router component must forward the supplied props and ref to its interactive element, including when an item appears in the overflow menu.

For a typed wrapper, use `BreadcrumbsItemProps<typeof RouterLink>` to include the router's props. Unparameterized `BreadcrumbsItemProps` and `React.ComponentProps<typeof Breadcrumbs.Item>` retain the legacy anchor-shaped props and broadly typed `as`.

The menu overflow modes render hidden, inert copies of ancestor items to measure their widths. Those children mount separately, so components with mount effects will run them for both copies. Inert does not prevent effects from registering global shortcuts or opening portaled content. The copies do not share local component state; if their content differs from the visible items, the measured widths may not match. The final item mounts only once. Use `overflow="wrap"` when a copied item has global shortcuts or other mount side effects.

Wrapped items can break long unbroken names to fit their container. When a retained final item cannot fit alongside the overflow control, it can wrap onto multiple lines without remounting. Containers narrower than their interactive controls may still overflow, and long unbroken labels may produce a tall layout; allocate sufficient space or provide an appropriate responsive navigation layout. The overflow control currently exposes navigation as an ARIA menu and adds `aria-controls` when open. GitHub's internal accessibility guidance prohibits menu and menuitem roles for navigation and prohibits `aria-controls`; this component does not expose a trigger prop to suppress it. Use `overflow="wrap"` where that policy applies while the menu behavior is under specialist review.

Renders a [`<nav>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `overflow`: `"menu" | "menu-with-root" | "wrap"` — Default `'wrap'`. How the trail behaves when it is too wide: wrap onto another line, or collapse the middle into a menu.
- `variant`: `"normal" | "spacious"` — Default `'normal'`. Use `spacious` to increase the spacing between items.

## Breadcrumbs.Item

Renders an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `as`: `As` — Default `'a'`. Element or component supplied by the wrapper.
- `className`: `string`
- `ref`: `Ref<HTMLElement>`
- `selected`: `boolean` — Marks the item as the current page, which is announced to assistive technology.

## Differences from `@primer/react`

- Normal breadcrumb and item composition is intended to be drop-in.
- Verify custom overflow menu styling or selectors against the new `ActionMenu` composition.
- **Breaking (semantics):** Overflowed items are now ARIA menu items in a portaled `ActionMenu`, not links in a disclosure list. Each item keeps its native `<a href>` (with `role="menuitem"`), so activation, modified clicks, and click handlers still work. Keyboard users open the trigger with Enter, Space, or ArrowDown, move between items with the arrow keys instead of Tab, and press Escape to close and return focus to the trigger. Tab leaves the menu. Update tests and selectors that query overflowed items by role `link` to use role `menuitem`, and scope them to the open menu because it renders in a portal.

  ```tsx
  // Before
  await user.click(screen.getByRole('button', {name: /more breadcrumb items/}))
  screen.getByRole('link', {name: 'github'})

  // After
  await user.click(screen.getByRole('button', {name: /more breadcrumb items/}))
  await screen.findByRole('menuitem', {name: 'github'})
  ```

- **Custom component props:** `Breadcrumbs.Item as={RouterLink}` infers the router's required props and ref, including destinations such as `to`. Router components must forward their props and ref to the interactive element, including when rendered in the overflow menu.
- By default, breadcrumb items and the overflow button have a 28 CSS pixel minimum, so controls may occupy more space than in Primer React. Overflow responds to changes in the button's size.
- **Parity gap:** Menu overflow modes mount inert, hidden measurement copies of ancestor items. Interactive ancestor components and their effects mount twice, unlike the legacy implementation. A reduced delayed-response scenario shows a hidden ancestor copy taking a global shortcut and opening portaled content. The copy's local state is independent of the visible item, so their widths can diverge. The final item mounts only once. `overflow="wrap"` avoids the measurement copies.
- Wrapped items can break long unbroken names to fit their container. A retained final item can wrap when it cannot fit beside the overflow control, but extremely narrow containers may still overflow or produce a tall layout. When resizing moves the focused item into overflow, focus moves to the menu trigger. When a focused menu item becomes visible, focus remains in the menu if it is still open; otherwise, it moves to an available visible breadcrumb. Switching from menu to wrap similarly recovers focus when an overflow control disappears. If a focused item is removed, focus moves to a remaining focusable breadcrumb when possible.
- **Accessibility review needed:** GitHub's internal guidance prohibits `menu` and `menuitem` roles for navigation and prohibits the `aria-controls` emitted by the open overflow trigger. It also generally discourages supplementing Primer focus management. This composition and its manual focus recovery need specialist review; these policy concerns are not by themselves WCAG failures. `overflow="wrap"` avoids the menu.
- **Investigation:** In automated WebKit, pressing End immediately after opening a just-resized overflow menu sometimes leaves focus on its first item, and an extremely fast drag away from the trigger can leave the menu open rather than canceling. The settled-menu keyboard checks pass; native Safari and assistive technology have not been evaluated.
- Remove `sx` and other styled-system props.

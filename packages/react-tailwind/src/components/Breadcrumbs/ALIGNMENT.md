# Alignment

## From: `@primer/react`

`Breadcrumbs` renders an ordered breadcrumb navigation with `Breadcrumbs.Item` children. Items support `href`, `selected`, `separator`, and the polymorphic link behavior supplied by the legacy component. The `overflow` prop collapses items into an overflow menu, while `variant` controls the visual treatment. The legacy implementation combines styled-system props, CSS modules, and a `<details>` disclosure whose overflow popup is a plain `ActionList` of links.

## To: `@primer/react-tailwind`

The Tailwind component preserves `Breadcrumbs`, `Breadcrumbs.Item`, `overflow`, and `variant`, and continues to render a navigation landmark with an ordered list. Its layout, separators, selected state, and responsive styling use Tailwind utilities and Primer tokens. Overflow is composed with the package's `ActionMenu` rather than the legacy menu implementation. The component remains presentational/navigation behavior; it is not a Base UI replacement.

## Migration notes

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

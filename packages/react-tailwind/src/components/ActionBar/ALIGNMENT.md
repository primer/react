# Alignment

## From: `@primer/react`

Legacy ActionBar is a compound toolbar with button, icon-button, group, divider, and menu parts. Items that do not fit move into a "More items" overflow menu in bar order, and `ActionBar.Menu` takes an `items` array with dividers, visuals, danger variants, and submenus.

## To: `@primer/react-tailwind`

ActionBar keeps the same `Button`, `IconButton`, `Group`, `Divider`, and `Menu` parts and props. It is built on Base UI `Toolbar` for roving focus and on the local `ActionMenu` for menus. Overflow uses the shared `OverflowObserverProvider`: items clipped by the toolbar register themselves with a "More items" menu, groups overflow as a whole, and overflowing originals are hidden from assistive technology and keyboard navigation. SSR renders no overflow menu; it appears once the observer reports clipping.

## Migration notes

- `ActionBar.Menu` requires `icon`, matching upstream. Use `overflowIcon` to change, or `'none'` to hide, the icon shown in the "More items" menu.
- `returnFocusRef` maps to the Base UI menu's `finalFocus` and takes precedence over overflow focus restoration. An open menu or composed SelectPanel follows "More items" when its original trigger overflows.
- Icons accept either a component such as an Octicon or a rendered element.
- `sx` and styled-system props are unsupported; use `className` on the appropriate local part.

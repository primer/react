# Alignment

## From: `@primer/react`

Legacy ActionBar is a compound toolbar with button, icon-button, group, divider, and menu parts. Items that do not fit move into a "More items" overflow menu in bar order, and `ActionBar.Menu` takes an `items` array with dividers, visuals, danger variants, and submenus.

## To: `@primer/react-tailwind`

ActionBar keeps the same `Button`, `IconButton`, `Group`, `Divider`, and `Menu` parts and props. It is built on Base UI `Toolbar` for roving focus and on the local `ActionMenu` for menus. Overflow uses the shared `OverflowObserverProvider`: items clipped by the toolbar register themselves with a "More items" menu, groups overflow as a whole, and overflowing originals are hidden from assistive technology and keyboard navigation. SSR renders no overflow menu; it appears once the observer reports clipping.

## Migration notes

- `ActionBar.Menu` requires `icon`, matching upstream. Use `overflowIcon` to change, or `'none'` to hide, the icon shown in the "More items" menu.
- `returnFocusRef` maps to the Base UI menu's `finalFocus` and takes precedence over overflow focus restoration without transiently focusing the inline action, including across repeated resize cycles. This preserves Base UI's explicit-target behavior: a connected target can receive focus after focus moved outside. Omit the prop for automatic restoration that preserves outside focus. An open menu or composed SelectPanel follows "More items" when its original trigger overflows.
- When expansion removes "More items", focus in an overflow entry or any of its nested portaled submenus returns to the corresponding visible inline action. Automatic restoration does not redirect intentionally moved outside focus, including when it changes after removal but before queued restoration. No consumer resize handler or keyboard override is needed.
- Icons accept either a component such as an Octicon or a rendered element.
- `sx` and styled-system props are unsupported; use `className` on the appropriate local part.
- The default outer inset uses Primer's 16px size token without the generic `px-4` class, avoiding a known collision with a legacy host utility of the same name. `flush` and consumer padding classes still override it. This does not isolate other utilities from host CSS; see the package's CSS integration guidance.
- Compose a configured `SelectPanel` trigger directly with `renderAnchor={() => <ActionBar.Button>Projects</ActionBar.Button>}`. Part refs remain attached across ordinary renders, and overflow dispatch invokes the latest action handler without repeatedly registering a new handler identity. The narrow composition is covered with React 19 and Base UI 1.8 as well as the package's Base UI 1.6 environment; no external-trigger adapter, custom arrow handler, or dependency patch is required. Overflow activation, selection, resizing with an open picker, and return focus remain package-owned.
- Custom controls that do not render an ActionBar action part do not register an overflow entry, even when wrapped in a Base UI `Toolbar.Button`; an overflowing `Group` hides them without an equivalent in "More items". `ActionBar.Button` and `ActionBar.IconButton` currently ignore their inherited `render` prop. A controlled multi-select submenu needs an alternate overflow composition that the current `Menu` data API does not provide.

# Alignment

## From: `@primer/react`

Legacy Button supports styled-system props plus button/link variants, counters, trailing actions, inactive styling, label wrapping, and keybinding-hint-oriented compositions.

## To: `@primer/react-tailwind`

Button is the stable Base UI-backed button primitive with aligned `variant`, `size`, `block`, `alignContent`, `leadingVisual`, `trailingVisual`, `trailingAction`, `count`, `inactive`, `labelWrap`, `loading`, `loadingAnnouncement`, and `notificationIndicator` contracts while forwarding valid button props and refs. Shared `CounterLabel`, `Spinner`, and `VisuallyHidden` primitives provide counter and loading behavior. Visual props accept either an icon component or a rendered element, matching modern Primer composition without its private slot markers.

## Migration notes

- Prefer LinkButton for navigation; the `link` Button variant remains available for semantic button actions rendered as inline links.
- **Computed/spread legacy `as` migration:** changing imports is not enough. Audit button prop objects, factories, conditional spreads, wrapper defaults, and legacy `Partial<ButtonProps>` aliases for `as: 'a'`, computed `as`, `href`, `target`, and router destination props, not just JSX `as=` attributes. TypeScript's structural typing and excess-property rules can let stale keys survive through variables, spreads, or assertions; a successful type-check does not prove that a legacy anchor still renders as a link. Neither a type assertion nor a props spread converts the Tailwind Button into an anchor.
  - For navigation branches, render `LinkButton` or `IconLinkButton` and forward anchor props such as `href`, `target`, and `rel`; keep `Button` or `IconButton` for action branches. Type each branch's props against its actual component instead of hiding both under a shared legacy button type. Use `render={<RouterLink to="/path" />}` on the link component for router navigation; the custom component must retain an actual anchor and forward received DOM props and refs. Do not mechanically translate navigation into a Button `render` replacement or a click handler calling `location.assign`.
  - Verify the actual element, accessible role and name, destination, target, Enter activation, modifier-click, middle-click, and context-menu navigation in the consumer. Preserve the browser/router's modified-navigation behavior rather than unconditionally preventing the click's default action. Disabled/loading LinkButton behavior differs from an enabled link; the LinkButton guide describes those constraints.
  - Revisit ref types and uses in each branch: default action buttons resolve to buttons, while default link buttons resolve to anchors. The public button-family ref typings are `HTMLElement` to accommodate replacement roots; that does not promise an `HTMLButtonElement` at runtime. Custom `render` components must forward the ref to the actual control. Remove button-only assumptions, or narrow the actual node before reading button/anchor-specific properties; a cast does not change the rendered element.
- Pass counters through `count`, trailing disclosure icons through `trailingAction`, and keyboard shortcuts through a composed `KeybindingHint` in `trailingVisual`.
- Use `inactive` for the interactive visually-disabled state and add an accessible description when the reason is not otherwise evident.
- Use `render`, not `as`, when composing a Base UI trigger or other existing element. Set `nativeButton={false}` when the rendered element is not a `<button>`.
- `notificationIndicator` accepts `button` or `leadingVisual`; the dot is visual only, so include the activity in the accessible name or description.
- The `link` variant underlines only the label on hover when visuals are present, matching upstream `data-no-visuals` behavior.
- The text-only loading overlay avoids the generic `.invisible` and `.absolute` utilities that can be redefined by host CSS. This addresses those specific collisions, not package-wide CSS isolation; check loading states with the host's actual styles.
- An empty `loadingAnnouncement` omits the built-in status and loading description so a host can own the announcement. Unlike legacy's conditional `AriaStatus`, the default Tailwind status appears with its text; that alone does not establish a reliable spoken announcement.
- Replace `sx` and styled-system props with `className`.

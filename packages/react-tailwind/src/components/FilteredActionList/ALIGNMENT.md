# Alignment

## From: `@primer/react`

The upstream configured API provides filtering, item and list render callbacks, group metadata, single/multiple/radio selection, select-all, loading modes, messages, refs, announcements, and optional virtualization.

## To: `@primer/react-tailwind`

The Tailwind configured component supports string and number IDs; item text, descriptions, visuals, children, and class names; disabled, danger, and selected states; groups and headings; and item, group, and list render precedence. It supports controlled and uncontrolled filter and selected-ID state with Base UI change details, legacy item `selected`/`onAction`, all three selection variants, select-all, loading states, custom messages, DOM props, refs, and uniform-list virtualization.

The component owns filtering, ordering, selection, announcements, and the combobox/listbox contract. It composes Base UI combobox behavior with package primitives rather than duplicating focus, keyboard, or selection behavior. Consumers that need arbitrary markup or behavior can compose `TextInput` and `ActionList`.

## Migration notes

- Deprecated `trailingIcon` and `trailingText` are not included; use `trailingVisual`.
- The public focus behavior props from the upstream component are supported: `focusOutBehavior`, `onActiveDescendantChanged`, `disableSelectOnHover`, `setInitialFocus`, `focusPrependedElements`, `scrollBehavior`, and `fullScreenOnNarrow`.
- The previous partial `Root`, `Input`, `Content`, `List`, `Item`, `Empty`, and `Status` compound exports were removed because they did not form a complete composable API.
- Virtualization is enabled only for ungrouped, enabled, default-rendered, one-line text rows. Grouped, disabled, custom-rendered, and variable-height rows use the safe regular-list fallback.
- Item-level `renderItem` callbacks are honored. The upstream custom-rendering story currently falls back to its default item presentation even though each item supplies a renderer; this implementation preserves the documented custom-rendering behavior instead.
- `announcementsEnabled` controls a polite result-count announcement. `messageText` is also announced.
- Styled-system `sx` props are unsupported.

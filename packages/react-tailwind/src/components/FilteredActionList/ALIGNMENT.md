# Alignment

## From: `@primer/react`

The upstream configured API provides filtering, item and list render callbacks, group metadata, single/multiple/radio selection, select-all, loading modes, messages, refs, announcements, and optional virtualization.

## To: `@primer/react-tailwind`

The Tailwind configured component supports string and number IDs; item text, descriptions, visuals, children, and class names; disabled, danger, and selected states; groups and headings; and item, group, and list render precedence. It supports controlled and uncontrolled filter and selected-ID state with Base UI change details, legacy item `selected`/`onAction`, all three selection variants, select-all, loading states, custom messages, DOM props, refs, and uniform-list virtualization.

The component owns filtering, ordering, selection, announcements, and the combobox/listbox contract. It composes Base UI combobox behavior with package primitives rather than duplicating focus, keyboard, or selection behavior. Consumers that need arbitrary markup or behavior can compose `TextInput` and `ActionList`.

## Migration notes

- Deprecated `trailingIcon` and `trailingText` are not included; use `trailingVisual`.
- `placeholderText` no longer supplies the input's accessible name. Top-level `aria-label` names the input and, by default, the listbox; use `actionListProps['aria-label']` for an independent listbox name. Legacy usage commonly used `placeholderText` for the input name and the top-level `aria-label` for the listbox, so migrate and localize both labels explicitly.
- The public focus behavior props from the upstream component are available: `focusOutBehavior`, `onActiveDescendantChanged`, `disableSelectOnHover`, `setInitialFocus`, `focusPrependedElements`, `scrollBehavior`, and `fullScreenOnNarrow`. **Parity gaps:** the first option is not highlighted on mount with default `setInitialFocus={false}`, and `focusPrependedElements` does not reliably highlight newly prepended options when the filter is unchanged.
- Default item descriptions and `ActionList.Description` parts are exposed as descriptions rather than included in option names. Custom `ActionList.Item` renderers can provide their own accessible name and description references.
- The previous partial `Root`, `Input`, `Content`, `List`, `Item`, `Empty`, and `Status` compound exports were removed because they did not form a complete composable API.
- Legacy `FilteredActionList.Input` and `FilteredActionList.BodyLoader` are not exported. For a standalone input or loader, compose `TextInput`, `Spinner`, and `SkeletonBox`; provide an accessible label and an appropriate loading announcement. A standalone input does not by itself provide the configured component's combobox/listbox semantics, keyboard behavior, or selection management.
- `FilteredActionListLoadingTypes` values are the strings `'body-spinner'`, `'body-skeleton'`, and `'input'`, not objects with `.name` and `.appearsInBody`. Compare `loadingType` with `FilteredActionListLoadingTypes.input` to distinguish input loading from the two body-loading modes, or compare the body constants individually.
- Virtualization is enabled only for ungrouped, enabled, default-rendered, uniform text rows. Grouped, disabled, and custom-rendered rows use regular rendering. If a mounted fixed-height row overflows, including after resizing or revealing another row, the component switches to regular rendering and preserves its visible scroll anchor. It also falls back when `ResizeObserver` is unavailable. A new `items` array or toggling `virtualized` off and on allows virtualization to be attempted again.
- **Unresolved keyboard gap:** In an automated WebKit fixture with an option taller than its scrolling results area, Page Down and End on the focused combobox did not scroll through the option, and Tab did not focus the scroll area. Chromium in the same fixture automatically focused the scrolling area and Page Down scrolled it, although axe reported `scrollable-region-focusable` on both engines. This needs accessibility-specialist review before choosing a focus or interaction change; native Safari and screen-reader behavior have not been verified.
- Item-level `renderItem` callbacks are honored. The upstream custom-rendering story currently falls back to its default item presentation even though each item supplies a renderer; this implementation preserves the documented custom-rendering behavior instead.
- `announcementsEnabled` controls a polite result-count announcement. `messageText` is also announced.
- `emptyStateText={null}` suppresses the built-in message without adding padded space; the Base UI empty status stays mounted for later content changes. Rich empty-state content fills the available width, but a short dialog may still clip it and needs an appropriate surrounding layout. Announcement behavior needs screen-reader and policy review.
- The inline combobox reports its expanded state explicitly, including when a loading or message state replaces its list.
- To retain a legacy contrast search background, pass a scoped class through `textInputProps.className`; it styles the package TextInput wrapper, not its transparent native input. That class can preserve `background-color: var(--control-bgColor-contrast, var(--bgColor-inset))`. The legacy token may need a narrowly scoped github-ui stylelint exception; do not disable the rule globally or assume dropping `contrast` preserves the previous appearance. See TextInput's migration notes for the complete control/search example.
- Styled-system `sx` props are unsupported.

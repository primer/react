# FilteredActionList

`FilteredActionList` is a configured, data-driven filterable ActionList for established picker and command-list patterns. It composes shared `TextInput`, ActionList content layers, `Checkbox`, `Spinner`, and `SkeletonBox` with Base UI's combobox behavior. Use `ActionList` directly when consumer-owned markup needs a different structure.

Import: `import {FilteredActionList} from '@primer/react-tailwind/FilteredActionList'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Import

```tsx
import {FilteredActionList} from '@primer/react-tailwind/FilteredActionList'
```

## API

Pass `items` with a unique string or number `id`, `text`, and optional `filterValue`, `description`, `descriptionVariant`, `leadingVisual`, `trailingVisual`, `disabled`, `selected`, `groupId`, `variant`, `children`, `className`, and `onAction`. String and number IDs are distinct.

Use `filterValue`/`onFilterChange` or `defaultFilterValue` for controlled and uncontrolled filtering. Use `selectedItemIds`/`onSelectedChange` or `defaultSelectedItemIds` for modern controlled and uncontrolled selection. These callbacks receive Base UI change details when an input or option changes. Item-level `selected` and `onAction` remain supported for legacy data-driven state. `selectionVariant` supports `single`, `multiple`, and `radio`; `onSelectAllChange` opts a multiple list into select-all.

`groupMetadata` adds ordered, labelled groups. `renderItem` precedence is item, group, then list. `renderGroup` wraps a Base UI group’s labelled content. `message` renders custom body content, while `messageText` announces it. `loadingType` accepts `input`, `body-spinner`, or `body-skeleton`; the default is `body-spinner`.

`emptyStateText` replaces the default "No items found" message and accepts rich content. Pass `null` to suppress the built-in visible message when the surrounding interface provides its own empty state. The empty status remains mounted without padding, and the result-count live region remains controlled separately by `announcementsEnabled`. Provide any additional empty-state feedback the surrounding task needs.

`textInputProps`, `actionListProps`, root DOM props, `inputRef`, `scrollContainerRef`, `onInputRefChanged`, and `onListContainerRefChanged` preserve integration points. `focusOutBehavior`, `onActiveDescendantChanged`, `disableSelectOnHover`, `setInitialFocus`, `focusPrependedElements`, `scrollBehavior`, and `fullScreenOnNarrow` configure the underlying combobox behavior. Set `virtualized` for large, ungrouped lists with simple enabled, uniform text rows. Grouped, custom, and disabled rows use regular rendering. If mounted content grows beyond a fixed row, including after a resize, the component switches to regular rendering and preserves the visible scroll anchor. It also uses regular rendering when `ResizeObserver` is unavailable. Custom fixed-size or non-wrapping visuals must still provide their own responsive layout.

## Accessibility and keyboard behavior

The input is a combobox associated with a listbox and retains DOM focus while Base UI exposes the highlighted option through `aria-activedescendant`. Arrow keys move between enabled options and Enter invokes selection and `onAction`. Option names include the item label and trailing visual; item descriptions are exposed separately. Mark decorative visuals as hidden from assistive technology. Groups use labelled `group` semantics, and a polite result count is announced unless `announcementsEnabled` is false. Body loading and custom-message states do not leave the input pointing to an absent listbox; empty-state status is outside the listbox.

Provide a visible label and an `aria-label` that names the filter input. The top-level `aria-label` also names the listbox by default; set `actionListProps['aria-label']` to give the listbox a different name. `placeholderText` sets the placeholder, not the input's accessible name. If omitted, `aria-label` defaults to the English text "Filter items", so localize both names for the surrounding application:

```tsx
<label htmlFor="team-search">Search for teams</label>
<FilteredActionList
  aria-label="Search for teams"
  placeholderText="Search for teams"
  textInputProps={{id: 'team-search'}}
  actionListProps={{'aria-label': 'Select teams'}}
  items={[{id: 'primer', text: 'Primer team'}]}
/>
```

**Known keyboard gap:** In automated WebKit, an option taller than the scrolling results area could not be fully reached with the tested keyboard navigation, including in a short dialog with no body padding. Provide enough height for option content where practical, or present long details outside the list, pending accessibility-specialist review. Neither removing dialog padding nor switching to narrow fullscreen guarantees enough space for every option. This has not been verified in native Safari or with a screen reader.

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `actionListProps`: `Omit<Partial<ActionListRootProps>, "children" | "data-component">` — Extra props forwarded to the underlying list.
- `announcementsEnabled`: `boolean` — Default `true`. Announces result counts and selection changes to assistive technology.
- `defaultFilterValue`: `string` — Default `''`. Initial filter query for an uncontrolled list.
- `defaultSelectedItemIds`: `readonly FilteredActionListItemId[]` — Initially selected ids for an uncontrolled list.
- `disableSelectOnHover`: `boolean` — Default `false`. Stops hovering an option from making it the active descendant.
- `emptyStateText`: `React.ReactNode` — Default `'No items found'`. Content shown when the filter matches no items. Pass `null` to suppress the built-in message.
- `filterValue`: `string` — Controlled filter query.
- `focusOutBehavior`: `"stop" | "wrap"` — Default `'wrap'`. Determines whether keyboard navigation stops or wraps at the first and last enabled option.
- `focusPrependedElements`: `boolean` — Default `false`. Enables automatic highlighting as the filter changes; it does not re-highlight items prepended to an unchanged filter.
- `fullScreenOnNarrow`: `boolean` — Default `false`. Increases the input text size on narrow viewports to prevent iOS from zooming while the input is focused.
- `groupMetadata`: `readonly FilteredActionListGroup[]` — Group headers and per-group renderers, matched to items by `groupId`.
- `inputRef`: `Ref<HTMLInputElement>` — Ref to the filter input, for focusing it from outside.
- `items` (required): `readonly FilteredActionListItem[]` — Items to list. Filtering, selection, and virtualization all operate on this array.
- `loading`: `boolean` — Default `false`. Shows a loading affordance in place of results.
- `loadingType`: `FilteredActionListLoadingType` — Default `'body-spinner'`. Which loading affordance to show, and whether it replaces the list or sits beside it.
- `message`: `React.ReactNode` — Content shown in place of the list, for an error or other terminal state.
- `messageText`: `{ title: string; description: string; }` — Title and description for the built-in message, as an alternative to supplying `message`.
- `onActiveDescendantChanged`: `((current: HTMLElement | undefined, previous: HTMLElement | undefined, directlyActivated: boolean) => void)` — Called when keyboard focus moves to a different option.
- `onFilterChange`: `((value: string, details: ChangeEventDetails) => void)` — Called with the new query whenever the filter input changes.
- `onInputRefChanged`: `((ref: RefObject<HTMLInputElement | null>) => void)` — Called when the filter input element is attached or replaced.
- `onListContainerRefChanged`: `((element: HTMLElement | null) => void)` — Called when the results container element is attached or replaced.
- `onSelectAllChange`: `((selected: boolean) => void)` — Opts a multiple-selection list into a select-all control.
- `onSelectedChange`: `((selectedItemIds: FilteredActionListItemId[], details?: ChangeEventDetails | undefined) => void)` — Called with the full set of selected ids whenever selection changes.
- `placeholderText`: `string` — Default `'Filter items'`. Placeholder shown in the filter input.
- `renderGroup`: `React.ElementType` — Component used to render each group, replacing the default group element.
- `renderItem`: `FilteredActionListRenderItem` — A list-level renderer used unless a group or item provides one.
- `scrollBehavior`: `ScrollBehavior` — Scrolling behavior used when bringing the active option into view.
- `scrollContainerRef`: `Ref<HTMLDivElement>` — Ref to the scrolling results container.
- `selectedItemIds`: `readonly FilteredActionListItemId[]` — Controlled selected IDs. Number and string IDs remain distinct.
- `selectionVariant`: `"multiple" | "radio" | "single"` — How many items may be selected and which selection semantics the list reports.
- `setInitialFocus`: `boolean` — Default `false`. Suppresses filter-change highlighting unless focusPrependedElements is enabled. Initial item highlighting is not yet supported.
- `showItemDividers`: `boolean` — Default `false`. Draws a divider between items.
- `textInputProps`: `FilteredActionListTextInputProps` — Extra props forwarded to the filter input.
- `variant`: `"full" | "horizontal-inset" | "inset"` — Default `'inset'`. Density and inset treatment of the underlying list.
- `virtualized`: `boolean` — Default `false`. Enables fixed-row virtualization for ungrouped, uniform default items.

## Differences from `@primer/react`

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

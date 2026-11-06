# FilteredActionList

`FilteredActionList` is a configured, data-driven filterable ActionList for established picker and command-list patterns. It composes shared `TextInput`, ActionList content layers, `Checkbox`, `Spinner`, and `SkeletonBox` with Base UI's combobox behavior. Use `ActionList` directly when consumer-owned markup needs a different structure.

Import: `import {FilteredActionList} from '@primer/react-tailwind/FilteredActionList'`

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `actionListProps`: `Omit<Partial<ActionListRootProps>, "children" | "data-component">` — Extra props forwarded to the underlying list.
- `announcementsEnabled`: `boolean` — Default `true`. Announces result counts and selection changes to assistive technology.
- `defaultFilterValue`: `string` — Default `''`. Initial filter query for an uncontrolled list.
- `defaultSelectedItemIds`: `readonly FilteredActionListItemId[]` — Initially selected ids for an uncontrolled list.
- `disableSelectOnHover`: `boolean` — Default `false`. Stops hovering an option from making it the active descendant.
- `emptyStateText`: `React.ReactNode` — Default `'No items found'`. Content shown when the filter matches no items.
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
- The public focus behavior props from the upstream component are available: `focusOutBehavior`, `onActiveDescendantChanged`, `disableSelectOnHover`, `setInitialFocus`, `focusPrependedElements`, `scrollBehavior`, and `fullScreenOnNarrow`. **Parity gaps:** the first option is not highlighted on mount with default `setInitialFocus={false}`, and `focusPrependedElements` does not reliably highlight newly prepended options when the filter is unchanged.
- Default item descriptions and `ActionList.Description` parts are exposed as descriptions rather than included in option names. Custom `ActionList.Item` renderers can provide their own accessible name and description references.
- The previous partial `Root`, `Input`, `Content`, `List`, `Item`, `Empty`, and `Status` compound exports were removed because they did not form a complete composable API.
- Virtualization is enabled only for ungrouped, enabled, default-rendered, one-line text rows. Grouped, disabled, custom-rendered, and variable-height rows use the safe regular-list fallback.
- Item-level `renderItem` callbacks are honored. The upstream custom-rendering story currently falls back to its default item presentation even though each item supplies a renderer; this implementation preserves the documented custom-rendering behavior instead.
- `announcementsEnabled` controls a polite result-count announcement. `messageText` is also announced.
- The inline combobox reports its expanded state explicitly, including when a loading or message state replaces its list.
- Styled-system `sx` props are unsupported.

# FilteredActionList

`FilteredActionList` is a configured, data-driven filterable ActionList for established picker and command-list patterns. It composes shared `TextInput`, ActionList content layers, `Checkbox`, `Spinner`, and `SkeletonBox` with Base UI's combobox behavior. Use `ActionList` directly when consumer-owned markup needs a different structure.

Import: `import {FilteredActionList} from '@primer/react-tailwind/FilteredActionList'`

Renders a `<div>` and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `actionListProps`: `Omit<Partial<ActionListRootProps>, "children" | "data-component">`
- `announcementsEnabled`: `boolean` — Default `true`.
- `defaultFilterValue`: `string` — Default `''`.
- `defaultSelectedItemIds`: `readonly FilteredActionListItemId[]`
- `disableSelectOnHover`: `boolean` — Default `false`.
- `emptyStateText`: `React.ReactNode` — Default `'No items found'`.
- `filterValue`: `string` — Controlled filter query.
- `focusOutBehavior`: `"stop" | "wrap"` — Default `'wrap'`. Determines whether keyboard navigation stops or wraps at the first and last enabled option.
- `focusPrependedElements`: `boolean` — Default `false`.
- `fullScreenOnNarrow`: `boolean` — Default `false`. Increases the input text size on narrow viewports to prevent iOS from zooming while the input is focused.
- `groupMetadata`: `readonly FilteredActionListGroup[]`
- `inputRef`: `Ref<HTMLInputElement>`
- `items`: `readonly FilteredActionListItem[]`
- `loading`: `boolean` — Default `false`.
- `loadingType`: `FilteredActionListLoadingType` — Default `FilteredActionListLoadingTypes.bodySpinner`.
- `message`: `React.ReactNode`
- `messageText`: `{ title: string; description: string; }`
- `onActiveDescendantChanged`: `((current: HTMLElement | undefined, previous: HTMLElement | undefined, directlyActivated: boolean) => void)`
- `onFilterChange`: `((value: string, details: ChangeEventDetails) => void)`
- `onInputRefChanged`: `((ref: RefObject<HTMLInputElement | null>) => void)`
- `onListContainerRefChanged`: `((element: HTMLElement | null) => void)`
- `onSelectAllChange`: `((selected: boolean) => void)` — Opts a multiple-selection list into a select-all control.
- `onSelectedChange`: `((selectedItemIds: FilteredActionListItemId[], details?: ChangeEventDetails | undefined) => void)`
- `placeholderText`: `string` — Default `'Filter items'`.
- `renderGroup`: `React.ElementType`
- `renderItem`: `FilteredActionListRenderItem` — A list-level renderer used unless a group or item provides one.
- `scrollBehavior`: `ScrollBehavior`
- `scrollContainerRef`: `Ref<HTMLDivElement>`
- `selectedItemIds`: `readonly FilteredActionListItemId[]` — Controlled selected IDs. Number and string IDs remain distinct.
- `selectionVariant`: `"multiple" | "radio" | "single"`
- `setInitialFocus`: `boolean` — Default `false`.
- `showItemDividers`: `boolean` — Default `false`.
- `textInputProps`: `FilteredActionListTextInputProps`
- `variant`: `"full" | "horizontal-inset" | "inset"` — Default `'inset'`.
- `virtualized`: `boolean` — Default `false`. Enables fixed-row virtualization for ungrouped, uniform default items.

## Differences from `@primer/react`

- Deprecated `trailingIcon` and `trailingText` are not included; use `trailingVisual`.

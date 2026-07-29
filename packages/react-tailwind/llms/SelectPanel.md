# SelectPanel

`SelectPanel` is a data-driven, filterable picker built with Base UI Combobox and Primer's Popover and Dialog primitives.

Import: `import {SelectPanel} from '@primer/react-tailwind/SelectPanel'`

## Props

- `actionListProps`: `SelectPanelActionListProps`
- `align`: `Align` — Default `'start'`.
- `anchorId`: `string`
- `anchorRef`: `RefObject<HTMLElement | null>`
- `aria-label`: `string`
- `className`: `string`
- `cssAnchorPositioningSettings`: `{ fallbackStrategy?: "default" | "none" | "opposite-side" | undefined; }`
- `defaultFilterValue`: `string` — Default `''`.
- `defaultOpen`: `boolean` — Default `false`.
- `disableFullscreenOnNarrow`: `boolean` — Default `false`.
- `disableSelectOnHover`: `boolean` — Default `false`.
- `displayInViewport`: `boolean` — Default `false`.
- `filterValue`: `string`
- `focusOutBehavior`: `"start" | "stop" | "wrap"` — Default `'wrap'`.
- `focusPrependedElements`: `boolean` — Default `false`.
- `groupMetadata`: `readonly SelectPanelGroupMetadata[]`
- `height`: `"auto" | "fit-content" | "initial" | "large" | "medium" | "small" | "xlarge" | "xsmall"`
- `id`: `string`
- `initialLoadingType`: `"skeleton" | "spinner"` — Default `'spinner'`.
- `inputLabel`: `string`
- `items`: `readonly SelectPanelItem[]`
- `loading`: `boolean` — Default `false`.
- `message`: `SelectPanelMessage | React.ReactNode`
- `notice`: `SelectPanelNotice`
- `onActiveDescendantChanged`: `((current: HTMLElement | undefined, previous: HTMLElement | undefined, directlyActivated: boolean) => void)`
- `onCancel`: `(() => void) | (() => void)`
- `onFilterChange`: `((filter: string, details: ChangeEventDetails) => void)`
- `onOpenChange`: `((open: boolean, gesture: SelectPanelOpenChangeGesture) => void)`
- `onScrollEnd`: `(() => void)`
- `onSelectedChange`: `(selected: SelectPanelItem[] | SelectPanelItem | undefined, details?: ChangeEventDetails | undefined) => void`
- `open`: `boolean`
- `overlayProps`: `SelectPanelOverlayProps`
- `placeholder`: `string`
- `placeholderText`: `string` — Default `'Filter items'`.
- `renderAnchor`: `((props: SelectPanelAnchorProps) => React.ReactElement) | null`
- `renderGroup`: `SelectPanelRenderGroup`
- `renderItem`: `SelectPanelRenderItem`
- `scrollContainerRef`: `Ref<HTMLDivElement>`
- `secondaryAction`: `React.ReactElement`
- `selected`: `readonly SelectPanelItem[] | SelectPanelItem | undefined`
- `selectionVariant`: `"multiple" | "single"`
- `setInitialFocus`: `boolean` — Default `false`.
- `showItemDividers`: `boolean` — Default `false`.
- `showSelectAll`: `boolean` — Default `false`.
- `showSelectedOptionsFirst`: `boolean` — Default `true`.
- `subtitle`: `React.ReactNode`
- `textInputProps`: `Partial<Omit<TextInputProps, "defaultValue" | "onChange" | "value">>`
- `title`: `React.ReactNode`
- `variant`: `"anchored" | "modal"` — Default `'empty'`.
- `virtualized`: `boolean` — Default `false`.
- `width`: `"auto" | "large" | "medium" | "small" | "xlarge" | "xxlarge"`

## Message props

- `action`: `React.ReactNode`
- `body`: `React.ReactNode`
- `className`: `string`
- `icon`: `React.ElementType`
- `title`: `React.ReactNode`
- `variant`: `"empty" | "error" | "warning"` — Default `'empty'`.

## SecondaryActionButton props

- `alignContent`: `"center" | "start"`
- `block`: `boolean`
- `children`: `React.ReactElement[]`
- `className`: `string`
- `count`: `string | number`
- `data-component`: `string`
- `disabled`: `boolean`
- `inactive`: `boolean`
- `labelWrap`: `boolean`
- `leadingVisual`: `ButtonVisual`
- `loading`: `boolean` — Default `false`.
- `loadingAnnouncement`: `string`
- `size`: `ControlSize`
- `trailingAction`: `ButtonVisual`
- `trailingVisual`: `ButtonVisual`
- `variant`: `"danger" | "default" | "invisible" | "link" | "primary"` — Default `'empty'`.

## SecondaryActionLink props

- `alignContent`: `"center" | "start"`
- `block`: `boolean`
- `children`: `React.ReactElement[]`
- `className`: `string`
- `count`: `string | number`
- `data-component`: `string`
- `disabled`: `boolean`
- `href`: `string`
- `inactive`: `boolean`
- `labelWrap`: `boolean`
- `leadingVisual`: `ButtonVisual`
- `loading`: `boolean` — Default `false`.
- `loadingAnnouncement`: `string`
- `size`: `ControlSize`
- `trailingAction`: `ButtonVisual`
- `trailingVisual`: `ButtonVisual`
- `variant`: `"danger" | "default" | "invisible" | "link" | "primary"` — Default `'empty'`.

## Differences from `@primer/react`

- `onOpenChange(open, gesture)` reports the gesture that caused the change rather than Base UI change details, and `disableFullscreenOnNarrow` stays opt-out where `FilteredActionList` uses the opt-in `fullScreenOnNarrow`. Both keep upstream's contract.

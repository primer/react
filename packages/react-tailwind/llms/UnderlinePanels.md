# UnderlinePanels

`UnderlinePanels` is a tab-and-panel composition with an underlined tab list.

Import: `import {UnderlinePanels} from '@primer/react-tailwind/UnderlinePanels'`

Forwards unrecognized props to Base UI's [`Tabs.Root`](https://base-ui.com/react/components/tabs#root), so it also accepts that part's props.

## Props

- `activationMode`: `TabsActivationMode` — Default `'automatic'`. Whether arrow-key focus also selects a tab. `automatic` selects the focused tab; `manual` only moves focus, and Enter, Space, or a click commits the selection. An explicit `TabList` `activateOnFocus` takes precedence.
- `defaultValue`: `string` — Value of the tab selected on first render when uncontrolled.
- `loadingCounters`: `boolean` — Default `false`. Shows placeholders in place of tab counters while their values load.
- `onChange`: `((details: { value: string; }) => void)` — Called with the newly selected tab's `value` when a user selects a different tab. Automatic fallbacks, such as a missing or disabled selection, and re-selecting the current tab do not call it.
- `value`: `string` — Value of the selected tab when controlled. Update it from `onChange` or `onValueChange`.

## UnderlinePanels.List

Forwards unrecognized props to Base UI's [`Tabs.List`](https://base-ui.com/react/components/tabs#list), so it also accepts that part's props.

## UnderlinePanels.Tab

Forwards unrecognized props to Base UI's [`Tabs.Tab`](https://base-ui.com/react/components/tabs#tab), so it also accepts that part's props.

- `counter`: `React.ReactNode` — Number shown after the tab's label.
- `icon`: `React.ElementType` — Icon component shown before the tab's label.
- `leadingVisual`: `React.ReactNode` — Visual shown before the tab's label, as an alternative to `icon`.

## UnderlinePanels.Panel

Forwards unrecognized props to Base UI's [`Tabs.Panel`](https://base-ui.com/react/components/tabs#panel), so it also accepts that part's props.

## Differences from `@primer/react`

- Use `value`/`defaultValue` with `onChange({value})` for tab selection, matching upstream. `onChange` fires only for user-initiated selection of a different tab; Base UI's `onValueChange(value, eventDetails)` remains available when you need the event details or want to cancel a change.
- **Parity — activation mode:** `activationMode="manual"` keeps upstream's behavior: Arrow, Home, and End keys move focus without selecting, and Enter, Space, or click commits the selection.
- **Intentional difference — explicit composition:** tabs live in `UnderlinePanels.List` and every tab and panel needs an explicit `value`; positional pairing and `aria-selected`/`onSelect` tab props are not supported.
- **Intentional difference — unmatched value:** a `value` that matches no tab leaves no tab selected instead of clamping to the first tab with a development warning. An uncontrolled `defaultValue` that matches no tab falls back to the first enabled tab without calling `onChange`.
- **Overlay composition:** `UnderlinePanels` can render inside `AnchoredOverlay.Content`; the overlay does not add a competing focus zone, so the tab list keeps exactly one tabbable tab.
- Do not treat counters as the tab's accessible name.
- Query the active panel only; inactive panels need not remain mounted.
- Icons remain visible while the tab list scrolls horizontally at constrained widths, matching the current upstream rendering even though its historical story name describes hiding icons.
- Use `render` for behavior composition and `className`, not `sx` or styled-system props.

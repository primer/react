# Button

`Button` triggers an action in the current view. Use `LinkButton` when the control navigates to a URL, and `IconButton` when the control has no visible label.

Import: `import {Button, ButtonBase} from '@primer/react-tailwind/Button'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Usage

```tsx
import {Button} from '@primer/react-tailwind/Button'
;<Button variant="primary">Save changes</Button>
```

## Composition

Use `Button` for the styled API. `ButtonBase` is the lower-level public primitive for custom button composition.

Button labels wrap by default inside `Dialog.Footer` so actions can reflow in narrow dialogs. For non-link variants, set `labelWrap={false}` to retain the single-line treatment there. The link variant keeps its normal wrapping behavior.

Buttons default to `type="button"` so actions do not accidentally submit an enclosing form. Set `type="submit"` on the form's submit action:

```tsx
<form onSubmit={handleSubmit}>
  {/* Form fields */}
  <Button type="submit" variant="primary">
    Create account
  </Button>
</form>
```

## Accessibility

Use meaningful text or an `aria-label` for icon-only content. Loading state sets `aria-disabled` (not `aria-busy`, which GitHub accessibility policy prohibits) and suppresses activation without replacing the focused element. By default, `loadingAnnouncement` contributes a description and a status element that appears with its text when loading begins. That insertion alone does not guarantee a spoken announcement.

When the host already announces loading through its own announcer, set `loadingAnnouncement=""` to omit the Button's status and loading description. The host must then communicate the loading state; GitHub applications use their centralized `@github-ui/aria-live` announcer. Any consumer-supplied `aria-describedby` remains intact. Verify the experience with the host's supported assistive technologies.

Describe inactive controls with `aria-describedby` so the visual state has an accessible explanation.

## Data attributes

`data-component="Button"`, `data-block`, `data-inactive`, `data-label-wrap`, `data-loading`, `data-size`, and `data-variant` expose the stable public state and part contract.

Forwards unrecognized props to Base UI's [`Button`](https://base-ui.com/react/components/button#api-reference), so it also accepts that part's props.

## Props

- `alignContent`: `"center" | "start"` — Default `'center'`. Whether the label sits centred or hugs the start edge when visuals are present.
- `block`: `boolean` — Stretches the button to fill the width of its container.
- `children`: `React.ReactNode`
- `className`: `string`
- `count`: `string | number` — Number shown in a trailing counter, for a button that acts on a known quantity.
- `data-component`: `string` — Default `'Button'`. Overrides the marker used to identify this element in tests and styling.
- `disabled`: `boolean` — Prevents activation and removes the button from the keyboard order.
- `inactive`: `boolean` — Marks the button temporarily unavailable while keeping it focusable, so its reason can be announced.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line. Defaults to wrapping within `Dialog.Footer`.
- `leadingVisual`: `ButtonVisual` — Icon shown before the label.
- `loading`: `boolean` — Replaces the leading visual with a spinner and suppresses activation.
- `loadingAnnouncement`: `string` — Default `'Loading'`. Loading status text. Set to an empty string when an external announcer communicates loading.
- `notificationIndicator`: `"button" | "leadingVisual"` — Shows a dot for new activity on the button boundary or on the leading visual. `leadingVisual` requires a `leadingVisual`. The dot is not announced, so describe the activity in the accessible name or description.
- `size`: `ControlSize` — Default `'medium'`. Height and text size of the button.
- `trailingAction`: `ButtonVisual` — Icon shown at the far end, conventionally a chevron for a button that opens something.
- `trailingVisual`: `ButtonVisual` — Icon shown after the label.
- `type`: `"button" | "reset" | "submit"` — Default `'button'`. Native button behavior. Use `submit` to submit a form.
- `variant`: `"danger" | "default" | "invisible" | "link" | "primary"` — Default `'default'`. Visual weight of the button. Use `primary` for the main action and `danger` for a destructive one.

## ButtonBase

Forwards unrecognized props to Base UI's [`Button`](https://base-ui.com/react/components/button#api-reference), so it also accepts that part's props.

- `data-component`: `string` — Default `'ButtonBase'`. Overrides the marker used to identify this element in tests and styling.

## Differences from `@primer/react`

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

# Banner

`Banner` announces a page-level status or message that needs attention but does not interrupt the user. Use `Dialog` instead when the message must block the task, and inline validation for a single field.

Import: `import {Banner} from '@primer/react-tailwind/Banner'`

Renders a [`<section>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `actionsLayout`: `"default" | "inline" | "stacked"` — Default `'default'`. Whether actions sit inline with the message or stack below it.
- `description`: `React.ReactNode` — Supporting detail shown below the title.
- `flush`: `boolean` — Default `false`. Removes the outer border and radius so the banner can span a container edge to edge.
- `hideTitle`: `boolean` — Default `false`. Hides the title visually while keeping it available to assistive technology.
- `layout`: `"compact" | "default"` — Default `'default'`. Use `compact` to reduce the banner's spacing.
- `leadingVisual`: `React.ReactNode` — Replaces the icon the variant would otherwise choose.
- `onDismiss`: `(() => void)` — Shows a dismiss button and is called when it is pressed.
- `primaryAction`: `React.ReactNode` — Most important action, rendered first.
- `secondaryAction`: `React.ReactNode` — Supporting action, rendered after the primary one.
- `title`: `React.ReactNode` — Short summary of the banner's message.
- `variant`: `BannerVariant` — Default `'info'`. Severity of the message, which also sets the colour and default icon.

## Banner.Actions

- `primaryAction`: `React.ReactNode` — Most important action, rendered first.
- `secondaryAction`: `React.ReactNode` — Supporting action, rendered after the primary one.

## Banner.Description

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Banner.PrimaryAction

Forwards unrecognized props to Base UI's [`Button`](https://base-ui.com/react/components/button#api-reference), so it also accepts that part's props.

- `alignContent`: `"center" | "start"` — Whether the label sits centred or hugs the start edge when visuals are present.
- `block`: `boolean` — Stretches the button to fill the width of its container.
- `children`: `React.ReactElement[]`
- `className`: `string`
- `count`: `string | number` — Number shown in a trailing counter, for a button that acts on a known quantity.
- `data-component`: `string` — Overrides the marker used to identify this element in tests and styling.
- `disabled`: `boolean` — Prevents activation and removes the button from the keyboard order.
- `inactive`: `boolean` — Marks the button temporarily unavailable while keeping it focusable, so its reason can be announced.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line instead of being clipped.
- `leadingVisual`: `ButtonVisual` — Icon shown before the label.
- `loading`: `boolean` — Replaces the leading visual with a spinner and suppresses activation.
- `loadingAnnouncement`: `string` — Text announced to assistive technology while the button is loading.
- `notificationIndicator`: `"button" | "leadingVisual"` — Shows a dot for new activity on the button boundary or on the leading visual. `leadingVisual` requires a `leadingVisual`. The dot is not announced, so describe the activity in the accessible name or description.
- `size`: `ControlSize` — Default `'medium'`. Height and text size of the button.
- `trailingAction`: `ButtonVisual` — Icon shown at the far end, conventionally a chevron for a button that opens something.
- `trailingVisual`: `ButtonVisual` — Icon shown after the label.

## Banner.SecondaryAction

Forwards unrecognized props to Base UI's [`Button`](https://base-ui.com/react/components/button#api-reference), so it also accepts that part's props.

- `alignContent`: `"center" | "start"` — Whether the label sits centred or hugs the start edge when visuals are present.
- `block`: `boolean` — Stretches the button to fill the width of its container.
- `children`: `React.ReactElement[]`
- `className`: `string`
- `count`: `string | number` — Number shown in a trailing counter, for a button that acts on a known quantity.
- `data-component`: `string` — Overrides the marker used to identify this element in tests and styling.
- `disabled`: `boolean` — Prevents activation and removes the button from the keyboard order.
- `inactive`: `boolean` — Marks the button temporarily unavailable while keeping it focusable, so its reason can be announced.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line instead of being clipped.
- `leadingVisual`: `ButtonVisual` — Icon shown before the label.
- `loading`: `boolean` — Replaces the leading visual with a spinner and suppresses activation.
- `loadingAnnouncement`: `string` — Text announced to assistive technology while the button is loading.
- `notificationIndicator`: `"button" | "leadingVisual"` — Shows a dot for new activity on the button boundary or on the leading visual. `leadingVisual` requires a `leadingVisual`. The dot is not announced, so describe the activity in the accessible name or description.
- `size`: `ControlSize` — Default `'medium'`. Height and text size of the button.
- `trailingAction`: `ButtonVisual` — Icon shown at the far end, conventionally a chevron for a button that opens something.
- `trailingVisual`: `ButtonVisual` — Icon shown after the label.

## Banner.Title

Renders a [`<h2>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/h2#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `as`: `"h2" | "h3" | "h4" | "h5" | "h6"` — Default `'h2'`. Heading element to render, so the title fits the surrounding document outline.

## Differences from `@primer/react`

- Prefer the compound parts for custom heading and action markup.

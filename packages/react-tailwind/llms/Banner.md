# Banner

`Banner` displays a page-level status or message that needs attention but does not interrupt the user. Use `Dialog` instead when the message must block the task, and inline validation for a single field.

Import: `import {Banner} from '@primer/react-tailwind/Banner'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Usage

```tsx
import {Banner} from '@primer/react-tailwind/Banner'
;<Banner title="Info" description="A helpful message." />
```

## API notes

The `variant` values are `critical`, `info`, `success`, `upsell`, and `warning`.

## Composition

Use `Banner.Title`, `Banner.Description`, `Banner.Actions`, `Banner.PrimaryAction`, and `Banner.SecondaryAction` for local composition, or pass the corresponding content props. For navigation, use `Banner.PrimaryActionLink` and `Banner.SecondaryActionLink`; they render links rather than applying button keyboard behavior to anchors. Link actions do not accept disabled, inactive, or loading props: use noninteractive content or an action button when navigation is unavailable. With the default and stacked layouts, actions use `width: fit-content` without a `max-width` rule and wrap onto new rows when they do not fit. Use `labelWrap` for long or localized action labels in narrow and right-to-left containers. The inline layout keeps actions beside the content until the viewport is narrower than 768px, matching Primer React, so prefer the stacked or default layout in narrow containers. `Banner.Actions` forwards its ref, `className`, and other `div` props to its outer element for host layout adjustments; the inner action row is not a styling API.

### Migrating from Flash

The deprecated `Flash` is not exported by this package. For a page-level message, a named `Banner` is a possible replacement: Flash's `default`, `warning`, `success`, and `danger` variants correspond most closely to Banner's `info`, `warning`, `success`, and `critical`. Review the icon, spacing, layout, and named section semantics rather than assuming a visual or DOM-equivalent replacement. `flush` is intended for confined surfaces, not as a direct replacement for Flash's `full`. See the migration notes for details.

## Accessibility

A direct `Banner.Title`, including one grouped in a fragment, automatically labels the banner. The `title` prop takes precedence when both are supplied, and an explicit `aria-label` or `aria-labelledby` overrides the automatic name. If a custom wrapper renders the title, give it an `id` and pass that ID as the banner's `aria-labelledby`. Give a banner an accessible name when its title is absent. Dismiss controls receive an accessible label, and a hidden title remains available to assistive technology.

When a field needs both a banner's summary and its validation details as a description, reference the title and details rather than the named banner section. Accessibility computations can resolve a reference to the section as only its name; local Playwright and Chromium accessibility-tree checks returned different results for that composition.

```tsx
import {useId} from 'react'
import {Banner} from '@primer/react-tailwind/Banner'

function Filter() {
  const inputId = useId()
  const titleId = useId()
  const detailsId = useId()

  return (
    <>
      <label htmlFor={inputId}>Filter</label>
      <input id={inputId} aria-describedby={`${titleId} ${detailsId}`} aria-invalid="true" />
      <Banner variant="warning">
        <Banner.Title id={titleId}>Filter contains 1 issue:</Banner.Title>
        <Banner.Description id={detailsId}>
          <ul>
            <li>Invalid value for state</li>
          </ul>
        </Banner.Description>
      </Banner>
    </>
  )
}
```

To keep a single description ID, put it on an unlabeled wrapper containing the title and details, and explicitly set the banner's `aria-labelledby` to the wrapped title's ID. Verify the resulting description in the host and with its supported assistive technologies.

Rendering a Banner does not automatically announce it as a live status message. When a dynamically introduced status needs an announcement, use the host's supported announcement mechanism; github-ui uses `@github-ui/aria-live`.

## Data attributes

The section exposes `data-component="Banner"`, `data-variant`, `data-layout`, `data-actions-layout`, and state attributes for dismissal, flush, and hidden titles.

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

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `primaryAction`: `React.ReactNode` — Most important action, rendered first.
- `secondaryAction`: `React.ReactNode` — Supporting action, rendered after the primary one.

## Banner.Description

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Banner.PrimaryAction

Forwards unrecognized props to Base UI's [`Button`](https://base-ui.com/react/components/button#api-reference), so it also accepts that part's props.

- `alignContent`: `"center" | "start"` — Whether the label sits centred or hugs the start edge when visuals are present.
- `block`: `boolean` — Stretches the button to fill the width of its container.
- `children`: `React.ReactNode`
- `className`: `string`
- `count`: `string | number` — Number shown in a trailing counter, for a button that acts on a known quantity.
- `data-component`: `string` — Overrides the marker used to identify this element in tests and styling.
- `disabled`: `boolean` — Prevents activation and removes the button from the keyboard order.
- `inactive`: `boolean` — Marks the button temporarily unavailable while keeping it focusable, so its reason can be announced.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line. Defaults to wrapping within `Dialog.Footer`.
- `leadingVisual`: `ButtonVisual` — Icon shown before the label.
- `loading`: `boolean` — Replaces the leading visual with a spinner and suppresses activation.
- `loadingAnnouncement`: `string` — Loading status text. Set to an empty string when an external announcer communicates loading.
- `notificationIndicator`: `"button" | "leadingVisual"` — Shows a dot for new activity on the button boundary or on the leading visual. `leadingVisual` requires a `leadingVisual`. The dot is not announced, so describe the activity in the accessible name or description.
- `size`: `ControlSize` — Default `'medium'`. Height and text size of the button.
- `trailingAction`: `ButtonVisual` — Icon shown at the far end, conventionally a chevron for a button that opens something.
- `trailingVisual`: `ButtonVisual` — Icon shown after the label.
- `type`: `"button" | "reset" | "submit"` — Default `'button'`. Native button behavior. Use `submit` to submit a form.

## Banner.PrimaryActionLink

Renders an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `alignContent`: `"center" | "start"` — Default `'center'`. Whether the label sits centred or hugs the start edge when visuals are present.
- `block`: `boolean` — Stretches the link to fill the width of its container.
- `children`: `React.ReactNode`
- `count`: `string | number` — Number shown in a trailing counter.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line. Defaults to wrapping within `Dialog.Footer`.
- `leadingVisual`: `ButtonVisual` — Icon shown before the label.
- `onClick`: `MouseEventHandler<HTMLAnchorElement>` — Called when the link is activated.
- `render`: `RenderProp<LinkButtonState>` — Renders the link as your own element, for a router link that still needs button styling.
- `size`: `ControlSize` — Default `'medium'`. Height and text size of the link.
- `trailingAction`: `ButtonVisual` — Icon shown at the far end, conventionally a chevron.
- `trailingVisual`: `ButtonVisual` — Icon shown after the label.

## Banner.SecondaryAction

Forwards unrecognized props to Base UI's [`Button`](https://base-ui.com/react/components/button#api-reference), so it also accepts that part's props.

- `alignContent`: `"center" | "start"` — Whether the label sits centred or hugs the start edge when visuals are present.
- `block`: `boolean` — Stretches the button to fill the width of its container.
- `children`: `React.ReactNode`
- `className`: `string`
- `count`: `string | number` — Number shown in a trailing counter, for a button that acts on a known quantity.
- `data-component`: `string` — Overrides the marker used to identify this element in tests and styling.
- `disabled`: `boolean` — Prevents activation and removes the button from the keyboard order.
- `inactive`: `boolean` — Marks the button temporarily unavailable while keeping it focusable, so its reason can be announced.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line. Defaults to wrapping within `Dialog.Footer`.
- `leadingVisual`: `ButtonVisual` — Icon shown before the label.
- `loading`: `boolean` — Replaces the leading visual with a spinner and suppresses activation.
- `loadingAnnouncement`: `string` — Loading status text. Set to an empty string when an external announcer communicates loading.
- `notificationIndicator`: `"button" | "leadingVisual"` — Shows a dot for new activity on the button boundary or on the leading visual. `leadingVisual` requires a `leadingVisual`. The dot is not announced, so describe the activity in the accessible name or description.
- `size`: `ControlSize` — Default `'medium'`. Height and text size of the button.
- `trailingAction`: `ButtonVisual` — Icon shown at the far end, conventionally a chevron for a button that opens something.
- `trailingVisual`: `ButtonVisual` — Icon shown after the label.
- `type`: `"button" | "reset" | "submit"` — Default `'button'`. Native button behavior. Use `submit` to submit a form.

## Banner.SecondaryActionLink

Renders an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `alignContent`: `"center" | "start"` — Default `'center'`. Whether the label sits centred or hugs the start edge when visuals are present.
- `block`: `boolean` — Stretches the link to fill the width of its container.
- `children`: `React.ReactNode`
- `count`: `string | number` — Number shown in a trailing counter.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line. Defaults to wrapping within `Dialog.Footer`.
- `leadingVisual`: `ButtonVisual` — Icon shown before the label.
- `onClick`: `MouseEventHandler<HTMLAnchorElement>` — Called when the link is activated.
- `render`: `RenderProp<LinkButtonState>` — Renders the link as your own element, for a router link that still needs button styling.
- `size`: `ControlSize` — Default `'medium'`. Height and text size of the link.
- `trailingAction`: `ButtonVisual` — Icon shown at the far end, conventionally a chevron.
- `trailingVisual`: `ButtonVisual` — Icon shown after the label.

## Banner.Title

Renders a [`<h2>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/h2#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `as`: `"h2" | "h3" | "h4" | "h5" | "h6"` — Default `'h2'`. Heading element to render, so the title fits the surrounding document outline.

## Differences from `@primer/react`

- Prefer the compound parts for custom heading and action markup.
- A direct `Banner.Title` (including one in a fragment) labels the banner automatically; the root `title` prop takes precedence. For a wrapped title, set its `id` and the root's `aria-labelledby` explicitly.
- When a field must be described by both a banner's title and validation details, reference those elements by ID instead of the named banner root. To retain one description ID, put it on an unlabeled wrapper around both and explicitly label the banner from its wrapped title. A named-root reference produced different results in local Playwright and Chromium accessibility-tree checks; verify the host and assistive-technology behavior.
- Use the link action parts for navigation, including router links composed with `render`; use the button action parts for actions.
- Default and stacked actions wrap when they do not fit; use `labelWrap` for long labels. `Banner.Actions` supports a ref, `className`, and standard `div` props on its content-sized outer element for layout adjustments, without a public styling hook for the inner row.
- **Unsupported link substitute:** `Banner.PrimaryAction` and `Banner.SecondaryAction` retain Button activation behavior even with `render={<a href="..." />}`, `nativeButton={false}`, and `role="link"`. The host's React 19.2/Base UI 1.8 Chromium audit found the same Space-keyup activation issue as IconButton; that composition is not equivalent to a native link. Replace navigation branches with `Banner.PrimaryActionLink` or `Banner.SecondaryActionLink`, and keep the button parts for actions. This is host Chromium evidence, not a cross-browser or assistive-technology parity claim.
- Pass `href`, `target`, and `rel` directly to the link action part, preserving the caller's destination and new-tab/security policy; for example, `<Banner.PrimaryActionLink href="/settings" target="_blank" rel="noopener noreferrer">Settings</Banner.PrimaryActionLink>`. For routers, use `render={<RouterLink to="/settings" />}` on the link action part, without `nativeButton` or `role="link"`. The router component must render a real anchor with a destination and forward received props (including `target`, `rel`, event handlers, and children) and the ref to that anchor. The default link-action ref resolves to an anchor, although the public ref type is `HTMLElement` for replacement roots. Inspect computed/spread legacy `as`, `href`, and `target` props as well as direct JSX; verify Enter navigation, no Space activation, modifier/middle-click, context-menu, target/rel, and anchor-ref behavior in the host rather than relying on codemod output or type-checking alone.
- Keep dialog ownership in local Dialog composition; Banner does not own modal behavior.
- **Migrating deprecated `Flash`:** `Flash` is not exported by this package; use a named `Banner` for a page-level message when that pattern fits. Closest semantic variants are Flash `default` → Banner `info`, `warning` → `warning`, `success` → `success`, and `danger` → `critical`, but they are not visual equivalents. Flash renders a generic `div` by default; Banner renders a `section`, uses its title as the accessible name, and adds a variant icon, different spacing, and an optional dismiss control. Banner's `flush` is intended for confined surfaces and is not a direct replacement for Flash's `full`; review surrounding layout, selectors, and custom icons. `onDismiss` supplies a button, but the consumer still owns whether the banner remains rendered. For dynamic status messages that need announcement, use the host's supported announcement mechanism; Banner does not announce itself merely by rendering. github-ui hosts use `@github-ui/aria-live` for such announcements. Verify the name, heading hierarchy, dismissal, visibility, and announcement in the host instead of assuming Flash parity.
- Do not replace the container-query behavior with viewport-only CSS.
- `sx` and styled-system props are unsupported; use documented `className` composition.

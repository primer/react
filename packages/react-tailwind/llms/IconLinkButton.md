# IconLinkButton

`IconLinkButton` is an icon-only navigation link with the visual treatment and tooltip behavior of `IconButton`. It requires an accessible name from either `aria-label` or `aria-labelledby`.

Import: `import {IconLinkButton} from '@primer/react-tailwind/IconLinkButton'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Usage

```tsx
import {IconLinkButton} from '@primer/react-tailwind/IconLinkButton'
;<IconLinkButton aria-label="View repository" href="/repository" icon={LinkExternalIcon} />
```

## Composition

Supply `href` for a native anchor or use `render={<RouterLink to="/repository" />}` for a router link that forwards its props and ref. Use `IconButton` for actions that do not navigate. This component does not offer disabled, inactive, or loading links; use noninteractive content or an action button when navigation is unavailable.

Descriptions supplied on a rendered element or returned by a `render` callback are merged with the tooltip description. A custom router component must forward the received `aria-describedby` to its anchor, merging it with any description IDs it adds internally rather than overwriting it.

## Accessibility

Provide an accessible name with `aria-label` or `aria-labelledby`; the icon is decorative. The default tooltip shows the label, or exposes `description` as an accessible description. With only `aria-labelledby`, supply `description` or an enclosing Tooltip for visible tooltip text. A surrounding `Tooltip` replaces the default tooltip. Native links activate with Enter, while Space retains its normal scrolling behavior.

By default, icon controls are at least 28 CSS pixels square, even with a reduced root font size. Custom size utilities replace this default; ensure the resulting pointer target is adequately sized or spaced.

When both naming props are supplied, `aria-labelledby` provides the accessible name and `aria-label` provides the default label tooltip when there is no `description`. Include the tooltip text in the referenced name so speech-input users can activate the link by its visible label.

## Data attributes

The anchor exposes `data-component="IconLinkButton"`.

Renders an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `aria-label`: `string`
- `aria-labelledby`: `string`
- `description`: `string` — Supplementary tooltip text, exposed as the link's accessible description.
- `icon` (required): `IconSource` — Icon component or rendered element.
- `keybindingHint`: `string | string[]` — Keyboard shortcut or alternatives shown in the tooltip; consumers still register the shortcut.
- `notificationIndicator`: `"button" | "icon"` — Shows a visual activity dot on the link boundary or icon. Describe its meaning in the name or description.
- `onClick`: `MouseEventHandler<HTMLAnchorElement>` — Called when the link is activated.
- `render`: `RenderProp<LinkButtonState>` — Renders the link as your own element, for a router link that still needs button styling.
- `size`: `ControlSize` — Default `'medium'`. Height and text size of the link.
- `tooltipDirection`: `TooltipDirection` — Default `'s'`. Side and alignment of the tooltip relative to the link.
- `unsafeDisableTooltip`: `boolean` — Default `false`. Skips the default tooltip. The tooltip is also skipped inside an existing Tooltip.
- `variant`: `"danger" | "default" | "invisible" | "link" | "primary"` — Default `'default'`. Visual weight of the link. Use `primary` for the main action and `danger` for a destructive one.

## Differences from `@primer/react`

- Replace an icon-only button rendered as an anchor with `IconLinkButton`, passing `href` or a router link through `render`.
- `IconButton render={<a href="..." />} nativeButton={false} role="link"` is not an equivalent alternative: the host's React 19.2/Base UI 1.8 Chromium reproduction activated that composition on Space keyup. IconLinkButton avoids button activation behavior; its host replacement restored native Space/Enter behavior. Keep a real anchor with a destination when using a router render, and verify native navigation in the target browsers.
- Inspect computed and spread prop objects for legacy `as: 'a'`, `href`, and `target`; a stale `Partial<ButtonProps>` variable can evade excess-property checks and leave a migrated IconButton rendering a button. Use IconLinkButton for that navigation branch and IconButton for actions. Verify the link's accessible name, destination, target, modifier/middle-click and context-menu behavior. Its default ref resolves to an anchor, not a button, even though the public ref type is `HTMLElement` for custom-render roots; custom components must forward the ref and received props to the actual anchor.
- Supply `aria-label` or `aria-labelledby` for the accessible name. `aria-label` also supplies visual tooltip text; when using only `aria-labelledby`, use `description` or an enclosing Tooltip for tooltip text.
- An enabled, mounted Tooltip provides a reference target in server-rendered HTML even when its visual popup is portaled. Use an independent label if the tooltip can be disabled or removed, and follow Tooltip's server-rendering guidance for custom content.
- Native links cannot be disabled, so disabled, inactive, and loading props are not supported. Use noninteractive content or an action button when navigation is unavailable.
- For an icon-only router link with an asynchronous loading presentation, compose the public `Tooltip.Trigger` with `render={<LinkButton ... />}` and a `Tooltip.Content`. Put the icon in `leadingVisual`, supply an accessible name, and apply square sizing through `className`; LinkButton supplies the spinner and `loadingAnnouncement` when `loading` is true. Forward router-render props and refs to the actual anchor. This is a composition path, not an IconLinkButton `loading` API: loading suppresses ordinary clicks but retains `href` and native browser navigation channels such as context-menu opening. The host pull-request Refresh control uses this shape; full host/browser/assistive-technology parity remains unverified.
- Icon controls have a 28 CSS pixel default size floor, which can increase their dimensions with a smaller root font. Consumer sizing utilities can override it.
- Replace `sx` and styled-system props with `className`.

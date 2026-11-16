# Alignment

## From: `@primer/react`

Legacy IconButton supplies icon-only button styling and tooltip behavior, but projecting button behavior onto an anchor does not provide native link keyboard semantics.

## To: `@primer/react-tailwind`

IconLinkButton shares the icon, size, variant, notification indicator, and tooltip contracts of IconButton while rendering a native link or a router link through `render`. It composes the shared link-button presentation without Base UI button activation behavior.

## Migration notes

- Replace an icon-only button rendered as an anchor with `IconLinkButton`, passing `href` or a router link through `render`.
- `IconButton render={<a href="..." />} nativeButton={false} role="link"` is not an equivalent alternative: the host's React 19.2/Base UI 1.8 Chromium reproduction activated that composition on Space keyup. IconLinkButton avoids button activation behavior; its host replacement restored native Space/Enter behavior. Keep a real anchor with a destination when using a router render, and verify native navigation in the target browsers.
- Inspect computed and spread prop objects for legacy `as: 'a'`, `href`, and `target`; a stale `Partial<ButtonProps>` variable can evade excess-property checks and leave a migrated IconButton rendering a button. Use IconLinkButton for that navigation branch and IconButton for actions. Verify the link's accessible name, destination, target, modifier/middle-click and context-menu behavior. Its default ref resolves to an anchor, not a button, even though the public ref type is `HTMLElement` for custom-render roots; custom components must forward the ref and received props to the actual anchor.
- Supply `aria-label` or `aria-labelledby` for the accessible name. `aria-label` also supplies visual tooltip text; when using only `aria-labelledby`, use `description` or an enclosing Tooltip for tooltip text.
- An enabled, mounted Tooltip provides a reference target in server-rendered HTML even when its visual popup is portaled. Use an independent label if the tooltip can be disabled or removed, and follow Tooltip's server-rendering guidance for custom content.
- Native links cannot be disabled, so disabled, inactive, and loading props are not supported. Use noninteractive content or an action button when navigation is unavailable.
- For an icon-only router link with an asynchronous loading presentation, compose the public `Tooltip.Trigger` with `render={<LinkButton ... />}` and a `Tooltip.Content`. Put the icon in `leadingVisual`, supply an accessible name, and apply square sizing through `className`; LinkButton supplies the spinner and `loadingAnnouncement` when `loading` is true. Forward router-render props and refs to the actual anchor. This is a composition path, not an IconLinkButton `loading` API: loading suppresses ordinary clicks but retains `href` and native browser navigation channels such as context-menu opening. The host pull-request Refresh control uses this shape; full host/browser/assistive-technology parity remains unverified.
- Icon controls have a 28 CSS pixel default size floor, which can increase their dimensions with a smaller root font. Consumer sizing utilities can override it.
- Replace `sx` and styled-system props with `className`.

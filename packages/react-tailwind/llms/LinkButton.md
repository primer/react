# LinkButton

`LinkButton` navigates to a URL while looking like a `Button`. Supply `href` for a native anchor destination.

Import: `import {LinkButton} from '@primer/react-tailwind/LinkButton'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Usage

```tsx
import {LinkButton} from '@primer/react-tailwind/LinkButton'
;<LinkButton href="#settings">Settings</LinkButton>
```

## Composition

This navigation primitive composes the shared Button presentation. Use `render={<RouterLink to="/settings" />}` for framework links and a real Button for actions that do not navigate.

Link labels wrap by default inside `Dialog.Footer`. For non-link variants, set `labelWrap={false}` to retain the single-line treatment there. The link variant keeps its normal wrapping behavior.

## Accessibility

LinkButton renders a native anchor, so it keeps link semantics and is announced as a link. Do not add `role="button"` or button keyboard handling; use a real Button for actions that do not navigate.

- **Naming:** the visible children are the accessible name. Name the destination or result rather than repeating generic text such as “Click here”. An icon-only link has no text, so provide `aria-label` or `aria-labelledby`. Octicon visuals are hidden from assistive technology, but text in a custom visual or `count` becomes part of the name. Loading keeps the visible label (or the supplied `aria-label`/`aria-labelledby`) as the name and, by default, adds `loadingAnnouncement` as a description.
- **Keyboard and pointer:** with an `href`, Enter follows the link and Space does not activate it, as for any native link. Modifier-clicks, middle-click, and context-menu actions keep the browser's native behavior. `onClick` receives Enter and clicks, including modifier-clicks, so call `preventDefault()` only when you intend to replace navigation; middle-click does not fire `onClick`. When composing a router through `render`, the rendered element must be a real anchor with a destination and must preserve modifier-click and new-tab behavior. An anchor without `href` is not keyboard focusable or exposed as a link, so use one only for a placeholder.
- **New tabs:** when `target="_blank"` opens a new tab or window, tell users in the visible label or a description, and pass the `rel` value your security policy requires.
- **Target size:** `small`, `medium`, and `large` render at least 28, 32, and 40 CSS pixels tall. Content sets the width, so give an icon-only link square sizing through `className`. `variant="link"` uses inline text sizing and is intended for links within text, not standalone controls.
- **Disabled:** `disabled` sets `aria-disabled`, removes the link from the tab order, and cancels clicks (including modifier-clicks) and Enter. The `href` remains, so middle-click and context-menu actions can still navigate; render noninteractive content when the destination must not be reachable.
- **Loading:** `loading` sets `aria-disabled` (not `aria-busy`), keeps the link focusable, and cancels clicks (including modifier-clicks) and Enter while it remains reachable through middle-click and the context menu. It is not a substitute for removing an unavailable destination. The default status appears with its text, which does not guarantee a spoken announcement. When the host's announcer communicates loading, set `loadingAnnouncement=""` to omit the built-in status and description; consumer-supplied `aria-describedby` is preserved. The host must communicate the loading state and verify its supported assistive technologies.
- **Inactive:** `inactive` only applies inactive styling. It neither disables navigation nor exposes a state to assistive technology, so explain the unavailable state in text when it matters.

Verify naming, Enter/modifier/middle-click, context-menu, and new-tab behavior in the host's supported browsers and assistive technologies; this guidance describes the native anchor contract, not screen-reader announcement parity with legacy Primer.

## Data attributes

The anchor exposes `data-component="LinkButton"`.

Renders an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `alignContent`: `"center" | "start"` — Default `'center'`. Whether the label sits centred or hugs the start edge when visuals are present.
- `block`: `boolean` — Stretches the link to fill the width of its container.
- `children`: `React.ReactNode`
- `count`: `string | number` — Number shown in a trailing counter.
- `data-component`: `string` — Default `'LinkButton'`. Overrides the marker used to identify this element in tests and styling.
- `disabled`: `boolean` — Default `false`. Removes the link from the keyboard order and suppresses ordinary click activation. Its `href` remains available to browser actions such as opening the link from a context menu.
- `inactive`: `boolean` — Marks the link temporarily unavailable while keeping it focusable.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line. Defaults to wrapping within `Dialog.Footer`.
- `leadingVisual`: `ButtonVisual` — Icon shown before the label.
- `loading`: `boolean` — Default `false`. Replaces the leading visual with a spinner and suppresses ordinary click activation. Its `href` remains available to browser actions such as opening the link from a context menu.
- `loadingAnnouncement`: `string` — Default `'Loading'`. Loading status text. Set to an empty string when an external announcer communicates loading.
- `onClick`: `MouseEventHandler<HTMLAnchorElement>` — Called when the link is activated.
- `render`: `RenderProp<LinkButtonState>` — Renders the link as your own element, for a router link that still needs button styling.
- `size`: `ControlSize` — Default `'medium'`. Height and text size of the link.
- `trailingAction`: `ButtonVisual` — Icon shown at the far end, conventionally a chevron.
- `trailingVisual`: `ButtonVisual` — Icon shown after the label.
- `variant`: `"danger" | "default" | "invisible" | "link" | "primary"` — Default `'default'`. Visual weight of the link. Use `primary` for the main action and `danger` for a destructive one.

## Differences from `@primer/react`

- Replace `as={RouterLink}` with `render={<RouterLink to="/path" />}`.
- Replace legacy Button navigation with LinkButton even when `as: 'a'`, `href`, or `target` comes from a computed object or `Partial<ButtonProps>` spread. Use link-specific props on navigation branches; successful type-checking of a stale spread is not evidence of an anchor. Preserve native/router modifier-click, middle-click, context-menu and target behavior instead of routing every click through an action handler. The default root is an anchor, while the public ref is typed `HTMLElement` for replacement roots; forward custom-render refs to the actual anchor and recheck any button-only ref assumptions. The Button alignment guide describes the complete spread-detection migration.
- `href` remains optional for loading placeholders and custom render elements.
- Disabled and loading links suppress ordinary clicks but retain `href`; browser actions such as opening the link from a context menu can still navigate. Use noninteractive content when the destination must not be available.
- LinkButton is also the public loading icon-link composition surface: provide a name with `aria-label` or `aria-labelledby`, an icon in `leadingVisual`, square sizing through `className`, and a surrounding Tooltip instead of text children. Use `loading` and `loadingAnnouncement` for the spinner and loading description; keep router `render` rooted in a real anchor. IconLinkButton intentionally does not expose these loading props. Loading is not a substitute for removing an unavailable destination.
- The text-only loading overlay shares Button's targeted mitigation for host `.invisible` and `.absolute` utility collisions. Other host CSS can still affect it; verify mixed-package styles in the consumer.
- Set `loadingAnnouncement=""` when the host owns loading announcements. This omits the built-in status and loading description without removing consumer descriptions; the default populated status does not by itself guarantee spoken output.
- Use a real Button for actions that do not navigate.
- Replace `sx` and styled-system props with `className`.

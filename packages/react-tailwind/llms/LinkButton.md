# LinkButton

`LinkButton` navigates to a URL while looking like a `Button`. It renders an anchor, so it requires `href` rather than `onClick`.

Import: `import {LinkButton} from '@primer/react-tailwind/LinkButton'`

Renders an `<a>` and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `alignContent`: `"center" | "start"` — Default `'center'`. Whether the label sits centred or hugs the start edge when visuals are present.
- `block`: `boolean` — Stretches the link to fill the width of its container.
- `children`: `React.ReactElement[]`
- `count`: `string | number` — Number shown in a trailing counter.
- `disabled`: `boolean` — Default `false`. Prevents navigation and removes the link from the keyboard order.
- `inactive`: `boolean` — Marks the link temporarily unavailable while keeping it focusable.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line instead of being clipped.
- `leadingVisual`: `ButtonVisual` — Icon shown before the label.
- `loading`: `boolean` — Default `false`. Replaces the leading visual with a spinner and suppresses navigation.
- `loadingAnnouncement`: `string` — Default `'Loading'`. Text announced to assistive technology while the link is loading.
- `onClick`: `MouseEventHandler<HTMLAnchorElement>` — Called when the link is activated.
- `render`: `RenderProp<LinkButtonState>` — Renders the link as your own element, for a router link that still needs button styling.
- `size`: `ControlSize` — Height and text size of the link.
- `trailingAction`: `ButtonVisual` — Icon shown at the far end, conventionally a chevron.
- `trailingVisual`: `ButtonVisual` — Icon shown after the label.
- `variant`: `"danger" | "default" | "invisible" | "link" | "primary"` — Default `'default'`. Visual weight of the link. Use `primary` for the main action and `danger` for a destructive one.

## Differences from `@primer/react`

- Replace `as={RouterLink}` with `render={<RouterLink to="/path" />}`.

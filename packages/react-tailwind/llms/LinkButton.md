# LinkButton

`LinkButton` navigates to a URL while looking like a `Button`. It renders an anchor, so it requires `href` rather than `onClick`.

Import: `import {LinkButton} from '@primer/react-tailwind/LinkButton'`

Renders an `<a>` and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `alignContent`: `"center" | "start"` — Default `'center'`.
- `block`: `boolean`
- `children`: `React.ReactElement[]`
- `count`: `string | number`
- `disabled`: `boolean` — Default `false`.
- `inactive`: `boolean`
- `labelWrap`: `boolean`
- `leadingVisual`: `ButtonVisual`
- `loading`: `boolean` — Default `false`.
- `loadingAnnouncement`: `string` — Default `'Loading'`.
- `onClick`: `MouseEventHandler<HTMLAnchorElement>`
- `render`: `RenderProp<LinkButtonState>`
- `size`: `ControlSize`
- `trailingAction`: `ButtonVisual`
- `trailingVisual`: `ButtonVisual`
- `variant`: `"danger" | "default" | "invisible" | "link" | "primary"` — Default `'default'`.

## Differences from `@primer/react`

- Replace `as={RouterLink}` with `render={<RouterLink to="/path" />}`.

# LinkButton

`LinkButton` navigates to a URL while looking like a `Button`. It renders an anchor, so it requires `href` rather than `onClick`.

Import: `import {LinkButton} from '@primer/react-tailwind/LinkButton'`

## Props

- `alignContent`: `'start' | 'center'` — Default `'center'`.
- `block`: `boolean`
- `children`: `React.ReactNode`
- `count`: `number | string`
- `disabled`: `boolean` — Default `false`.
- `inactive`: `boolean`
- `labelWrap`: `boolean`
- `leadingVisual`: `ButtonVisual`
- `loading`: `boolean` — Default `false`.
- `loadingAnnouncement`: `string` — Default `'Loading'`.
- `onClick`: `React.MouseEventHandler<HTMLAnchorElement>`
- `render`: `useRender.RenderProp<LinkButtonState>`
- `size`: `ControlSize`
- `trailingAction`: `ButtonVisual`
- `trailingVisual`: `ButtonVisual`
- `variant`: `'default' | 'primary' | 'danger' | 'invisible' | 'link'` — Default `'default'`.

## Differences from `@primer/react`

- Replace `as={RouterLink}` with `render={<RouterLink to="/path" />}`.


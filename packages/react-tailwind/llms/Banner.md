# Banner

`Banner` announces a page-level status or message that needs attention but does not interrupt the user. Use `Dialog` instead when the message must block the task, and inline validation for a single field.

Import: `import {Banner} from '@primer/react-tailwind/Banner'`

Renders a `<section>` and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `actionsLayout`: `"default" | "inline" | "stacked"` — Default `'default'`.
- `description`: `React.ReactNode`
- `flush`: `boolean` — Default `false`.
- `hideTitle`: `boolean` — Default `false`.
- `layout`: `"compact" | "default"` — Default `'default'`.
- `leadingVisual`: `React.ReactNode`
- `onDismiss`: `(() => void)`
- `primaryAction`: `React.ReactNode`
- `secondaryAction`: `React.ReactNode`
- `title`: `React.ReactNode`
- `variant`: `BannerVariant` — Default `'info'`.

## Actions props

- `primaryAction`: `React.ReactNode`
- `secondaryAction`: `React.ReactNode`

## PrimaryAction props

- `alignContent`: `"center" | "start"`
- `block`: `boolean`
- `children`: `React.ReactElement[]`
- `className`: `string`
- `count`: `string | number`
- `data-component`: `string`
- `disabled`: `boolean`
- `inactive`: `boolean`
- `labelWrap`: `boolean`
- `leadingVisual`: `ButtonVisual`
- `loading`: `boolean`
- `loadingAnnouncement`: `string`
- `size`: `ControlSize`
- `trailingAction`: `ButtonVisual`
- `trailingVisual`: `ButtonVisual`

## SecondaryAction props

- `alignContent`: `"center" | "start"`
- `block`: `boolean`
- `children`: `React.ReactElement[]`
- `className`: `string`
- `count`: `string | number`
- `data-component`: `string`
- `disabled`: `boolean`
- `inactive`: `boolean`
- `labelWrap`: `boolean`
- `leadingVisual`: `ButtonVisual`
- `loading`: `boolean`
- `loadingAnnouncement`: `string`
- `size`: `ControlSize`
- `trailingAction`: `ButtonVisual`
- `trailingVisual`: `ButtonVisual`

## Title props

- `as`: `"h2" | "h3" | "h4" | "h5" | "h6"` — Default `'h2'`.

## Differences from `@primer/react`

- Prefer the compound parts for custom heading and action markup.

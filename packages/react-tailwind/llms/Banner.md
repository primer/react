# Banner

`Banner` announces a page-level status or message that needs attention but does not interrupt the user. Use `Dialog` instead when the message must block the task, and inline validation for a single field.

Import: `import {Banner} from '@primer/react-tailwind/Banner'`

## Props

- `actionsLayout`: `'inline' | 'stacked' | 'default'` — Default `'default'`.
- `description`: `React.ReactNode`
- `flush`: `boolean` — Default `false`.
- `hideTitle`: `boolean` — Default `false`.
- `layout`: `'default' | 'compact'` — Default `'default'`.
- `leadingVisual`: `React.ReactNode`
- `onDismiss`: `() => void`
- `primaryAction`: `React.ReactNode`
- `secondaryAction`: `React.ReactNode`
- `title`: `React.ReactNode`
- `variant`: `BannerVariant` — Default `'info'`.

## BannerTitle props

- `as`: `'h2' | 'h3' | 'h4' | 'h5' | 'h6'` — Default `'h2'`.

## BannerActions props

- `primaryAction`: `React.ReactNode`
- `secondaryAction`: `React.ReactNode`

## Differences from `@primer/react`

- Prefer the compound parts for custom heading and action markup.


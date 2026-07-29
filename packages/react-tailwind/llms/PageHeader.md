# PageHeader

`PageHeader` composes page context, a title, description, actions, and local navigation while preserving reading and focus order.

Import: `import {PageHeader} from '@primer/react-tailwind/PageHeader'`

## Props

- `hasBorder`: `boolean`

## PageHeaderPart props

- `hidden`: `Hidden`

## ParentLink props

- `hidden`: `Hidden`

## TitleArea props

- `variant`: `ResponsiveValue<TitleVariant>` — Default `'medium'`.

## Title props

- `as`: `'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'` — Default `'div'`.
- `hidden`: `Hidden`

## Navigation props

- `as`: `'nav' | 'div'` — Default `'div'`.

## Differences from `@primer/react`

- Compose Breadcrumbs, local Header, and product controls around the slots instead of extending PageHeader.


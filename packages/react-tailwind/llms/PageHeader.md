# PageHeader

`PageHeader` composes page context, a title, description, actions, and local navigation while preserving reading and focus order.

Import: `import {PageHeader} from '@primer/react-tailwind/PageHeader'`

## Props

- `as`: `React.ElementType` — Default `'div'`.
- `hasBorder`: `boolean`

## ContextArea props

- `hidden`: `ResponsiveValue<boolean>`

## ParentLink props

- `as`: `React.ElementType` — Default `'div'`.
- `hidden`: `ResponsiveValue<boolean>`

## ContextBar props

- `hidden`: `ResponsiveValue<boolean>`

## ContextAreaActions props

- `hidden`: `ResponsiveValue<boolean>`

## TitleArea props

- `hidden`: `ResponsiveValue<boolean>`
- `variant`: `ResponsiveValue<TitleVariant>` — Default `'medium'`.

## LeadingAction props

- `hidden`: `ResponsiveValue<boolean>`

## Breadcrumbs props

- `hidden`: `ResponsiveValue<boolean>`

## LeadingVisual props

- `hidden`: `ResponsiveValue<boolean>`

## Title props

- `as`: `"h1" | "h2" | "h3" | "h4" | "h5" | "h6"` — Default `'div'`.
- `hidden`: `ResponsiveValue<boolean>`

## TrailingVisual props

- `hidden`: `ResponsiveValue<boolean>`

## TrailingAction props

- `hidden`: `ResponsiveValue<boolean>`

## Actions props

- `hidden`: `ResponsiveValue<boolean>`

## Description props

- `hidden`: `ResponsiveValue<boolean>`

## Navigation props

- `as`: `"div" | "nav"` — Default `'div'`.
- `hidden`: `ResponsiveValue<boolean>`

## Differences from `@primer/react`

- Compose Breadcrumbs, local Header, and product controls around the slots instead of extending PageHeader.

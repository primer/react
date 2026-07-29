# PageHeader

`PageHeader` composes page context, a title, description, actions, and local navigation while preserving reading and focus order.

Import: `import {PageHeader} from '@primer/react-tailwind/PageHeader'`

## Props

- `as`: `React.ElementType` — Default `'div'`. Element to render.
- `hasBorder`: `boolean` — Draws a border below the header, separating it from the content.

## ContextArea props

- `hidden`: `ResponsiveValue<boolean>` — Hides the part. Accepts a responsive object to hide it only at some viewports.

## ParentLink props

- `as`: `React.ElementType` — Default `'div'`. Element to render.
- `hidden`: `ResponsiveValue<boolean>` — Hides the parent link. Accepts a responsive object to hide it only at some viewports.

## ContextBar props

- `hidden`: `ResponsiveValue<boolean>` — Hides the part. Accepts a responsive object to hide it only at some viewports.

## ContextAreaActions props

- `hidden`: `ResponsiveValue<boolean>` — Hides the part. Accepts a responsive object to hide it only at some viewports.

## TitleArea props

- `hidden`: `ResponsiveValue<boolean>` — Hides the part. Accepts a responsive object to hide it only at some viewports.
- `variant`: `ResponsiveValue<TitleVariant>` — Default `'medium'`. Size of the title area. Accepts a responsive object to vary it per viewport.

## LeadingAction props

- `hidden`: `ResponsiveValue<boolean>` — Hides the part. Accepts a responsive object to hide it only at some viewports.

## Breadcrumbs props

- `hidden`: `ResponsiveValue<boolean>` — Hides the part. Accepts a responsive object to hide it only at some viewports.

## LeadingVisual props

- `hidden`: `ResponsiveValue<boolean>` — Hides the part. Accepts a responsive object to hide it only at some viewports.

## Title props

- `as`: `"h1" | "h2" | "h3" | "h4" | "h5" | "h6"` — Default `'div'`. Heading element to render, so the title fits the surrounding document outline.
- `hidden`: `ResponsiveValue<boolean>` — Hides the title. Accepts a responsive object to hide it only at some viewports.

## TrailingVisual props

- `hidden`: `ResponsiveValue<boolean>` — Hides the part. Accepts a responsive object to hide it only at some viewports.

## TrailingAction props

- `hidden`: `ResponsiveValue<boolean>` — Hides the part. Accepts a responsive object to hide it only at some viewports.

## Actions props

- `hidden`: `ResponsiveValue<boolean>` — Hides the part. Accepts a responsive object to hide it only at some viewports.

## Description props

- `hidden`: `ResponsiveValue<boolean>` — Hides the part. Accepts a responsive object to hide it only at some viewports.

## Navigation props

- `as`: `"div" | "nav"` — Default `'div'`. Element to render. Use `nav` only when the navigation has an accessible name.
- `hidden`: `ResponsiveValue<boolean>` — Hides the part. Accepts a responsive object to hide it only at some viewports.

## Differences from `@primer/react`

- Compose Breadcrumbs, local Header, and product controls around the slots instead of extending PageHeader.

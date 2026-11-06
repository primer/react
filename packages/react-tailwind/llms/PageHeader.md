# PageHeader

`PageHeader` composes page context, a title, description, actions, and local navigation while preserving reading and focus order.

Import: `import {PageHeader} from '@primer/react-tailwind/PageHeader'`

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `as`: `React.ElementType` — Default `'div'`. Element to render.
- `hasBorder`: `boolean` — Draws a border below the header, separating it from the content.

## PageHeader.ContextArea

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `hidden`: `ResponsiveValue<boolean>` — Hides the part. Accepts a responsive object to hide it only at some viewports.

## PageHeader.ParentLink

Renders an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `as`: `React.ElementType` — Default `'a'`. Element to render.
- `hidden`: `ResponsiveValue<boolean>` — Hides the parent link. Accepts a responsive object to hide it only at some viewports.

## PageHeader.ContextBar

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `hidden`: `ResponsiveValue<boolean>` — Hides the part. Accepts a responsive object to hide it only at some viewports.

## PageHeader.ContextAreaActions

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `hidden`: `ResponsiveValue<boolean>` — Hides the part. Accepts a responsive object to hide it only at some viewports.

## PageHeader.TitleArea

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `hidden`: `ResponsiveValue<boolean>` — Hides the part. Accepts a responsive object to hide it only at some viewports.
- `variant`: `ResponsiveValue<TitleVariant>` — Default `'medium'`. Size of the title area. Accepts a responsive object to vary it per viewport.

## PageHeader.LeadingAction

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `hidden`: `ResponsiveValue<boolean>` — Hides the part. Accepts a responsive object to hide it only at some viewports.

## PageHeader.Breadcrumbs

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `hidden`: `ResponsiveValue<boolean>` — Hides the part. Accepts a responsive object to hide it only at some viewports.

## PageHeader.LeadingVisual

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `hidden`: `ResponsiveValue<boolean>` — Hides the part. Accepts a responsive object to hide it only at some viewports.

## PageHeader.Title

Renders a [`<h2>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/h2#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `as`: `"h1" | "h2" | "h3" | "h4" | "h5" | "h6"` — Default `'h2'`. Heading element to render, so the title fits the surrounding document outline.
- `hidden`: `ResponsiveValue<boolean>` — Hides the title. Accepts a responsive object to hide it only at some viewports.

## PageHeader.TrailingVisual

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `hidden`: `ResponsiveValue<boolean>` — Hides the part. Accepts a responsive object to hide it only at some viewports.

## PageHeader.TrailingAction

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `hidden`: `ResponsiveValue<boolean>` — Hides the part. Accepts a responsive object to hide it only at some viewports.

## PageHeader.Actions

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `hidden`: `ResponsiveValue<boolean>` — Hides the part. Accepts a responsive object to hide it only at some viewports.

## PageHeader.Description

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `hidden`: `ResponsiveValue<boolean>` — Hides the part. Accepts a responsive object to hide it only at some viewports.

## PageHeader.Navigation

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `as`: `"div" | "nav"` — Default `'div'`. Element to render. Use `nav` only when the navigation has an accessible name.
- `hidden`: `ResponsiveValue<boolean>` — Hides the part. Accepts a responsive object to hide it only at some viewports.

## Differences from `@primer/react`

- Compose Breadcrumbs, local Header, and product controls around the slots instead of extending PageHeader.
- Use each part's `hidden` option for supported responsive or conditional presentation.
- Preserve heading hierarchy when replacing Title's simple `as` element.
- `sx` and styled-system props are unsupported; use `className`.

# PageHeader

`PageHeader` composes page context, a title, description, actions, and local navigation while preserving reading and focus order.

Import: `import {PageHeader} from '@primer/react-tailwind/PageHeader'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Import and usage

```tsx
import {PageHeader} from '@primer/react-tailwind/PageHeader'
;<PageHeader hasBorder>
  <PageHeader.TitleArea>
    <PageHeader.Title>Issues</PageHeader.Title>
  </PageHeader.TitleArea>
</PageHeader>
```

Keep its slots as direct children, use one clear page title, and give local navigation an accessible name. Use `hidden` only for responsive presentation, not to remove the only navigation path.

Public parts expose namespaced `data-component` identifiers, such as `PageHeader.TitleArea` and `PageHeader.Actions`. Use `className` on a part for application-owned styling; see the migration notes when replacing legacy selectors.

`PageHeader.ParentLink` accepts `href` for a native link, or a router component via `as` together with that component's required destination and options. Router props, events, and refs follow the selected component, which must forward them to its interactive element.

For a typed wrapper, use `ParentLinkProps<typeof RouterLink>` to include the router's props. Unparameterized `ParentLinkProps` and `React.ComponentProps<typeof PageHeader.ParentLink>` retain the legacy anchor-shaped props and broadly typed `as`.

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `as`: `React.ElementType` — Default `'div'`. Element to render.
- `hasBorder`: `boolean` — Draws a border below the header, separating it from the content.

## PageHeader.ContextArea

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `hidden`: `ResponsiveValue<boolean>` — Hides the part. Accepts a responsive object to hide it only at some viewports.

## PageHeader.ParentLink

Renders an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `as`: `As` — Default `'a'`. Element or component supplied by the wrapper.
- `className`: `string`
- `hidden`: `ResponsiveValue<boolean>` — Hides the parent link. Accepts a responsive object to hide it only at some viewports.
- `ref`: `Ref<HTMLElement>`

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
- `ParentLink` renders a native anchor by default; use `href` when hard navigation is intentional. For router navigation, pass the router component as `as` with its required destination and options. Props, event targets, and refs are inferred from that component, which must forward them to its interactive element.
- **Selector migration:** part identifiers use the `PageHeader.` namespace. For example, replace legacy `[data-component="PH_Actions"]` with `[data-component="PageHeader.Actions"]` and `[data-component="TitleArea"]` with `[data-component="PageHeader.TitleArea"]`. Other legacy `PH_` part identifiers likewise use their `PageHeader.<part>` names. Alternatively, put an application-owned `className` on the public part. Recheck narrow layouts after migrating host selectors; an unmatched action-width override can make a header overflow.
- `sx` and styled-system props are unsupported; use `className`.

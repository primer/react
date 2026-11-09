# Link

`Link` navigates to another location. Use `Button` when the control performs an action, and `LinkButton` when a navigation target needs button styling.

Import: `import {Link} from '@primer/react-tailwind/Link'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Usage

```tsx
import {Link} from '@primer/react-tailwind/Link'
;<Link href="#docs">Documentation</Link>
```

## API notes

`muted` and `inline` both default to `false`. Use `inline` for links within text so link-underline preferences apply.

## Composition

Use the default anchor for navigation, or `as` when composing with an element that owns navigation. The selected component's props and ref are inferred, so a router component can receive its required destination directly, for example `<Link as={RouterLink} to="/issues">Issues</Link>`. The router component must forward the supplied props and ref to its interactive element.

For a typed wrapper, use `LinkProps<typeof RouterLink>` to include that router's props. Unparameterized `LinkProps` and `React.ComponentProps<typeof Link>` retain the legacy anchor-shaped props and broadly typed `as`.

## Accessibility

Provide descriptive link text and a valid destination; do not rely only on surrounding context.

## Data attributes

The rendered element has `data-component="Link"`.

Renders an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `as`: `As` — Default `'a'`. Element or component supplied by the wrapper.
- `className`: `string`
- `inline`: `boolean | null`
- `muted`: `boolean | null`
- `ref`: `Ref<HTMLElement>`

## Differences from `@primer/react`

- Preserve `muted`, `inline`, and `as` usage.
- **Custom component props:** `as={RouterLink}` infers the router component's props and ref, including required destinations such as `to`, while retaining Primer's visual props. The selected component must forward its props and ref to the link it renders.
- Replace `hoverColor` with supported token/class composition.
- Remove `sx`, styled-system props, and legacy class selectors.

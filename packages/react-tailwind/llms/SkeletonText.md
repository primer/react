# SkeletonText

`SkeletonText` creates one or more text-shaped loading lines with typography height presets and an optional maximum width.

Import: `import {SkeletonText} from '@primer/react-tailwind/SkeletonText'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Import and usage

```tsx
import {SkeletonText} from '@primer/react-tailwind/SkeletonText'
;<SkeletonText size="bodyMedium" lines={3} maxWidth={420} />
```

## API notes

`lines` is rounded down to a whole number and has a minimum of one.

## Composition

Use one line for a single text placeholder and multiple lines for paragraphs. The final line of a multi-line group is intentionally shorter to resemble natural text wrapping. Pair with `SkeletonAvatar` or `SkeletonBox` for cards.

## Accessibility

Neither form sets a role or `aria-busy` unless labelled (an `aria-label` or `aria-labelledby` opts into `role="img"`). Treat skeletons as status-free layout placeholders and provide surrounding loading context; they should not replace a heading or label needed to understand the page.

## Animation and reduced motion

The loading pulse uses `animate-pulse` and `motion-reduce:animate-none`. Reduced-motion users see the same geometry without the pulse.

## Theming and Tailwind

Skeleton text uses the Primer `neutral-muted` and typography-height utilities. Import the package styles or use Tailwind v4 with the package `dist` path in `@source`; extend the result with `className` and standard CSS.

### Data attributes

The root exposes `data-component="SkeletonText"`. Individual multi-line boxes are `SkeletonBox` children with `aria-hidden="true"`.

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `lines`: `number` — Default `1`. Number of placeholder lines to render.
- `maxWidth`: `MaxWidth<string | number>` — Largest width the placeholder lines may reach.
- `size`: `"bodyLarge" | "bodyMedium" | "bodySmall" | "display" | "subtitle" | "titleLarge" | "titleMedium" | "titleSmall"` — Default `'bodyMedium'`. Typography size whose font height and line spacing the placeholder matches.

## Differences from `@primer/react`

- Expect at least one line; fractional counts are floored.
- Each bar's height follows the selected size's font-size token, while its vertical margins follow that size's line-height token. Single and multiline skeletons use the same sizing rule; they are not fixed-height 16px bars. At the default 16px root scale, `bodyMedium` bars are 14px and `bodySmall` bars are 12px. Typography token or root-font overrides can change those values.
- Legacy Primer CSS can redefine typography tokens depending on stylesheet order. Compare loading and loaded content under the same actual host tokens/order rather than forcing a pixel height or weakening a layout-shift threshold. The height correction does not isolate unrelated host CSS. `className` and `style` still target the public root; in multiline mode that root is the wrapper, not an individual bar.
- Recheck snapshots or selectors that depended on one element per line or legacy CSS classes.
- Remove `sx` and styled-system props.

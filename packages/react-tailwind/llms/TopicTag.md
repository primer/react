# TopicTag

`TopicTag` presents a repository topic as a compact accent-colored tag. `TopicTag.Group` wraps tags into a responsive row.

Import: `import {TopicTag} from '@primer/react-tailwind/TopicTag'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Import and usage

```tsx
import {TopicTag} from '@primer/react-tailwind/TopicTag'
;<TopicTag.Group aria-label="Repository topics">
  <TopicTag href="/topics/react">react</TopicTag>
  <TopicTag href="/topics/typescript">typescript</TopicTag>
</TopicTag.Group>
```

`TopicTag.Group` is also exported as `TopicTagGroup`.

## API notes

`TopicTag.Group` accepts standard `div` props and lays out children with wrapping and a two-unit gap.

## Composition

Use `TopicTag.Group` for a collection of topics and provide a group label when the surrounding heading does not already name them. Use `as="button"` for selection, with the selected state owned by the consumer.

## Accessibility

Links and buttons need meaningful topic text and appropriate destinations or actions. Add an accessible group label when topics are not otherwise named. The visual color is not the sole source of meaning.

## Animation and reduced motion

Interactive tags change background and text color on hover without animation. No reduced-motion override is required.

## Theming and Tailwind

Topic tags use Primer accent tokens. Import package styles or compile Tailwind v4 with the package `dist` path in `@source`; use `className` for local spacing, wrapping, or color extensions.

### Data attributes

`TopicTag` exposes `data-component="TopicTag"` and `TopicTag.Group` exposes `data-component="TopicTagGroup"`.

Renders an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `as`: `React.ElementType` — Default `'a'`. Element to render. Use a non-anchor element when the tag does not link anywhere.
- `href`: `string` — URL the tag navigates to.

## TopicTag.Group

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Differences from `@primer/react`

- Existing TopicTag and TopicTagGroup composition can generally be retained.
- Keep navigation/filter state outside the components.
- Remove `sx`, styled-system props, and legacy CSS-module selectors.

# TopicTag

`TopicTag` presents a repository topic as a compact accent-colored tag. `TopicTag.Group` wraps tags into a responsive row.

Import: `import {TopicTag} from '@primer/react-tailwind/TopicTag'`

Renders an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `as`: `React.ElementType` — Default `'a'`. Element to render. Use a non-anchor element when the tag does not link anywhere.
- `href`: `string` — URL the tag navigates to.

## TopicTag.Group

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Differences from `@primer/react`

- Existing TopicTag and TopicTagGroup composition can generally be retained.

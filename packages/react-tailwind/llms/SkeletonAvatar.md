# SkeletonAvatar

`SkeletonAvatar` reserves circular or square space for an avatar while the profile content is loading.

Import: `import {SkeletonAvatar} from '@primer/react-tailwind/SkeletonAvatar'`

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `size`: `AvatarSize | ResponsiveValue<number>` — Default `'small'`. Width and height in pixels, matching the avatar it stands in for.
- `square`: `boolean` — Default `false`. Renders square corners, matching a square avatar.

## Differences from `@primer/react`

- Existing `size` and `square` usage can be retained.
- Verify custom sizes against the Tailwind component's supported size scale.
- Remove `sx`, styled-system props, and legacy class selectors.

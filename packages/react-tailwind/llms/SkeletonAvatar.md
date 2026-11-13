# SkeletonAvatar

`SkeletonAvatar` reserves circular or square space for an avatar while the profile content is loading.

Import: `import {SkeletonAvatar} from '@primer/react-tailwind/SkeletonAvatar'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Import and usage

```tsx
import {SkeletonAvatar} from '@primer/react-tailwind/SkeletonAvatar'
;<SkeletonAvatar size="medium" />
```

## API notes

Named sizes are `small`, `medium`, `large`, and `xlarge`; numeric values specify pixels and may be responsive.

## Composition

Use the same size as the eventual avatar and place it in the same flex or grid slot. Set `square` for repository or file thumbnails. Numeric sizes are useful when matching a custom avatar dimension.

## Accessibility

The placeholder is decorative, sets no `aria-busy`, and is not a replacement for the accessible name of the profile or content it represents. Keep the loading context available elsewhere in the page.

## Animation and reduced motion

The placeholder uses a pulse animation with `motion-reduce:animate-none`. Reduced-motion users retain the geometry without animation.

## Theming and Tailwind

The background uses the `neutral-muted` token. Import package styles or compile with Tailwind v4 and include the package `dist` path in `@source`. Extend shape or spacing with `className`.

### Data attributes

The root exposes `data-component="SkeletonAvatar"`. Preset and numeric dimensions are represented by classes and inline styles.

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `size`: `AvatarSize | ResponsiveValue<number>` — Default `'small'`. Width and height in pixels, matching the avatar it stands in for.
- `square`: `boolean` — Default `false`. Renders square corners, matching a square avatar.

## Differences from `@primer/react`

- Existing `size` and `square` usage can be retained.
- Verify custom sizes against the Tailwind component's supported size scale.
- Remove `sx`, styled-system props, and legacy class selectors.

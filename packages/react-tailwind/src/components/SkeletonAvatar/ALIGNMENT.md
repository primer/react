# Alignment

## From: `@primer/react`

`SkeletonAvatar` renders a placeholder avatar using the legacy `Avatar` size scale. Its `size` prop accepts the legacy numeric avatar sizes, defaulting to the standard 20px avatar size, and `square` changes the shape from circular to rounded. CSS modules provide the placeholder color and pulse animation, while shared props can add legacy styling customization.

## To: `@primer/react-tailwind`

Tailwind `SkeletonAvatar` preserves numeric and named avatar sizing, `square`, and native placeholder content semantics. It uses Tailwind utilities and Primer muted/skeleton tokens for dimensions, shape, and animation. This is a presentational placeholder, not a Base UI primitive; React 19-compatible native props are forwarded. Legacy CSS-module selectors and styled-system props are not part of the new API.

## Migration notes

- Existing `size` and `square` usage can be retained.
- Verify custom sizes against the Tailwind component's supported size scale.
- Remove `sx`, styled-system props, and legacy class selectors.

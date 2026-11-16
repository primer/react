---
applyTo: 'packages/react-tailwind/src/**/*.ts,packages/react-tailwind/src/**/*.tsx,packages/react-tailwind/src/**/*.css'
---

# React Tailwind styling

This package uses Tailwind v4 with `@primer/tailwind-config`; it does not use
Primer React CSS Modules or styled-system.

## Tokens and utilities

- Use Primer semantic Tailwind utilities and CSS custom properties for color,
  typography, spacing, radius, border, shadow, focus, and motion.
- Use arbitrary values only for intentional geometry with no design token.
  Prefer a documented CSS custom property when the value varies at runtime.
- Write every utility class as a complete static string visible to Tailwind's
  scanner. Never construct a class or responsive prefix with interpolation,
  concatenation, or a runtime-derived fragment.
- Model closed variant sets with static class maps or CVA. Responsive helpers
  must select complete static classes such as `md:flex`, not build `md:` plus
  `flex`.
- Map Primer viewport ranges to Tailwind breakpoints consistently: narrow uses unprefixed base utilities below `md`, regular uses `md:`, and wide uses `2xl:`. Primer React's compiled custom media and `@primer/tailwind-config` both define the wide range at 87.5rem (1400px); do not confuse the named viewport range with the unrelated `lg` breakpoint at 63.25rem.
- Merge package defaults and consumer `className` through the shared `cn`
  helper. Keep consumer conflict utilities last so `tailwind-merge` resolves
  them predictably.
- Prefer Base UI state attributes and Tailwind data variants over React-driven
  styling state.

## CSS contract

- Component CSS must not include Tailwind Preflight. Any base/reset behavior is
  an explicit opt-in package export.
- Preserve the package layer order and both supported consumption modes:
  compiled `styles.css` or host-generated Tailwind utilities, never both.
- Do not duplicate Primer token definitions or vendor
  `@primer/tailwind-config`.
- Use logical properties and responsive layouts. Verify behavior at narrow,
  regular, and wide viewports rather than treating desktop as the only target.
- Respect reduced motion, forced colors/high contrast, zoom, and consumer theme
  overrides. Focus indicators must remain visible in every supported scheme.
- Avoid broad selectors, specificity escalation, and `!important` except for a
  documented accessibility or external integration requirement.

## Visual quality

- Match the selected non-deprecated Primer React design for component geometry,
  typography, colors, states, and responsive behavior unless an intentional
  difference is recorded.
- Validate light, dark, light high contrast, and dark high contrast. Interactive
  components also require hover, focus-visible, active, selected/open, disabled,
  invalid, and loading states as applicable.
- After styling changes, inspect the generated production CSS to confirm every
  required state and responsive utility was emitted.

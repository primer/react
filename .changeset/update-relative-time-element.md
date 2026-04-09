---
'@primer/react': minor
---

Update `@github/relative-time-element` to v5.0.0

The breaking change in v5.0.0 removes the JSX `IntrinsicElements` type augmentation for `<relative-time>`. This does not affect `@primer/react` consumers since the `RelativeTime` component uses a `createComponent` wrapper and is consumed as a proper React component, not as a custom element in JSX.

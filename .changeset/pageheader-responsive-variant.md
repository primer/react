---
"@primer/react": minor
---

PageHeader: Remove useResponsiveValue hook from TitleArea variant prop

Migrates PageHeader.TitleArea's `variant` prop to use `getResponsiveAttributes` following ADR-018 for SSR-safe responsive values. This prevents layout shift during hydration when using responsive variants.

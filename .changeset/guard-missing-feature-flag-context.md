---
'@primer/react': patch
---

FeatureFlags: Guard against missing context in `useFeatureFlag` so it returns `false` instead of throwing when used outside a provider

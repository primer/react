---
'@primer/react': patch
---

Timeline: Add `primer_react_timeline_list_semantics` feature flag to opt into list semantics

When the `primer_react_timeline_list_semantics` feature flag is enabled, `Timeline` renders as `<ol role="list">` and `Timeline.Item` / `Timeline.Break` render as `<li>` so screen reader users get list navigation (total item count, position in sequence). The default behavior is unchanged — `Timeline` and its subcomponents still render as `<div>` until the flag is opted into.

Enable the flag with the `FeatureFlags` provider:

```tsx
import {FeatureFlags} from '@primer/react/experimental'

<FeatureFlags flags={{primer_react_timeline_list_semantics: true}}>
  <Timeline>…</Timeline>
</FeatureFlags>
```

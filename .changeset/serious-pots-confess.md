---
"@primer/react": minor
---

Add a `sticky` prop to the `PageLayout.Pane` component that provides a convenient way for you to make side panes sticky:

```diff
<PageLayout>
- <PageLayout.Pane>...</PageLayout.Pane>
+ <PageLayout.Pane sticky>...</PageLayout.Pane>
  <PageLayout.Content>...</PageLayout.Content>
</PageLayout>
```

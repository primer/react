---
"@primer/react": patch
---

Deprecates `position` prop for PageLayout.Pane and SplitPageLayout.Pane.

```diff
-<PageLayout>
-    <PageLayout.Content />
-    <PageLayout.Pane position="start" />
-</PageLayout>

+<PageLayout>
+    <PageLayout.Pane />
+    <PageLayout.Content />
+</PageLayout>
    
```

<!-- Changed components: PageLayout, SplitPageLayout -->

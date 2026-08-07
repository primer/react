---
'@primer/react': patch
---

Portal: Render nothing while server rendering and during hydration instead of accessing the DOM during render, fixing server rendering support. Client-only renders are unchanged and still mount portaled content in the same commit.

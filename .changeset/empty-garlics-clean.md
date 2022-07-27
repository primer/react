---
"@primer/react": minor
---

Add a responsive `hidden` prop to `PageLayout.Header`, `PageLayout.Pane`, `PageLayout.Content`, and `PageLayout.Footer` that allows you to hide layout regions based on the viewport width. Example usage:

```jsx
// Hide pane on narrow viewports
<PageLayout.Pane hidden={{narrow: true}}>...</PageLayout.Pane>
```

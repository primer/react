---
"@primer/components": major
---

Removed `useMouseIntent` in favor of [`:focus-visible`](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible).  With the removal of `useMouseIntent`, the `intent-mouse` class will no longer be added to the `<body>`.  Since `:focus-visible` is a relatively new psuedo-class, a polyfill is included.  Any focused elements that meet the criteria for `:focus-visible` will also have a `focus-visible` class added to them by the polyfill.

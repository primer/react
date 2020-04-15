---
title: Link
---

The Link component styles anchor tags with default blue styling and hover text decoration. `Link` is used for destinations, or moving from one page to another.

In special cases where you'd like a `<button>` styled like a `Link`, use `<Link as='button'>`. Make sure to provide a click handler with `onClick`.

**Important:** When using the `as` prop, be sure to always render an accessible element type, like `a`, `button`, `input`, or `summary`.

## Default example

```jsx live
<Link mb={1} href="https://github.com">
  Link
</Link>
```

## Props

import {Link} from "@primer/components"
import ComponentProps from "../components/ComponentProps"

<ComponentProps Component={Link} name="Link" />

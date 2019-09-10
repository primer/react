---
title: Link
---

The Link component styles anchor tags with default blue styling and hover text decoration. `Link` is used for destinations, or moving from one page to another.

In special cases where you'd like a `<button>` styled like a `Link`, use `<Link as='button'>`. Make sure to provide a click handler with `onClick`.

**Important:** When using the `as` prop, be sure to always render an accessible element type, like `a`, `button`, `input`, or `summary`.

## Default example

```.jsx live
<Link mb={1} href="https://github.com">Link</Link>
```

## System props

Link components get `COMMON` and `TYPOGRAPHY` system props. Read our [System Props](/components/docs/system-props) doc page for a full list of available props.

## Component props

| Name      | Type    | Default | Description                                 |
| :-------- | :------ | :-----: | :------------------------------------------ |
| href      | String  |         | URL to be used for the Link                 |
| underline | Boolean |  false  | Adds underline to the Link                  |
| as        | String  |   'a'   | Can be 'a', 'button', 'input', or 'summary' |

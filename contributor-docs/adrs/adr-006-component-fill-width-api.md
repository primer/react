# ADR 006: Use consistent API for making a component fill a parent's width

## Status

Proposed

## Context

By default, components like [Button](https://primer.style/react/Button) and [TextInput](https://primer.style/react/TextInput) are layed out inline, and are only do not fill the width of their parent. However, there are some layouts where these components fill the width of their parent for better ergonomics or to raise its level of hierarchy on the page.

Currently, we have 2 ways to make a component fill its parent's width:

- Pass a `block` prop
- Use the `sx` prop to set `width: '100%'`

This ADR aims to define a consistent component API for this behavior.

## Decision

Use a prop called `fullWidth`. When `fullWidth` is `true`, the component will fill the width of its parent.

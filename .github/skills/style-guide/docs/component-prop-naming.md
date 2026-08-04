# Component Prop Naming

Use these conventions when creating, editing, or evaluating props for Primer React components.

<!-- prettier-ignore-start -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Naming conventions](#naming-conventions)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
<!-- prettier-ignore-end -->

## Naming conventions

### Boolean props

#### Name interactive state props as a bare adjective

Component props that represent state must be named without a prefix. For
example:

- Prefer `open` over `isOpen`
- Prefer `expanded` over `isExpanded`
- Prefer `selected` over `isSelected`

#### Prefix default values with `default*`

When exposing a default value for a state prop, prefix the bare adjective with
`default*`. For example:

- Prefer `defaultOpen` over `defaultIsOpen`
- Prefer `defaultExpanded` over `defaultIsExpanded`
- Prefer `defaultSelected` over `defaultIsSelected`

#### Name boolean props according to the value a consumer would pass to override it

#### Use `hide` or `show` for visibility-related props

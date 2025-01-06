<!-- markdownlint-disable MD036 -->

# Versioning

<!-- prettier-ignore-start -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Overview](#overview)
- [Changes](#changes)
- [Reference](#reference)
  - [The type of a prop is broadened](#the-type-of-a-prop-is-broadened)
  - [The type of a prop is narrowed](#the-type-of-a-prop-is-narrowed)
  - [The `display` property used for the container of `children` is changed](#the-display-property-used-for-the-container-of-children-is-changed)
  - [A component changes its usage of a CSS Custom Property](#a-component-changes-its-usage-of-a-css-custom-property)
  - [A component includes a landmark role](#a-component-includes-a-landmark-role)
  - [A component no longer includes a landmark role](#a-component-no-longer-includes-a-landmark-role)
  - [The element onto which props are spread is changed](#the-element-onto-which-props-are-spread-is-changed)
  - [The element type in an event handler becomes broader](#the-element-type-in-an-event-handler-becomes-broader)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
<!-- prettier-ignore-end -->

## Overview

The Primer team aims to follow
[Semantic Versioning](https://semver.org/) (semver) for each of the packages
that we ship. From semver.org, this means that:

> Given a version number MAJOR.MINOR.PATCH, increment the:
>
> 1. **MAJOR** version when you make incompatible API changes,
> 2. **MINOR** version when you add functionality in a backwards compatible
>    manner, and
> 3. **PATCH** version when you make backwards compatible bug fixes.
>
> _Additional labels for pre-release and build metadata are available as
> extensions to the MAJOR.MINOR.PATCH format._

As a result, whenever you see a `minor` or `patch` update to a package from the
Primer team you should feel confident that you can update without
anything breaking in your project. For a full list of changes and their
corresponding semver bumps, check out the [changes](#changes) table below.

For a full list of releases, visit our [releases](https://github.com/primer/react/releases) page.

## Changes

| Category      | Type of change                                                                                                                                | semver bump         |
| :------------ | :-------------------------------------------------------------------------------------------------------------------------------------------- | :------------------ |
| Component     | A component is added                                                                                                                          | `minor`             |
|               | A component is deprecated                                                                                                                     | `minor`             |
|               | A component is removed                                                                                                                        | `major`             |
| Props         | A prop is added                                                                                                                               | `minor`             |
|               | [The type of a prop is broadened](#the-type-of-a-prop-is-broadened)                                                                           | `minor`             |
|               | [The type of a prop is narrowed](#the-type-of-a-prop-is-narrowed)                                                                             | `major`             |
|               | A prop is deprecated                                                                                                                          | `minor`             |
|               | A prop is removed                                                                                                                             | `major`             |
|               | [The element onto which props are spread is changed](#the-element-onto-which-props-are-spread-is-changed)                                     | potentially `major` |
|               | [The element type in an event handler becomes broader](#the-element-type-in-an-event-handler-becomes-broader)                                 | `major`             |
| Package       | A dependency is added                                                                                                                         | `minor`             |
|               | A dependency is removed and it does not affect the public API of the package                                                                  | `minor`             |
|               | A dependency is removed and it does affect the public API of the package                                                                      | `major`             |
|               | The version of a dependency is increased to a newer minor or patch version                                                                    | `minor`             |
|               | The version of a dependency is increased to a newer major version                                                                             | `major`             |
| CSS           | [The `display` property used for the container of `children` is changed](#the-display-property-used-for-the-container-of-children-is-changed) | potentially `major` |
|               | [A component changes its usage of a CSS Custom Property](#a-component-changes-its-usage-of-a-css-custom-property)                             | potentially `major` |
| Accessibility | [A component includes a landmark role](#a-component-includes-a-landmark-role)                                                                 | potentially `major` |
|               | [A component no longer includes a landmark role](#a-component-no-longer-includes-a-landmark-role)                                             | potentially `major` |

## Reference

### The type of a prop is broadened

semver bump: **minor**

When a type is broadened, it is now possible for that type to include both the
existing value and additional values. As a result, this maintains backwards
compatibility while providing new functionality to the library.

```diff
// v0.1.0
- export type Example = number;

// v0.2.0
+ export type Example = number | string;

// Maintains compatibility across versions
const t1: Example = 1;
```

### The type of a prop is narrowed

semver bump: **major**

When a type is narrowed, it is no longer possible for that type to include all
possible values from the previous version. As a result, this is a breaking
change as existing code which provides a value that is no longer valid will not
work.

```diff
// v0.1.0
- export type Example = string;

// v0.2.0
+ export type Example = 'a' | 'b' | 'c';

// Does not maintain compatibility across versions, the change must be a major
// change
const t1: Example = 'd';
```

### The `display` property used for the container of `children` is changed

semver bump: potentially **major**

When a React component accepts `children` as an argument, changing the value of
the `display` property for that container may be considered a breaking change.

Consider the situation where we move from `block` to `flex` and how this might
change the flow layout of the contents of the component. In situations where
this order is preserved, this may **not** be considered a breaking change and
could be considered a refactor.

However, depending on the type of elements used as children, moving from `block`
to `flex` could also cause unexpected layout changes unrelated to its flow
layout. For example, there may be whitespace that is important in the following
markup:

```html
<button type="button" class="custom-button">Save <span class="custom-class">changes</span></button>
```

In this situation, changing the layout of the `button` to `flex` would collapse
the whitespace present between the text "Save" and "changes" and would be
considered a breaking change.

### A component changes its usage of a CSS Custom Property

semver bump: potentially **major**

When a component changes how it uses a CSS Custom Property, the change could be
considered breaking if the CSS Custom Property is a part of the component's
public API or participates in a broader system for design tokens. The breakage
occurs when a consumer of the component is setting the value of this CSS Custom
Property in some way expecting a change in the component. For example:

```diff
/* ExampleComponent.css */
.ExampleComponent {
  display: flex;
-  column-gap: var(--example-component-gap, 1rem);
+  column-gap: var(--gap, 1rem);
}
```

```css
/* Consumer.css */
.ExampleClassName {
  --example-component-gap: var(--gap-none);
}
```

In this case, the consumer of the component is setting the value of `--example-component-gap` but this will no longer have an effect after the change. There is an expectation that `--example-component-gap` is a part of the public API and therefore this change is considered breaking.

At a high level, CSS Custom Properties in components typically come from:

- Primer Primitives as design tokens for the design system
- Component-level tokens which can be used to style, customize the component or
  is used internally by the component

As a rule of thumb, changes to CSS Custom Properties that use values from Primer
Primitives are **not** a breaking change unless the token only exists in a new
major version of Primer. In which case, a fallback should be used.

```diff
// This is not a breaking change if base-size-6 is defined in the current major
// version of Primer Primitives
.ExampleComponent {
-  margin-block: var(--space-small, 0.375rem);
+  margin-block: var(--base-size-6, 0.375rem);
}
```

```diff
// This is a breaking change if base-size-6 is defined in the next major
// version of Primer Primitives. A fallback should be used to ship this safely
.ExampleComponent {
-  margin-block: var(--space-small, 0.375rem);
+  margin-block: var(--base-size-6, var(--space-small, 0.375rem));
}
```

For component-level tokens, changes to CSS Custom Properties are not considered
breaking unless they are explicitly part of the component's public API. By default,
CSS Custom Properties defined by components are not a part of the public API of a
component.

### A component includes a landmark role

semver bump: potentially **major**

The addition of certain [landmark](https://w3c.github.io/aria/#dfn-landmark) regions may be considered a breaking change. For example, if a component includes the `main` landmark role and another `main` element already exists then the product would violate the [`landmark-no-duplicate-main`](https://dequeuniversity.com/rules/axe/4.8/landmark-no-duplicate-main?product=RuleDescription) rule that is a part of axe.

The addition of other landmark roles may be permissible in a `minor` release if
and only if the component is uniquely identifiable from other landmarks of the
same role. This is typically done through an explicit label on the landmark or
through an element which labels the landmark.

| Role          | semver bump         | Description                                                                                |
| :------------ | :------------------ | :----------------------------------------------------------------------------------------- |
| banner        | potentially `major` | `major` if used as global site header, `minor` if used in sectioning elements              |
| complementary | `minor`             |                                                                                            |
| contentinfo   | `major`             | The implicit role of `<footer>`, there should only be one element with this role on a page |
| main          | `major`             |                                                                                            |
| navigation    | potentially `major` | Should be used sparingly and must be uniquely labeled                                      |
| region        | `minor`             |                                                                                            |
| search        | `minor`             |                                                                                            |

### A component no longer includes a landmark role

semver bump: potentially **major**

If a component that previously used a landmark role, there may be a breaking
change if that role is removed. Specifically, if a component specifies a `main`
landmark then removing that landmark role will cause products to fail
[`landmark-one-main`](https://dequeuniversity.com/rules/axe/4.8/landmark-one-main?product=RuleDescription) as they previously relied on this component to specify this landmark.

Generally, removing landmark roles will have a net impact on the accessibility
of products and should be treated carefully. In certain situations, it may
be possible to remove a landmark role that is superfluous in a `minor` release.
However, most cases should treat this as a breaking change and should draft a
migration plan accordingly for product teams.

### The element onto which props are spread is changed

semver bump: potentially **major**

This situation has a couple of scenarios where it may be considered a breaking change:

- When the changes to the public types for `props` do not overlap due to the change in element
- When the values provided as `props` may contribute to layout

These scenarios can occur when either adding a new container element or when
moving `props` that are spread from a container to an element contained within
the container.

<details>
<summary>When the changes to the public types for `props` do not overlap due to the change in element</summary>

**Before**

```tsx
type Props = React.ComponentPropsWithoutRef<'input'>

function Component(props: Props) {
  return <input {...props} />
}
```

**After**

```tsx
// This type does not fully overlap with the previous type and is a breaking
// change
type Props = React.ComponentPropsWithoutRef<'div'>

function Component(props: Props) {
  return (
    <div {...props}>
      <input />
    </div>
  )
}
```

</details>

<details>
<summary>When the values provided as `props` may contribute to layout</summary>

**Before**

```tsx
type Props = {
  /* ... */
}

function Component(props: Props) {
  return <svg {...props} />
}
```

**After**

```tsx
type Props = {
  /* ... */
}

// When adding the new container element, values that may have influenced layout
// will no longer apply as the `<svg>` element is within the container element.
function Component(props: Props) {
  return (
    <div>
      <svg {...props} />
    </div>
  )
}
```

</details>

### The element type in an event handler becomes broader

semver bump: **major**

This is a breaking change due to how extracted event handlers need to be typed.
Consider the following example:

```tsx
function ExampleComponent() {
  return (
    <Item
      onSelect={event => {
        //
      }}
    />
  )
}
```

When the `onSelect` handler is provided inline, the type is inferred and does
not need to be explicitly defined. However, when this handler is pulled out then
the type is defined:

```tsx
function ExampleComponent() {
  function onSelect(event: React.MouseEvent<HTMLDivElement>) {
    //
  }

  return <Item onSelect={onSelect} />
}
```

This situation is what will cause a breaking change if we change the base
element type of this event handler. For example, if we update the props of
`Item` to be the following:

```diff
interface ItemProps {
-  onSelect(event: React.MouseEvent<HTMLDivElement>): void;
+  onSelect(event: React.MouseEvent<HTMLElement>): void;
}
```

Then the downstream consumers that have typed `onSelect` will now have a
TypeScript error since `HTMLDivElement` does not fully overlap with `HTMLElement`.

When choosing to expose event handler types, consider what the minimum type is
that will satisfy the requirements by callers. Additionally, when typing
handlers of components it is recommended to use the type from the component
props directly. For example:

```tsx
function ExampleComponent() {
  const onSelect: ItemProps['onSelect'] = event => {
    //
  }

  return <Item onSelect={onSelect} />
}
```

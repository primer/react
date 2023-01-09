# Versioning

<!-- prettier-ignore-start -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

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

As a result, whenever you see a `minor` or `patch` update for a package from the
Primer you should feel confident that you can update without
anything breaking in your project. For a full list of changes that the team
commits to being backwards-compatible, view the [changes](#changes) table
below.

## Changes

| Category   | Type of change                                                | semver bump |
| :--------- | :------------------------------------------------------------ | :---------- |
| Component  | A component is added                                          | `minor`     |
|            | A component is deprecated                                     | `minor`     |
|            | A component is removed                                        | `major`     |
| Props      | A prop is added to a component                                | `minor`     |
|            | The type of a prop is made more general                       | `minor`     |
|            | The type of a prop is made more specific                      | `major`     |
|            | A prop is deprecated                                          | `minor`     |
|            | A prop is removed from a component                            | `major`     |
|            | The element to which additional props are added to is changed |             |
| Markup     | The DOM node that an `id` corresponds to is changed           |             |
|            | The DOM node that an `aria-label` corresponds to is changed   |             |
|            | The `role` of a component is changed                          |             |
| Styles     | The `position` of the outermost element is updated            |             |
|            | The `display` property of the outermost element is updated    |             |
|            | A flex or grid property is updated                            |             |
| Behavior   | Interactions are added to a component                         |             |
|            | Interactions are removed from a component                     |             |
| TypeScript | A type is added                                               | `minor`     |
|            | A type is made more general                                   | `minor`     |
|            | A type is made more specific                                  | `major`     |
|            | A type is removed                                             | `major`     |
| Package    | An entrypoint is added to the package                         | `minor`     |
|            | An entrypoint is removed from a package                       | `major`     |

### Examples

#### A prop is added to a component

semver bump: **minor**

```diff
type Props = {
  propA: string;
+  propB: string;
};

function ExampleComponent({
  propA,
+  propB,
}: Props) {
  return (
    <>
      <span>{propA}</span>
+      <span>{propB}</span>
    </>
  );
}
```

#### An existing prop is deprecated

semver bump: **minor**

```diff
type Props = {
  propA: string;
+  /**
+   * @deprecated This prop will be removed in the next major version of
+   * `@primer/react`. Please use <replacement> instead.
+   */
  propB: string;
};

function ExampleComponent({
  propA,
+  propB,
}: Props) {
  return (
    <>
      <span>{propA}</span>
+      <span>{propB}</span>
    </>
  );
}
```

#### The DOM node that an `id` corresponds to is changed

semver bump: **major**

#### The DOM node that an `aria-label` corresponds to is changed

semver bump: **minor**

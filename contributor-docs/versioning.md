# Versioning

<!-- prettier-ignore-start -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Overview](#overview)
- [Changes](#changes)
  - [Examples](#examples)
    - [A prop is added to a component](#a-prop-is-added-to-a-component)
    - [An existing prop is deprecated](#an-existing-prop-is-deprecated)
    - [The DOM node that an `id` corresponds to is changed](#the-dom-node-that-an-id-corresponds-to-is-changed)
    - [The DOM node that an `aria-label` corresponds to is changed](#the-dom-node-that-an-aria-label-corresponds-to-is-changed)

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
anything breaking in your project. For a full list of changes and their
corresponding semver bumps, check out the [changes](#changes) table below.

For a full list of releases, visit our [releases](https://github.com/primer/react/releases) page.

## Changes

| Category   | Type of change                                                | semver bump |
| :--------- | :------------------------------------------------------------ | :---------- |
| Component  | A component is added                                          | `minor`     |
|            | A component is deprecated                                     | `major`     |
|            | A component is removed                                        | `major`     |
| Props      | A prop is added to a component                                | `minor`     |
|            | The type of a prop is made more general                       | `minor`     |
|            | The type of a prop is made more specific                      | `major`     |
|            | A prop is deprecated                                          | `minor`     |
|            | A prop is removed from a component                            | `major`     |
|            | The element to which additional props are added to is changed | `<todo>`    |
| Markup     | The DOM node that an `id` corresponds to is changed           | `<todo>`    |
|            | The DOM node that an `aria-label` corresponds to is changed   | `<todo>`    |
|            | The `role` of a component is changed                          | `<todo>`    |
| Styles     | The `position` of the outermost element is updated            | `<todo>`    |
|            | The `display` property of the outermost element is updated    | `<todo>`    |
|            | A flex or grid property is updated                            | `<todo>`    |
|            | A selector is added                                           | `<todo>`    |
|            | A selector is removed                                         | `<todo>`    |
|            | The specificity of a selector is raised                       | `<todo>`    |
|            | The specificity of a selector is lowered                      | `<todo>`    |
| Behavior   | Interactions are added to a component                         | `<todo>`    |
|            | Interactions are removed from a component                     | `<todo>`    |
| TypeScript | A type is added                                               | `minor`     |
|            | A type is made more general                                   | `minor`     |
|            | A type is made more specific                                  | `major`     |
|            | A type is removed                                             | `major`     |
| Package    | An entrypoint is added to the package                         | `minor`     |
|            | An entrypoint is removed from a package                       | `major`     |
|            | A dependency is added to the project's `package.json`         | `<todo>`    |
|            | A dependency is removed from the project's `package.json`     | `<todo>`    |
|            | A dependency range is updated                                 | `<todo>`    |
|            | A pinned dependency version is updated to be range            | `<todo>`    |
| Visual     | The design for a component has been updated                   | `<todo>`    |

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

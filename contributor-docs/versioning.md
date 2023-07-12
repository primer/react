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

| Category  | Type of change                                                               | semver bump |
| :-------- | :--------------------------------------------------------------------------- | :---------- |
| Component | A component is added                                                         | `minor`     |
|           | A component is deprecated                                                    | `minor`     |
|           | A component is removed                                                       | `major`     |
| Props     | A prop is added                                                              | `minor`     |
|           | [The type of a prop is broadened](#the-type-of-a-prop-is-broadened)          | `minor`     |
|           | [The type of a prop is narrowed](#the-type-of-a-prop-is-narrowed)            | `major`     |
|           | A prop is deprecated                                                         | `minor`     |
|           | A prop is removed                                                            | `major`     |
| Package   | A dependency is added                                                        | `minor`     |
|           | A dependency is removed and it does not affect the public API of the package | `minor`     |
|           | A dependency is removed and it does affect the public API of the package     | `major`     |
|           | The version of a dependency is increased to a newer minor or patch version   | `minor`     |
|           | The version of a dependency is increased to a newer major version            | `major`     |

## Reference

### The type of a prop is broadened

semver bump: **minor**

When a type is broadened, it is now possible for that type to include both the
existing value and additional values. As a result, this maintains backwards
compatability while providing new functionality to the library.

```diff
// v0.1.0
- export type Example = number;

// v0.2.0
+ export type Example = number | string;

// Maintains compatability across versions
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

// Does not maintain compatability across versions, the change must be a major
// change
const t1: Example = 'd';
```

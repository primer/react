# Testing

Use these guidelines when authoring tests.

<!-- prettier-ignore-start -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Overview](#overview)
- [Components](#components)
  - [Requirements](#requirements)
    - [Use `@testing-library/react`](#use-testing-libraryreact)
    - [Test that a components provides `className` support](#test-that-a-components-provides-classname-support)
    - [Test that a component supports additional props on the root element](#test-that-a-component-supports-additional-props-on-the-root-element)
  - [Guidelines](#guidelines)
    - [Test the public API of a component](#test-the-public-api-of-a-component)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
<!-- prettier-ignore-end -->

## Overview

This project uses vitest as the test runner. Tests may live under the
`__tests__` directory or as `*.test.tsx?` files alongside the code they are testing.

Prefer browser tests when possible. Use Node.js when working in an environment
that will never run in the browser.

Shared config for testing lives in `packages/vitest-config`.

## Components

### Requirements

#### Use `@testing-library/react`

Render components using `@testing-library/react` and query for elements by
using `screen`.

When interactivity is needed in a test, prefer `userEvent` from `vitest/browser`. If needed, fallback to `userEvent` from `@testing-library/react`.

#### Test that a components provides `className` support

Use the `implementsClassName` utility to test that a component supports the `className` prop.

#### Test that a component supports additional props on the root element

Provide an extra prop, like a `data-testid` to a component and assert that the
root element has that attribute.

### Guidelines

#### Test the public API of a component

The most important thing to test in our component suite is the public API of a
component. This will allow us to safely make changes to the implementation of a
component without breaking consumers of the component.

When evaluating the public API of a component, consider:

- What props does the component have? What combinations can they be used in?
- What are the default values of props?
- For callback props, what arguments are passed to the callback when it is called?
- What accessibility guarantees or semantics does the component provide?

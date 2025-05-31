# @primer/dynamic-list-element

> A custom element for managing dynamic lists of items.

## Getting started

To install `@primer/dynamic-list-element` in your project, you will need to run the following
command using [npm](https://www.npmjs.com/):

```bash
npm install -S @primer/dynamic-list-element
```

If you prefer [Yarn](https://yarnpkg.com/), use the following command instead:

```bash
yarn add @primer/dynamic-list-element
```

## Usage

The `@primer/dynamic-list-element` package provides a custom element for managing dynamic lists of items. To use the element, import the package in your project:

```tsx
import '@primer/dynamic-list-element'
```

This will register the following custom elements for you to use:

- `dynamic-list`: the container for your list of items
- `dynamic-list-item`: an individual item
- `dynamic-list-trigger`: a way to trigger the display of the list of hidden
  items

The `dynamic-list` element will dynamically manage the visibility of each child
`dynamic-list-item` by adding it to slots in the shadow DOM. By default, items
will be visible. If there is overflow, they will be added to an overflow slot
that is a `popover` element.

## 🙌 Contributing

We love collaborating with folks inside and outside of GitHub and welcome contributions! If you're interested, check out our [contributing docs](contributor-docs/CONTRIBUTING.md) for more info on how to get started.

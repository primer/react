<p align="center">
  <img alt="Primer logo" width="300px" src="https://user-images.githubusercontent.com/4608155/127241386-f11da52d-00d9-4366-b01c-6f4c1ebcf7f2.png">
</p>

<h1 align="center">Primer React</h1>

<p align="center">A React implementation of GitHub's Primer Design System</p>

<p align="center">
  <a aria-label="npm package" href="https://www.npmjs.com/package/@primer/react">
    <img alt="npm package" src="https://img.shields.io/npm/v/@primer/react.svg">
  </a>
  <a aria-label="contributors graph" href="https://github.com/primer/react/graphs/contributors">
    <img alt="contributors graph" src="https://img.shields.io/github/contributors/primer/react.svg">
  </a>
  <a aria-label="last commit" href="https://github.com/primer/react/commits/main">
    <img alt="last commit" src=
  "https://img.shields.io/github/last-commit/primer/react.svg">
  </a>
  <a aria-label="license" href="https://github.com/primer/react/blob/main/LICENSE">
    <img alt="license" src="https://img.shields.io/github/license/primer/react.svg" alt="">
  </a>
</p>

## Getting started

To install `@primer/react` in your project, you will need to run the following
command using [npm](https://www.npmjs.com/):

```bash
npm install -S @primer/react @primer/primitives
```

If you prefer [Yarn](https://yarnpkg.com/), use the following command instead:

```bash
yarn add @primer/react @primer/primitives
```

This command will install three packages in your project:

- `@primer/react`: used to import and use all the components from Primer
- `@primer/primitives`: used to include the design tokens from Primer

To learn more about how to use `@primer/react`, visit our documentation site at:
[primer.style](https://primer.style).

## Usage

The `@primer/react` package provides components in React for the Primer Design System. To use a component, import it directly from the package:

```tsx
import {Button} from '@primer/react'

function App() {
  return <Button>Hello world</Button>
}
```

At the root of your application, you'll also want to include our
`BaseStyles` component along with styles from the
`@primer/primitives` package. For example:

```tsx
// Import each of the themes you would like to use, by default we are including
// the light theme below
import '@primer/primitives/dist/css/functional/themes/light.css'
import {BaseStyles} from '@primer/react'

function RootLayout() {
  return (
    <BaseStyles>
      <App />
    </BaseStyles>
  )
}
```

In addition, you will need to add the following attributes to your `html` element:

```html
<html
  data-light-theme="light"
  data-dark-theme="dark"
  data-color-mode="auto"
>
<!-- ...-->
</html>
```

## 📖 Documentation

The documentation for `@primer/react` lives at [primer.style](https://primer.style). There, you'll find detailed documentation on getting started, all of the components, our theme, our principles, and more.

## 🙌 Contributing

We love collaborating with folks inside and outside of GitHub and welcome contributions! If you're interested, check out our [contributing docs](contributor-docs/CONTRIBUTING.md) for more info on how to get started.

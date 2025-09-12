# @primer/styled-react

> A temporary package that bridges the gap between Primer React and styled-components

## Getting started

To install `@primer/styled-react` in your project, you will need to run the following
command using [npm](https://www.npmjs.com/):

```bash
npm install -S @primer/styled-react
```

## Usage

This is a pre-1.0 package designed to interop between Primer and existing
styled-components usage. As a result, expect breaking changes between minor
versions as components will be removed when their `sx` usage goes to zero.

Each component that is imported from `@primer/styled-react` is a wrapper around
the corresponding component in `@primer/react`. The notable difference is that
these components support the `sx` prop and styled system props.

By default, each component is deprecated. The intent is to transition code over
to an alternative styling solution, such as CSS Modules.

## 📖 Documentation

The documentation for `@primer/react` lives at [primer.style](https://primer.style). There, you'll find detailed documentation on getting started, all of the components, our theme, our principles, and more.

## Components List

A machine-readable list of all exported components, utilities, and types is available at build time:

```javascript
import componentsData from '@primer/styled-react/components.json'

console.log(componentsData.components) // Array of component names
console.log(componentsData.utilities) // Array of utility names
console.log(componentsData.types) // Array of type names
console.log(componentsData.metadata) // Package metadata
```

This JSON file is automatically generated during the build process and includes:

- `components`: All React components exported by the package
- `utilities`: Theme utilities and helper functions
- `types`: TypeScript type definitions
- `metadata`: Package information and generation details

## 🙌 Contributing

We love collaborating with folks inside and outside of GitHub and welcome contributions! If you're interested, check out our [contributing docs](contributor-docs/CONTRIBUTING.md) for more info on how to get started.

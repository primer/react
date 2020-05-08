---
title: Getting Started
---

## Installation

To get started using Primer Components, install the package and its peer dependencies with your package manager of choice:

```bash
# with npm
npm install @primer/components react react-dom styled-components

# with yarn
yarn add @primer/components react react-dom styled-components
```

You can now import Primer Components from the main package module:

```javascript
// using import syntax
import {Box, Flex} from '@primer/components'

// using require syntax
const {Box, Flex} = require('@primer/components')
```

Alternatively, you can import individual components from the `lib` subfolder:

```javascript
// using import syntax
import Box from '@primer/components/lib/Box'
import Flex from '@primer/components/lib/Flex'

// using require syntax
const Box = require('@primer/components/lib/Box')
const Flex = require('@primer/components/lib/Flex')
```

Note that the files in the `lib` folder are CommonJS-style modules; if you're using ECMAScript modules (ESM) and a compatible module bundler, importing files individually from `lib` provides no benefit, as unused modules from the ESM build will be removed via tree-shaking. Primer Components has an ESM build specified in its `package.json`, so when using ESM you should always import components from the main entry point (as in the first example, above).

If you're *not* using ESM, importing components individually from the `lib` folder may drastically decrease your final bundle size, since your module bundler will not have to include the entirety of Primer Components in your bundle.

### Peer dependencies

Primer Components ships with a few libraries labeled as peer dependencies. These libraries are separated because they are commonly already installed in the host project and having multiple versions can introduce errors.

Primer Components requires the following libraries to be installed along with it:

- `styled-components` at version 4.0.0 or higher
- `react` at versions 16.8.0 or higher
- `react-dom` at versions 16.8.0 or higher

## BaseStyles

In order to set baseline color, font-family, and line-heights across your project, you will need to establish base Primer styles for your app by wrapping all of your Primer components in `<BaseStyles>` at the root of your app:

```jsx
import {BaseStyles, Box, Heading} from '@primer/components'

export default const MyApp = () => (
  <BaseStyles>
    <Box m={4}>
      <Heading mb={2}>Hello, world!</Heading>
      <p>This will get Primer text styles.</p>
    </Box>
  </BaseStyles>
)
```

This will apply the same `color`, `font-family`, and `line-height` styles to the `<body>` as [Primer CSS's base styles](https://github.com/primer/css/blob/master/src/base/base.scss#L15-L20).

## Theming

Components are styled using Primer's [theme](https://github.com/primer/components/blob/master/src/theme.js) by default, but you can provide your own theme by using [styled-component's](https://styled-components.com/) `<ThemeProvider>`. If you'd like to fully replace the Primer [theme](https://github.com/primer/components/blob/master/src/theme.js) with your custom theme, pass your theme to the `<ThemeProvider>` in the root of your application like so:

```jsx
import {ThemeProvider} from 'styled-components'

const theme = { ... }

const App = (props) => {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <div>your app here</div>
      </ThemeProvider>
    </div>
  )
}
```

If you'd like to merge the Primer theme with your theme, you can do so by importing the Primer theme and then merging the themes using a library like [deepmerge](https://www.npmjs.com/package/deepmerge):

```jsx
import {ThemeProvider} from 'styled-components'
import {theme} from '@primer/components'
import deepmerge from 'deepmerge'

const customTheme = { ... }
const newTheme = deepmerge(theme, customTheme, {
  // overwrite arrays instead of concatenating
  arrayMerge: (_dest, source) => source
})


const App = (props) => {
  return (
    <div>
      <ThemeProvider theme={deepmerge(theme, )}>
        <div>your app here</div>
      </ThemeProvider>
    </div>
  )
}
```

Note that using `Object.assign` to merge themes will only create a shallow merge. This means that if both themes have a `color` object, the _entire_ `color` object will be replaced with the new `color` object, instead of only replacing duplicate values from the original theme's color object. If you want to merge sub-values, be sure to use a deep-merging strategy.

## Static CSS rendering

If you're rendering React components both server- and client-side, we suggest following [styled-component's server-side rendering instructions](https://www.styled-components.com/docs/advanced#server-side-rendering) to avoid the flash of unstyled content for server-rendered components.

## TypeScript

Primer Components includes TypeScript support and ships with its own typings. You will need still need to to install type typings for the peer dependencies if you import those in your own application code.

Once installed, you can import components and their prop type interfaces from the `@primer/components` package:

```typescript
import {BorderBox, BorderBoxProps} from '@primer/components'
```

### Fixing "Duplicate identifier 'FormData'"

Ever since `@types/styled-components` version `14.1.19`, it has had a dependency on both `@types/react` and `@types/react-native`. Unfortunately, those declarations clash; for more information, see [issue 33311](https://github.com/DefinitelyTyped/DefinitelyTyped/issues/33311) and [issue 33015](https://github.com/DefinitelyTyped/DefinitelyTyped/issues/33015) in the DefinitelyTyped repo.

You may run into this conflict even if you're not importing anything from `react-native` or don't have it installed. This is because some package managers hoist packages to the top-level `node_modules` folder, and the TypeScript compiler automatically includes types from all folders in `node_modules/@types` by default.

The TypeScript compiler allows you to opt-out of this behavior [using the `typeRoots` and `types` configuration options](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#types-typeroots-and-types), and the best solution for this error — for now — seems to be to opt out the automatic inclusion of `node_modules/@types` and instead list the types you want to be included individually.

In your `tsconfig.json`, set the `types` array under the `compilerOptions` like so:

```json
{
  "compilerOptions": {
    "types": ["node", "react", "styled-components", "jest"]
  }
}
```

Of course, customize the array based on the `@types/` packages you have installed for your project.

## Silencing warnings

Like React, Primer Components emits warnings to the JavaScript console under certain conditions, like using deprecated components or props. Similar to React, you can silence these warnings by setting the `NODE_ENV` environment variable to `production` during bundling.

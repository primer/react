---
title: Getting Started
---

## Installation

To get started using Primer Components, install the package and its two peer dependencies with your package manager of choice:

```bash
# with npm
npm install @primer/components react styled-components

# with yarn
yarn add @primer/components react styled-components
```

You can now start importing Primer Components!

```javascript
import {Box, Flex} from '@primer/components'
```

## Installing Peer Dependencies

Primer Components is shipped with a few libraries labeled as peer dependencies. These libraries are separated because they are commonly already installed in the host project and having multiple versions can introduce errors.

Before getting started using Primer Components, make sure that the following libraries are installed in your host project:

- `styled-components` at version 4.0.0 or higher
- `react` at versions 16.8.0 and higher

## BaseStyles

In order to set basic color, font-family, and line-heights across your project, you will need to establish base Primer styles for your app by wrapping all of your Primer components in `<BaseStyles>` at the root of your app:

```javascript
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

```javascript
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

If you'd like to merge the Primer theme with your theme, you can do so importing the Primer theme and merging using a library like [deepmerge](https://www.npmjs.com/package/deepmerge)

```javascript
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

*Note that using `Object.assign` will only create a shallow merge. This means that if both themes have a `color` object, the _entire_ `color` object will be replaced with the new `color` object, instead of only replacing duplicate values from the original theme's color object.

## Static CSS rendering

If you're rendering React components both server-side _and_ client-side, we suggest following [styled-component's server-side rendering instructions](https://www.styled-components.com/docs/advanced#server-side-rendering) to avoid the flash of unstyled content for server-rendered components.

## TypeScript

Primer Components includes TypeScript support and ships with its own typings. You will need to install `@types/styled-components` and `@types/react` if you import either of those packages directly, as normal.

Once installed, you can import components and their prop type interfaces from the `@primer/components` package:

```typescript
import {BorderBox, BorderBoxProps} from '@primer/components'
```

### Fixing "Duplicate identifier 'FormData'"

Ever since `@types/styled-components` version `14.1.19`, it has had a dependency of both `@types/react` and `@types/react-native`. Unfortunately, those declarations clash; for more information, see [issue 33311](https://github.com/DefinitelyTyped/DefinitelyTyped/issues/33311) and [issue 33015](https://github.com/DefinitelyTyped/DefinitelyTyped/issues/33015) in the DefinitelyTyped repo.

You may run into this conflict even if you're not importing anything from `react-native` or don't have it installed. This is because the TypeScript compiler automatically includes types from the folders in `node_modules/@types` automatically. The TypeScript compiler allows you to opt-out of this behavior [using the `typeRoots` and `types` configuration options](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#types-typeroots-and-types).

The best solution for this error — for now — seems to be disabling the automatic inclusion of `node_modules/@types` and instead listing the types you want to be included individually.

In your `tsconfig.json`, set the `types` array under the `compilerOptions` like so:

```json
{
  "compilerOptions": {
    "types": ["node", "react", "styled-components", "jest"]
  }
}
```

Of course, customize the array based on the `@types/` packages you have installed for your project.

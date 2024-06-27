---
title: Getting started
---

import DeprecationBanner from '../components/DeprecationBanner'

<DeprecationBanner replacementUrl={'/guides/react'} />

## Installation

To get started using Primer React, install the package and its peer dependencies with your package manager of choice:

```bash
# with npm
npm install @primer/react react react-dom styled-components@5

# with yarn
yarn add @primer/react react react-dom styled-components@5
```

You can now import Primer React from the main package module:

```javascript
// using import syntax
import {Box} from '@primer/react'
```

```javascript
// using require syntax
const {Box} = require('@primer/react')
```

### Polyfills & Browser Support

Primer React supports the current versions of [Chrome](https://www.google.com/chrome/), [Firefox](http://www.mozilla.org/firefox/), [Safari](http://www.apple.com/safari/), and [Microsoft Edge](https://www.microsoft.com/en-us/windows/microsoft-edge), as well as the [Firefox Extended Support Release](https://www.mozilla.org/en-US/firefox/organizations/). This is in-line with [GitHub's Browser Support](https://docs.github.com/en/free-pro-team@latest/github/getting-started-with-github/supported-browsers).

Primer React does not transform code to support older ECMAScript versions, such as ES5, and it uses ECMAScript features such as `Object.assign`, as well as syntax features such as native classes and Object destructuring and spreading.

Environments that Primer React is used in should have all the necessary polyfills to comply with the latest code standards, as Primer React will not ship with these. Additionally, as Primer React does not transform code to support older versions, it may be necessary for projects to transform this code if support for older browsers (such as Edge 18) is needed.

### Minimizing bundle size

Module bundlers that use ECMAScript modules (ESM) will automatically tree-shake Primer React, ensuring that no unused code is included in your final bundle. However, if you're not using ESM, you may be able to drastically reduce the size of your final bundle by importing components individually from the `lib` subfolder:

```javascript
// using import syntax
import Box from '@primer/react/lib/Box'
```

```javascript
// using require syntax
const Box = require('@primer/react/lib/Box')
```

Note that the modules in the `lib` folder are CommonJS-style modules; if you're using ESM and a compatible module bundler, importing files individually from `lib` provides no benefit.

### Peer dependencies

Primer React ships with a few libraries labeled as peer dependencies. These libraries are separated because they are commonly already installed in the host project and having multiple versions can introduce errors.

Primer React requires the following libraries to be installed along with it:

- `styled-components` at version 4.0.0 or higher
- `react` at versions 17.x or higher
- `react-dom` at versions 17.x or higher

## ThemeProvider

For Primer React to work correctly and accurately apply color schemes, you must add `ThemeProvider` to the root of your application:

```jsx
import {ThemeProvider} from '@primer/react'

function App() {
  return (
    <ThemeProvider>
      <div>...</div>
    </ThemeProvider>
  )
}
```

See [Theming](/theming) for more details on advanced configuration, color modes, and overriding theme values.

## BaseStyles

In order to set baseline color, font-family, and line-heights across your project, you will need to establish base Primer styles for your app by wrapping all of your Primer components in `<BaseStyles>` at the root of your app:

```jsx
import {BaseStyles, Box, Heading} from '@primer/react'

export default () => (
  <BaseStyles>
    <Box m={4}>
      <Heading as="h2" sx={{mb: 2}}>
        Hello, world!
      </Heading>
      <p>This will get Primer text styles.</p>
    </Box>
  </BaseStyles>
)
```

This will apply the same `color`, `font-family`, and `line-height` styles to the `<body>` as [Primer CSS's base styles](https://github.com/primer/css/blob/main/src/base/base.scss#L15-L20).

## Static CSS rendering

If you're rendering React components both server- and client-side, we suggest following [styled-component's server-side rendering instructions](https://www.styled-components.com/docs/advanced#server-side-rendering) to avoid the flash of unstyled content for server-rendered components.

## TypeScript

Primer React includes TypeScript support and ships with its own typings. You will still need to install type definitions for the peer dependencies if you import those in your own application code.

Once installed, you can import components and their prop type interfaces from the `@primer/react` package:

```typescript
import {Button, ButtonProps} from '@primer/react'
```

### Fixing "Duplicate identifier 'FormData'"

Ever since `@types/styled-components` version `4.1.19`, it has had a dependency on both `@types/react` and `@types/react-native`. Unfortunately, those declarations clash; for more information, see [issue 33311](https://github.com/DefinitelyTyped/DefinitelyTyped/issues/33311) and [issue 33015](https://github.com/DefinitelyTyped/DefinitelyTyped/issues/33015) in the DefinitelyTyped repo.

You may run into this conflict even if you're not importing anything from `react-native` or don't have it installed. This is because some package managers hoist packages to the top-level `node_modules` folder, and the TypeScript compiler automatically includes types from all folders in `node_modules/@types` by default.

The TypeScript compiler allows you to opt-out of this behavior [using the `typeRoots` and `types` configuration options](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#types-typeroots-and-types), and the best solution for this error — for now — seems to be to opt out the automatic inclusion of `node_modules/@types` and instead list the types you want to be included individually.

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

Like React, Primer React emits warnings to the JavaScript console under certain conditions, like using deprecated components or props. Similar to React, you can silence these warnings by setting the `NODE_ENV` environment variable to `production` during bundling.

## Testing

Testing your application with Primer React is no different than testing your application with any other React library. Depending on your test environment and the testing libraries you use, you may need polyfills. For example if you are using `jest`, it runs via Node runtime and uses [JSDOM](https://github.com/jsdom/jsdom) as a DOM implementation, so you will need to mock some browser APIs. We have [helpers](https://github.com/primer/react/tree/main/packages/react/src/utils/test-helpers.tsx) that you can utilize to mock some of these APIs. You can import the helpers in your test setup file like so:

```js
import '@primer/react/lib-esm/utils/test-helpers' // For ESM
import '@primer/react/lib/utils/test-helpers' // For CommonJS
```

---
title: Getting Started
---

## Installation

To get started using Primer Components, run `npm install @primer/components` in your application.

You can now start importing Primer Components! There are a few ways to import Primer Components. You can either:

Import them individually from the main bundle:

```
import {Box, Flex} from '@primer/components'
```

or, if you've configured your application to tree-shake with webpack, you can import them individually from the `src` folder:

```
import Box from '@primer/components/src/Box'
import Flex from '@primer/components/src/Flex'

```


## Installing Peer Dependencies

Primer Components is shipped with a few libraries labeled as peer dependencies. These libraries are separated because they are commonly already installed in the host project. This keeps the bundle size down and allows you to specify the version number you'd like in your own project.

Before getting started using Primer Components, make sure that the following libraries are installed in your host project:

- `styled-components` at version 4.0.0 or higher
- `react` at versions 16.8.0 and higher


## BaseStyles

In order to set basic color, font-family, and line-heights across your project, you will need to establish base Primer styles for your app by wrapping all of your Primer components in `<BaseStyles>`:

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
